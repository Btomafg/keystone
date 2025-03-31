// components/project/ProjectSection.tsx
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { ReactNode, useState } from "react"

interface ProjectSectionProps {
    title: string
    children: ReactNode
    defaultOpen?: boolean
    badge?: string | number
}

export default function ProjectSection({ title, children, defaultOpen = true, badge }: ProjectSectionProps) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="p-4 border-b  shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => setOpen(!open)}
                    className="text-lg font-semibold flex items-center gap-2"
                >
                    {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    {title}
                    {badge && (
                        <span className="ml-2 px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                            {badge}
                        </span>
                    )}
                </Button>{open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            {open && <div>{children}</div>}
        </div>
    )
}
