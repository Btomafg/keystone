// app/admin/settings/page.tsx (Example Path)
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarCog, CalendarOff, ListChecks, Shapes, SquareStack } from 'lucide-react'; // Example Icons

// Import the components for each tab's content (we'll define these below)
import CabinetTypesManager from '@/components/app/admin/settings/CabinetTypeManager';
import CustomOptionsManager from '@/components/app/admin/settings/CustomOptionManager';
import { HolidayTimeOffManager } from '@/components/app/admin/settings/HolidayTimeOffManager';
import RoomOptionsManager from '@/components/app/admin/settings/RoomOptionsManager';
import { SchedulingResourcesManager } from '@/components/app/admin/settings/SchedulingResourcesManager';
import { useAdminGetSettings } from '@/hooks/api/admin/admin.settings.queries';

interface dataType {
  roomOptions: any[];
  customOptions: any[];
  cabinetTypes: any[];
}
export default function AdminSettingsPage() {
  const { data, isLoading } = useAdminGetSettings();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-8">
      {' '}
      {/* Added space-y */}
      <h1 className="text-3xl font-bold tracking-tight">Application Settings</h1>
      <p className="text-muted-foreground">Manage core configuration options for projects and scheduling.</p>
      <Tabs defaultValue="scheduling-resources" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 h-auto">
          <TabsTrigger value="scheduling-resources" className="py-2">
            {' '}
            <CalendarCog className="w-4 h-4 mr-2" /> Resources{' '}
          </TabsTrigger>
          <TabsTrigger value="room-options" className="py-2">
            {' '}
            <ListChecks className="w-4 h-4 mr-2" /> Room Options{' '}
          </TabsTrigger>
          <TabsTrigger value="custom-options" className="py-2">
            {' '}
            <Shapes className="w-4 h-4 mr-2" /> Custom Options{' '}
          </TabsTrigger>
          <TabsTrigger value="cabinet-types" className="py-2">
            {' '}
            <SquareStack className="w-4 h-4 mr-2" /> Cabinet Types{' '}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-2" value="scheduling-resources">
          <Card>
            <p className="text-red-500 text-xl font-bold">
              Note: This is a work in progress. Please check back later. You can click around, but data may not persist.
            </p>
            <CardHeader>
              <CardTitle>Manage Scheduling Resources</CardTitle>
              <CardDescription>
                Define bookable resources (e.g., consultants) and their default scheduling parameters. Detailed availability is managed
                separately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SchedulingResourcesManager />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarOff className="w-5 h-5" /> Manage Holidays & Time Off
              </CardTitle>
              <CardDescription>
                Define company-wide holidays or specific time off for resources. These times will be blocked in the scheduler.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HolidayTimeOffManager /> {/* <-- Use New Component */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="room-options">
          <Card>
            <CardHeader>
              <CardTitle>Manage Room Options</CardTitle>
              <CardDescription>Define options applicable to rooms, like crown molding or baseboards.</CardDescription>
            </CardHeader>
            <CardContent>
              <RoomOptionsManager data={data} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-options">
          <Card>
            <CardHeader>
              <CardTitle>Manage Custom Options</CardTitle>
              <CardDescription>Define specific add-ons or features like hardware, accessories, or special materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomOptionsManager data={data} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cabinet-types">
          <Card>
            <CardHeader>
              <CardTitle>Manage Cabinet Types</CardTitle>
              <CardDescription>Define the base cabinet types available for projects, including dimensions and defaults.</CardDescription>
            </CardHeader>
            <CardContent>
              <CabinetTypesManager data={data} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
