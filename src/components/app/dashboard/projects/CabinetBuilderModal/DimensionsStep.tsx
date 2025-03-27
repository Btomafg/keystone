import { Input } from "@/components/ui/input";
import { Cabinet } from "@/constants/models/object.types";

interface DimensionsStepProps {
    inputs: Partial<Cabinet> & { width?: string; length?: string; height?: string };
    setInputs: React.Dispatch<React.SetStateAction<Partial<Cabinet> & { width?: string; length?: string; height?: string }>>;
    liveQuoteDisplay: React.ReactNode;
}

const DimensionsStep: React.FC<DimensionsStepProps> = ({ inputs, setInputs, liveQuoteDisplay }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Enter Dimensions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                    type="number"
                    value={inputs?.width ?? ''}
                    onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
                    placeholder="Width (ft)"
                    className="text-center"
                />
                <Input
                    type="number"
                    value={inputs?.length ?? ''}
                    onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
                    placeholder="Length (ft)"
                    className="text-center"
                />
                <Input
                    type="number"
                    value={inputs?.height ?? ''}
                    onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
                    placeholder="Height (ft)"
                    className="text-center"
                />
            </div>
            {liveQuoteDisplay}
        </div>
    );
};
export default DimensionsStep;