"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { setStep } from "@/store/slices/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function AuthStepProfile() {
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const handleProfileSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({ title: "Profile Completed", description: "Your account is now set up!" });
            dispatch(setStep("login")); // Reset back to login after profile setup
        }, 1500);
    };

    return (
        <div className="grid gap-4">
            <Input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <Input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Button loading={loading} onClick={handleProfileSubmit}>Complete Profile</Button>
        </div>
    );
}
