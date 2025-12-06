import { useState, useEffect } from 'react';
import { DataSlate } from '../components/ui/DataSlate';
import { GlitchText } from '../components/ui/GlitchText';
import { supabase } from '../lib/supabase';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    summary: string;
}

export const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error loading news:", error);
        } else {
            setNews(data || []);
        }
        setLoading(false);
    };

    fetchNews();

    // Subscribe to realtime changes
    const subscription = supabase.channel('news')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
             fetchNews(); 
        })
        .subscribe();

    return () => { subscription.unsubscribe(); }
  }, []);

  return (
    <section className="relative w-full py-12 md:py-24 px-4 bg-void">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
        
        {/* Sticky Header */}
        <div className="md:w-1/3">
           <div className="sticky top-24">
              <h2 className="text-3xl md:text-5xl font-military text-white mb-8 leading-none">
                 <GlitchText text="INCOMING" /> <br />
                 <span className="text-neon/80">TRANSMISSION</span>
              </h2>
               <p className="text-silver/90 font-tactical text-base max-w-xs border-l border-neon/50 pl-4 py-2 mt-4 tracking-wide shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-black/20">
                  DECODING ASTRO-TELEPATHIC DATA STREAM... <br/>
                  <span className="text-neon drop-shadow-[0_0_5px_rgba(102,252,241,0.8)]">PRIORITY LEVEL: VERMILLION</span>
               </p>
           </div>
        </div>

        {/* Feed */}
        <div className="md:w-2/3 flex flex-col gap-8">
            {loading ? (
                 <div className="text-neon/50 font-mono animate-pulse">ESTABLISHING NOOSPHERE CONNECTION...</div>
            ) : news.length === 0 ? (
                 <div className="text-silver/50 font-mono">NO ACTIVE TRANSMISSIONS FOUND.</div>
            ) : (
                news.map((item, i) => (
                    <DataSlate key={item.id || i} index={i} {...item} />
                ))
            )}
            
            {/* Infinite Scroll Loader Mock */}
            <div className="flex items-center gap-2 text-silver/30 text-xs font-mono justify-center py-10">
                <span className="animate-spin">/</span> CHARGING DATA BUFFERS...
            </div>
        </div>
      </div>
    </section>
  );
};
