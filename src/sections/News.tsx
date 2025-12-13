import { useState, useEffect } from 'react';
import { DataSlate } from '../components/ui/DataSlate';
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
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const fetchNews = async () => {
    setLoading(true);
    
    // Get total count first
    const countResult = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true });
    
    setTotalCount(countResult.count || 0);

    // Get paginated data
    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error loading news:", error);
    } else {
        setNews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();

    // Subscribe to realtime changes
    const subscription = supabase.channel('news')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
             fetchNews(); 
        })
        .subscribe();

    return () => { subscription.unsubscribe(); }
  }, [page]); // Re-fetch when page changes

  const hasNextPage = (page + 1) * ITEMS_PER_PAGE < totalCount;
  const hasPrevPage = page > 0;

  return (
    <section className="relative w-full py-12 md:py-24 px-4 bg-wood border-t-4 border-[#2c1810]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
        
        {/* Sticky Header */}
        <div className="md:w-1/3">
           <div className="sticky top-24">
              <h2 className="text-3xl md:text-5xl font-medieval text-parchment mb-4 leading-none drop-shadow-md">
                 NEUE KUNDE <br />
                 <span className="text-gold">VOM HEROLD</span>
              </h2>
               <div className="text-parchment/80 font-sans text-base max-w-xs border-l-4 border-gold pl-4 py-2 mt-4 tracking-wide bg-[#2c1810]/50 p-4 rounded-r-lg shadow-lg italic">
                  "HÖRT, HÖRT! Hier werden die neuesten Dekrete und Berichte der Ritterschaft verkündet." <br/>
                  <span className="text-gold font-bold not-italic block mt-2 border-t border-gold/20 pt-2">STATUS: ÖFFENTLICH</span>
               </div>
           </div>
        </div>

        {/* Feed */}
        <div className="md:w-2/3 flex flex-col gap-8">
            {loading ? (
                 <div className="text-gold/50 font-medieval animate-pulse text-xl text-center py-12">DER BOTE IST UNTERWEGS...</div>
            ) : news.length === 0 ? (
                 <div className="text-parchment/50 font-sans italic text-center py-12">KEINE NEUEN NACHRICHTEN VORLIEGEND.</div>
            ) : (
                <div className="flex flex-col gap-8">
                    {news.map((item, i) => (
                        <DataSlate key={item.id || i} index={i} {...item} />
                    ))}
                </div>
            )}
            
            {/* Pagination Controls */}
            {(hasPrevPage || hasNextPage) && (
                <div className="flex justify-between items-center pt-8 border-t border-[#2c1810]/30">
                    <button 
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={!hasPrevPage}
                        className={`
                            font-medieval text-sm md:text-base px-6 py-2 rounded border-2 transition-all duration-300
                            ${!hasPrevPage 
                                ? 'opacity-0 pointer-events-none' 
                                : 'border-[#8b4513] text-[#8b4513] bg-[#f5e6d3] hover:bg-[#8b4513] hover:text-[#f5e6d3] shadow-md hover:shadow-lg lowercase font-variant-small-caps'}
                        `}
                    >
                        ❮ Neuere Beiträge
                    </button>

                    <span className="text-gold/50 font-medieval text-xs tracking-widest">
                        SEITE {page + 1}
                    </span>

                    <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={!hasNextPage}
                        className={`
                            font-medieval text-sm md:text-base px-6 py-2 rounded border-2 transition-all duration-300
                            ${!hasNextPage 
                                ? 'opacity-0 pointer-events-none' 
                                : 'border-[#8b4513] text-[#8b4513] bg-[#f5e6d3] hover:bg-[#8b4513] hover:text-[#f5e6d3] shadow-md hover:shadow-lg lowercase font-variant-small-caps'}
                        `}
                    >
                        Ältere Beiträge ❯
                    </button>
                </div>
            )}
            
            {/* Divider */}
            <div className="flex items-center gap-4 text-gold/30 text-xs font-medieval justify-center py-4 opacity-50">
                <span className="w-10 h-[1px] bg-gold/50"></span> ⚔ <span className="w-10 h-[1px] bg-gold/50"></span>
            </div>
        </div>
      </div>
    </section>
  );
};
