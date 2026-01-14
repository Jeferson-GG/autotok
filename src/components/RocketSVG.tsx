import { motion } from 'framer-motion';
import { useState } from 'react';

export const RocketSVG = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotate: isHovered ? 360 : 0,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          y: isHovered ? -10 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        {/* Glow effect */}
        <defs>
          <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(330, 100%, 50%)" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Rocket body */}
        <g filter="url(#glow)">
          {/* Main body */}
          <path
            d="M60 15C60 15 45 35 45 55C45 75 55 90 60 90C65 90 75 75 75 55C75 35 60 15 60 15Z"
            fill="url(#rocketGradient)"
          />
          
          {/* Rocket tip */}
          <path
            d="M60 15L55 30H65L60 15Z"
            fill="hsl(180, 100%, 60%)"
          />
          
          {/* Window */}
          <circle
            cx="60"
            cy="50"
            r="8"
            fill="hsl(220, 20%, 10%)"
            stroke="hsl(180, 100%, 70%)"
            strokeWidth="2"
          />
          
          {/* Left fin */}
          <path
            d="M45 70L30 85L45 80V70Z"
            fill="url(#rocketGradient)"
          />
          
          {/* Right fin */}
          <path
            d="M75 70L90 85L75 80V70Z"
            fill="url(#rocketGradient)"
          />
          
          {/* Fire/Exhaust */}
          <motion.g
            animate={{
              opacity: isHovered ? [0.8, 1, 0.8] : 0.6,
              scaleY: isHovered ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
            style={{ originY: 0 }}
          >
            <path
              d="M55 90L60 110L65 90"
              fill="hsl(45, 100%, 50%)"
            />
            <path
              d="M57 90L60 105L63 90"
              fill="hsl(25, 100%, 50%)"
            />
          </motion.g>
        </g>
      </motion.svg>
      
      {/* Particle effects on hover */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan to-magenta"
              initial={{ 
                opacity: 0, 
                x: 60 + Math.cos(i * 60 * Math.PI / 180) * 20,
                y: 100 
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [100, 130, 150],
                x: 60 + Math.cos(i * 60 * Math.PI / 180) * (30 + i * 5),
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};
