import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DataSlateProps {
  title: string;
  date: string;
  category: string;
  summary: string;
  index: number;
}

export const DataSlate = ({ title, date, category, summary, index }: DataSlateProps) => {
  const [refId, setRefId] = useState("");
  useEffect(() => {
    setRefId(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-4 md:p-6 border-l-4 border-silver/20 hover:border-neon bg-gradient-to-r from-silver/5 to-transparent transition-colors group cursor-pointer w-full max-w-2xl"
    >
      <div className="absolute top-0 right-0 p-2 opacity-50 text-[10px] font-mono text-silver group-hover:text-neon">
        // REF: {refId}
      </div>
      
      <div className="flex gap-4 items-baseline mb-2">
        <span className="text-neon text-xs font-bold tracking-wider uppercase border border-neon/30 px-2 py-0.5 rounded-sm">
            {category}
        </span>
        <span className="text-silver/40 text-xs font-mono">{date}</span>
      </div>
      
      <h3 className="text-xl md:text-2xl font-military text-silver group-hover:text-white transition-colors mb-2">
        {title}
      </h3>
      
      <p className="text-silver/70 font-tactical text-sm leading-relaxed max-w-xl">
        {summary}
      </p>

      {/* Hover decoration */}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
};
