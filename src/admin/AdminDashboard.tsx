import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { GlitchText } from '../components/ui/GlitchText';

interface Profile {
    id: string;
    username: string;
    role: string;
    created_at: string;
}

interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    summary: string;
}

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'propaganda' | 'personnel'>('propaganda');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Data State
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    
    // News Form State
    const [newNews, setNewNews] = useState({ title: '', date: '40.999.M42', category: 'ANNOUNCEMENT', summary: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    // HARDCODED CHAPTER MASTER ID (Your ID)
    const CHAPTER_MASTER_ID = '9f9a24d1-01d8-4a53-b29a-c71b7b208590';

    const fetchData = useCallback(async () => {
        const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (profilesData) setProfiles(profilesData);

        const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (newsData) setNews(newsData);
    }, []);

    const checkAdmin = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (profile?.role === 'admin') {
                setIsAdmin(true);
                fetchData();
                setLoading(false);
                return true;
            }
        }
        setLoading(false);
        return false;
    }, [fetchData]);

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    // Perform redirect in render or separate effect to avoid "modifying value" lint error
    // Ideally use react-router navigate, but window.location is a hard refresh fallback.
    // For now, simpler: just don't render content.
    


    const handleRoleUpdate = async (targetUserId: string, newRole: string) => {
        // SECURITY CHECK: Only Chapter Master can touch Admin roles
        if (currentUserId !== CHAPTER_MASTER_ID) {
            // If trying to SET admin
            if (newRole === 'admin') {
                alert("ACCESS DENIED. ONLY THE LORD INQUISITOR CAN PROMOTE COMMANDERS.");
                return;
            }
            // If trying to CHANGE an existing admin (demotion)
            const targetProfile = profiles.find(p => p.id === targetUserId);
            if (targetProfile?.role === 'admin') {
                alert("ACCESS DENIED. YOU CANNOT MODIFY A FELLOW COMMANDER'S RANK.");
                return;
            }
        }

        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', targetUserId);
        if (!error) {
            setProfiles(profiles.map(p => p.id === targetUserId ? { ...p, role: newRole } : p));
        } else {
            alert("Role update failed: " + error.message);
        }
    };

    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingId) {
            // UPDATE EXISTING
            const { error } = await supabase.from('news').update(newNews).eq('id', editingId);
            if (!error) {
                setNews(news.map(n => n.id === editingId ? { ...n, ...newNews, id: editingId } : n));
                setNewNews({ title: '', date: '40.999.M42', category: 'ANNOUNCEMENT', summary: '' });
                setEditingId(null);
            } else {
                alert("Update failed: " + error.message);
            }
        } else {
            // CREATE NEW
            const { data, error } = await supabase.from('news').insert([newNews]).select();
            if (!error && data) {
                setNews([data[0], ...news]);
                setNewNews({ title: '', date: '40.999.M42', category: 'ANNOUNCEMENT', summary: '' });
            } else {
                alert("News post failed: " + error?.message);
            }
        }
    };

    const startEdit = (item: NewsItem) => {
        setNewNews({
            title: item.title,
            date: item.date,
            category: item.category,
            summary: item.summary
        });
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setNewNews({ title: '', date: '40.999.M42', category: 'ANNOUNCEMENT', summary: '' });
        setEditingId(null);
    };

    const handleDeleteNews = async (id: string) => {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) {
            setNews(news.filter(n => n.id !== id));
        } else {
            alert("Delete failed: " + error.message);
        }
    };

    if (loading) return <div className="text-white p-10 font-mono animate-pulse">AUTHENTICATING COMMAND CODES...</div>;
    
    if (!isAdmin) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl text-red-500 font-military mb-4">ACCESS DENIED</h1>
                <p className="text-white font-mono mb-8">
                    IDENTIFICATION PROTOCOLS FAILED.<br/>
                    YOUR GENE-SEED IS NOT RECOGNIZED BY THE LOGIS ENGINES.
                </p>
                <div className="text-xs text-silver/50 font-mono border border-silver/20 p-4 max-w-md mx-auto">
                    DEBUG INFO:<br/>
                    USER AUTH: {JSON.stringify(isAdmin)}<br/>
                    ROLE CHECK: FAILED
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-20 bg-[#0b0c10]">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-military text-center mb-10 text-white">
                    <GlitchText text="COMMAND BRIDGE" />
                    <span className="block text-sm font-mono text-neon mt-2">
                        {currentUserId === CHAPTER_MASTER_ID ? 'WELCOME, LORD INQUISITOR' : 'ADMINISTRATION TERMINAL'}
                    </span>
                </h1>

                {/* Tabs */}
                <div className="flex flex-col sm:flex-row border-b border-white/10 mb-8">
                    <button 
                        onClick={() => setActiveTab('propaganda')}
                        className={`px-4 sm:px-8 py-3 sm:py-4 font-bold tracking-wider transition-colors w-full sm:w-auto ${activeTab === 'propaganda' ? 'text-neon border-b-2 border-neon bg-white/5' : 'text-silver/50 hover:text-white'}`}
                    >
                        SECTOR: PROPAGANDA
                    </button>
                    <button 
                        onClick={() => setActiveTab('personnel')}
                        className={`px-4 sm:px-8 py-3 sm:py-4 font-bold tracking-wider transition-colors w-full sm:w-auto ${activeTab === 'personnel' ? 'text-neon border-b-2 border-neon bg-white/5' : 'text-silver/50 hover:text-white'}`}
                    >
                        SECTOR: PERSONNEL
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'propaganda' && (
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Form */}
                        <div className="bg-[#1f2833]/50 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl text-white font-military mb-6">
                                {editingId ? `EDITING SIGNAL: ${editingId.slice(0,8)}...` : 'TRANSMIT NEW SIGNAL'}
                            </h3>
                            <form onSubmit={handleAddNews} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-silver mb-1">DATA HEADER (TITLE)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-neon outline-none"
                                        value={newNews.title}
                                        onChange={e => setNewNews({...newNews, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono text-silver mb-1">TIMESTAMP</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-neon outline-none"
                                            value={newNews.date}
                                            onChange={e => setNewNews({...newNews, date: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-silver mb-1">CLASSIFICATION</label>
                                        <select 
                                            className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-neon outline-none"
                                            value={newNews.category}
                                            onChange={e => setNewNews({...newNews, category: e.target.value})}
                                        >
                                            <option>ANNOUNCEMENT</option>
                                            <option>TOURNAMENT</option>
                                            <option>LOGISTICS</option>
                                            <option>EVENT</option>
                                        </select>
                                    </div>
                                </div>
                                    <div>
                                        <label className="block text-xs font-mono text-silver mb-1">PAYLOAD (SUMMARY)</label>
                                        
                                        {/* Markdown Toolbar */}
                                        <div className="flex flex-wrap gap-2 mb-2 bg-black/30 p-2 rounded border border-white/10">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setNewNews(prev => ({...prev, summary: prev.summary + '**BOLD**'}));
                                                }}
                                                className="px-3 py-2 md:px-2 md:py-1 text-xs font-bold text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1]/10 rounded touch-manipulation"
                                                title="Bold"
                                            >
                                                B
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setNewNews(prev => ({...prev, summary: prev.summary + '*Italic*'}));
                                                }}
                                                className="px-3 py-2 md:px-2 md:py-1 text-xs italic text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1]/10 rounded touch-manipulation"
                                                title="Italic"
                                            >
                                                I
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setNewNews(prev => ({...prev, summary: prev.summary + '\n# Heading'}));
                                                }}
                                                className="px-3 py-2 md:px-2 md:py-1 text-xs font-bold text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1]/10 rounded touch-manipulation"
                                                title="Heading"
                                            >
                                                H1
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setNewNews(prev => ({...prev, summary: prev.summary + '[Link Text](url)'}));
                                                }}
                                                className="px-3 py-2 md:px-2 md:py-1 text-xs text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1]/10 rounded touch-manipulation"
                                                title="Link"
                                            >
                                                LINK
                                            </button>
                                            <label className="px-3 py-2 md:px-2 md:py-1 text-xs text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1]/10 rounded cursor-pointer flex items-center gap-1 touch-manipulation">
                                                <span>IMG</span>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const fileExt = file.name.split('.').pop();
                                                        const fileName = `${Math.random()}.${fileExt}`;
                                                        const filePath = `${fileName}`;

                                                        // Upload
                                                        const { error: uploadError } = await supabase.storage
                                                            .from('news-images')
                                                            .upload(filePath, file);

                                                        if (uploadError) {
                                                            alert('Upload failed: ' + uploadError.message);
                                                            return;
                                                        }

                                                        // Get URL
                                                        const { data: { publicUrl } } = supabase.storage
                                                            .from('news-images')
                                                            .getPublicUrl(filePath);

                                                        // Insert Markdown
                                                        setNewNews(prev => ({
                                                            ...prev, 
                                                            summary: prev.summary + `\n![Image](${publicUrl})\n`
                                                        }));
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <textarea 
                                            className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-neon outline-none h-64 font-mono text-sm"
                                            value={newNews.summary}
                                            onChange={e => setNewNews({...newNews, summary: e.target.value})}
                                            required
                                            placeholder="Supports Markdown: **bold**, *italic*, [links](url)..."
                                        />
                                    </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="flex-1 py-3 bg-neon/10 border border-neon text-neon hover:bg-neon/20 font-bold tracking-widest transition-all">
                                        {editingId ? 'UPDATE SIGNAL' : 'UPLOAD TO NOOSPHERE'}
                                    </button>
                                    {editingId && (
                                        <button 
                                            type="button" 
                                            onClick={cancelEdit}
                                            className="px-4 py-3 bg-red-900/20 border border-red-500/50 text-red-500 hover:bg-red-900/40 font-bold tracking-widest transition-all"
                                        >
                                            CANCEL
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {news.map(item => (
                                <div key={item.id} className={`bg-[#1f2833]/30 p-4 border-l-2 flex justify-between items-start group transition-colors ${editingId === item.id ? 'border-yellow-500 bg-yellow-500/10' : 'border-neon'}`}>
                                    <div>
                                        <div className="text-neon text-xs font-mono mb-1">{item.category} // {item.date}</div>
                                        <h4 className="text-white font-bold">{item.title}</h4>
                                        <p className="text-silver/60 text-sm mt-2 line-clamp-2">{item.summary}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => startEdit(item)}
                                            className="text-yellow-500 hover:text-yellow-400 text-xs font-bold tracking-wider text-right"
                                        >
                                            [EDIT]
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteNews(item.id)}
                                            className="text-red-500 hover:text-red-400 text-xs font-bold tracking-wider text-right"
                                        >
                                            [DELETE]
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'personnel' && (
                    <div className="bg-[#1f2833]/30 rounded-xl overflow-hidden border border-white/10">
                        <table className="w-full text-left">
                            <thead className="bg-black/50 text-xs font-mono text-silver">
                                <tr>
                                    <th className="p-4">CODENAME</th>
                                    <th className="p-4">JOINED</th>
                                    <th className="p-4">CLEARANCE LEVEL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {profiles.map(profile => (
                                    <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <span className="text-neon font-bold">{profile.username}</span>
                                            <div className="text-[10px] text-silver/40 font-mono">{profile.id}</div>
                                        </td>
                                        <td className="p-4 text-silver/80 text-sm">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <select 
                                                className={`bg-black/40 border p-1 text-xs font-mono outline-none cursor-pointer
                                                    ${profile.role === 'admin' ? 'border-red-500 text-red-500' : 
                                                      profile.role === 'member' ? 'border-neon text-neon' : 'border-silver/30 text-silver'}
                                                    ${(currentUserId !== CHAPTER_MASTER_ID && profile.role === 'admin') ? 'opacity-50 cursor-not-allowed' : ''}  
                                                `}
                                                value={profile.role}
                                                onChange={(e) => handleRoleUpdate(profile.id, e.target.value)}
                                                disabled={currentUserId !== CHAPTER_MASTER_ID && profile.role === 'admin'}
                                            >
                                                <option value="guest">GUEST (RECRUIT)</option>
                                                <option value="member">MEMBER (OPERATIVE)</option>
                                                {/* Only show/allow Admin option if I am Master or if the user is already admin */}
                                                {(currentUserId === CHAPTER_MASTER_ID || profile.role === 'admin') && (
                                                    <option value="admin">ADMIN (COMMANDER)</option>
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
