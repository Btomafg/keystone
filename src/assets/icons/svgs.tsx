import React from "react";
import { cn } from "src/lib/utils";


interface SvgWrapperProps {

  className?: string;
}


const SvgWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("w-6 h-6", className)}>{children}</div>
}



export const CloseX: React.FC<SvgWrapperProps> = (props) => {
  const { className } = props;
  return <SvgWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </SvgWrapper>
}