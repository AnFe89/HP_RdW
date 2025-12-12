import { useState } from 'react';
import { motion } from 'framer-motion';

interface DataSlateProps {
  title: string;
  date: string;
  category: string;
  summary: string;
  index: number;
}

export const DataSlate = ({ title, date, category, summary, index }: DataSlateProps) => {
  const [refId] = useState(() => Math.random().toString(36).substr(2, 6).toUpperCase());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className="relative p-6 md:p-8 bg-[#f5e6d3] text-[#2c1810] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-colors duration-300 group cursor-pointer w-full max-w-2xl rounded-sm border border-[#d4c5a9]"
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply rounded-sm" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }} />
      
      {/* Wax Seal / ID */}
      <div className="absolute top-4 right-4 text-[10px] font-medieval text-[#2c1810]/40 group-hover:text-crimson/60 transition-colors">
        REF: {refId}
      </div>
      
      <div className="flex gap-4 items-baseline mb-3 relative z-10">
        <span className="text-[#2c1810] text-xs font-bold tracking-widest uppercase border-b-2 border-gold pb-0.5">
            {category}
        </span>
        <span className="text-[#2c1810]/50 text-xs font-sans italic">{date}</span>
      </div>
      
      <h3 className="text-2xl md:text-3xl font-medieval text-[#2c1810] group-hover:text-crimson transition-colors mb-4 relative z-10">
        {title}
      </h3>
      
      <p className="text-[#2c1810]/80 font-serif text-base leading-relaxed max-w-xl relative z-10">
        {summary}
      </p>

      {/* Decorative footer line */}
      <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gold group-hover:w-full transition-all duration-500 rounded-b-sm" />
    </motion.div>
  );
};
