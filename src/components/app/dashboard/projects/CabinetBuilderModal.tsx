import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toUSD } from '@/utils/common';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { DoorOpen, PanelBottom, Ruler, RulerIcon, Wrench } from 'lucide-react';
import { useState } from 'react';

const ceilingOptions = [
    { label: "8' Ceiling", value: '1', icon: <Ruler size={36} /> },
    { label: "9' Ceiling", value: '1.125', icon: <Ruler size={36} /> },
    { label: "10' Ceiling", value: '1.25', icon: <Ruler size={36} /> },
];

const doorMaterialOptions = [
    { label: 'Paint Grade', value: '66.86' },
    { label: 'Red Oak', value: '69.13' },
    { label: 'White Oak', value: '102.06' },
    { label: 'Hard Maple', value: '84.71' },
    { label: 'Walnut', value: '127.96' },
    { label: 'Cherry', value: '92.52' },
    { label: 'Hickory', value: '76.92' },
    { label: 'Alder', value: '78.43' },
    { label: 'Beech', value: '0.00' },
    { label: 'Ash', value: '67.87' },
    { label: 'Rift Sawn White Oak', value: '122.68' },
];

const subMaterialOptions = [
    { label: 'Veneer Panel', value: '0', icon: <PanelBottom size={32} /> },
    { label: 'Hardwood Panel', value: '25', icon: <PanelBottom size={32} /> },
];

const constructionMethodOptions = [
    { label: 'Frameless', value: '650', icon: <Wrench size={32} /> },
    { label: 'Face Frame Overlay', value: '775', icon: <Wrench size={32} /> },
    { label: 'Framed Inset', value: '840', icon: <Wrench size={32} /> },
];

const toeStyleOptions = [
    { label: 'None', value: '0', icon: <RulerIcon size={32} /> },
    { label: 'Furniture', value: '35', icon: <RulerIcon size={32} /> },
];

const crownOptions = [
    { label: 'None', value: '0' },
    { label: 'Riser', value: '15' },
    { label: 'Crown', value: '20' },
    { label: 'Riser and Crown', value: '35' },
];

const lightRailOptions = [
    { label: 'None', value: '0' },
    { label: 'Standard', value: '10' },
];

interface CabinetBuilderModalProps {
    cabinetId: string;
    updateCabinet: (cabinetId: string, data: any) => void;
}

const CabinetBuilderModal: React.FC<CabinetBuilderModalProps> = (props) => {
    const { updateCabinet, cabinetId } = props;
    const [step, setStep] = useState(0);
    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState({
        ceilingHeight: '',
        doorMaterial: '',
        subMaterial: '',
        constructionMethod: '',
        toeStyle: '',
        crown: '',
        lightRail: '',
        sqft: '',
    });

    const selectOption = (field: string, value: string) => {
        setInputs({ ...inputs, [field]: value });
        setStep((prev) => prev + 1);
    };

    const handleSteps = () => {
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
                        {options.map((opt) => (
                            <Card
                                key={opt.value}
                                className={`flex flex-col hover:scale-105 transition hover:bg-blue-50 cursor-pointer h-36 justify-center items-center p-3 ${inputs[field] === opt.value ? 'bg-blue-100 border-blue-400' : ''}`}
                                onClick={() => selectOption(field, opt.value)}
                            >
                                {opt.icon && opt.icon}
                                <h3 className="text-lg font-semibold mt-2 text-center">{opt.label}</h3>
                            </Card>
                        ))}
                    </div>
                </div>
            );
        }

        if (step === 7) {
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">How many Sq Ft?</h2>
                    <div className="flex justify-center">
                        <Input
                            type="number"
                            value={inputs.sqft}
                            onChange={(e) => setInputs({ ...inputs, sqft: e.target.value })}
                            className="w-40 text-center"
                            placeholder="e.g. 12"
                        />
                    </div>
                </div>
            );
        }

        const total =
            (parseFloat(inputs.doorMaterial || '0') +
                parseFloat(inputs.subMaterial || '0') +
                parseFloat(inputs.constructionMethod || '0') +
                parseFloat(inputs.toeStyle || '0') +
                parseFloat(inputs.crown || '0') +
                parseFloat(inputs.lightRail || '0')) *
            parseFloat(inputs.ceilingHeight || '1') *
            parseFloat(inputs.sqft || '1');

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
