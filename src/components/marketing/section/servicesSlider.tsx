'use client';
import designconceptreal from '@/assets/images/projects/designconcept-real.png';
import designconcept from '@/assets/images/projects/designconcept.png';
import ServiceCard from '@/components/ui/cards/serviceCard';
import ProgressAndNatigation from '@/components/ui/progressAndNatigation';
import SectionTitle from '@/components/ui/sectionTitle';
import { servicesData } from '@/lib/fackData/servicesData';
import Image from 'next/image';
import { ReactCompareSlider } from 'react-compare-slider';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ServicesSlider = ({ text_muted, bg_muted }) => {
  const pagination = {
    clickable: true,
    el: '.progressbar-pagination',
    type: 'progressbar',
  };
  return (
    <section className="pt-20">
      <div className="container-fluid">
        <SectionTitle
          sectionName={'Services'}
          sectionTitle={'Explore What We Do'}
          sectionDesc={'Everything to transform your space in a way that works for you.'}
          link={'/services'}
          button_text={'View All Services'}
          text_muted={text_muted}
          bg_muted={bg_muted}
        />
        <div className="max-w-[1000px] mx-auto">
          <ReactCompareSlider
            itemOne={<Image src={designconcept} alt="Image one" />}
            itemTwo={<Image src={designconceptreal} alt="Image two" />}
          />
        </div>

        <div className="lg:pt-30 2sm:pt-20 pt-14">
          <Swiper
            spaceBetween={30}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              560: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
              1400: {
                slidesPerView: 4,
              },
            }}
            pagination={pagination}
            loop={true}
            modules={[Pagination, Navigation]}
            className=""
          >
            {servicesData.map(({ id, service_name, service_desc, link }) => (
              <SwiperSlide key={id}>
                {' '}
                <ServiceCard id={id} service_desc={service_desc} service_name={service_name} text_muted={text_muted} link={link} />{' '}
              </SwiperSlide>
            ))}
            <div className="container">
              <ProgressAndNatigation />
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ServicesSlider;
