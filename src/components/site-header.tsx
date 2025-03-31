'use client';;
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouteEntries } from "@/hooks/useRouteEntries";


import { usePathname, useRouter } from "next/navigation";

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const entries = useRouteEntries();


  const pathLength = pathname.split("/").length;

  const path = pathLength <= 4 ? pathname.split("/").slice(0, pathLength - 1).join("/") : pathname.split("/").slice(0, pathLength - 2).join("/");

  const matchedEntry = entries.find((r) => r.path.includes(path));

  const title = matchedEntry?.title;




  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  );
}
