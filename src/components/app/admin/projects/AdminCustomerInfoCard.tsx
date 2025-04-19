// app/admin/projects/[projectId]/_components/AdminCustomerInfoCard.tsx

'use client';

import AvatarPng from '@/assets/images/avatar.png'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminGetUserById } from '@/hooks/api/admin/admin.users.queries';
import { ExternalLink, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// --- Define Customer/Lead Type ---
// Align this with the actual structure you'll pass from your data source
interface CustomerLead {
  id: string | number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address1: string | null; // Street address
  city: string | null;
  state: string | null;
  zip: string | null;
  // Add other relevant fields, e.g., company name
}

// --- Component Props ---
interface AdminCustomerInfoCardProps {
  /** The customer/lead data object, or null/undefined if not available */
  customerId: CustomerLead | null | undefined;
  /** Loading state controlled by the parent */
  isLoading?: boolean;
}

// --- Dummy Data Example ---
export const DUMMY_CUSTOMER_LEAD: CustomerLead = {
  id: 'LEAD_456',
  first_name: 'Sarah',
  last_name: 'Chen',
  email: 's.chen@example.com',
  phone: '555-987-6543',
  address1: '789 Pine St',
  city: 'Metropolis',
  state: 'NY',
  zip: '10001',
};
// You would pass this or real data like: <AdminCustomerInfoCard customer={DUMMY_CUSTOMER_LEAD} />

export function AdminCustomerInfoCard({ customerId, isLoading = false }: AdminCustomerInfoCardProps) {
  console.log(customerId);
  const { data: customer, isError } = useAdminGetUserById({ user_id: customerId });
  console.log('Customer Data:', customer, isError);
  const customerName = customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : null;
  const fullAddress = customer ? [customer.address1, customer.city, customer.state, customer.zip].filter(Boolean).join(', ') : null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-muted-foreground" /> Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm min-h-[150px]">
        {' '}
        {/* Added min-height */}
        {isLoading ? (
          <div className="flex justify-center items-center py-4 h-full">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !customer ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground italic text-center">No customer linked or data unavailable.</p>
          </div>
        ) : (
          <>
            <Image
              src={customer.profile_img_url || AvatarPng}
              alt="Customer Avatar"
              className="h-12 w-12 rounded-full mx-auto "
              width={48}
              height={48}
            />

            {customerName && <div className="font-semibold text-base">{customerName}</div>}
            {customer.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${customer.email}`} className="hover:underline break-all">
                  {customer.email}
                </a>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${customer.phone}`} className="hover:underline">
                  {customer.phone}
                </a>
              </div>
            )}
            {fullAddress && (
              <div className="flex items-start gap-2 text-muted-foreground pt-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{fullAddress}</span>
              </div>
            )}
            {/* Link to full customer/lead profile page */}
            <div className="pt-2">
              <Button className="w-full" variant="outline" size="sm" asChild>
                {/* Adjust href based on your routing */}
                <Link className="flex" href={`/admin/users/${customer.id}`}>
                  Edit User <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
