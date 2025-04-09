import React, { useState } from 'react';
import logo from '@/assets/images/logo.png';
import Loader from '@/components/ui/loader';
import { FAQ } from '@/constants/models/object.types';

type Props = {
  setSelectedFaq: (faq: FAQ) => void;
  data: any;
};

const FAQCards: React.FC<Props> = (pros) => {
  const { setSelectedFaq, data } = pros;
  console.log(data);
  const [searchTerm, setSearchTerm] = useState<string>('');
  console.log(data);

  const topFaqs = data?.sort((a, b) => a.search_count - b.search_count);

  const sections = [
    {
      title: 'General',
      faq: data?.slice(0, 10),
      image: logo,
    },
    {
      title: 'Most Popular',
      faq: topFaqs?.slice(0, 10),
      image: logo,
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className="bg-white container">
      <div className="py-4 mx-auto sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 ">
          {sections?.map((section, index) => (
            <div
              key={index}
              className="group relative what-we-do-box py-5 px-6 pb-4 shadow-[0px_0px_20px_0px_rgba(191,188,188,0.25)] ml-0 mt-0 mb-[30px] rounded-lg transition-all duration-[0.5s] ease-[ease-in-out] hover:shadow-[0px_0px_20px_0px_rgba(57,56,56,0.25)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-primary">{section?.title}</h3>
              </div>
              <div className="flex min-h-[350px]">
                {!section.faq ? (
                  <Loader />
                ) : (
                  <ul role="list" className="mb-4 space-y-3 text-gray-500 cursor-pointer">
                    {section?.faq?.map((item: FAQ, itemIndex: number) => (
                      <li className="cursor-pointer" key={itemIndex}>
                        <a onClick={() => setSelectedFaq(item)} className="hover:underline text-sm ">
                          {item.question}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQCards;
