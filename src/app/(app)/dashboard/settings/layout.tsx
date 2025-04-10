'use client';

import { Separator } from '@/components/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { APP_ROUTES } from '@/constants/routes';
import { User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { Suspense, useCallback, useMemo } from 'react';

import Profile from '@/components/app/dashboard/settings/Profile';
const Notifications = React.lazy(() => import('@/components/app/dashboard/settings/Notifications'));
const Security = React.lazy(() => import('@/components/app/dashboard/settings/Security'));

const sidebarNavItems = [
    {
        title: 'Profile',
        href: APP_ROUTES.DASHBOARD.SETTINGS.PROFILE.path,
        component: <Profile />,
        icon: <User className="h-5 w-5" />,
    },
    {
        title: 'Security',
        href: APP_ROUTES.DASHBOARD.SETTINGS.SECURITY.path,
        component: <Security />,
        icon: <User className="h-5 w-5" />,
    },
    {
        title: 'Notifications',
        href: APP_ROUTES.DASHBOARD.SETTINGS.NOTIFICATIONS.path,
        component: <Notifications />,
        icon: <User className="h-5 w-5" />,
    },
];

const Settings: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Match tab by pathname
    const currentTab = useMemo(() => {
        const match = sidebarNavItems.find((item) => pathname.includes(item.href));
        return match?.href || sidebarNavItems[0].href;
    }, [pathname]);

    const handleTabChange = useCallback((href: string) => {
        router.push(href);
    }, [router]);

    return (
        <div className="container flex-1 p-8">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>
            <Separator className="my-6" />

            <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList>
                    {sidebarNavItems.map((item) => (
                        <TabsTrigger key={item.href} value={item.href}>
                            {item.title}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {sidebarNavItems.map((item) => (
                    <TabsContent key={item.href} value={item.href} className="mt-6">
                        <Suspense fallback={<p>Loading {item.title}...</p>}>
                            {item.component}
                        </Suspense>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default Settings;
