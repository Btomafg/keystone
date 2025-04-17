// components/forms/NewProjectPage.tsx (Example adjusted path)

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building, CalendarIcon, House, MapPin } from 'lucide-react'; // Keep Loader2
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react'; // Import useState, useCallback
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete'; // Import library
import { Controller, useForm } from 'react-hook-form'; // Import Controller
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'; // Keep for other fields
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { ProjectType } from '@/constants/enums/project.enums';
import { APP_ROUTES } from '@/constants/routes';
import { useCreateProjects, useGetProjects } from '@/hooks/api/projects.queries';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { addDays } from 'date-fns';
import { format } from 'date-fns-tz';

// --- Updated Zod Schema ---
export const projectDetailsSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(2, 'Please tell us a bit about your project'),
  first_custom: z.boolean().optional(),
  fullAddress: z.string({ required_error: 'Please select a valid address.' }).min(5, 'Please select a valid address.'),
  type: z
    .number({ required_error: 'Please select a project type', invalid_type_error: 'Please select a project type' })
    .refine((val) => val === 0 || val === 1, { message: 'Please select a project type' }),
  target_install_date: z.date().optional().nullable(),
  // Optional fields to be populated by autocomplete logic
  street: z.string({ required_error: 'Street address is required' }).min(1, 'Street address is required'),
  city: z.string({ required_error: 'City is required' }).min(1, 'City is required'),
  state: z.string({ required_error: 'State is required' }).min(1, 'State is required'),
  zip: z.string({ required_error: 'Zip code is required' }).min(1, 'Zip code is required'),
  latitude: z.number(),
  longitude: z.number(),
});

export type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>;

interface NewProjectPageProps {}

// Helper function to parse Google Places address components
const getAddressComponent = (components: google.maps.GeocoderAddressComponent[], type: string): string | undefined => {
  return components.find((component) => component.types.includes(type))?.long_name;
};
const getShortAddressComponent = (components: google.maps.GeocoderAddressComponent[], type: string): string | undefined => {
  return components.find((component) => component.types.includes(type))?.short_name;
};

