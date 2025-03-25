import Feedback from '@/components/marketing/section/feedback';
import BannerOne from '@/components/marketing/section/heroes/bannerOne';
import ServicesSlider from '@/components/marketing/section/servicesSlider';
import Testimonial from '@/components/marketing/section/testimonial';
import TeamCardOne from '@/components/ui/cards/teamCardOne';
import Counter from '@/components/ui/counter';
import SectionTitle from '@/components/ui/sectionTitle';

import Footer from '@/components/marketing/footer';
import HeaderOne from '@/components/marketing/header/headerOne';
import { bannerOneData } from '@/lib/fackData/bannerOneData';
import { teamData } from '@/lib/fackData/teamData';
import { cardSlideAnimation } from '@/lib/utils';

const Home = () => {
  return (
    <>
      <main style={{ zIndex: 0 }}>
        <HeaderOne />
        <BannerOne data={bannerOneData} />
        <Counter />
        <ServicesSlider />
        {/*}<Gallery />*/}
        <Testimonial />
        {/* --------- start team section */}
        <section className="pt-20">
          <div className="container-fluid ">
            <SectionTitle
              sectionName={'Team'}
              sectionTitle={'Craftsmen of Keystone Woodworx'}
              sectionDesc={'Where Passion Meets Precision'}
              button_text={'Our Team'}
              link={'/about-us'}
            />
          </div>
          <div className="container lg:pt-[340px] 2sm:pt-20 pt-14">
            <div className="grid lg:grid-cols-3 2sm:grid-cols-2 gap-7">
              {teamData.slice(0, 3).map(({ id, img, name, position, social_link }) => (
                <TeamCardOne
                  key={id}
                  img={img}
                  name={name}
                  position={position}
                  social_link={social_link}
                  prantCalss={'team-card'}
                  cardVariants={cardSlideAnimation()}
                />
              ))}
            </div>
          </div>
        </section>
        {/* --------- end team section */}

        {/*}<ProjectsSlider />*/}

        {/*}
        <section className='pt-20'>
          <div className='container-fluid '>
            <SectionTitle
              sectionName={"Blog"}
              sectionTitle={"Design Insights & Inspiration"}
              sectionDesc={"Unveil the Secrets to Transforming Spaces"}
            />
          </div>
          <div className='container lg:pt-30 2sm:pt-20 pt-14'>
            <BlogSlider data={blogData.slice(0, 4)} />
          </div>
        </section>
        { */}

        <Feedback />
      </main>
      <Footer />
    </>
  );
};

export default Home;
