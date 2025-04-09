import React, { useState } from 'react';

import FAQCards from './FAQCards';
import FAQSearch from './FAQSearch';

import { CheckCircle, XIcon } from 'lucide-react';

import { APP_ROUTES } from '@/constants/routes';

import { FAQ } from '@/constants/models/object.types';
import { useFaqCreateFeedback, useFaqIncreaseSearchCount, useGetAllFaqs, useGetMyFaqFeedback } from '@/hooks/api/faq.queries';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CloseX } from '@/assets/icons/svgs';
import Link from 'next/link';

const defaultFaq: Partial<FAQ> = {
  id: '',
  version: 0,
  question: 'Your Answer Will Appear Here',
  answer: ' Click a question below or search whats on your mind above.',
  keywords: [],
  search_count: 0,
};

const FAQs: React.FC = () => {
  const router = useRouter();
  const { data: faqdata } = useGetAllFaqs();
  const [selectedFaq, setSelectedFaq] = useState<FAQ>(defaultFaq as FAQ);
  const { mutate: increaseFaqSearchCount, isError, data: res, error: resError } = useFaqIncreaseSearchCount();
  const { mutateAsync: createFeedback, isPending: creatingFeedback } = useFaqCreateFeedback({
    faq_id: selectedFaq?.id,
    faq_version: selectedFaq?.version,
  });

  const {
    data: myFeedback,
    isLoading: feedbackLoading,
    refetch,
  } = useGetMyFaqFeedback({ faq_id: selectedFaq?.id, faq_version: selectedFaq?.version });

  const handleFeedback = async (update: { faq_id: string; result: string; faq_version: number }) => {
    await createFeedback(update);
    refetch();
  };

  const handleSelect = (faq: FAQ) => {
    setSelectedFaq(faq);
    increaseFaqSearchCount({ faq_id: faq?.id });
  };

  const FAQAnswer = () => {
    return (
      <>
        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-primary">{selectedFaq?.question}</h2>
        <p
          className="text-[#4F5256] text-base font-normal leading-[1.7em] mb-10"
          dangerouslySetInnerHTML={{ __html: selectedFaq?.answer }}
        ></p>
      </>
    );
  };
  const FAQFeedback = () => {
    if (!selectedFaq.id || feedbackLoading) return null;

    const feedbackMessage = myFeedback ? 'Feedback submitted, thank you!' : 'Was this FAQ helpful?';

    const renderButtons = !myFeedback && !feedbackLoading && !creatingFeedback && (
      <div className="flex flex-row gap-2 mx-auto">
        <Button
          onClick={() =>
            handleFeedback({
              faq_id: selectedFaq?.id,
              result: 'negative',
              faq_version: selectedFaq?.version,
            })
          }
          variant="outline"
          className="flex flex-row items-center justify-center gap-1 my-auto "
        >
          <XIcon className="!my-auto" /> No
        </Button>{' '}
        <Button
          onClick={() =>
            handleFeedback({
              faq_id: selectedFaq?.id,
              result: 'positive',
              faq_version: selectedFaq?.version,
            })
          }
          className="flex gap-1 my-auto "
        >
          <CheckCircle /> Yes
        </Button>
      </div>
    );

    return (
      <div className="flex flex-col ms-auto gap-2 min-h-18">
        <div className="flex flex-col h-18">
          <span className="my-auto">{feedbackMessage}</span>
          {creatingFeedback && <span className="my-auto">Submitting feedback...</span>}
          {renderButtons}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col min-h-[80vh] max-w-[1400px]">
        <FAQSearch setSelectedFaq={handleSelect} faqs={faqdata} />
        <div className="container  mb-4 mt-12 lg:mb-8">
          <FAQAnswer />
        </div>
        <div className="flex flex-col gap-4">
          <FAQFeedback />
          <FAQCards setSelectedFaq={handleSelect} data={faqdata} />
        </div>
        {/* <div className="my-auto">
          <h3 className="text-primary text-3xl lg:text-4xl font-bold leading-[1.2em] mb-4">Still have questions?</h3>
          <p className="text-[#4F5256] text-base font-normal leading-[1.7em] mb-10">
            Contact our support team <Link to={APP_ROUTES.DASHBOARD.SETTINGS.SETTINGS.path}>here</Link>. We're here to help.
          </p>
        </div> */}
      </div>
    </main>
  );
};

export default FAQs;
