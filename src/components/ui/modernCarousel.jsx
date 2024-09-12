import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import workshop1 from '@/assets/images/workshop/workshop1.jpg';
import workshop2 from '@/assets/images/workshop/workshop2.jpg';
import workshop3 from '@/assets/images/workshop/workshop3.jpg';
import workshop4 from '@/assets/images/workshop/workshop4.jpg';
import workshop5 from '@/assets/images/workshop/workshop5.jpg';
import workshop6 from '@/assets/images/workshop/workshop6.jpg';
import Image from 'next/image';

const images = [
  {
    id: 1,
    src: workshop1,
    title: 'Our Warehouse',
  },
  {
    id: 2,
    src: workshop2,
    title: 'Our Warehouse',
  },
  {
    id: 3,
    src: workshop3,
    title: 'Our Warehouse',
  },
  {
    id: 4,
    src: workshop4,
    title: 'Our Warehouse',
  },
  {
    id: 5,
    src: workshop5,
    title: 'Our Warehouse',
  },
  {
    id: 6,
    src: workshop6,
    title: 'Our Warehouse',
  },
];
export default function ModernCarousel() {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(idx);

  const trend = idx > prevIdx ? 1 : -1;

  const imageIndex = Math.abs(idx % images.length);

  return (
    <div className=" h-[700px] w-full max-h-[600px] bg-black relative overflow-hidden">
      <button
        onClick={() => {
          setPrevIdx(idx);
          setIdx((pv) => pv - 1);
        }}
        className="bg-black/50 hover:bg-black/60 transition-colors text-white p-2 absolute z-10 left-0 top-0 bottom-0"
      >
        <FiChevronLeft />
      </button>

      <div className="absolute inset-0 z-[5] backdrop-blur-xl">
        <AnimatePresence initial={false} custom={trend}>
          <Image src={images[imageIndex].src} layout="fill" objectFit="cover" />
        </AnimatePresence>
      </div>
      <button
        onClick={() => {
          setPrevIdx(idx);
          setIdx((pv) => pv + 1);
        }}
        className="bg-black/50 hover:bg-black/60 transition-colors text-white p-2 absolute z-10 right-0 top-0 bottom-0"
      >
        <FiChevronRight />
      </button>

      <AnimatePresence initial={false}>
        <motion.div
          key={images[imageIndex].id + images.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 object-fill z-0"
          style={{
            backgroundImage: `url(${images[imageIndex].src})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
      </AnimatePresence>
    </div>
  );
}

const imgVariants = {
  initial: (trend) => ({
    x: trend === 1 ? '200%' : '-200%',
    opacity: 0,
  }),
  animate: { x: '-50%', opacity: 1 },
  exit: (trend) => ({
    x: trend === 1 ? '-200%' : '200%',
    opacity: 0,
  }),
};

const titleVariants = {
  initial: (trend) => ({
    y: trend === 1 ? 20 : -20,
    opacity: 0,
  }),
  animate: { y: 0, opacity: 1 },
  exit: (trend) => ({
    y: trend === 1 ? -20 : 20,
    opacity: 0,
  }),
};
