"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"


type DatePickerProps = {
    mode?: "single" | "range"
    onDateChange?: (date: Date | { from: Date; to: Date } | undefined) => void
    disabled?: { before?: Date; after?: Date }
    fromYear?: number
    toYear?: number
    startMonth?: Date
    endMonth?: Date
    selected?: Date | { from: Date; to: Date } | undefined
}

export function DatePicker({ mode = "single", onDateChange, disabled, startMonth, endMonth, fromYear, toYear, selected }: DatePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | { from: Date; to: Date } | undefined
    >(selected || undefined)

    const handleDateSelect = (date: Date | { from: Date; to: Date } | undefined) => {
        setSelectedDate(date)
        if (onDateChange) onDateChange(date)
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        " justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        mode === "single" && selectedDate instanceof Date ? (
                            format(selectedDate, "PPP")
                        ) : mode === "range" &&
                            selectedDate &&
                            typeof selectedDate === "object" ? (
                            selectedDate.from && selectedDate.to ? (
                                `${format(selectedDate.from, "PPP")} - ${format(
                                    selectedDate.to,
                                    "PPP"
                                )}`
                            ) : (
                                <span>Pick a range</span>
                            )
                        ) : (
                            <span>Pick a date</span>
                        )
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">

                <Calendar
                    mode={mode}

                    captionLayout="dropdown-buttons"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    fromYear={fromYear}
                    toYear={toYear}
                    disabled={disabled}

                />
            </PopoverContent>
        </Popover>
    )
}
