import Link from 'next/link'
import React from 'react'
import SocialMediaList from '../ui/socialMediaList'
import ButtonFill from '../ui/buttons/buttonFill'
import ButtonOutline from '../ui/buttons/buttonOutline'

const TopNavbar = () => {
    return (
        <div className='container-fluid  py-4 flex justify-between items-center'>
            <p className='font-semibold mb-0'>Welcome to Keystone Woodworx. Proven Quality You Deserve.</p>
            <a href='https://link.buoycrm.com/widget/booking/iusHrn919zNeEGjFvK4k' target='blank_'><ButtonFill className='ms-5 p-2 !text-sm'>Schedule An Initial Consultation</ButtonFill></a>
            <div className='flex items-center gap-[20px] divide-x divide-black'>
                <div className='pl-5'>
                    <SocialMediaList />
                </div>
            </div>
        </div>
    )
}

export default TopNavbar