const NewProjectPage: React.FC<NewProjectPageProps> = () => {
  const path = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createOrUpdateProject, isPending: loading } = useCreateProjects();
  const projectId = path.split('/')[4];
  const isEditing = !!projectId;

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects();
  const project = useMemo(() => projects?.find((p) => p.id == projectId), [projects, projectId]);

  // State to hold parsed address components temporarily if needed outside form state
  // const [parsedAddress, setParsedAddress] = useState<{ street?: string; city?: string; state?: string; zip?: string }>({});

  const form = useForm<ProjectDetailsFormValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      name: '',
      description: '',
      first_custom: false,
      fullAddress: '', // Initialize new field
      street: '', // Initialize parsed fields
      city: '',
      state: '',
      zip: '',
      latitude: null,
      longitude: null,
      type: undefined,
      target_install_date: null,
    },
    mode: 'onChange',
  });

  const { setValue, watch, control, handleSubmit, formState, trigger, reset } = form;
  const selectedType = watch('type');

  // --- Populate form on edit ---
  useEffect(() => {
    if (isEditing && project) {
      // Construct a full address string for display if editing
      const existingFullAddress = [project.street, project.city, project.state, project.zip].filter(Boolean).join(', ');

      reset({
        // Use reset to update multiple fields, especially non-input ones
        name: project.name || '',
        description: project.description || '',
        first_custom: project.first_custom || false,
        fullAddress: existingFullAddress, // Set the combined address for display
        street: project.street || '', // Keep parsed values if available
        city: project.city || '',
        state: project.state || '',
        zip: project.zip || '',
        latitude: project.latitude || null,
        longitude: project.longitude || null,
        type: project.type,
        target_install_date: project.target_install_date ? new Date(project.target_install_date) : null,
      });
    }
  }, [isEditing, project, reset]); // Use reset in dependency array

  // --- Form Submission ---
  const onSubmit = async (data: ProjectDetailsFormValues) => {
    console.log('Submitting Data:', data);

    try {
      const submissionData = {
        ...data,
        target_install_date: data.target_install_date ? data.target_install_date.toISOString() : null,
        status: isEditing ? project?.status : 0,
      };
      // Remove optional fields if not needed
      delete submissionData.fullAddress;

      const result = await createOrUpdateProject(submissionData);

      toast({
        title: `Project ${isEditing ? 'Updated' : 'Created'}`,
        description: `Project "${data.name}" was successfully ${isEditing ? 'updated' : 'saved'}.`,
        variant: 'success',
      });

      if (!isEditing && result?.id) {
        router.push(`${APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path}/${result.id}`);
      }
      // Close modal or navigate away if needed (e.g., using setOpen if it were passed)
    } catch (error: any) {
      console.error('Failed to save project:', error);
      toast({
        title: `Error ${isEditing ? 'Updating' : 'Creating'} Project`,
        description: error?.message || `Could not ${isEditing ? 'update' : 'save'} the project. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  // --- Google Places Autocomplete Handler ---
  const handlePlaceSelected = useCallback(
    async (place: any) => {
      // Use 'any' or install @types/google.maps
      if (!place) return;

      setValue('fullAddress', place.description || place.label, { shouldValidate: true, shouldDirty: true });

      // Use geocoding to get detailed address components
      try {
        const results = await geocodeByAddress(place.description || place.label);
        if (results && results.length > 0) {
          const components = results[0].address_components;
          const streetNumber = getAddressComponent(components, 'street_number');
          const route = getAddressComponent(components, 'route');
          const street = `${streetNumber ? streetNumber + ' ' : ''}${route || ''}`.trim();
          const city = getAddressComponent(components, 'locality') || getAddressComponent(components, 'postal_town');
          const state = getShortAddressComponent(components, 'administrative_area_level_1');
          const zip = getAddressComponent(components, 'postal_code');
          const longitude = results[0].geometry.location.lng();
          const latitude = results[0].geometry.location.lat();
          console.log('Parsed Address:', { street, city, state, zip, longitude, latitude });

          // Update the hidden/optional form fields
          setValue('street', street || '', { shouldDirty: true });
          setValue('city', city || '', { shouldDirty: true });
          setValue('state', state || '', { shouldDirty: true });
          setValue('zip', zip || '', { shouldValidate: true, shouldDirty: true });
          setValue('latitude', latitude || null, { shouldDirty: true });
          setValue('longitude', longitude || null, { shouldDirty: true });
          // Optional: Store parsed address in component state if needed elsewhere
          // setParsedAddress({ street, city, state, zip });

          trigger(['street', 'city', 'state', 'zip']); // Trigger validation manually if needed
        } else {
          console.error('Geocoding failed for selected place:', place);
          // Clear parsed fields if geocoding fails but keep fullAddress
          setValue('street', '', { shouldDirty: true });
          setValue('city', '', { shouldDirty: true });
          setValue('state', '', { shouldDirty: true });
          setValue('zip', '', { shouldDirty: true });
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        // Clear parsed fields on error
        setValue('street', '', { shouldDirty: true });
        setValue('city', '', { shouldDirty: true });
        setValue('state', '', { shouldDirty: true });
        setValue('zip', '', { shouldDirty: true });
      }
    },
    [setValue, trigger],
  );
  console.log(form.getValues());
  if (isEditing && isLoadingProjects) {
    /* ... loading state ... */
  }
  if (isEditing && !isLoadingProjects && !project) {
    /* ... not found state ... */
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? `Edit Project: ${project?.name}` : 'Create New Project'}</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
          {/* --- Basic Info --- */}
          <div className="space-y-4">
            {/* Name Field */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {' '}
                  <FormLabel>Project Name *</FormLabel>{' '}
                  <FormControl>
                    <Input placeholder="e.g., Smith Kitchen Remodel" {...field} />
                  </FormControl>{' '}
                  <FormDescription className="text-xs">Give your project a memorable name.</FormDescription> <FormMessage />{' '}
                </FormItem>
              )}
            />
            {/* Description Field */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  {' '}
                  <FormLabel>Description</FormLabel>{' '}
                  <FormControl>
                    <Textarea placeholder="Briefly describe the project scope..." {...field} rows={3} />
                  </FormControl>{' '}
                  <FormDescription className="text-xs">Optional details about the project.</FormDescription> <FormMessage />{' '}
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* --- Address (Using Google Autocomplete) --- */}
          <div className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Project Address *
            </FormLabel>
            <FormField
              control={control}
              name="fullAddress" // Bind to the new field
              render={(
                { field }, // field here contains value, onChange etc for fullAddress
              ) => (
                <FormItem>
                  <FormControl>
                    {/* Controller is needed to bridge react-hook-form with the autocomplete component */}
                    <Controller
                      control={control}
                      name="fullAddress" // Control this specific field
                      render={(
                        { field: controllerField }, // controllerField has its own onChange, value etc.
                      ) => (
                        <GooglePlacesAutocomplete
                          apiKey={process.env.NEXT_PUBLIC_Maps_API_KEY} // Load API key from env
                          selectProps={{
                            value: controllerField.value ? { label: controllerField.value, value: controllerField.value } : null, // Adapt value format if needed by library
                            onChange: (selectedOption) => {
                              // selectedOption typically has { label: string, value: Place }
                              // We pass the whole selected option to our handler
                              handlePlaceSelected(selectedOption);
                            },
                            placeholder: 'Start typing address...',
                            isClearable: true,
                            // Style to match Shadcn Input (example)
                            styles: {
                              control: (provided) => ({
                                ...provided,
                                borderRadius: 'var(--radius)', // Use Shadcn border radius variable
                                borderColor: 'var(--input)', // Use Shadcn input border color
                                minHeight: 'calc(1.5rem + 0.875rem + 1px)', // Match input height (adjust as needed)
                                boxShadow: 'none',
                                '&:hover': {
                                  borderColor: 'hsl(var(--input))',
                                  cursor: 'text',
                                },
                              }),
                              input: (provided) => ({
                                ...provided,
                                color: 'hsl(var(--foreground))', // Match text color
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused ? 'hsl(var(--accent))' : 'transparent', // Match accent bg
                                color: 'hsl(var(--foreground))',
                                cursor: 'pointer',
                              }),
                              // Add other style overrides if needed
                            },
                          }}
                          autocompletionRequest={{
                            componentRestrictions: { country: ['us', 'ca'] }, // Restrict to US/Canada example
                          }}
                          onLoadFailed={(error) => console.error('Could not load Google Maps script', error)}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                  {form.getFieldState('street').error && ( // Show error message if street is invalid
                    <p className="text-sm text-red-500 mt-1">{form.getFieldState('street').error.message}</p>
                  )}
                  {form.getFieldState('city').error && ( // Show error message if city is invalid
                    <p className="text-sm text-red-500 mt-1">{form.getFieldState('city').error.message}</p>
                  )}
                  {form.getFieldState('state').error && ( // Show error message if state is invalid
                    <p className="text-sm text-red-500 mt-1">{form.getFieldState('state').error.message}</p>
                  )}
                  {form.getFieldState('zip').error && ( // Show error message if zip is invalid
                    <p className="text-sm text-red-500 mt-1">{form.getFieldState('zip').error.message}</p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* --- Project Type & Options --- */}
          <div className="space-y-4">
            {/* Project Type Field */}
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Project Type *</FormLabel>

                  <FormControl>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      {[ProjectType.Residential, ProjectType.Commercial].map((typeValue) => {
                        const isSelected = field.value === typeValue;

                        const Icon = typeValue === ProjectType.Residential ? House : Building;

                        const label = typeValue === ProjectType.Residential ? 'Residential' : 'Commercial';

                        const description = typeValue === ProjectType.Residential ? 'Homes, apartments, etc.' : 'Offices, retail, etc.';

                        return (
                          <Card
                            key={typeValue}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onClick={() => field.onChange(typeValue)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') field.onChange(typeValue);
                            }}
                            className={cn(
                              `flex flex-col justify-center items-center p-4 h-36 w-full cursor-pointer border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,

                              isSelected
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                                : 'hover:border-muted-foreground/50 border-muted',
                            )}
                          >
                            <Icon className={cn('h-10 w-10 mb-2', isSelected ? 'text-primary' : 'text-muted-foreground')} />

                            <h3 className="text-base font-semibold">{label}</h3>

                            <p className="text-xs text-muted-foreground text-center mt-1">{description}</p>
                          </Card>
                        );
                      })}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Target Install Date Field */}
            <FormField
              control={control}
              name="target_install_date"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="mb-1">Target Install Date</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full sm:w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}

                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined} // Pass undefined if null
                        onSelect={(date) => field.onChange(date ?? null)} // Set null if cleared
                        disabled={(date) => date < addDays(new Date(), -1)} // Disable past dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormDescription className="text-xs">Estimated date for project installation.</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* First Custom Checkbox Field */}
            <FormField
              control={control}
              name="first_custom"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 pt-2">
                  {' '}
                  <FormControl>
                    <Checkbox id="first_custom" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>{' '}
                  <FormLabel htmlFor="first_custom" className="text-sm font-normal cursor-pointer !mt-0">
                    Is this your first custom project with us?
                  </FormLabel>{' '}
                  <FormMessage />{' '}
                </FormItem>
              )}
            />
          </div>

          {/* --- Submission Button --- */}
          <div className="pt-6 flex flex-row justify-end">
            <Button type="submit" disabled={loading || !formState.isValid} loading={loading} className="w-full sm:w-auto">
              Create Project & Start Building!
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewProjectPage;
