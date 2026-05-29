import React from 'react';
import { motion } from 'motion/react';
import { AnimationType } from '../types';

interface AnimateInProps {
  key?: React.Key;
  type?: AnimationType;
  children: React.ReactNode;
  delay?: number;
  className?: string;
  triggerKey?: string; // Change key to re-trigger animation
}

export default function AnimateIn({
  type = 'none',
  children,
  delay = 0,
  className = '',
  triggerKey
}: AnimateInProps) {
  const getVariants = () => {
    switch (type) {
      case 'fade-in':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 25 },
          visible: { opacity: 1, y: 0 },
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.93 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'bounce':
        return {
          hidden: { opacity: 0, y: 40 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 150,
              damping: 10,
              delay
            }
          },
        };
      case 'pulse':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay
            }
          }
        };
      default:
        return null;
    }
  };

  const variants = getVariants();

  if (type === 'none' || !variants) {
    return <div className={className}>{children}</div>;
  }

  const animationProps = type === 'pulse' 
    ? {
        animate: {
          scale: [1, 1.02, 1],
          transition: {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }
        }
      }
    : {};

  return (
    <motion.div
      key={triggerKey}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}
