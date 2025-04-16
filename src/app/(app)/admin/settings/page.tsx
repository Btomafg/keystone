// app/admin/settings/page.tsx (Example Path)
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListChecks, Shapes, SquareStack } from 'lucide-react'; // Example Icons

// Import the components for each tab's content (we'll define these below)
import CabinetTypesManager from '@/components/app/admin/settings/CabinetTypeManager';
import CustomOptionsManager from '@/components/app/admin/settings/CustomOptionManager';
import RoomOptionsManager from '@/components/app/admin/settings/RoomOptionsManager';
import { useAdminGetSettings } from '@/hooks/api/admin/admin.settings.queries';

interface dataType {
  roomOptions: any[];
  customOptions: any[];
  cabinetTypes: any[];
}
export default function AdminSettingsPage() {
  const { data, isLoading } = useAdminGetSettings();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Application Configuration</h1>

      <Tabs defaultValue="room-options" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="room-options">
            <ListChecks className="w-4 h-4 mr-2" /> Room Options
          </TabsTrigger>
          <TabsTrigger value="custom-options">
            <Shapes className="w-4 h-4 mr-2" /> Custom Options
          </TabsTrigger>
          <TabsTrigger value="cabinet-types">
            <SquareStack className="w-4 h-4 mr-2" /> Cabinet Types
          </TabsTrigger>
        </TabsList>

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
