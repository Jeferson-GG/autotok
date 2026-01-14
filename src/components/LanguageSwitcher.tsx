import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const BrazilFlag = () => (
  <svg viewBox="0 0 512 512" className="w-6 h-4 rounded-sm">
    <rect fill="#6DA544" width="512" height="512"/>
    <polygon fill="#FFDA44" points="256,100.2 467.5,256 256,411.8 44.5,256"/>
    <circle fill="#F0F0F0" cx="256" cy="256" r="80"/>
    <circle fill="#0052B4" cx="256" cy="256" r="80"/>
    <path fill="#F0F0F0" d="M215.9,236.4c-14.5,0-28.5,2.1-41.8,5.9c-0.8,5.4-1.3,10.9-1.3,16.5c0,45.9,30.8,84.6,72.9,96.7c20.8-12.9,38.6-30.6,51.5-51.5C297,256.8,258.3,236.4,215.9,236.4z"/>
  </svg>
);

const USAFlag = () => (
  <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
    <g fillRule="evenodd">
      <path fill="#bd3d44" d="M0 0h640v480H0"/>
      <path fill="#fff" stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
      <path fill="#192f5d" d="M0 0h364v258.5H0"/>
      <g fill="#fff">
        <path d="M30 15l4.5 14H50l-12 9 4.5 14-12-9-12 9 4.5-14-12-9h15.5z"/>
        <path d="M90 15l4.5 14h15.5l-12 9 4.5 14-12-9-12 9 4.5-14-12-9h15.5z"/>
        <path d="M150 15l4.5 14h15.5l-12 9 4.5 14-12-9-12 9 4.5-14-12-9h15.5z"/>
        <path d="M210 15l4.5 14h15.5l-12 9 4.5 14-12-9-12 9 4.5-14-12-9h15.5z"/>
        <path d="M270 15l4.5 14h15.5l-12 9 4.5 14-12-9-12 9 4.5-14-12-9h15.5z"/>
        <path d="M330 15l4.5 14h15.5l-12 9 4.5 14-12-9-12 9 4.5-14-12-9h15.5z"/>
      </g>
    </g>
  </svg>
);

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={() => setLanguage('pt')}
        className={`p-1.5 rounded-md transition-all duration-300 ${
          language === 'pt' 
            ? 'bg-muted ring-2 ring-primary' 
            : 'hover:bg-muted/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BrazilFlag />
      </motion.button>
      <motion.button
        onClick={() => setLanguage('en')}
        className={`p-1.5 rounded-md transition-all duration-300 ${
          language === 'en' 
            ? 'bg-muted ring-2 ring-primary' 
            : 'hover:bg-muted/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <USAFlag />
      </motion.button>
    </div>
  );
};
