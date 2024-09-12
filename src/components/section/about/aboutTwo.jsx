'use client';
import React from 'react';
import Image from 'next/image';
import SectionTitle from '../../ui/sectionTitle';
import markandcole from '@/assets/images/team/markandcole.jpg';
import SectionSidebarImg from '@/components/ui/sectionSidebarImg';
import ModernCarousel from '@/components/ui/modernCarousel';

const AboutTwo = () => {
  return (
    <section>
      <div className="container-fluid">
        <SectionTitle
          sectionName={'About Us'}
          sectionTitle={'Keystone Woodworx'}
          sectionDesc={'Redefining Spaces with Elegance and Precision'}
        />
        <div className=" flex flex-col md:flex-row">
          <p className=" text-primary px-8 mt-3 w-full md:w-1/2 ">
            At Keystone Woodworx, we specialize in crafting custom cabinetry that transforms spaces with elegance and precision. Led by the
            expertise of Mark and Cole, our team of master craftsmen seamlessly blend modern innovation with time-honored techniques,
            utilizing only the highest quality materials. Every project is tailored to your unique vision, ensuring both beauty and
            functionality. From classic designs to contemporary aesthetics, we are committed to exceeding expectations with exceptional
            craftsmanship and meticulous attention to detail. Experience the Keystone difference—where your dream cabinetry becomes reality.
          </p>{' '}
          <Image className="w-full md:w-1/2" src={markandcole} />
        </div>
        <div className={`bg-primary xl:mt-[220px] py-8 lg:mt-25 md:mt-44 mt-[100px] xl:mb-20 mb-0`}>
          <div className="container">
            <div className="flex lg:flex-row flex-col items-center justify-between gap-[66px]">
              <div className="flex flex-col">
                <h2 className="text-secondary-foreground text-3xl 2sm:text-4xl font-bold leading-120 mb-6 max-w-[400px]">Our Workshop</h2>
                <p className=" text-secondary-foreground">
                  Nestled in Carrolltown, PA, our state-of-the-art workshop spans over 5,000 square feet and is equipped with cutting-edge
                  manufacturing equipment and technology. This modern facility allows us to push the boundaries of custom cabinetry design
                  while maintaining the craftsmanship and attention to detail that define Keystone Woodworx. From precision cutting to
                  flawless finishing, every aspect of our workshop is designed to deliver high-quality, bespoke pieces that meet your unique
                  needs. It's in this space where innovation and tradition come together, enabling our team to craft cabinetry that exceeds
                  expectations every time.
                </p>
                <ModernCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTwo;
