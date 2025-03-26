import { useMemo, useState } from 'react';
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

interface CabinetBuilderModalProps {
  cabinetId: string;
  project: Project;
}

const CabinetBuilderModal: React.FC<CabinetBuilderModalProps> = (props) => {
  const { cabinetId, project } = props;
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  // Local state to store user inputs for dimensions and selected options
  const [inputs, setInputs] = useState<Partial<Cabinet> & { width?: string; length?: string; height?: string }>({});
  // New states for file uploads:
  const [spacePhotos, setSpacePhotos] = useState<File[]>([]);
  const [inspirationPhotos, setInspirationPhotos] = useState<File[]>([]);

  // Find the cabinet from the project
  const cabinet = project?.rooms?.flatMap((room) => room.cabinets).find((cab) => cab.id === cabinetId);

  const { mutateAsync: updateCabinet } = useUpdateCabinet();
  const { data: customOptions } = useGetCustomOptions();

  // Helper: get selected option id from local inputs, falling back to cabinet property.
  const getOptionId = (field: string) => {
    return inputs[field] || cabinet?.[field];
  };

  const ceilingOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.Ceiling);
  const doorMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.DoorMaterial);
  const subMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.SubMaterial);
  const constructionMethodOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ConstructionMethod);
  const toeStyleOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ToeStyle);
  const crownOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.Crown);
  const lightRailOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.LightRail);

  // When an option is selected, update both the remote cabinet and local state.
  const selectOption = async (field: string, value: string) => {
    // Update local state immediately.
    setInputs((prev) => ({ ...prev, [field]: value }));
    // Update remote cabinet.
    await updateCabinet({ id: cabinetId, room: cabinet?.room, [field]: value });
    setStep((prev) => prev + 1);
  };

  // Use dynamic dimensions: if inputs exist, use those; otherwise fallback to cabinet values.
  const widthVal = parseFloat(inputs.width ?? cabinet?.width?.toString() ?? '0');
  const lengthVal = parseFloat(inputs.length ?? cabinet?.length?.toString() ?? '0');
  const heightVal = parseFloat(inputs.height ?? cabinet?.height?.toString() ?? '0');
  const sqft = widthVal * lengthVal;
  const cuft = widthVal * lengthVal * heightVal;

  // Retrieve option values from the selected IDs (using local inputs if available)
  const ceilingHeightId = getOptionId('ceilingHeight');
  const doorMaterialId = getOptionId('doorMaterial');
  const subMaterialId = getOptionId('subMaterial');
  const constructionMethodId = getOptionId('constructionMethod');
  const toeStyleId = getOptionId('toeStyle');
  const crownId = getOptionId('crown');
  const lightRailId = getOptionId('lightRail');

  const ceilingHeightValue = parseFloat(ceilingOptions?.find((opt) => opt?.id === ceilingHeightId)?.value || '0');
  const doorMaterialValue = parseFloat(doorMaterialOptions?.find((opt) => opt?.id === doorMaterialId)?.value || '0');
  const subMaterialValue = parseFloat(subMaterialOptions?.find((opt) => opt?.id === subMaterialId)?.value || '0');
  const constructionMethodValue = parseFloat(constructionMethodOptions?.find((opt) => opt?.id === constructionMethodId)?.value || '0');
  const toeStyleValue = parseFloat(toeStyleOptions?.find((opt) => opt?.id === toeStyleId)?.value || '0');
  const crownValue = parseFloat(crownOptions?.find((opt) => opt?.id === crownId)?.value || '0');
  const lightRailValue = parseFloat(lightRailOptions?.find((opt) => opt?.id === lightRailId)?.value || '0');

  // Use useMemo to recalc the quote whenever any dependency changes.
  const computedQuote = useMemo(() => {
    return (
      (ceilingHeightValue + doorMaterialValue + subMaterialValue + constructionMethodValue + toeStyleValue + crownValue + lightRailValue) *
      sqft
    );
  }, [ceilingHeightValue, doorMaterialValue, subMaterialValue, constructionMethodValue, toeStyleValue, crownValue, lightRailValue, sqft]);

  // UI: Show live update of quote when dimensions change.
  const liveQuoteDisplay = useMemo(() => {
    return (
      <div className="mt-4 text-center text-sm text-muted">
        <p>
          Calculated Area: {sqft.toFixed(2)} sqft, Volume: {cuft.toFixed(2)} cuft
        </p>
        <p>Live Quote: {toUSD(computedQuote)}</p>
      </div>
    );
  }, [sqft, cuft, computedQuote]);

  // Handle step navigation and update the cabinet with the dynamic quote and inputs.
  const handleSteps = () => {
    if (step >= 9) {
      updateCabinet({ id: cabinet?.id, room: cabinet?.room, ...inputs, quote: computedQuote });
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

    // Steps 0 - 6: Option selection steps.
    if (step < steps.length) {
      const { label, field, options } = steps[step];
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">{label}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {options?.map((opt) => (
              <Card
                key={opt.value}
                className={`flex flex-col hover:scale-105 transition hover:bg-blue-50 cursor-pointer h-36 justify-center items-center p-3 ${
                  getOptionId(field) === opt.id ? 'bg-blue-100 border-blue-400' : ''
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

    // Step 7: Enter Dimensions
    if (step === 7) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Enter Dimensions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="number"
              value={inputs.width ?? ''}
              onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
              placeholder="Width (ft)"
              className="text-center"
            />
            <Input
              type="number"
              value={inputs.length ?? ''}
              onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
              placeholder="Length (ft)"
              className="text-center"
            />
            <Input
              type="number"
              value={inputs.height ?? ''}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
              placeholder="Height (ft)"
              className="text-center"
            />
          </div>
          {liveQuoteDisplay}
        </div>
      );
    }

    // Step 8: File Uploaders for photos.
    if (step === 8) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Upload Photos</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Photos of Your Space</label>
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setSpacePhotos(Array.from(e.target.files));
                  }
                }}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Inspiration Photos</label>
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setInspirationPhotos(Array.from(e.target.files));
                  }
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    // Step 9: Final summary step.
    // Recalculate dimensions and total based on local inputs (or fallback values)
    const widthSummary = parseFloat(inputs.width ?? cabinet?.width?.toString() ?? '0');
    const lengthSummary = parseFloat(inputs.length ?? cabinet?.length?.toString() ?? '0');
    const heightSummary = parseFloat(inputs.height ?? cabinet?.height?.toString() ?? '0');
    const dimensionMultiplier = widthSummary * lengthSummary || 1;

    // For options in the summary, fallback to local inputs first.
    const doorMaterialSummary = parseFloat(
      doorMaterialOptions?.find((opt) => opt?.id === (inputs.doorMaterial || cabinet?.doorMaterial))?.value || '0',
    );
    const subMaterialSummary = parseFloat(
      subMaterialOptions?.find((opt) => opt?.id === (inputs.subMaterial || cabinet?.subMaterial))?.value || '0',
    );
    const constructionMethodSummary = parseFloat(
      constructionMethodOptions?.find((opt) => opt?.id === (inputs.constructionMethod || cabinet?.constructionMethod))?.value || '0',
    );
    const toeStyleSummary = parseFloat(toeStyleOptions?.find((opt) => opt?.id === (inputs.toeStyle || cabinet?.toeStyle))?.value || '0');
    const crownSummary = parseFloat(crownOptions?.find((opt) => opt?.id === (inputs.crown || cabinet?.crown))?.value || '0');
    const lightRailSummary = parseFloat(
      lightRailOptions?.find((opt) => opt?.id === (inputs.lightRail || cabinet?.lightRail))?.value || '0',
    );
    const ceilingHeightSummary = parseFloat(
      ceilingOptions?.find((opt) => opt?.id === (inputs.ceilingHeight || cabinet?.ceilingHeight))?.value || '0',
    );

    const total =
      (doorMaterialSummary +
        subMaterialSummary +
        constructionMethodSummary +
        toeStyleSummary +
        crownSummary +
        lightRailSummary +
        ceilingHeightSummary) *
      dimensionMultiplier;

    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="text-muted">Review your cabinet configuration.</p>
        <pre className="text-left text-sm bg-muted p-4 rounded-md">
          {JSON.stringify({ ...inputs, spacePhotos, inspirationPhotos }, null, 2)}
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
              <Button onClick={() => handleSteps()}>{step >= 9 ? 'Finish' : 'Next'}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CabinetBuilderModal;
