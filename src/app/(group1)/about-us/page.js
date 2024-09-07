import AboutTwo from '@/components/section/about/aboutTwo';
import Expertise from '@/components/section/expertise';
import Feedback from '@/components/section/feedback';
import TeamCardOne from '@/components/ui/cards/teamCardOne';
import SectionTitle from '@/components/ui/sectionTitle';
import { teamData } from '@/lib/fackData/teamData';
import { cardSlideAnimation } from '@/lib/utils';

export const metadata = {
  title: 'Keystone Woodworx -- About Us',
  description: 'Keystone Woodworx is a next js and tailwind css website',
};
const AboutUs = () => {
  return (
    <>
      <AboutTwo />

      {/* --------- start team section */}
      <section className="pt-20">
        <div className="container-fluid ">
          <SectionTitle
            sectionName={'Team'}
            sectionTitle={'Craftsmen of Keystone Woodworx'}
            sectionDesc={'Where Passion Meets Precision'}
          />
        </div>
        <div className="container lg:pt-[340px] 2sm:pt-20 pt-14">
          <div className="grid lg:grid-cols-3 2sm:grid-cols-2 gap-7">
            {teamData.map(({ id, img, name, position, social_link }) => (
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
      {/* --------- start team section */}
      <Feedback />
    </>
  );
};

export default AboutUs;
