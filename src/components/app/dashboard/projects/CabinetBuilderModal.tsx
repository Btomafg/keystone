import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CabinetOptionType } from '@/constants/enums/project.enums';
import { Cabinet, Project } from '@/constants/models/object.types';
import { useGetCustomOptions, useUpdateCabinet } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { DoorOpen } from 'lucide-react';
import { useState } from 'react';

interface CabinetBuilderModalProps {
    cabinetId: string;
    project: Project;
}

const CabinetBuilderModal: React.FC<CabinetBuilderModalProps> = (props) => {
    const { cabinetId, project } = props;
    const [step, setStep] = useState(0);
    const [open, setOpen] = useState(false);
    // Extend inputs to include width, length, and height instead of sqft
    const [inputs, setInputs] = useState<Partial<Cabinet> & { width?: string; length?: string; height?: string }>({});
    const cabinet = project?.rooms?.flatMap((room) => room.cabinets).find((cab) => cab.id === cabinetId);

    const { mutateAsync: updateCabinet, isPending } = useUpdateCabinet();
    const { data: customOptions } = useGetCustomOptions();

    const ceilingOptions = customOptions?.filter((opt) => opt.type == CabinetOptionType.Ceiling);
    const doorMaterialOptions = customOptions?.filter((opt) => opt.type == CabinetOptionType.DoorMaterial);
    const subMaterialOptions = customOptions?.filter((opt) => opt.type == CabinetOptionType.SubMaterial);
    const constructionMethodOptions = customOptions?.filter((opt) => opt.type == CabinetOptionType.ConstructionMethod);
    const toeStyleOptions = customOptions?.filter((opt) => opt.type == CabinetOptionType.ToeStyle);
    const crownOptions = customOptions?.filter((opt) => opt.type == CabinetOptionType.Crown);
    const lightRailOptions = customOptions?.filter((opt) => opt.type == CabinetOptionType.LightRail);

    // When an option is selected, update that field in the cabinet and then move to the next step.
    const selectOption = async (field: string, value: string) => {
        console.log('UPDATING', field, value);
        await updateCabinet({ id: cabinetId, room: cabinet?.room, [field]: value });
        setStep((prev) => prev + 1);
    };

    // In this example, updateCabinetValue is not being used for saving.
    // You might want to integrate it when finishing, if needed.
    const updateCabinetValue = (cabinetId: string, data: Partial<Cabinet>) => {
        const quote =
            (parseFloat(data.ceilingHeight || '0') +
                parseFloat(data.constructionMethod || '0') +
                parseFloat(data.crown || '0') +
                parseFloat(data.doorMaterial || '0') +
                parseFloat(data.lightRail || '0') +
                parseFloat(data.subMaterial || '0') +
                parseFloat(data.toeStyle || '0')) *
            parseFloat(data.ceilingHeight || '1');
        // Currently not saving quote; update if needed.
    };

    const handleSteps = () => {
        // Final step: if we've gone through all option steps, update cabinet with custom inputs.
        if (step >= 8) {
            updateCabinet(cabinetId, { ...inputs });
            setOpen(false);
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const renderStep = () => {
        const steps = [
            { label: 'Select Ceiling Height', field: 'ceilingHeight', options: ceilingOptions },
            { label: 'Select Door Material', field: 'doorMaterial', options: doorMaterialOptions, icon: <DoorOpen size={32} /> },
            { label: 'Select Sub Material', field: 'subMaterial', options: subMaterialOptions },
            { label: 'Select Construction Method', field: 'constructionMethod', options: constructionMethodOptions },
            { label: 'Select Toe Style', field: 'toeStyle', options: toeStyleOptions },
            { label: 'Select Crown', field: 'crown', options: crownOptions },
            { label: 'Select Light Rail', field: 'lightRail', options: lightRailOptions },
        ];

        if (step < steps.length) {
            const { label, field, options } = steps[step];
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">{label}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {options?.map((opt) => (
                            <Card
                                key={opt.value}
                                className={`flex flex-col hover:scale-105 transition hover:bg-blue-50 cursor-pointer h-36 justify-center items-center p-3 ${cabinet && cabinet[field] === opt.id ? 'bg-blue-100 border-blue-400' : ''
                                    }`}
                                onClick={() => selectOption(field, opt.id)}
                            >
                                {opt.icon && opt.icon}
                                <h3 className="text-lg font-semibold mt-2 text-center">{opt.name}</h3>
                            </Card>
                        ))}
                    </div>
                </div>
            );
        }

        // Step for dimensions: now we need width, length, height.
        if (step === 7) {
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">Enter Dimensions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                            type="number"
                            value={inputs.width || ''}
                            onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
                            placeholder="Width"
                            className="text-center"
                        />
                        <Input
                            type="number"
                            value={inputs.length || ''}
                            onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
                            placeholder="Length"
                            className="text-center"
                        />
                        <Input
                            type="number"
                            value={inputs.height || ''}
                            onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
                            placeholder="Height"
                            className="text-center"
                        />
                    </div>
                </div>
            );
        }

        // Final summary step: calculate total price.
        const doorMaterial = parseFloat(inputs.doorMaterial || '0');
        const subMaterial = parseFloat(inputs.subMaterial || '0');
        const constructionMethod = parseFloat(inputs.constructionMethod || '0');
        const toeStyle = parseFloat(inputs.toeStyle || '0');
        const crown = parseFloat(inputs.crown || '0');
        const lightRail = parseFloat(inputs.lightRail || '0');
        const ceilingHeight = parseFloat(inputs.ceilingHeight || '1');

        const width = parseFloat(inputs.width || '0');
        const length = parseFloat(inputs.length || '0');
        const height = parseFloat(inputs.height || '0');
        // For example, calculate volume (or area) as needed.
        // Here we calculate a "dimension multiplier" as width * length * height.
        const dimensionMultiplier = width * length * height || 1;

        const total =
            (doorMaterial + subMaterial + constructionMethod + toeStyle + crown + lightRail) *
            ceilingHeight *
            dimensionMultiplier;

        return (
            <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Summary</h2>
                <p className="text-muted">Review your cabinet configuration.</p>
                <pre className="text-left text-sm bg-muted p-4 rounded-md">
                    {JSON.stringify(inputs, null, 2)}
                </pre>
                <h3 className="text-lg font-bold text-primary">Total Price: {toUSD(total)}</h3>
            </div>
        );
    };

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                        Customize Cabinet
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl">
                    {renderStep()}

                    {step > 0 && (
                        <div className="flex justify-between pt-6">
                            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                                Back
                            </Button>
                            <Button onClick={() => handleSteps()}>
                                {step >= 8 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CabinetBuilderModal;
