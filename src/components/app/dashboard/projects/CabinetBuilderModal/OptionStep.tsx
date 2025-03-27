import { Card } from "@/components/ui/card";

interface OptionStepProps {
    label: string;
    field: string;
    options: any[] | undefined;
    selectedId: string | number | undefined;
    onSelect: (field: string, value: string) => Promise<void>;
}

const OptionStep: React.FC<OptionStepProps> = ({ label, field, options, selectedId, onSelect }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">{label}</h2>
            <div className="flex flex-wrap gap-4">
                {options?.map((opt) => (
                    <Card
                        key={opt.id}
                        className={`flex flex-col mx-auto hover:scale-105 transition hover:bg-blue-50 cursor-pointer h-32 aspect-square justify-center items-center p-3 ${parseFloat(selectedId as string) === opt.id ? 'bg-blue-100 border-blue-400' : ''}`}
                        onClick={() => onSelect(field, opt.id)}
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