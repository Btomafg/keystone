'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import AddressCard from '@/components/ui/cards/addressCard';
import SectionTitle from '@/components/ui/sectionTitle';
import { addressList } from '@/lib/fackData/addressList';
import InputField from '@/components/ui/inputField';
import TextAreaFiled from '@/components/ui/textAreaFiled';
import RightArrow from '@/assets/icons/rightArrow';
import from_img from '@/assets/images/team/markandcole2.jpg';
import Feedback from '@/components/section/feedback';
import ButtonOutline from '@/components/ui/buttons/buttonOutline';
import ButtonFill from '@/components/ui/buttons/buttonFill';
import { callWebhook } from '@/app/actions/contactSubmit';
import { cn } from '@/lib/utils';

export const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
export const nameRegex = /^[a-zA-Z a-zA-Z]+$/;
export const emailRegex = /^([a-zA-Z0-9_\-\.]{1,})@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
    console.log('payload', payload);
    try {
      const result = await callWebhook(payload);
      if (result.status == 'Success: request sent to trigger execution server') {
        setIsSubmitted(true);
        setError('');
      }
      console.log('Webhook response:', result);
    } catch (error) {
      setError('Seems like something went wrong. Please try again later.');
      console.error('Failed to call webhook:', error);
    }
  };

  return (
    <>
      {/* ------ contact form start */}
      <section className="mb-8">
        <div className="container-fluid ">
          <SectionTitle
            sectionName={'Inquiry'}
            sectionTitle={'Have a Project in your mind?'}
            sectionDesc={
              <div className="flex flex-col w-full  px-12">
                <h2 className=" text-5xl font-extrabold leading-110 text-primary-foreground mb-5 my-auto">Write us directly or:</h2>
                <a href="https://link.buoycrm.com/widget/booking/iusHrn919zNeEGjFvK4k" target="blank_">
                  <ButtonFill className="ms-3 my-auto">Schedule A Consultation</ButtonFill>
                </a>
              </div>
            }
          />
        </div>

        <div className="container lg:pt-30 2sm:pt-20 pt-14">
          <div className="grid lg:grid-cols-2 gap-x-5">
            <Image src={from_img} loading="lazy" alt="contact-form" className="w-full h-auto" />
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="flex sm:flex-row flex-col gap-x-5">
                  <InputField name="firstName" placeholderc={'First Name'} type={'firstName'} className={'mb-[13px]'} />
                  <InputField name="lastName" placeholderc={'Last Name'} type={'lastName'} className={'mb-[13px]'} />
                </div>
                <div className="flex sm:flex-row flex-col gap-x-5">
                  <InputField name="phoneNumber" placeholderc={'Phone Number'} type={'phoneNumber'} className={'mb-[13px]'} />
                  <InputField patter={emailRegex} name="email" placeholderc={'Your Email'} type={'email'} className={'mb-[13px]'} />
                </div>
                <TextAreaFiled name="message" placeholder={'Type your message'} className={'min-h-[223px] '} />
                {error && <p className={cn('text-red-500 text-sm')}>{error}</p>}
                <div className="flex justify-end mt-2">
                  <ButtonOutline type="submit">
                    Send Message <RightArrow height={'22'} width={'35'} />
                  </ButtonOutline>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-y-5">
                <h2 className="text-2xl font-bold text-primary-foreground">Thank you for your message!</h2>
                <p className="text-primary-foreground">We will get back to you as soon as possible.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* ------ contact form end */}
    </>
  );
};

export default Contact;
