import menu_image_1 from "@/assets/images/menu-image-1.png"
export const menuList = [
    {
        id: 1,
        name: "Home",
        path: "#",
        isMegaMenu: false,
        isDropdown: false
    },
    {
        id: 2,
        name: "Projects",
        path: '/project-archive',
        isMegaMenu: false,
        isDropdown: false
    },
    {
        id: 3,
        name: "Services",
        path: "#",
        isDropdown: false,
        isMegaMenu: [
            {
                id: 1,
                menus: [
                    {
                        id: 1,
                        name: "Custom Cabinetry",
                        path: "/service-single",
                        desc: "New construction cabinetry furnishes a new home with cabinetry for every space of the home."
                    },
              
                ]
            },
            {
                id: 2,
                menus: [
                    {
                        id: 2,
                        name: "Unique Remodel Designs",
                        path: "/service-single",
                        desc: "Removal of existing cabinetry (if needed), Designed cabinetry for existing space, Installation of cabinets and counter. "
                     },
                 
                ]
            },
            {
                id: 3,
                menus: [
                    {
                        id: 3,
                        name: "Closet Design",
                        path: "/service-single",
                        desc: "Fast closet design, manufacturing, and installation service to organize his and hers space. "
                    },
                    
                ]
            },
            {
                id: 5,
                menus: [
                    {
                        id: 9,
                        name: "Embark on a Design Journey with Us",
                        path: "#",
                        desc: "Let’s Talk",
                        img: menu_image_1
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "Learn More",
        path: "#",
        isMegaMenu: false,
        isDropdown: [
            {
                id: 1,
                name: "About Us",
                path: "/about-us"
            },
            {
                id: 2,
                name: "Services",
                path: "/services"
            },
            // {
            //     id: 3,
            //     name: "Service Single",
            //     path: "/service-single"
            // },
            
            {
                id: 3,
                name: "Career",
                path: "/career"
            },
           
            {
                id: 4,
                name: "Team",
                path: "/team"
            },
           
        ]
    },
 
    {
        id: 6,
        name: "Contact",
        path: "/contact",
        isMegaMenu: false,
        isDropdown: false
    },
]