
import dynamic from 'next/dynamic'
import Image from 'next/image'

import AddressCard from '@/components/ui/cards/addressCard'
import SectionTitle from '@/components/ui/sectionTitle'
import { addressList } from '@/lib/fackData/addressList'
import InputFiled from '@/components/ui/inputFiled'
import TextAreaFiled from '@/components/ui/textAreaFiled'
import RightArrow from '@/assets/icons/rightArrow'
import from_img from "@/assets/images/contact-image.jpg"
import Feedback from '@/components/section/feedback'
import ButtonOutline from '@/components/ui/buttons/buttonOutline'

const LeafletMap = dynamic(
    () => import('@/components/ui/leafletMap'),
    {
        loading: () => <p>A map is loading</p>,
        ssr: false
    }
)

export const metadata = {
    title: "Keystone Woodworx -- Contact Us",
    description: "Keystone Woodworx - Custom Cabinetry and Woodworking. Contact us for your next project.",
};

const Contact = () => {

    return (
        <>
          
            {/* ------ contact form start */}
            <section className='mb-8'>
                <div className='container-fluid '>
                    <SectionTitle sectionName={"Inquiry"} sectionTitle={"Have a Project in your mind?"} sectionDesc={"Write us directly"} />
                </div>
                <div className='container lg:pt-30 2sm:pt-20 pt-14'>
                    <div className='grid lg:grid-cols-2 gap-5'>
                        <Image src={from_img} loading='lazy'      alt='contact-form' className='w-full h-auto' />
                        <form>
                            <InputFiled placeholderc={"Your Name"} type={"text"} className={"mb-[13px]"} />
                            <div className='flex sm:flex-row flex-col gap-x-5'>
                                <InputFiled placeholderc={"Phone Number"} type={"number"} className={"mb-[13px]"} />
                                <InputFiled placeholderc={"Your Email"} type={"email"} className={"mb-[13px]"} />
                            </div>
                            <TextAreaFiled placeholder={'Type your massage'} className={"min-h-[223px] mb-[13px]"} />
                            <div className='flex justify-end'>
                                <ButtonOutline>Send Message <RightArrow height={"22"} width={"35"} /></ButtonOutline>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            {/* ------ contact form end */}
           
        </>
    )
}

export default Contact