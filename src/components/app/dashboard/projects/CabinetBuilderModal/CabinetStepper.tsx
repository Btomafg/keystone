import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function CabinetStepper({
    steps,
    currentStep,
    onStepClick,
}: {
    steps: string[];
    currentStep: number;
    onStepClick: (step: number) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scroll = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: direction === 'left' ? -200 : 200,
                behavior: 'smooth',
            });
        }
    };

    // Whenever the current step changes, scroll the active element into view.
    useEffect(() => {
        const activeStep = stepRefs.current[currentStep];
        if (activeStep) {
            activeStep.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }
    }, [currentStep]);

    return (
        <div className="flex flex-row items-center max-w-md justify-center md:max-w-2xl">
            <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
                <ChevronLeft size={20} />
            </button>
            <div
                ref={containerRef}
                className="flex-1 flex gap-6 overflow-x-auto scrollbar-hide px-2"
            >
                {steps.map((label, index) => {
                    const isActive = currentStep === index;
                    const isCompleted = currentStep > index;
                    return (
                        <div
                            key={index}
                            ref={(el) => (stepRefs.current[index] = el)}
                            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                            onClick={() => onStepClick(index)}
                        >
                            <div
                                className={[
                                    'rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium mb-1 transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : isCompleted
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-600',
                                ].join(' ')}
                            >
                                {index + 1}
                            </div>
                            <span
                                className={[
                                    'text-xs text-center w-20 transition-colors',
                                    isActive
                                        ? 'font-semibold text-blue-600'
                                        : 'font-normal text-gray-500',
                                ].join(' ')}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
