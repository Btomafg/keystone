import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BackgroundCard } from '@/components/ui/cards/backgroundCard';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CabinetOptionType } from '@/constants/enums/project.enums';
import { Room } from '@/constants/models/object.types';
import {
  useCreateRoom,
  useDeleteRoom,
  useGetCustomOptions,
  useGetLayoutOptions,
  useGetProjects,
  useGetRoomOptions,
  useUpdateRoom,
} from '@/hooks/api/projects.queries';
import { useScreenWidth } from '@/hooks/uiHooks';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import OptionStep from '../CabinetBuilderModal/OptionStep';

interface NewProjectRoomsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function NewProjectRooms({ open, setOpen }: NewProjectRoomsProps) {
  const [newRoomStep, setNewRoomStep] = React.useState(0);
  const [newRoom, setNewRoom] = React.useState<any>(null);
  const screenWidth = useScreenWidth();
  const { mutateAsync: createRoom, isPending: creatingRoom } = useCreateRoom();
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const { data: customOptions } = useGetCustomOptions();
  const [selectedOptions, setSelectedOptions] = React.useState<Partial<Room>>({});
  const { data: projects, isLoading } = useGetProjects();
  const { data: commonRooms } = useGetRoomOptions();
  const { data: layouts } = useGetLayoutOptions();
  const typeLayouts = layouts?.filter((layout) => layout.room_option_id === newRoom?.type);
  const path = usePathname();
  const projectId = path.split('/')[3];
  const project = projects?.find((project) => project?.id == projectId);
  const sortedCommonRooms = commonRooms?.sort((a, b) => a.id - b.id);
  const roomHeightOptions = customOptions?.filter((option) => option.type === 1).sort((a, b) => a.value - b.value);

  const saveRoom = async (data) => {
    const roomData = {
      ...data,
      construction_method: selectedOptions[CabinetOptionType.ConstructionMethod],
      crown: selectedOptions[CabinetOptionType.Crown],
      door_material: selectedOptions[CabinetOptionType.DoorMaterial],
      light_rail: selectedOptions[CabinetOptionType.LightRail],
      sub_material: selectedOptions[CabinetOptionType.SubMaterial],
      toe_style: selectedOptions[CabinetOptionType.ToeStyle],
    };
    console.log('Saving room data', roomData);
    const res = await createRoom(roomData);
    setOpen(false);
    setNewRoomStep(0);
    setNewRoom(null);
  };

  console.log(customOptions);
  console.log(selectedOptions);
  const selectRoomType = async (type: number) => {
    const newRoom = {
      type: type,
      project: project?.id,
    };
    setNewRoom(newRoom);
    setNewRoomStep(1);
  };

  const selectLayout = async (layoutId: number) => {
    const newRoomData = {
      ...newRoom,
      layout: layoutId,
    };
    setNewRoom(newRoomData);
    setNewRoomStep(2);
  };

  const updateRoomName = async (roomId: string, newName: string) => {
    console.log('updateRoomName', roomId, newName);
    await updateRoom({ id: roomId, name: newName, project: project?.id });
  };

  const deleteRoomById = async (roomId: string) => {
    await deleteRoom(roomId);
  };

  const onBack = () => {
    if (newRoomStep === 0) {
      console.log('Closing modal or going back');
    }
    if (newRoomStep === 1) {
      setNewRoomStep(0);
    }
    if (newRoomStep === 2) {
      setNewRoomStep(1);
    }
  };
  const onOptionComplete = async (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
    setNewRoomStep(3);
  };
  const stepData = [
    {
      title: 'Select Room Type',
      description: 'What type of room do you want to add?',
    },
    {
      title: 'Select Room Layout',
      description: 'Choose a layout that best fits the room.',
    },
    {
      title: 'Room Details',
      description: 'Add details for the room.',
    },
  ];

  const NewRoomStep1 = () => (
    <div className="grid grid-cols-4 md:grid-cols-4 gap-1 md:gap-2 p-2 mx-auto">
      {sortedCommonRooms?.map((room) => (
        <BackgroundCard
          key={room.id}
          imageUrl={room.image_url}
          title={room.name}
          description="sdsd"
          variant="outline"
          onClick={() => selectRoomType(room.id)}
        >
          {room.name}
        </BackgroundCard>
      ))}
    </div>
  );

