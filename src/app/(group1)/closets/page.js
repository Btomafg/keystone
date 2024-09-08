import Image from 'next/image';
import service_img from '@/assets/images/custom-closet2.png';
import SectionTitle from '@/components/ui/sectionTitle';
import Title from '@/components/ui/title';
import ServiceSingleSidebar from '@/components/ui/serviceSingleSidebar';
import Feedback from '@/components/section/feedback';

export const metadata = {
  title: 'Keystone Woodworx | Closet Design | Located in Carrolltown, PA',
  description:
    'Keystone Woodworx offers fast and efficient closet design, manufacturing, and installation services to organize your space.',
};

const Closets = () => {
  return (
    <>
      <section>
        <div className="container-fluid">
          <SectionTitle
            sectionName={'Services'}
            sectionTitle={'Closet Design & Installation'}
            sectionDesc={'Organize your space with our fast and efficient closet design services.'}
          />
        </div>
        <div className="container lg:pt-30 2sm:pt-20 pt-14">
          <div className="grid lg:grid-cols-[58%_auto] xl:gap-[120px] gap-15 items-start">
            <div>
              <Image src={service_img} loading="lazy" alt="closet-service-img" />
              <div className="pt-12.5">
                <Title title_text={'Overview'} />
                <p className="text-primary-foreground">
                  Keystone Woodworx provides quick and professional closet design, manufacturing, and installation services. Our goal is to
                  help you organize your his and hers spaces efficiently, offering a wide range of design options and high-quality materials
                  to create the perfect closet system for your needs.
                </p>
              </div>
              <div className="pt-12.5">
                <Title title_text={"What's Included"} />
                <ul>
                  <li>
                    <h5 className="font-bold">Custom Closet Design:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Tailored design of closet cabinetry with optional organizers from Revashelf.com to maximize your space.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Prints & Renderings:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Detailed prints and 3D renderings are included to help you visualize your closet design.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Closet System Manufacturing:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      High-quality manufacturing of the custom closet system to your specifications.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Installation Services:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      1-day professional installation included in the price, ensuring a quick and hassle-free experience.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="pt-12.5">
                <Title title_text={'How It Works'} />
                <ul>
                  <li>
                    <h5 className="font-bold">Initial Design & Quote:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      We start with an initial design and quote based on your expected cabinetry needs and space requirements.
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Color Selection:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      Choose from a wide range of color options through our online gallery at{' '}
                      <a
                        href="https://arauco.esignserver3.com/gallery.do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-foreground underline"
                      >
                        Arauco Gallery
                      </a>
                      .
                    </p>
                  </li>
                  <li className="pt-7.5">
                    <h5 className="font-bold">Manufacturing & Installation:</h5>
                    <p className="mt-2.5 xl:ml-[113px] 2sm:ml-14 ml-10">
                      After the deposit is made, manufacturing begins, typically taking 3-6 weeks. Installation is completed in just one
                      day.
                    </p>
                  </li>
                </ul>
              </div>
              <strong className="mt-12.5 block">
                Transform your closet with Keystone Woodworx's expert design, manufacturing, and installation services. We bring efficiency
                and style to your organization needs.
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

export default Closets;
