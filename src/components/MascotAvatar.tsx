import { motion } from 'motion/react';
import { MASCOTS } from '../constants';

interface MascotAvatarProps {
  type: 'shangshang' | 'caicai';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function MascotAvatar({ type, size = 'md', className = '' }: MascotAvatarProps) {
  const mascot = MASCOTS[type];
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-64 h-64',
  };

  // Image paths for the mascots
  const mascotImages = {
    shangshang: '/assets/mascots/shangshang.png',
    caicai: '/assets/mascots/caicai.png'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative rounded-xl flex items-center justify-center overflow-hidden border-4 ${
        type === 'shangshang' ? 'border-yellow-400 bg-white' : 'border-red-500 bg-white'
      } ${sizeClasses[size]} ${className}`}
    >
      <img 
        src={mascotImages[type]} 
        alt={mascot.name} 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback to text if image fails to load
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div className="text-center hidden flex-col items-center">
        {type === 'shangshang' ? (
          <>
            <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              商
            </div>
            <span className="text-[10px] font-bold text-yellow-800 mt-1">商商</span>
          </>
        ) : (
          <>
             <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              财
            </div>
            <span className="text-[10px] font-bold text-red-800 mt-1">财财</span>
          </>
        )}
      </div>
    </motion.div>
  );
}
