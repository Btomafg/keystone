'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import RightArrow from '@/assets/icons/rightArrow';

const TeamCardOne = ({ img, name, position, text_muted, cardVariants, prantCalss }) => {
  return (
    <motion.div
      className={cn(`mb-16 mt-8 ${prantCalss}`)}
      initial="offscreen"
      whileInView="onscreen"
      variants={cardVariants}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="relative group hover-underline mt-8">
        <div className="relative">
          <Image src={img} loading="lazy" width={'auto'} height={'auto'} alt={name} className="w-full h-full" />
        </div>
        <div className="bg-secondary p-4  absolute left-0 bottom-[-10%] min-w-[295px] transition-all duration-500 group-hover:min-w-full">
          <div>
            <span className="w-full h-[1px] bg-[#253B2F4D] block absolute top-2"></span>
            <span className="w-full h-[1px] bg-[#253B2F4D] block absolute bottom-2"></span>
            <span className="w-[1px] h-full bg-[#253B2F4D] block absolute left-2"></span>
            <span className="w-[1px] h-full bg-[#253B2F4D] block absolute right-2"></span>
          </div>

          <label>
            <span className={cn(`text-2xl font-bold leading-160 text-primary-foreground cursor-pointer ${text_muted}`)}>{name}</span>
            <small className={cn(`text-primary-foreground text-lg block ${text_muted}`)}>{position}</small>
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCardOne;
