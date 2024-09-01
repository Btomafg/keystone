"use client"
import Link from 'next/link'
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import 'swiper/css';
import { cn } from '@/lib/utils'
import ButtonFill from '@/components/ui/buttons/buttonFill'
import RightArrow from '@/assets/icons/rightArrow';


const BannerOne = ({ data, text_muted, bg_muted }) => {
  const swiperRef = useRef()

  const handleSlideChange = (swiper) => {
    const animate_fill = document.querySelectorAll(".animate-bg")
    const text_animation = document.querySelectorAll(".text-animation")

    animate_fill.forEach((item) => item.classList.remove("animate-fill"))
    text_animation.forEach((item) => item.classList.remove("animate-text-line-animation"))

    animate_fill.forEach((item, index) => {
      if (index === swiper.activeIndex) {
        item.classList.add("animate-fill")
      }
    })
    text_animation.forEach((item, index) => {
      if (index === swiper.activeIndex) {
        item.classList.add("animate-text-line-animation")
      }
    })


  };


  const pagination = {
    clickable: true,
    el: ".hero-pagination",
    renderBullet: function (index, className) {
      return `
      <span className='${className} flex leading-120'>
         <span className='inline-block mr-2 lg:text-4xl text-2xl font-extrabold text-transparent webkit-text-stroke-width-1 webkit-text-stroke-primary active-blut'>0${index + 1}</span>
         <span className='title md:text-lg text-sm font-semibold text-primary-foreground hidden sm:block sm:max-w-56 max-w-48'> ${data[index].title}</span>
      </span>`;
    },
  };

  return (
    <section className='relative banner-one'>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        pagination={pagination}
        loop={true}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={handleSlideChange}
        speed={1500}
        autoplay={{
          delay: 4000,
        }}
        modules={[Pagination, Navigation, Autoplay]}
      >

        {
          data.map(({ id, banner_img, heading_one, heading_two }) => {
            return (
              <SwiperSlide key={id} className='relative ' >
                <div className='bg-cover bg-no-repeat' style={{ backgroundImage: `url(${banner_img.src})` }}>
                  <div className='container '>
                    <div className='xl:pt-[200px] pt-[150px] pb-[250px]'>
                      <div>
                        <h1 className='2sm:text-[105px] sm:text-[100px] xm:text-7xl text-xl leading-[100%] font-bold relative'>
                          <span className={cn(`text-primary-foreground  animate-fill animate-bg after:${bg_muted} ${text_muted}`)}> {heading_one} </span>
                          <svg strokeWidth="2" className="stroke-primary  fill-transparent stroke-dasharray-1000 stroke-dashoffset-1000 animate-text-line-animation w-full 2sm:h-[200px] h-25 text-animation"><text x="0%" dominantBaseline="middle" y="50%">{heading_two}</text></svg>
                        </h1>
                        <Link href={"/project-archive"} className='mt-10 inline-block'>
                          <ButtonFill className={cn(`after:z-[1] rounded-md sm:px-10 px-4 after:left-0 after:${bg_muted} `)}> <span className='relative z-10'>Explore Our Portfolio</span> </ButtonFill>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })
        }
        <div className='flex justify-between absolute right-0 bottom-0 z-40'>
          <div className='hero-pagination bg-[rgba(210, 224, 217, 0.27)] backdrop-blur-md xl:px-9 xl:py-[61px] sm:px-5 px-2 py-10 max-w-[800px] flex xl:gap-8 gap-5'></div>
          {/* ------- Next and prev arrow */}
          <div className='flex flex-col sm:w-[90px] min-w-17.5 xl:h-[181px] h-[136px] '>
            <button onClick={() => swiperRef.current?.slideNext()} className={cn(`bg-primary ${bg_muted} text-secondary-foreground flex justify-center items-center h-1/2 `)}> <RightArrow width={"35"} height={"22"} /> </button>
            <button onClick={() => swiperRef.current?.slidePrev()} className={cn(`bg-secondary text-primary-foreground flex justify-center items-center h-1/2 rotate-180`)}> <RightArrow width={"35"} height={"22"} /> </button>
          </div>
          {/* ------- Next and prev arrow */}
        </div>
      </Swiper>

    </section>
  )
}

export default BannerOne