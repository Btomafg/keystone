import React, { createContext, useContext, useState } from "react";
import ReportBug from "./ReportBug";

interface ReportBugContextProps {
    showReportBug: () => void;
}

const ReportBugContext = createContext<ReportBugContextProps | undefined>(undefined);

export const ReportBugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const showReportBug = () => setIsOpen(true);

    return (
        <ReportBugContext.Provider value={{ showReportBug }}>
            {children}
            <ReportBug open={isOpen} setOpen={setIsOpen} />
        </ReportBugContext.Provider>
    );
};


export const useReportBug = (): ReportBugContextProps => {
    const context = useContext(ReportBugContext);
    if (!context) {
        throw new Error("useReportBug must be used within a ReportBugProvider");
    }
    return context;
};
