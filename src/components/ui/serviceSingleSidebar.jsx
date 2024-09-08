'use client';
import React from 'react';
import RightArrow from '@/assets/icons/rightArrow';
import Link from 'next/link';
import Title from '@/components/ui/title';
import InputField from '@/components/ui/inputField';
import TextAreaFiled from '@/components/ui/textAreaFiled';
import ButtonFill from './buttons/buttonFill';
import { servicesData } from '@/lib/fackData/servicesData';
import Image from 'next/image';
import from_img from '@/assets/images/contact-image.jpg';
import ButtonOutline from './buttons/buttonOutline';
import { cn } from '@/lib/utils';
import { callWebhook } from '@/app/actions/contactSubmit';
export const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
export const nameRegex = /^[a-zA-Z a-zA-Z]+$/;
export const emailRegex = /^([a-zA-Z0-9_\-\.]{1,})@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const ServiceSingleSidebar = () => {
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
    <div className="sticky top-16">
      <div>
        <Title title_text={'All Services'} />
        <ul>
          {servicesData.map(({ id, link, service_name }) => {
            return (
              <li key={id} className="text-primary-foreground flex items-center gap-[27px] mb-[22px] last:mb-0">
                <RightArrow width={'35'} height={'22'} />
                <Link
                  href={link}
                  className="text-xl leading-160 inline-block relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-500 hover:after:w-full "
                >
                  <span className="font-medium text-primary-foreground">{service_name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="gap-x-5 mt-12">
        <Title title_text={'Ready to get started?'} />
        <div className="flex flex-col gap-3 text-center mb-5">
          {' '}
          <a className="mx-auto" href="https://link.buoycrm.com/widget/booking/iusHrn919zNeEGjFvK4k" target="blank_">
            <ButtonFill className="ms-5 p-2 !text-sm">Schedule An Initial Consultation</ButtonFill>
          </a>
          <span className="font-medium text-primary-foreground">or</span>
          <span className="font-medium text-primary-foreground">Shoot us a message and let's discuss your project.</span>
        </div>

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
  );
};

export default ServiceSingleSidebar;
