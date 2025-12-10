import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
    id: string;
    username: string;
    role: string;
    created_at: string;
    email?: string;
    email_confirmed_at?: string | null;
}

interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    summary: string;
}

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'decrees' | 'knights'>('decrees');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Data State
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    
    // News Form State
    const [newNews, setNewNews] = useState({ title: '', date: 'Anno Domini 2025', category: 'VERKÜNDIGUNG', summary: '' });
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

    const handleRoleUpdate = async (targetUserId: string, newRole: string) => {
        // SECURITY CHECK: Only Chapter Master can touch Admin roles
        if (currentUserId !== CHAPTER_MASTER_ID) {
            // If trying to SET admin
            if (newRole === 'admin') {
                alert("ZUTRITT VERWEHRT. NUR DER KÖNIG KANN NEUE HERZÖGE ERNENNEN.");
                return;
            }
            // If trying to CHANGE an existing admin (demotion)
            const targetProfile = profiles.find(p => p.id === targetUserId);
            if (targetProfile?.role === 'admin') {
                alert("ZUTRITT VERWEHRT. IHR KÖNNT EINEN GLEICHGESTELLTEN NICHT DEGRADIEREN.");
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
                setNewNews({ title: '', date: 'Anno Domini 2025', category: 'VERKÜNDIGUNG', summary: '' });
                setEditingId(null);
            } else {
                alert("Update failed: " + error.message);
            }
        } else {
            // CREATE NEW
            const { data, error } = await supabase.from('news').insert([newNews]).select();
            if (!error && data) {
                setNews([data[0], ...news]);
                setNewNews({ title: '', date: 'Anno Domini 2025', category: 'VERKÜNDIGUNG', summary: '' });
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
        setNewNews({ title: '', date: 'Anno Domini 2025', category: 'VERKÜNDIGUNG', summary: '' });
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

    if (loading) return <div className="text-gold p-10 font-medieval text-center text-2xl animate-pulse">LADEN...</div>;
    
    if (!isAdmin) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center bg-[#1a120b]">
                <h1 className="text-4xl text-crimson font-medieval mb-4 drop-shadow-md">ZUGRIFF VERWEIGERT</h1>
                <p className="text-parchment font-sans mb-8 max-w-lg">
                    DIESER BEREICH IST NUR HÖHEREN RÄNGEN VORBEHALTEN.<br/>
                    BITTE WENDET EUCH AN EINEN ADMINISTRATOR.
                </p>
                <div className="w-16 h-16 rounded-full bg-crimson flex items-center justify-center shadow-lg border-2 border-wood">
                    X
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-20 bg-wood">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-medieval text-center mb-10 text-parchment drop-shadow-lg border-b-2 border-gold/30 pb-6 w-full mx-auto max-w-3xl">
                    <span className="block">ADMIN-BEREICH</span>
                    <span className="block text-sm font-sans text-gold mt-4 tracking-widest uppercase">
                        {currentUserId === CHAPTER_MASTER_ID ? 'WILLKOMMEN, MEIN KÖNIG' : 'WILLKOMMEN'}
                    </span>
                </h1>

                {/* Tabs */}
                <div className="flex flex-col sm:flex-row border-b-2 border-[#2c1810] mb-8 bg-[#2c1810]/30 rounded-t-lg overflow-hidden">
                    <button 
                        onClick={() => setActiveTab('decrees')}
                        className={`px-4 sm:px-8 py-3 sm:py-4 font-bold tracking-widest transition-all w-full sm:w-auto font-medieval text-lg ${activeTab === 'decrees' ? 'text-wood bg-gold shadow-inner' : 'text-parchment/60 hover:text-gold hover:bg-[#2c1810]/50'}`}
                    >
                        NEUIGKEITEN & VERWALTUNG
                    </button>
                    <button 
                        onClick={() => setActiveTab('knights')}
                        className={`px-4 sm:px-8 py-3 sm:py-4 font-bold tracking-widest transition-all w-full sm:w-auto font-medieval text-lg ${activeTab === 'knights' ? 'text-wood bg-gold shadow-inner' : 'text-parchment/60 hover:text-gold hover:bg-[#2c1810]/50'}`}
                    >
                        MITGLIEDERLISTE
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'decrees' && (
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Form */}
                        <div className="bg-[#f5e6d3] p-6 rounded-sm border-2 border-[#2c1810] shadow-xl relative">
                            {/* Texture */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }} />
                            
                            <h3 className="text-xl text-[#2c1810] font-medieval mb-6 relative z-10 border-b border-[#2c1810]/20 pb-2">
                                {editingId ? `EINTAG BEARBEITEN` : 'NEUER EINTRAG'}
                            </h3>
                            <form onSubmit={handleAddNews} className="space-y-4 relative z-10">
                                <div>
                                    <label className="block text-xs font-bold font-sans text-[#2c1810]/70 mb-1 uppercase">TITEL</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#faebd7] border border-[#8b4513]/30 p-2 text-[#2c1810] focus:border-[#8b4513] outline-none font-medieval placeholder-[#2c1810]/30"
                                        value={newNews.title}
                                        onChange={e => setNewNews({...newNews, title: e.target.value})}
                                        required
                                        placeholder="Seid gegrüßt..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold font-sans text-[#2c1810]/70 mb-1 uppercase">DATUM</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-[#faebd7] border border-[#8b4513]/30 p-2 text-[#2c1810] focus:border-[#8b4513] outline-none font-sans"
                                            value={newNews.date}
                                            onChange={e => setNewNews({...newNews, date: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold font-sans text-[#2c1810]/70 mb-1 uppercase">KATEGORIE</label>
                                        <select 
                                            className="w-full bg-[#faebd7] border border-[#8b4513]/30 p-2 text-[#2c1810] focus:border-[#8b4513] outline-none font-sans"
                                            value={newNews.category}
                                            onChange={e => setNewNews({...newNews, category: e.target.value})}
                                        >
                                            <option>VERKÜNDIGUNG</option>
                                            <option>TURNIER</option>
                                            <option>LOGISTIK</option>
                                            <option>FESTLICHKEIT</option>
                                        </select>
                                    </div>
                                </div>
                                    <div>
                                        <label className="block text-xs font-bold font-sans text-[#2c1810]/70 mb-1 uppercase">INHALT</label>
                                        
                                        {/* Markdown Toolbar */}
                                        <div className="flex flex-wrap gap-2 mb-2 bg-[#2c1810]/5 p-2 rounded border border-[#8b4513]/10">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setNewNews(prev => ({...prev, summary: prev.summary + '**FETT**'}));
                                                }}
                                                className="w-8 h-8 font-serif font-bold text-[#2c1810] border border-[#2c1810]/20 hover:bg-[#2c1810]/10 rounded shadow-sm bg-[#faebd7]"
                                                title="Bold"
                                            >
                                                B
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setNewNews(prev => ({...prev, summary: prev.summary + '*Kursiv*'}));
                                                }}
                                                className="w-8 h-8 font-serif italic text-[#2c1810] border border-[#2c1810]/20 hover:bg-[#2c1810]/10 rounded shadow-sm bg-[#faebd7]"
                                                title="Italic"
                                            >
                                                I
                                            </button>
                                            <label className="h-8 px-3 text-xs text-[#2c1810] border border-[#2c1810]/20 hover:bg-[#2c1810]/10 rounded cursor-pointer flex items-center gap-1 shadow-sm bg-[#faebd7] font-bold">
                                                <span>BILD</span>
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
                                                            summary: prev.summary + `\n![Bild](${publicUrl})\n`
                                                        }));
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <textarea 
                                            className="w-full bg-[#faebd7] border border-[#8b4513]/30 p-2 text-[#2c1810] focus:border-[#8b4513] outline-none h-64 font-serif text-sm leading-relaxed"
                                            value={newNews.summary}
                                            onChange={e => setNewNews({...newNews, summary: e.target.value})}
                                            required
                                            placeholder="Schreibt hier Eure Worte nieder..."
                                        />
                                    </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="flex-1 py-3 bg-[#2c1810] text-gold border border-gold hover:bg-gold hover:text-[#2c1810] font-bold font-medieval tracking-widest transition-all shadow-lg rounded-sm">
                                        {editingId ? 'SPEICHERN' : 'VERÖFFENTLICHEN'}
                                    </button>
                                    {editingId && (
                                        <button 
                                            type="button" 
                                            onClick={cancelEdit}
                                            className="px-4 py-3 bg-crimson/10 border border-crimson text-crimson hover:bg-crimson hover:text-white font-bold tracking-widest transition-all font-medieval rounded-sm"
                                        >
                                            ABBRECHEN
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {news.map(item => (
                                <div key={item.id} className={`bg-[#2c1810]/80 p-4 border-l-4 flex justify-between items-start group transition-colors shadow-lg ${editingId === item.id ? 'border-gold bg-gold/10' : 'border-wood-light'}`}>
                                    <div>
                                        <div className="text-gold text-xs font-medieval mb-1 tracking-widest text-[10px]">{item.category} // {item.date}</div>
                                        <h4 className="text-parchment font-medieval text-lg">{item.title}</h4>
                                        <p className="text-parchment/60 text-sm mt-2 line-clamp-2 font-serif italic">{item.summary}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => startEdit(item)}
                                            className="text-gold hover:text-white text-xs font-bold tracking-wider text-right font-sans"
                                        >
                                            [BEARBEITEN]
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteNews(item.id)}
                                            className="text-crimson hover:text-red-400 text-xs font-bold tracking-wider text-right font-sans"
                                        >
                                            [LÖSCHEN]
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'knights' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl text-parchment font-medieval drop-shadow-md">REGISTRIERTE BENUTZER ({profiles.length})</h3>
                            <button 
                                onClick={() => { setLoading(true); fetchData(); setLoading(false); }}
                                className="px-4 py-2 bg-[#2c1810] border border-gold text-gold hover:bg-gold hover:text-[#2c1810] font-bold font-sans text-xs tracking-wider transition-all shadow-md"
                            >
                                AKTUALISIEREN
                            </button>
                        </div>

                        {profiles.length === 0 ? (
                            <div className="bg-[#f5e6d3] p-8 rounded-sm border-2 border-[#2c1810] text-center shadow-lg">
                                <h4 className="text-crimson font-medieval font-bold mb-2 text-xl">KEINE BENUTZER GEFUNDEN</h4>
                                <p className="text-[#2c1810]/60 text-sm font-sans max-w-lg mx-auto italic">
                                    Die Liste ist leer.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-[#f5e6d3] rounded-sm overflow-hidden border-4 border-[#2c1810] shadow-2xl relative">
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }} />
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left relative z-10 whitespace-nowrap">
                                        <thead className="bg-[#2c1810] text-xs font-medieval text-gold tracking-widest uppercase">
                                            <tr>
                                                <th className="p-4">NAME</th>
                                                <th className="p-4">EMAIL / STATUS</th>
                                                <th className="p-4">REGISTRIERT AM</th>
                                                <th className="p-4">RANG</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#2c1810]/20">
                                            {profiles.map(profile => (
                                                <tr key={profile.id} className="hover:bg-[#2c1810]/5 transition-colors">
                                                    <td className="p-4">
                                                        <span className="text-[#2c1810] font-bold font-medieval text-lg">{profile.username}</span>
                                                        <div className="text-[10px] text-[#2c1810]/40 font-mono">ID: {profile.id.substring(0,8)}...</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-[#2c1810] text-sm font-sans">{profile.email || "N/A"}</div>
                                                        {profile.email_confirmed_at ? (
                                                            <span className="text-[10px] text-emerald-800 font-bold font-sans bg-emerald-200/50 px-1 rounded border border-emerald-500/30">BESTÄTIGT</span>
                                                        ) : (
                                                            <span className="text-[10px] text-amber-800 font-bold font-sans bg-amber-200/50 px-1 rounded border border-amber-500/30">AUSSTEHEND</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-[#2c1810]/70 text-sm font-sans italic">
                                                        {new Date(profile.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <select 
                                                            className={`bg-[#faebd7] border-2 p-2 text-xs font-bold font-sans outline-none cursor-pointer rounded shadow-sm
                                                                ${profile.role === 'admin' ? 'border-crimson text-crimson' : 
                                                                  profile.role === 'member' ? 'border-gold text-[#2c1810]' : 'border-[#2c1810]/20 text-[#2c1810]/50'}
                                                                ${(currentUserId !== CHAPTER_MASTER_ID && profile.role === 'admin') ? 'opacity-50 cursor-not-allowed' : ''}  
                                                            `}
                                                            value={profile.role}
                                                            onChange={(e) => handleRoleUpdate(profile.id, e.target.value)}
                                                            disabled={currentUserId !== CHAPTER_MASTER_ID && profile.role === 'admin'}
                                                        >
                                                            <option value="guest">GAST</option>
                                                            <option value="member">MITGLIED</option>
                                                            {/* Only show/allow Admin option if I am Master or if the user is already admin */}
                                                            {(currentUserId === CHAPTER_MASTER_ID || profile.role === 'admin') && (
                                                                <option value="admin">ADMIN</option>
                                                            )}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
