import React from 'react'
import DemoCard from './demoCard'

import home_1 from "@/assets/images/demos/home-1.jpg"
import home_2 from "@/assets/images/demos/home-2.jpg"
import home_3 from "@/assets/images/demos/home-3.jpg"
import home_4 from "@/assets/images/demos/home-4.jpg"

import about_us from "@/assets/images/demos/about-us.jpg"
import blog_archive from "@/assets/images/demos/blog-archive.jpg"
import blog_left_sidebar from "@/assets/images/demos/blog-left-sidebar.jpg"
import blog_right_sidebar from "@/assets/images/demos/blog-right-sidebar.jpg"
import blog_single from "@/assets/images/demos/blog-single.jpg"
import career from "@/assets/images/demos/career.jpg"
import contact from "@/assets/images/demos/contact.jpg"
import contact_2 from "@/assets/images/demos/contact-2.jpg"
import job_details from "@/assets/images/demos/job-details.jpg"
import project_archive from "@/assets/images/demos/project-archive.jpg"
import project_single from "@/assets/images/demos/project-single.jpg"
import services from "@/assets/images/demos/services.jpg"
import services_single from "@/assets/images/demos/service-single.jpg"
import shop_rchive from "@/assets/images/demos/shop-archive.jpg"
import shop_single from "@/assets/images/demos/shop-single.jpg"
import team from "@/assets/images/demos/team.jpg"
import team_single from "@/assets/images/demos/team-single.jpg"

const homeDemoData = [
    {
        id: 1,
        demo_img: home_1,
        link: "/home-1",
        demo_name: "Home-1"
    },
    {
        id: 2,
        demo_img: home_2,
        link: "/home-2",
        demo_name: "Home-2"
    },
    {
        id: 3,
        demo_img: home_3,
        link: "/home-3",
        demo_name: "Home-3"
    },
    {
        id: 4,
        demo_img: home_4,
        link: "/home-4",
        demo_name: "Home-4"
    },
]
const innerDemoData = [
    {
        id: 1,
        demo_img: about_us,
        link: "/about-us",
        demo_name: "About Us"
    },
    {
        id: 2,
        demo_img: blog_archive,
        link: "/blog-archive",
        demo_name: "Blog Archive"
    },
    {
        id: 3,
        demo_img: blog_left_sidebar,
        link: "/blog-left-sidebar",
        demo_name: "Blog Left Sidebar"
    },
    {
        id: 4,
        demo_img: blog_right_sidebar,
        link: "/blog-right-sidebar",
        demo_name: "Blog Right Sidebar"
    },
    {
        id: 5,
        demo_img: blog_single,
        link: "/blog-single",
        demo_name: "Blog Single"
    },
    {
        id: 6,
        demo_img: career,
        link: "/career",
        demo_name: "Career"
    },
    {
        id: 9,
        demo_img: job_details,
        link: "/job-details",
        demo_name: "Job Details"
    },
    {
        id: 7,
        demo_img: contact,
        link: "/contact",
        demo_name: "Contact"
    },
    {
        id: 8,
        demo_img: contact_2,
        link: "/contact-2",
        demo_name: "Contact 2"
    },
    {
        id: 10,
        demo_img: project_archive,
        link: "/project-archive",
        demo_name: "Project Archive"
    },
    {
        id: 11,
        demo_img: project_single,
        link: "/project-single",
        demo_name: "Project Single"
    },
    {
        id: 12,
        demo_img: services,
        link: "/services",
        demo_name: "Services"
    },
    {
        id: 13,
        demo_img: services_single,
        link: "/service-single",
        demo_name: "Service Single"
    },
    {
        id: 14,
        demo_img: shop_rchive,
        link: "/product-archive",
        demo_name: "Product Archive"
    },
    {
        id: 15,
        demo_img: shop_single,
        link: "/product-single",
        demo_name: "Product Single"
    },
    {
        id: 16,
        demo_img: team,
        link: "/team",
        demo_name: "Team"
    },
    {
        id: 17,
        demo_img: team_single,
        link: "/team-single",
        demo_name: "Team Single"
    },

]
const Demos = () => {
    return (
        <section className='py-25' id="demos">
            <div className='container'>
                <div>
                    <h1 className='text-center [font-size:_clamp(40px,7vw,90px)] font-extrabold leading-120 text-primary-foreground mb-15'>Stylish & Flexible <br /> Layouts</h1>
                    <div className='grid md:grid-cols-2 gap-10'>
                        {
                            homeDemoData.map(({ id, demo_img, demo_name, link }) => <DemoCard key={id} demo_img={demo_img} demo_name={demo_name} link={link} />)
                        }
                    </div>
                </div>
                <div className='pt-25'>
                    <h1 className='text-center [font-size:_clamp(40px,7vw,90px)] font-extrabold leading-120 text-primary-foreground mb-15'>Inner-Pages</h1>
                    <div className='grid xl:grid-cols-3 md:grid-cols-2 gap-10'>
                        {
                            innerDemoData.map(({ id, demo_img, demo_name, link }) => <DemoCard key={id} demo_img={demo_img} demo_name={demo_name} link={link} />)
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Demos