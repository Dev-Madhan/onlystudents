"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, LogOut, Mail, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const user = session?.user;

    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSubLoading, setIsSubLoading] = useState(false);

    // Notification states
    const [courseUpdates, setCourseUpdates] = useState(true);
    const [accountActivity, setAccountActivity] = useState(false);
    const [isNotifLoading, setIsNotifLoading] = useState(true);

    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user?.name]);

    useEffect(() => {
        if (!user) return;
        
        const fetchPreferences = async () => {
            try {
                const res = await fetch("/api/user/notifications");
                if (res.ok) {
                    const data = await res.json();
                    setCourseUpdates(data.notifyCourseUpdates ?? true);
                    setAccountActivity(data.notifyAccountActivity ?? false);
                }
            } catch {
                console.error("Failed to fetch notification preferences");
            } finally {
                setIsNotifLoading(false);
            }
        };
        fetchPreferences();
    }, [user]);

    const toggleCourseUpdates = async () => {
        const newVal = !courseUpdates;
        setCourseUpdates(newVal); // Optimistic UI update
        
        try {
            const res = await fetch("/api/user/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notifyCourseUpdates: newVal })
            });
            if (res.ok) {
                toast.success(newVal ? "Course updates enabled" : "Course updates disabled");
            } else {
                setCourseUpdates(!newVal);
                toast.error("Failed to save preference");
            }
        } catch {
            setCourseUpdates(!newVal);
            toast.error("Failed to save preference");
        }
    };

    const toggleAccountActivity = async () => {
        const newVal = !accountActivity;
        setAccountActivity(newVal); // Optimistic UI update
        
        try {
            const res = await fetch("/api/user/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notifyAccountActivity: newVal })
            });
            if (res.ok) {
                toast.success(newVal ? "Account activity alerts enabled" : "Account activity alerts disabled");
            } else {
                setAccountActivity(!newVal);
                toast.error("Failed to save preference");
            }
        } catch {
            setAccountActivity(!newVal);
            toast.error("Failed to save preference");
        }
    };

    const handleUpdateName = async () => {
        if (!name || name === user?.name) return;
        
        setIsSaving(true);
        await authClient.updateUser({
            name: name
        }, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                setIsSaving(false);
            },
            onError: (ctx: { error: { message: string } }) => {
                toast.error(ctx.error?.message || "Failed to update profile");
                setIsSaving(false);
            }
        });
    };

    const handleManageSubscription = async () => {
        setIsSubLoading(true);
        try {
            const res = await fetch("/api/stripe/billing");
            if (res.ok) {
                const data = await res.json();
                window.open(data.url, '_blank');
            } else {
                toast.error("You don't have any active billing history yet.");
            }
        } catch {
            toast.error("Failed to load billing portal.");
        } finally {
            setIsSubLoading(false);
        }
    };

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    onOpenChange(false);
                    router.push("/");
                }
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                <div className="p-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Settings</DialogTitle>
                        <DialogDescription>
                            Manage your dashboard preferences and account settings here.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                
                <Tabs defaultValue="appearance" className="w-full">
                    <div className="px-6 border-b">
                        <TabsList className="bg-transparent space-x-2 p-0 h-auto">
                            <TabsTrigger 
                                value="appearance" 
                                className="relative border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-md -mb-px"
                            >
                                Appearance
                            </TabsTrigger>
                            <TabsTrigger 
                                value="account" 
                                className="relative border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-md -mb-px"
                            >
                                Account
                            </TabsTrigger>
                            <TabsTrigger 
                                value="notifications" 
                                className="relative border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-md -mb-px"
                            >
                                Notifications
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6 pt-4 h-[300px] overflow-y-auto">
                        <TabsContent value="appearance" className="m-0 space-y-6 animate-in fade-in-50">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col space-y-1">
                                    <span className="font-semibold text-base">Theme Preference</span>
                                    <span className="text-sm text-muted-foreground">Customize the theme of the application.</span>
                                </div>
                                <ThemeToggle />
                            </div>
                        </TabsContent>

                        <TabsContent value="account" className="m-0 space-y-6 animate-in fade-in-50">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            id="name" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            className="max-w-[250px]" 
                                        />
                                        <Button 
                                            variant="outline" 
                                            onClick={handleUpdateName} 
                                            disabled={isSaving || !name || name === user?.name}
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="flex gap-2">
                                        <Input id="email" defaultValue={user?.email || ""} key={user?.email || "email"} readOnly className="max-w-[250px] bg-muted" />
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex flex-col gap-3">
                                    <Button 
                                        variant="outline" 
                                        className="w-fit justify-start"
                                        onClick={handleManageSubscription}
                                        disabled={isSubLoading}
                                    >
                                        <CreditCard className="size-4 mr-2" />
                                        {isSubLoading ? "Loading Portal..." : "Manage Subscription"}
                                    </Button>
                                    <Button variant="destructive" className="w-fit justify-start" onClick={handleSignOut}>
                                        <LogOut className="size-4 mr-2" />
                                        Sign out
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="notifications" className="m-0 space-y-6 animate-in fade-in-50">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border rounded-lg p-4">
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-semibold flex items-center">
                                            <Mail className="size-4 mr-2" />
                                            Course Updates
                                        </span>
                                        <span className="text-sm text-muted-foreground">Receive emails when new lessons are added.</span>
                                    </div>
                                    <Button 
                                        variant={courseUpdates ? "secondary" : "outline"} 
                                        size="sm"
                                        onClick={toggleCourseUpdates}
                                        disabled={isNotifLoading}
                                        className="w-24 transition-colors"
                                    >
                                        {courseUpdates ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between border rounded-lg p-4">
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-semibold flex items-center">
                                            <User className="size-4 mr-2" />
                                            Account Activity
                                        </span>
                                        <span className="text-sm text-muted-foreground">Receive alerts about your account security.</span>
                                    </div>
                                    <Button 
                                        variant={accountActivity ? "secondary" : "outline"} 
                                        size="sm"
                                        onClick={toggleAccountActivity}
                                        disabled={isNotifLoading}
                                        className="w-24 transition-colors"
                                    >
                                        {accountActivity ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
