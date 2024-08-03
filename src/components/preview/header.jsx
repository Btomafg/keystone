"use client"
import Link from 'next/link'
import Logo from '@/assets/images/logo/KW-LOGO.webp'
import RightArrow from '@/assets/icons/rightArrow'
import ButtonFill from '../ui/buttons/buttonFill'
import useStickyHeader from '@/hooks/useStickyHeader'

const Header = () => {
    useStickyHeader()
    return (
        <header className='py-4 absolute top-0 left-0 bg-background z-40 w-full shadow-md'>
            <div className='container-fluid'>
                <div className='bottom-navbar'>
                    <div className='flex sm:flex-row flex-col justify-between items-center'>
                        <div className='flex justify-between items-center py-3'>
                        <Image className='p-3' src={Logo} height={"31"} width={"219"} />
                        </div>
                        <Link href={"https://themeforest.net/item/architronix-nextjs-creative-interior-exterior-architecture-business-templates-by-tailwind-css/51303546"} className='hidden sm:inline-block mt-5 sm:mt-0'>
                            <ButtonFill className={"gap-3 after:left-0"}>Buy Architronix <RightArrow width={"35"} height={"22"} /> </ButtonFill>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header