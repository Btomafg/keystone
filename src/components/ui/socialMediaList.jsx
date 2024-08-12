import Link from 'next/link'
import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { CiInstagram } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const SocialMediaList = () => {
    return (
        <ul className='flex items-center gap-7.5'>
            <li>
        

                <Link href="" className='font-semibold text-lg relative after:contents-[""] after:absolute after:h-[20px] after:w-[1px] after:bg-black after:rotate-[22deg] after:top-1/2 after:-translate-y-1/2 after:right-[-15px] hover-underline'>    <FaFacebookSquare className='text-blue-800' /></Link>
            </li>
            <li>
       

                <Link href="" className='font-semibold text-lg relative after:contents-[""] after:absolute after:h-[20px] after:w-[1px] after:bg-black after:rotate-[22deg] after:top-1/2 after:-translate-y-1/2 after:right-[-15px] hover-underline'>     <CiInstagram className='text-pink-700'/></Link>
            </li>
            <li>
       
                <Link href="" className='font-semibold text-lg relative after:contents-[""] after:absolute after:h-[20px] after:w-[1px] after:bg-black after:rotate-[22deg] after:top-1/2 after:-translate-y-1/2 after:right-[-15px] hover-underline'>     <FaTiktok className='text-black' /></Link>
            </li>
            <li>
          
                <Link href="" className='font-semibold text-lg hover-underline'>  <FaYoutube className='text-red-600'/></Link>
            </li>
        </ul>
    )
}

export default SocialMediaList