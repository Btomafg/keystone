import { Card } from "@/components/ui/card";
import { CabinetOptionType } from "@/constants/enums/project.enums";
import { Cabinet } from "@/constants/models/object.types";
import { useState } from "react";

interface OptionStepProps {
    customOptions?: any;
    onOptionComplete?: (data: Partial<Cabinet>) => void;

}

const OptionStep: React.FC<OptionStepProps> = ({ customOptions, onOptionComplete }) => {


    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState<Partial<Cabinet> & {
    }>({

    });
    const stepLabels = [
        'Door Material',
        'Sub Material',
        'Construction Method',
        'Toe Style',
        'Crown',
        'Light Rail',
    ];

    // Helpers
    const getOptionId = (field: string) => {
        return inputs[field as keyof typeof inputs];
    };

    // Filter custom options for each type

    const doorMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.DoorMaterial);
    const subMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.SubMaterial);
    const constructionMethodOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ConstructionMethod);
    const toeStyleOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ToeStyle);
    const crownOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.Crown);
    const lightRailOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.LightRail);

    const allOptions = [
        doorMaterialOptions,
        subMaterialOptions,
        constructionMethodOptions,
        toeStyleOptions,
        crownOptions,
        lightRailOptions
    ];

    const handleSubmit = (opt) => {
        setStep(step + 1);
        setInputs({ ...inputs, [opt.type]: opt.id })
        step === allOptions.length - 1 && onOptionComplete && onOptionComplete(inputs);
    }



    return (
        <div className="space-y-4 min-w-[350px] max-w-fit p-4">
            <h2 className="text-xl font-semibold text-center">{stepLabels[step]}</h2>
            <div className="flex flex-wrap gap-4">

                {allOptions[step]?.map((opt) => (
                    <Card
                        key={opt.id}
                        className={`flex flex-col mx-auto hover:scale-105 transition hover:bg-blue-50 cursor-pointer h-32 aspect-square justify-center items-center p-3 `}
                        onClick={(opt) => handleSubmit(opt)}
                    >
                        {opt.icon && opt.icon}
                        <h3 className="text-lg font-semibold mt-2 text-center">{opt.name}</h3>
                    </Card>
                ))}

            </div>
        </div>
    );
};

export default OptionStep;