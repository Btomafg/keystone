import Link from 'next/link'
import landing from "@/assets/images/hero-landing.jpg"
import RightArrow from '@/assets/icons/rightArrow'
import ButtonFill from '../ui/buttons/buttonFill'
import ButtonOutline from '../ui/buttons/buttonOutline'

const Banner = () => {
    return (
        <section className={`pt-[100px]  relative bg-center bg-no-repeat bg-cover`} style={{ backgroundImage: `url(${landing.src})` }}>
            <div className='container-fluid '>
                <div className='pt-[160px] pb-[230px]'>
                    <h1 className='2xl:text-[200px] xl:text-[150px] lg:text-[120px] md:text-[90px] text-[60px] font-extrabold leading-[100%]  text-center text-primary-foreground'>Architecture Interior</h1>
                    <div className='flex md:flex-row flex-col items-center justify-center gap-5 mt-14'>
                        <Link href={"https://themeforest.net/item/architronix-nextjs-creative-interior-exterior-architecture-business-templates-by-tailwind-css/51303546"}>
                            <ButtonFill className={"gap-3 after:left-0"}>Buy Architronix <RightArrow width={"35"} height={"22"} /> </ButtonFill>
                        </Link>
                        <Link href={"#demos"}>
                            <ButtonOutline className={"after:z-[1]"}> <span className='z-10'>View Demos</span> </ButtonOutline>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner