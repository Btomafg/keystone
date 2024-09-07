'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';

import QuoteIcon from '@/assets/icons/quoteIcon';
import SectionTitle from '../ui/sectionTitle';
import ProgressAndNatigation from '../ui/progressAndNatigation';
import { cn } from '@/lib/utils';

const testimonialData = [
  {
    id: 1,
    name: 'Steve Gironda',
    position: 'Local Guide',
    review: 'If you are looking for unbelievable quality and even better customer service, I highly recommend these men and their work.',
  },
  {
    id: 2,
    name: 'Brandon Thomas',
    position: 'Homeowner',
    review:
      "Mark and his team took care of our kitchen with a full custom build, designed by Mark. It's the conversation piece with every new visitor. Great craftsmanship and experience end to end.",
  },
  {
    id: 3,
    name: 'David Albright',
    position: 'Home Builder',
    review:
      'Mark & Cole at Keystone Woodworx build custom cabinets that are next level. From design & planning to installation, everything is done professionally & perfect. This home builder is truly impressed with every installation!',
  },
  {
    id: 4,
    name: 'Mike Karazsia',
    position: 'Customer',
    review:
      'We love every piece—walnut bar stools, table set, and custom litter box/entryway cabinet. Mark and Cole have amazing craftsmanship! I highly recommend them!',
  },
  {
    id: 5,
    name: 'Jan Matos',
    position: 'Homeowner',
    review:
      "Can't say enough positive things about my experience. Mark and Cole were a pleasure to work with and made the process easy and seamless. Their passion shows not only in their projects but also in how they interact with their customers. Very satisfied customer over here!",
  },
];

const Testimonial = ({ text_muted, bg_muted }) => {
  const pagination = {
    clickable: true,
    el: '.progressbar-pagination',
    type: 'progressbar',
  };
  return (
    <section className="pt-20">
      <div className="container-fluid ">
        <SectionTitle
          sectionName={'Testimonial'}
          sectionTitle={'Client Experiences'}
          sectionDesc={'Inspiring Stories from Our Clients, Where Dreams Find Their Designers'}
          bg_muted={bg_muted}
          text_muted={text_muted}
        />

        <div className="lg:pt-30 2sm:pt-20 pt-14">
          <Swiper
            spaceBetween={30}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              700: {
                slidesPerView: 2,
              },
              1300: {
                slidesPerView: 3,
              },
            }}
            pagination={pagination}
            loop={true}
            modules={[Pagination, Navigation]}
            className=""
          >
            {testimonialData.map(({ id, name, position, review }) => {
              return (
                <SwiperSlide key={id}>
                  <div className="flex md:gap-6 gap-2">
                    <div className="text-secondary-foreground">
                      <QuoteIcon />
                    </div>
                    <div className="mt-16">
                      <p className={cn(`text-lg text-primary-foreground ${text_muted}`)}>{review}</p>
                      <div className="relative after:absolute after:-left-5 after:top-0 after:w-[1px] after:h-full after:bg-primary ml-5 mt-6">
                        <h5 className={cn(`text-primary-foreground font-extrabold leading-160 text-lg ${text_muted}`)}>{name}</h5>
                        <p className={cn(`text-primary-foreground font-medium ${text_muted}`)}>{position}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
            <div className="container">
              <ProgressAndNatigation />
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
