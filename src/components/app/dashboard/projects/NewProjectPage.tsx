// pages/projects/[id]/edit.tsx
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectStatusLabels } from "@/constants/enums/project.enums";
import { useGetLayoutOptions, useGetProjects, useGetRoomOptions } from "@/hooks/api/projects.queries";
import { ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

export default function NewProjectPage() {
    const path = usePathname();
    const projectId = path.split('/')[4];

    // Track open walls per room by room ID.
    const [openWalls, setOpenWalls] = React.useState<Record<number, boolean>>({});

    const { data: layouts } = useGetLayoutOptions();
    const { data: roomOptions } = useGetRoomOptions();
    const { data: projects } = useGetProjects();
    // const project = projects?.find((p) => p.id == projectId);
    console.log(layouts);

    // Dummy project data
    const project = {
        id: 1,
        name: "Project 1",
        description: "Project 1 Description",
        status: 1,
        layout: 0,
        rooms: [
            {
                id: 1,
                type: 1,
                name: "Room 1",
                height: 8,
                layout: 1,
                walls: [
                    { id: 1, number: 1, length: 10, cabinets: [] },
                    { id: 2, number: 2, length: 10, cabinets: [] }
                ],
                cabinets: [],
            },
            {
                id: 2,
                type: 2,
                name: "Room 2",
                height: 10,
                layout: 2,
                cabinets: [],
                walls: [] // even if empty, include the key for consistency
            }
        ]
    };

    const toggleWalls = (roomId: number) => {
        setOpenWalls((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
    };

    const wallImage = (roomId: number, wallNumber: number) => {
        const room = project.rooms.find((room) => room.id === roomId);
        const layout = layouts?.find((layout) => layout.id === room?.layout);
        const wall = room?.walls.find((wall) => wall.number === wallNumber);
        if (room) {
            console.log(layout?.wall_one_image_url)
            switch (wall.number) {
                case 1: return layout?.wall_one_image_url;
                case 2: return layout?.wall_two_image_url;
                case 3: return layout?.wall_three_image_url;
            }
            return "";
        }
    }

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <ProjectHeader project={project} />
            <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center mt-3">
                    <h3 className="text-2xl font-bold">Rooms</h3>
                    <Button>
                        Add Room <Plus className="ml-2" />
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="w-[100px]">Room Type</TableCell>
                            <TableCell className="w-[100px]">Room Name</TableCell>
                            <TableCell className="w-[100px]">Layout</TableCell>
                            <TableCell className="w-[100px]">Height</TableCell>
                            <TableCell className="w-[100px]">Estimated Cost</TableCell>
                            <TableCell className="w-10"></TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {project.rooms.map((room: any) => (
                            <React.Fragment key={room.id}>
                                <TableRow
                                    className={`cursor-pointer hover:bg-blue-50 !rounded-xl ${openWalls[room.id] && "border-b-0"}`}
                                    onClick={() => toggleWalls(room.id)}
                                >
                                    <TableCell className="font-bold text-lg">{room.name}</TableCell>
                                    <TableCell className="relative">
                                        <Image
                                            src={roomOptions?.find((option) => option.id === room.type)?.image_url || ""}
                                            alt="Room Layout"
                                            width={100}
                                            height={100}
                                            className="h-24 w-24 object-cover rounded-md"
                                        />
                                        <span className="text-sm absolute -translate-y-[50px] translate-x-[15px] text-white font-bold">
                                            {roomOptions?.find((option) => option.id === room.type)?.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Image
                                            src={layouts?.find((layout) => layout.id === room.layout)?.image_url || ""}
                                            alt="Room Layout"
                                            width={100}
                                            height={100}
                                            className="object-cover"
                                        />
                                    </TableCell>
                                    <TableCell>{room.height ? `${room.height} ft` : "N/A"}</TableCell>
                                    <TableCell>$--</TableCell>
                                    <TableCell role="" className="flex flex-row h-24">
                                        <ChevronDown
                                            className={`w-6 h-6 transition-transform mx-auto my-auto align-middle ${openWalls[room.id] ? "rotate-180" : ""}`}
                                        />

                                    </TableCell>
                                </TableRow>
                                {openWalls[room.id] && room.walls && room.walls.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-0">
                                            <div className=" p-2">
                                                <div className="flex flex-row justify-between border-b border-b-muted-foreground py-1">
                                                    <span className="font-semibold">Wall Number</span>

                                                    <span className="font-semibold">Length</span>
                                                    <span className="font-semibold">Cabinets</span>
                                                </div>
                                                {room.walls.map((wall: any) => (
                                                    <div
                                                        key={wall.id}
                                                        className="flex flex-row justify-between border-t border-t-muted-foreground py-1"
                                                    >
                                                        <Image
                                                            src={wallImage(room.id, wall.number) || ""}
                                                            alt="Room Layout"
                                                            width={100}
                                                            height={100}
                                                            className="h-20 w-24 scale-75 m-2  rounded-md"
                                                        />
                                                        <span className="justify-center align-middle my-auto"  >{wall.length} ft</span>
                                                        <span className="justify-center align-middle my-auto">{wall.cabinets.length}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col border-t border-t-muted-foreground pt-4">
                Estimated Project Cost: <span className="text-lg font-semibold ms-auto">$2,500</span>
            </div>
        </div>
    );
}

const ProjectHeader = ({ project }: { project: any }) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
                <span className="text-3xl font-bold">{project.name}</span>
                <p>{project.description}</p>
            </div>
            <Card className="min-h-[100px] p-2 flex flex-col justify-between">
                <div className="flex flex-row items-center">
                    <span className="text-2xl font-bold">Project Overview</span>
                    <Badge className="ms-auto" variant="outline">
                        {ProjectStatusLabels[project.status]}
                    </Badge>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col text-center w-24">
                        <span className="text-sm text-muted-foreground">Rooms</span>
                        <span className="text-sm font-semibold">{project.rooms.length}</span>
                    </div>
                    <div className="flex flex-col text-center w-24">
                        <span className="text-sm text-muted-foreground">Cabinets</span>
                        <span className="text-sm font-semibold">{project.id}</span>
                    </div>
                    <div className="flex flex-col text-center w-24">
                        <span className="text-sm text-muted-foreground">Estimate</span>
                        <span className="text-sm font-semibold">$22,000</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};
