'use client';;
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProjectStatusLabels } from "@/constants/enums/project.enums";
import { APP_ROUTES } from "@/constants/routes";
import { useGetProjects } from "@/hooks/api/projects.queries";
import { ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";




const ProjectsWidget = () => {
    const { data: projectData } = useGetProjects();
    const router = useRouter();


    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const filtered = projectData?.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const statusColors: Record<string, string> = {
        New: 'bg-gray-100 text-gray-800',
        Review: 'bg-blue-100 text-blue-800',
        Design: 'bg-indigo-100 text-indigo-800',
        Proposal: 'bg-yellow-100 text-yellow-800',
        Production: 'bg-orange-100 text-orange-800',
        Paint: 'bg-pink-100 text-pink-800',
        Delivery: 'bg-green-100 text-green-800',
        Install: 'bg-purple-100 text-purple-800',
    };


    return (
        <div className="flex flex-1 flex-col p-4">
            <div className="flex flex-row items-center gap-2 relative">
                <Button onClick={() => router.push(APP_ROUTES.DASHBOARD.PROJECTS.NEW.path)} size="xs" type="submit">
                    New Project
                </Button>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setOpen(e.target.value.length > 0);
                                }}
                                placeholder="Search projects..."
                                className="pl-8 h-[28px] text-sm"
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px] p-2">
                        {filtered?.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No projects found.</p>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {filtered?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-2 text-sm rounded-md hover:bg-muted cursor-pointer"
                                        onClick={() => {
                                            setSearch('');
                                            setOpen(false);
                                            // You could navigate to project detail or set active project
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-row mt-4 gap-2 flex-wrap">
                {!projectData ? (
                    <p>Loading...</p>
                ) :

                    projectData?.map((data, index) => (
                        <Card
                            key={index}
                            className="flex flex-col gap-1 min-w-52 h-36 p-2 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                        >
                            <div className="flex flex-row justify-between mt-1" title="Projects">
                                <span className="text-base">{data.name}</span>
                                <ChevronRight className="w-4 h-4 my-auto" />
                            </div>
                            <span className="text-xs">{data.description}</span>
                            <Badge className={`w-fit mt-auto ${statusColors[ProjectStatusLabels[data.status]]}`} variant="primary" size="xs">
                                {ProjectStatusLabels[data.status]}
                            </Badge>
                        </Card>
                    ))}
            </div>
        </div>
    );
};

export default ProjectsWidget;