  const NewRoomStep2 = () => (
    <div className="grid grid-cols-4 md:grid-cols-4 gap-1 md:gap-2 p-2 mx-auto">
      {typeLayouts?.map((layout) => (
        <div key={layout.id} className="w-[75px] md:w-[120px] group" onClick={() => selectLayout(layout.id)}>
          <div
            className={cn(
              'cursor-pointer overflow-hidden relative rounded-md shadow-xl aspect-square mx-auto flex flex-col justify-between p-2 bg-cover',
            )}
          >
            <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-white rounded-xl group-hover:border-primary group-hover:border-2"></div>
            <div className="flex flex-col relative z-10 text-content justify-between">
              <h1 className="font-bold text-lg md:text-xl text-muted">{layout.name}</h1>
              <Image src={layout.image_url} alt="Room Layout" width={100} height={100} className="object-cover" />
              <Badge color="blue" className="text-white text-xs group-hover:block hidden mx-auto mt-4">
                Selected
              </Badge>
            </div>
          </div>
        </div>
      ))}
      <div className="w-[75px] md:w-[120px] group" onClick={() => selectLayout(9)}>
        <div
          className={cn(
            'cursor-pointer overflow-hidden relative rounded-md shadow-xl aspect-square mx-auto flex flex-col justify-between p-2 bg-cover',
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-white rounded-xl group-hover:border-primary group-hover:border-2"></div>
          <div className="flex flex-col relative z-10 text-content justify-between">
            <h1 className="font-bold text-lg md:text-xl text-muted my-auto">Custom</h1>
            <Badge color="blue" className="text-white text-xs group-hover:block hidden mx-auto mt-4">
              Selected
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  const NewRoomStep3 = () => {
    return (
      <div>
        <OptionStep customOptions={customOptions} onOptionComplete={onOptionComplete} />
      </div>
    );
  };
  const roomDetailsSchema = z.object({
    roomName: z.string().min(1, { message: 'Room name is required' }),
    height: z.number({ required_error: 'Select a wall height' }),
    wallCount: z.number({ required_error: 'Select a wall height' }).optional(),
  });

  const NewRoomStep4 = () => {
    const form = useForm({
      resolver: zodResolver(roomDetailsSchema),
      defaultValues: {
        roomName: '',
        height: 8,
        wallCount: 1,
      },
    });

    const onSubmit = (data: z.infer<typeof roomDetailsSchema>) => {
      let roomData = {
        ...newRoom,
        name: data.roomName,
        height: data.height,
        project: project?.id,
      };
      newRoom.layout == 9 && (roomData = { ...roomData, wallCount: data.wallCount });
      saveRoom(roomData);
    };

    return (
      <div className="flex flex-col gap-2 min-w-[375px] md:min-w-[520px] z-[999]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="w-[300px] mx-auto">
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter room name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wall Height</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wall height" />
                        </SelectTrigger>
                        <SelectContent className="z-[999] cursor-pointer">
                          {roomHeightOptions?.map((option) => (
                            <SelectItem key={option.id} className=" cursor-pointer" value={option.value}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {newRoom.layout == 9 && (
                <FormField
                  control={form.control}
                  name="wallCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many walls with cabinets in this room?</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select wall height" />
                          </SelectTrigger>
                          <SelectContent className="z-[999] cursor-pointer">
                            <SelectItem className=" cursor-pointer" value={1}>
                              1
                            </SelectItem>
                            <SelectItem className=" cursor-pointer" value={2}>
                              2
                            </SelectItem>
                            <SelectItem className=" cursor-pointer" value={3}>
                              3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex justify-end mt-3">
              <Button loading={creatingRoom} type="submit">
                Save New Room
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  const RenderSteps = () => {
    switch (newRoomStep) {
      case 0:
        return <NewRoomStep1 />;
      case 1:
        return <NewRoomStep2 />;
      case 2:
        return <NewRoomStep3 />;
      case 3:
        return <NewRoomStep4 />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: screenWidth * 0.85 }} className="flex flex-col mx-auto">
      <div className="flex flex-row gap-3 w-full">
        {newRoomStep > 0 && <ChevronLeft className="text-muted cursor-pointer my-auto text-2xl" onClick={onBack} />}
        <div className="flex flex-col w-1/2">
          <h2 className="text-xl font-semibold">{stepData[newRoomStep]?.title}</h2>
          <p className="text-muted text-sm">{stepData[newRoomStep]?.description}</p>
        </div>
      </div>
      <RenderSteps />
    </div>
  );
}
