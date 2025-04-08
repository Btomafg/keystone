import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CabinetOptionType, CabinetOptionTypeLabels } from "@/constants/enums/project.enums";
import { Cabinet } from "@/constants/models/object.types";

interface OptionReviewProps {
  customOptions?: any[];
  selectedOptions?: Partial<Cabinet>;
  onOptionComplete?: (data: Partial<Cabinet>) => void;
  loading?: boolean;
}

const stepLabels: Record<keyof Partial<Cabinet>, string> = {
  door_material: "Door Material",
  sub_material: "Sub Material",
  construction_method: "Construction Method",
  toe_style: "Toe Style",
  crown: "Crown",
  light_rail: "Light Rail",
};

const OptionReview: React.FC<OptionReviewProps> = ({
  customOptions = [],
  selectedOptions = {},
  onOptionComplete,
    loading = false,
}) => {
 
  const getOptionById = (type: CabinetOptionType, id: number) => {
    return customOptions.find((opt) => opt.type == type && opt.id == id);
  };

  const handleConfirm = () => {
    onOptionComplete && onOptionComplete(selectedOptions);
  };
 
  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(selectedOptions).map((opt) => {
            console.log('Selected options', selectedOptions);
            const [key, value] = opt;
            const selectedOption = getOptionById(
                key as any,
              value
                );
         
            const label = CabinetOptionTypeLabels[
              selectedOption?.type as CabinetOptionType]
            
          return (
            <Card
              key={key}
              className="flex flex-col items-center justify-center p-4 text-center shadow-md rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-2">{label}</h3>
              {selectedOption?.image_url && (
                <img
                  src={selectedOption.image_url}
                  alt={selectedOption.name}
                  className="w-24 h-24 object-cover rounded-md mb-2"
                />
              )}
              <p className="text-base font-medium">
                {selectedOption?.name || "Not Selected"}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <Button
        className="ms-auto"
        loading={loading}
          onClick={handleConfirm}
        >
          Confirm Selections
        </Button>
      </div>
    </div>
  );
};

export default OptionReview;
