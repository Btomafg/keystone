"use client";;
import Logo from '@/assets/images/logo/KW-LOGO.webp';
import { menuList } from '@/lib/fackData/menuList';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import DropDownMenu from './dropDownMenu';
import MegaMenu from './megaMenu';
import Offcanvas from './offCanvas';
import TopNavbar from './topNavbar';

const BottomNavbar = ({ linkColor }) => {

    const [offcanvaseActive, setOffcanvaseActive] = useState(false)






    return (
        <div className=' bottom-navbar flex flex-col'>
            <TopNavbar />
            <div className='flex justify-between items-center border-border border-t'>

                <div>
                    <Link href="/" className={cn(`logo text-primary-foreground ${linkColor}`)}>
                        <Image alt='' className='p-3' src={Logo} width={"150"} />
                    </Link>
                </div>
                <nav>
                    <ul className='flex items-center'>
                        {
                            menuList.map(({ id, isDropdown, name, path, isMegaMenu }) => {
                                return (
                                    <li key={id} className='group'>
                                        <Link href={path} data-id={id} className={cn(`nav-link text-xl font-medium px-7 py-[20px] flex items-center gap-2  group-hover:bg-primary group-hover:text-secondary-foreground ${linkColor}`)}>
                                            {name}
                                            {
                                                (isDropdown || isMegaMenu) &&
                                                <span className={` transition-all duration-500 rotate-180 group-hover:rotate-0 group-hover:text-secondary-foreground`}>
                                                    <svg width="12" height="9" viewBox="0 0 12 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11 8L6 2L1 8" />
                                                    </svg>
                                                </span>
                                            }
                                        </Link>
                                        {
                                            isDropdown.length && <DropDownMenu dropDownList={isDropdown} parentId={id} />
                                        }
                                        {
                                            isMegaMenu.length && <MegaMenu dropDownList={isMegaMenu} parentId={id} />
                                        }
                                    </li>
                                )
                            })
                        }
                        {/*<li className='other_icon text-primary-foreground px-6  cursor-pointer' onClick={() => setOffcanvaseActive(true)}>
                                    <Search height={"24"} width={"24"} />
                                </li>
                                <li className='other_icon text-primary-foreground pl-6 relative cursor-pointer flex items-center' onClick={() => setCartActive(true)}>
                                    <ShopCart height={"24"} width={"24"} />
                                    {
                                        products.length ? <span className='font-medium flex items-center justify-center text-secondary-foreground text-sm absolute -top-3 -right-4 w-6 h-6 bg-primary rounded-full'>{countCartProductQuantity(products)}</span> : ""
                                    }
                                </li> */ }
                    </ul>
                </nav>
            </div>
            <Offcanvas setOffcanvaseActive={setOffcanvaseActive} offcanvaseActive={offcanvaseActive} />

        </div>
    )
}

export default BottomNavbar