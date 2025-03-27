"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../badge";

interface CardProps {
    title: string;
    description: string;
    imageUrl: string;
    onClick?: () => void;
}

export const BackgroundCard = ({ title, description, imageUrl, onClick }: CardProps) => {
    const img =
        imageUrl ||
        "https://www.keystonewoodworx.com/_next/static/media/mark1.9d2e7f3b.jpg";

    return (
        <div className=" w-full group">
            <div
                onClick={onClick}
                className={cn(
                    "cursor-pointer overflow-hidden relative h-32 sm:h-36 rounded-md shadow-xl aspect-square  mx-auto flex flex-col justify-between p-3 bg-cover"
                )}
                style={{ backgroundImage: `url(${img})` }}
            >
                <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-black opacity-40 group-hover:bg-transparent"></div>
                <div className="flex flex-col relative z-10 text-content justify-between ">
                    <h1 className="font-bold text-xl md:text-2xl text-white ">{title}</h1>

                    <Badge color="blue" className="text-white text-xs group-hover:block hidden mx-auto mt-16"> Add {title} </Badge>
                </div>
            </div>
        </div>
    );
};
