import service_img from '@/assets/images/projects/albright-concept1.png';
import Feedback from '@/components/marketing/section/feedback';
import SectionTitle from '@/components/ui/sectionTitle';
import ServiceSingleSidebar from '@/components/ui/serviceSingleSidebar';
import Title from '@/components/ui/title';
import Image from 'next/image';

export const metadata = {
  title: 'Keystone Woodworx -- Service Single',
  description: 'Keystone Woodworx offers custom cabinetry and remodel designs, specializing in new construction cabinetry.',
};

const Cabinetry = () => {
  return (
    <>
      <section>
        <div className="container-fluid">
          <SectionTitle
            sectionName={'Services'}
            sectionTitle={'New Construction Cabinetry'}
            sectionDesc={'Furnishing new homes with custom cabinetry for every space.'}
          />
        </div>
        <div className="container lg:pt-30 2sm:pt-20 pt-14">
          <div className="grid lg:grid-cols-[58%_auto] xl:gap-[120px] gap-15 items-start">
            <div>
              <Image src={service_img} loading="lazy" alt="service-img" />
              <div className="pt-12.5">
                <Title title_text={'Overview'} />
                <p className="text-primary-foreground">
                  At Keystone Woodworx, we specialize in providing custom cabinetry solutions for new home constructions. Our services cater
                  to custom home builders, homeowners, designers, and developers, ensuring that every space in your new home is beautifully
                  furnished with cabinetry that perfectly fits your style and needs.
                </p>
              </div>
              <div className="pt-12.5">
                <Title title_text={"What's Included"} />
                <ul>
                  <li>
                    <h5 className="font-bold">Comprehensive Design Plans:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Includes floor plan drawings, elevation drawings, visuals for wire and plumbing stub outs, 3D models, and revisions.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Custom Cabinet Manufacturing & Finishing:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      High-quality custom cabinetry built and finished to your specifications.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Installation Services:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Professional installation of all cabinetry, with optional countertop purchase and installation services available.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Countertop Options:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Granite, quartz, marble, and solid surface countertops can be purchased through us and installed.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="pt-12.5">
                <Title title_text={'How It Works'} />
                <ul>
                  <li>
                    <h5 className="font-bold">Initial Information Form:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Provide details about the rooms needing cabinetry, inspiration photos, architectural plans, counter preferences, and
                      pullout needs.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Quoting Process:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      We generate a quote based on your information. Upon approval, a deposit is required, and materials are ordered.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Design Phase:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      We create a rough draft design with revisions until final approval for manufacturing.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Manufacturing & Installation:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Our manufacturing process includes pre-manufacturing design, face frame construction, door construction, finishing,
                      and assembly. Installation is available at $50 per man hour.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Countertop Templating & Installation:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      We template and install countertops within 2 weeks of manufacturing completion.
                    </p>
                  </li>
                </ul>
              </div>
              <strong className="mt-12.5 block">
                Transform your new home with Keystone Woodworx's expert custom cabinetry services. We bring your vision to life with quality
                craftsmanship and personalized service.
              </strong>
            </div>
            <ServiceSingleSidebar />
          </div>
        </div>
      </section>
      <Feedback />
    </>
  );
};

export default Cabinetry;
