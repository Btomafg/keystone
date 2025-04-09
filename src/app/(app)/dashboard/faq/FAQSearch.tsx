"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FAQ } from "@/constants/models/object.types";


type Props = {
    setSelectedFaq: (faq: FAQ) => void;
    faqs: FAQ[];
};

const FAQSearch: React.FC<Props> = (props) => {
    const { setSelectedFaq, faqs } = props;
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
    const [inputSelected, setInputSelected] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setInputSelected(true);

        const regex = new RegExp(searchTerm.replace(/\*/g, ".*"), "i");
        console.log(faqs)
        const filtered: FAQ[] = faqs.filter((faq) =>
            faq.keywords?.some((keyword: string) => regex.test(keyword))
        );

        setSearchTerm(searchTerm);
        setFilteredFaqs(filtered);
    };

    const handleQuestionClick = (selectedFaq: FAQ) => {
        setSelectedFaq(selectedFaq);
        setSearchTerm(selectedFaq.question);
        setInputSelected(false);
    };

    return (
        <div className="mx-auto container mt-12 mb-8">
            <h2 className="text-primary text-3xl lg:text-5xl font-bold leading-[1.2em] mb-4">How can we help you?</h2>
            <p className="text-[#4F5256] text-base font-normal leading-[1.7em] mb-10">
                Here are a few of the questions we get the most. If you don't see what's on your mind, reach out to us anytime on phone, chat, or
                email.
            </p>


            <p className="sr-only">Search our Frequently Asked Questions by keywords.</p>

            <Input
                type="text"
                placeholder="Type keywords to find answers"
                value={searchTerm}
                onChange={handleSearch}
                onBlur={() => setTimeout(() => setInputSelected(false), 100)}
                className="block p-4 pl-12 w-full text-gray-900 bg-white rounded-lg border focus:ring-primary-500 focus:border-primary-500"
            />


            {filteredFaqs.length > 0 && inputSelected && (
                <div className="text-left mt-2 w-full bg-white  shadow-lg border left-0 top-[60px] rounded-lg max-h-[300px] overflow-auto z-10">
                    <ul className="px-4">
                        {filteredFaqs.map((faq: FAQ) => (
                            <li key={faq.id} className="py-2 border-b last:border-b-0">
                                <button
                                    className="w-full text-left hover:bg-gray-100 p-2 rounded"
                                    onClick={() => handleQuestionClick(faq)}
                                >
                                    {faq.question}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FAQSearch;
