import Image from 'next/image';
import service_img from "@/assets/images/projects/bt-kitchen-1.jpg";
import SectionTitle from '@/components/ui/sectionTitle';
import Title from '@/components/ui/title';
import ServiceSingleSidebar from '@/components/ui/serviceSingleSidebar';
import Feedback from '@/components/section/feedback';

export const metadata = {
  title: "Keystone Woodworx -- Remodel Services",
  description: "Keystone Woodworx offers expert custom remodel designs to enhance your home with personalized cabinetry and more.",
};

const Remodels = () => {
  return (
    <>
      <section>
        <div className='container-fluid'>
          <SectionTitle sectionName={"Services"} sectionTitle={"Custom Remodels"} sectionDesc={"Enhancing homes with expert custom cabinetry and remodel designs."} />
        </div>
        <div className='container lg:pt-30 2sm:pt-20 pt-14'>
          <div className='grid lg:grid-cols-[58%_auto] xl:gap-[120px] gap-15 items-start'>
            <div>
              <Image src={service_img} loading='lazy' alt='remodel-service-img' />
              <div className='pt-12.5'>
                <Title title_text={"Overview"} />
                <p className='text-primary-foreground'>
                  Keystone Woodworx specializes in custom remodel designs that breathe new life into your home. Whether you're renovating your kitchen, bathroom, or any other space, our expert team will work with you to create personalized cabinetry and design solutions that enhance functionality and aesthetic appeal.
                </p>
              </div>
              <div className='pt-12.5'>
                <Title title_text={"What's Included"} />
                <ul>
                  <li>
                    <h5 className='font-bold'>Custom Cabinetry Design & Build:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>Tailored cabinetry solutions designed to fit your remodel needs, including kitchen, bathroom, and other storage areas.</p>
                  </li>
                  <li className='pt-7.5'>
                    <h5 className='font-bold'>Space Planning & Design:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>Comprehensive space planning to optimize the layout and functionality of your remodeled area.</p>
                  </li>
                  <li className='pt-7.5'>
                    <h5 className='font-bold'>Material Selection:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>Expert guidance on selecting materials that match your style and meet your functional requirements.</p>
                  </li>
                  <li className='pt-7.5'>
                    <h5 className='font-bold'>Project Management:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>From design to installation, we manage every aspect of your remodel to ensure a smooth and stress-free process.</p>
                  </li>
                </ul>
              </div>
              <div className='pt-12.5'>
                <Title title_text={"How It Works"} />
                <ul>
                  <li>
                    <h5 className='font-bold'>Initial Consultation:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>We start with an in-depth consultation to understand your vision, needs, and budget for the remodel.</p>
                  </li>
                  <li className='pt-7.5'>
                    <h5 className='font-bold'>Design & Planning:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>Our design team creates detailed plans, including 3D renderings, to help you visualize the final result.</p>
                  </li>
                  <li className='pt-7.5'>
                    <h5 className='font-bold'>Approval & Quoting:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>Once the design is approved, we provide a detailed quote. Upon acceptance, we move forward with material selection and scheduling.</p>
                  </li>
                  <li className='pt-7.5'>
                    <h5 className='font-bold'>Remodel Execution:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>Our skilled craftsmen begin the remodeling process, ensuring every detail is executed to perfection. Regular updates keep you informed throughout the project.</p>
                  </li>
                  <li className='pt-7.5'>
                    <h5 className='font-bold'>Final Walkthrough & Approval:</h5>
                    <p className='mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10'>Upon completion, we conduct a final walkthrough with you to ensure everything meets your expectations and to address any final adjustments.</p>
                  </li>
                </ul>
              </div>
              <strong className='mt-12.5 block'>
                Elevate your living spaces with Keystone Woodworx's expert remodel services. We bring your vision to life, ensuring a seamless and satisfying experience from start to finish.
              </strong>
            </div>
            <ServiceSingleSidebar />
          </div>
        </div>
      </section>
      <Feedback />
    </>
  )
}

export default Remodels;
