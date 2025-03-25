"use client"
import BlogCard from '@/components/ui/cards/blogCard';
import ProgressAndNatigation from '@/components/ui/progressAndNatigation';
import 'swiper/css';
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';

const BlogSlider = ({ data, text_muted }) => {
    const pagination = {
        clickable: true,
        el: ".progressbar-pagination",
        type: 'progressbar'
    };
    return (
        <Swiper
            spaceBetween={18}

            breakpoints={{
                0: {
                    slidesPerView: 1
                },
                560: {
                    slidesPerView: 2
                },
                1200: {
                    slidesPerView: 3
                },
                // 1400: {
                //     slidesPerView: 3
                // }
            }}
            pagination={pagination}
            loop={true}
            modules={[Pagination, Navigation]}
            className=''
        >
            {
                data.map(({ id, thumb, date, title, tag }) => {
                    return (
                        <SwiperSlide key={id}>
                            <BlogCard date={date} tag={tag} thumb={thumb} title={title} text_muted={text_muted} />
                        </SwiperSlide>
                    )
                })
            }
            <ProgressAndNatigation />
        </Swiper>
    )
}

export default BlogSlider