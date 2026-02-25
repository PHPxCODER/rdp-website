'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface BehanceIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface BehanceIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const pathVariants: Variants = {
  normal: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [0.95, 1.05, 0.95],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const BehanceIcon = forwardRef<BehanceIconHandle, BehanceIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(
          `cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center`,
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <motion.g variants={pathVariants} initial="normal" animate={controls}>
            <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.836 1.98 2.101 1.98.726 0 1.25-.28 1.537-.78l3.118.03zm-7.726-7c-1.619 0-2.463.938-2.637 2.5h5.243c-.07-1.597-.932-2.5-2.606-2.5zM0 5.026h5.894c2.906 0 4.386 1.365 4.386 3.549 0 1.461-.555 2.46-1.648 2.957 1.498.44 2.368 1.661 2.368 3.17 0 2.646-1.908 4.297-4.764 4.297H0V5.026zm2.5 5.555h2.869c1.258 0 2.025-.5 2.025-1.654 0-1.065-.711-1.612-2.025-1.612H2.5v3.266zm0 5.42h2.981c1.443 0 2.292-.577 2.292-1.869s-.923-1.87-2.292-1.87H2.5v3.74z" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

BehanceIcon.displayName = 'BehanceIcon';

export { BehanceIcon };
