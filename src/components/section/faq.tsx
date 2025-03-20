import Image from "next/image"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import SectionTitle from "../ui/sectionTitle"
import faq_img from "@/assets/images/faq-image.jpg"
import SectionSidebarImg from "../ui/sectionSidebarImg"

const faqData = [
    {
        id: "1",
        question: "What Custom Cabinetry Services Do You Offer?",
        ans: `
        We specialize in designing and building custom cabinetry for kitchens, bathrooms, offices, and more. Our services include personalized consultations to understand your style and storage needs, custom design to fit your space perfectly, and high-quality craftsmanship to bring your vision to life.
        `
    },
    {
        id: "2",
        question: "How Does Your Custom Remodel Design Process Work?",
        ans: `
        Our custom remodel design process begins with a thorough consultation to understand your goals, style preferences, and budget. We then create detailed design plans, including 3D renderings, to help you visualize the final result. Throughout the project, we manage all aspects of the remodel, ensuring a smooth and stress-free experience.
        `
    },
    {
        id: "3",
        question: "Do You Work with Specific Materials for Custom Cabinetry?",
        ans: `
        Yes, we offer a wide range of material options for custom cabinetry, including solid wood, engineered wood, laminate, and more. We also provide various finishes, such as stains, paints, and veneers, to match your design preferences and ensure durability.
        `
    },
    {
        id: "4",
        question: "Can You Assist with Kitchen and Bathroom Remodels?",
        ans: `
        Absolutely! We specialize in kitchen and bathroom remodels, offering custom cabinetry, countertops, and tailored designs that optimize functionality and aesthetics. Our team handles everything from initial design concepts to final installation.
        `
    },
    {
        id: "5",
        question: "What Is Your Approach to Custom Closet Design?",
        ans: `
        Our custom closet design services focus on maximizing space and organization. We design custom closets that fit your specific storage needs and personal style, using high-quality materials and thoughtful layouts to create a functional and beautiful space.
        `
    },
    {
        id: "6",
        question: "How Do You Ensure Quality in Your Custom Designs?",
        ans: `
        Quality is our top priority in every project. We use only the finest materials and work with skilled craftsmen who have years of experience in custom cabinetry and remodel design. Our attention to detail and commitment to excellence ensure that your project meets the highest standards.
        `
    }
];

const Faq = ({className}) => {
    return (
        <section className={`pt-20 ${className}`}>
            <div className="container-fluid">
                <SectionTitle sectionName={"FAQ"} sectionTitle={"Design Insights Unveiled"} sectionDesc={"Answers to Your Design Questions"} />
            </div>
            <div className="container lg:pt-30 2sm:pt-20 pt-14">
                <div className="grid lg:grid-cols-[40%_auto] items-center gap-17.5">
                    <div>
                        <SectionSidebarImg img={faq_img} section_name={"faq-background"} />
                    </div>

                    <div>
                        <Accordion type="single" defaultValue="1" collapsible>
                            {
                                faqData.map(({ id, ans, question }) => {
                                    return (
                                        <AccordionItem value={id} className='mb-2.5'>
                                            <AccordionTrigger className="text-xl font-semibold border border-primary sm:px-12.5 px-6">{question}</AccordionTrigger>
                                            <AccordionContent className="mt-[22px] sm:px-12.5 px-6">
                                                {ans}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })
                            }


                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Faq