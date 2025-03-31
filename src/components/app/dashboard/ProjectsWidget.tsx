'use client';;
import { useGetProjects } from "@/hooks/api/projects.queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NewProjectModal from "./projects/NewProjectModal/NewProjectModal";
import { ProjectTable } from "./projects/ProjectTable";



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
                <NewProjectModal />

            </div>

            <div className="flex flex-row gap-2 flex-wrap">


                <ProjectTable />

            </div>
        </div>
    );
};



export default ProjectsWidget;
