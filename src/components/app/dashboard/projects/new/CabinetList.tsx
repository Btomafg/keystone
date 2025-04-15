// pages/projects/[id]/edit.tsx
'use client';
import { Card } from '@/components/ui/card';
import SawLoader from '@/components/ui/loader';
import { CabinetOptionType, CabinetOptionTypeLabels } from '@/constants/enums/project.enums';
import { Cabinet } from '@/constants/models/object.types';
import { useDeleteCabinet, useGetCustomOptions } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const CabinetsList = ({ cabinets }: { cabinets: Cabinet[] }) => {
  return (
    <div className="ms-3 p-2">
      <div className="flex flex-row">
        <h4 className="font-bold flex text-lg mb-2"> Cabinets</h4>
      </div>

      {cabinets?.map((cabinet) => (
        <CabinetRow key={cabinet.id} cabinet={cabinet} />
      ))}
    </div>
  );
};

const CabinetRow = ({ cabinet }: { cabinet: Cabinet }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(cabinet.name);
  const [isSaving, setIsSaving] = useState(false);
  const [rowOpen, setRowOpen] = useState(false);
  const { mutateAsync: deleteCabinet, isPending: deletingCabinets } = useDeleteCabinet();
  const handleDelete = async (cabinet) => {
    await deleteCabinet([cabinet.id]);
    setRowOpen(false);
  };
  const handleSave = async () => {
    setIsSaving(true);
    // TODO: hook into updateCabinet mutation
    console.log('Save cabinet name:', name);
    setEditOpen(false);
    setIsSaving(false);
  };
  const { data: customOptions } = useGetCustomOptions();

  const doorMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.DoorMaterial);
  const subMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.SubMaterial);
  const constructionMethodOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ConstructionMethod);
  const toeStyleOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ToeStyle);
  const crownOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.Crown);
  const lightRailOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.LightRail);

  let cabinetOptions = [];

  return (
    <div
      className="flex-col items-center justify-between p-2 border rounded-md bg-muted/50 shadow-sm hover:bg-blue-50 hover:cursor-pointer mb-2"
      onClick={() => setRowOpen(!rowOpen)}
    >
      <div className="flex flex-row gap-2">
        <div className="mx-auto flex  flex-col gap-1 w-fit">
          <div className="font-semibold">Name</div>
          <div className="text-sm">{cabinet?.name}</div>
        </div>
        <div className="mx-auto flex flex-col gap-1 w-fit">
          <div className="font-semibold">Length</div>
          <div className="text-sm">{cabinet?.length ? `${cabinet?.length}ft` : ''}</div>
        </div>
        <div className="mx-auto flex flex-col gap-1 w-fit">
          <div className="font-semibold">Height</div>
          <div className="text-sm">{cabinet?.length ? `${cabinet?.height}ft` : ''}</div>
        </div>
        <div className="mx-auto flex flex-col gap-1 w-fit">
          <div className="font-semibold">Estimated Cost</div>
          <div className="text-sm">{toUSD(cabinet?.estimate) || '--'}</div>
        </div>

        <div className="mx-auto flex flex-col gap-1 w-fit">
          {deletingCabinets ? (
            <SawLoader />
          ) : (
            <Trash2Icon className="w-5 h-5 text-red-500 hover:scale-125 my-auto" onClick={() => handleDelete(cabinet)} />
          )}
        </div>
      </div>
      <div className={`flex flex-row gap-2 mt-2 ${rowOpen ? 'block' : 'hidden'}`}>
        {cabinetOptions?.map((opt) => (
          <Card
            key={opt?.id}
            className={`flex flex-col mx-auto  transition   h-24 aspect-square justify-center items-center p-1  `}
            onClick={() => ''}
          >
            {CabinetOptionTypeLabels[opt?.type] && <h3 className="text-xs text-center">{CabinetOptionTypeLabels[opt?.type]}</h3>}
            {opt?.image_url && <img src={opt?.image_url} alt={opt?.name} className="w-12  h-12 rounded-xl  object-cover" />}
            {opt?.icon && opt?.icon}
            <h3 className="text-xs text-center">{opt?.name || 'None'}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CabinetsList;
