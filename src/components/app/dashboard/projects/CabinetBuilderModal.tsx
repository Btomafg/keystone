import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CabinetOptionType } from '@/constants/enums/project.enums';
import { Cabinet, Project } from '@/constants/models/object.types';
import { useGetCustomOptions, useUpdateCabinet } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { CabinetStepper } from './CabinetBuilderModal/CabinetStepper';
import DimensionsStep from './CabinetBuilderModal/DimensionsStep';
import OptionStep from './CabinetBuilderModal/OptionStep';
import SummaryStep from './CabinetBuilderModal/SummaryStep';
import UploadPhotosStep from './CabinetBuilderModal/UploadPhotosStep';

// We'll reuse the type below for file previews in step 8
interface FilePreview {
  file: File;
  previewUrl: string;
}

interface CabinetBuilderModalProps {
  cabinetId: string;
  project: Project;
}

const CabinetBuilderModal: React.FC<CabinetBuilderModalProps> = ({ cabinetId, project }) => {
  const [inputs, setInputs] = useState<Partial<Cabinet> & {
    width?: string;
    length?: string;
    height?: string;
  }>({});
  const [spacePhotos, setSpacePhotos] = useState<FilePreview[]>([]);
  const [inspirationPhotos, setInspirationPhotos] = useState<FilePreview[]>([]);

  const cabinet = project?.rooms
    ?.flatMap((room) => room.cabinets)
    .find((cab) => cab.id === cabinetId);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateCabinet } = useUpdateCabinet();
  const { data: customOptions } = useGetCustomOptions();

  // Initialize from the cabinet data on mount/update.
  useEffect(() => {
    if (cabinet) {
      setInputs({
        ceilingHeight: cabinet.ceilingHeight,
        doorMaterial: cabinet.doorMaterial,
        subMaterial: cabinet.subMaterial,
        constructionMethod: cabinet.constructionMethod,
        toeStyle: cabinet.toeStyle,
        crown: cabinet.crown,
        lightRail: cabinet.lightRail,
        width: cabinet.width?.toString(),
        length: cabinet.length?.toString(),
        height: cabinet.height?.toString(),
      });
      if (cabinet.createStep + 1 > step) {
        setStep(cabinet.createStep || 0);
      }
      setSpacePhotos([]);
      setInspirationPhotos([]);
    }
  }, []);

  // Step labels for the stepper
  const stepLabels = [
    'Ceiling Height',
    'Door Material',
    'Sub Material',
    'Construction Method',
    'Toe Style',
    'Crown',
    'Light Rail',
    'Dimensions',
    'Upload Photos',
    'Summary',
  ];

  // Helpers
  const getOptionId = (field: string) => {
    return inputs[field as keyof typeof inputs] || cabinet?.[field as keyof Cabinet];
  };

  // Filter custom options for each type
  const ceilingOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.Ceiling);
  const doorMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.DoorMaterial);
  const subMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.SubMaterial);
  const constructionMethodOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ConstructionMethod);
  const toeStyleOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ToeStyle);
  const crownOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.Crown);
  const lightRailOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.LightRail);

  // Option selection handler for steps 0-6
  const selectOption = async (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    const newStep = cabinet?.createStep >= step + 1 ? cabinet.createStep : step + 1;
    await updateCabinet({ id: cabinetId, createStep: newStep || 0, room: cabinet?.room, [field]: value });
    setStep((prev) => prev + 1);
  };

  // Calculate live quote for dimensions step
  const widthVal = parseFloat(inputs.width ?? cabinet?.width?.toString() ?? '0');
  const lengthVal = parseFloat(inputs.length ?? cabinet?.length?.toString() ?? '0');
  const heightVal = parseFloat(inputs.height ?? cabinet?.height?.toString() ?? '0');
  const sqft = widthVal * lengthVal;
  const cuft = widthVal * lengthVal * heightVal;

  const ceilingHeightValue = parseFloat(ceilingOptions?.find((opt) => opt.id === getOptionId('ceilingHeight'))?.value || '0');
  const doorMaterialValue = parseFloat(doorMaterialOptions?.find((opt) => opt.id === getOptionId('doorMaterial'))?.value || '0');
  const subMaterialValue = parseFloat(subMaterialOptions?.find((opt) => opt.id === getOptionId('subMaterial'))?.value || '0');
  const constructionMethodValue = parseFloat(constructionMethodOptions?.find((opt) => opt.id === getOptionId('constructionMethod'))?.value || '0');
  const toeStyleValue = parseFloat(toeStyleOptions?.find((opt) => opt.id === getOptionId('toeStyle'))?.value || '0');
  const crownValue = parseFloat(crownOptions?.find((opt) => opt.id === getOptionId('crown'))?.value || '0');
  const lightRailValue = parseFloat(lightRailOptions?.find((opt) => opt.id === getOptionId('lightRail'))?.value || '0');

  const computedQuote = useMemo(() => {
    return (
      (ceilingHeightValue +
        doorMaterialValue +
        subMaterialValue +
        constructionMethodValue +
        toeStyleValue +
        crownValue +
        lightRailValue) *
      sqft
    );
  }, [
    ceilingHeightValue,
    doorMaterialValue,
    subMaterialValue,
    constructionMethodValue,
    toeStyleValue,
    crownValue,
    lightRailValue,
    sqft,
  ]);

  const liveQuoteDisplay = useMemo(() => (
    <div className="mt-4 text-center text-sm text-muted">
      <p>
        Calculated Area: {sqft.toFixed(2)} sqft, Volume: {cuft.toFixed(2)} cuft
      </p>
      <p>Live Quote: {toUSD(computedQuote)}</p>
    </div>
  ), [sqft, cuft, computedQuote]);

  // Navigation: on finishing the final step, save quote and close.
  const handleNext = () => {

    updateCabinet({
      id: cabinet?.id,
      room: cabinet?.room,
      createStep: step,
      ...inputs,
      quote: computedQuote,
    });
    setStep((prev) => prev + 1);
  };

  // Render the current step by delegating to the appropriate subcomponent.
  const renderStep = () => {
    // Steps 0-6: Option selection
    const optionSteps = [
      { label: 'Select Ceiling Height', field: 'ceilingHeight', options: ceilingOptions },
      { label: 'Select Door Material', field: 'doorMaterial', options: doorMaterialOptions },
      { label: 'Select Sub Material', field: 'subMaterial', options: subMaterialOptions },
      { label: 'Select Construction Method', field: 'constructionMethod', options: constructionMethodOptions },
      { label: 'Select Toe Style', field: 'toeStyle', options: toeStyleOptions },
      { label: 'Select Crown', field: 'crown', options: crownOptions },
      { label: 'Select Light Rail', field: 'lightRail', options: lightRailOptions },
    ];

    if (step < optionSteps.length) {
      const { label, field, options } = optionSteps[step];
      return (
        <OptionStep
          label={label}
          field={field}
          options={options}
          selectedId={getOptionId(field)}
          onSelect={selectOption}
        />
      );
    }

    // Step 7: Dimensions
    if (step === 7) {
      return (
        <DimensionsStep
          inputs={inputs}
          setInputs={setInputs}
          liveQuoteDisplay={liveQuoteDisplay}
        />
      );
    }

    // Step 8: Upload Photos
    if (step === 8) {
      return (
        <UploadPhotosStep
          spacePhotos={spacePhotos}
          setSpacePhotos={setSpacePhotos}
          inspirationPhotos={inspirationPhotos}
          setInspirationPhotos={setInspirationPhotos}
        />
      );
    }

    // Step 9: Summary
    return (
      <SummaryStep
        inputs={inputs}
        spacePhotos={spacePhotos}
        inspirationPhotos={inspirationPhotos}
        toUSD={toUSD}
        customOptions={customOptions}
        cabinet={cabinet}
      />
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Customize
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle>Cabinet Builder</DialogTitle>
            <CabinetStepper
              steps={stepLabels}
              currentStep={step}
              onStepClick={(newStep) => setStep(newStep)}
            />
          </DialogHeader>
          <div className="mt-4">
            {renderStep()}
          </div>
          <div className="flex justify-between pt-6">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={handleNext} >
              {step >= stepLabels.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CabinetBuilderModal;
