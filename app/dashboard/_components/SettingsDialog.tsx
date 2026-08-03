"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, LogOut, Mail, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const user = session?.user;

    const [activeTab, setActiveTab] = useState<"appearance" | "account" | "notifications">("appearance");
    const [prevTab, setPrevTab] = useState<"appearance" | "account" | "notifications">("appearance");

    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSubLoading, setIsSubLoading] = useState(false);

    const tabs = ["appearance", "account", "notifications"] as const;
    const tabIndex = tabs.indexOf(activeTab);

    const handleTabChange = (tab: typeof activeTab) => {
        setPrevTab(activeTab);
        setActiveTab(tab);
    };

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
        setCourseUpdates(newVal);
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
        setAccountActivity(newVal);
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
            <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-[550px] p-0 overflow-hidden">
                {/* Header */}
                <div className="px-4 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-bricolage">Settings</DialogTitle>
                        <DialogDescription className="text-sm font-bricolage">
                            Manage your dashboard preferences and account settings here.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="w-full">
                    {/* Tab bar — scrollable horizontally on tiny screens */}
                    <div className="px-4 sm:px-6 border-b overflow-x-auto">
                        <div className="flex gap-0 sm:gap-1 p-0 h-auto w-max min-w-full">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`relative px-3 sm:px-4 pb-3 pt-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap capitalize ${
                                        activeTab === tab
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground/70"
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="settings-tab-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Animated Tab Content */}
                    <div className="relative px-4 py-4 sm:px-6 sm:py-5 max-h-[65vh] overflow-y-auto overflow-x-hidden">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: tabs.indexOf(activeTab) > tabs.indexOf(prevTab) ? 24 : -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: tabs.indexOf(activeTab) > tabs.indexOf(prevTab) ? -24 : 24 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.32 }}
                            >
                                {/* Appearance Tab */}
                                {activeTab === "appearance" && (
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex flex-col space-y-1 min-w-0">
                                                <span className="font-semibold text-sm sm:text-base font-bricolage">Theme Preference</span>
                                                <span className="text-xs sm:text-sm text-muted-foreground">Customize the theme of the application.</span>
                                            </div>
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                )}

                                {/* Account Tab */}
                                {activeTab === "account" && (
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="settings-name" className="text-sm font-bricolage">Display Name</Label>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Input
                                                    id="settings-name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="flex-1"
                                                    placeholder="Your display name"
                                                />
                                                <Button
                                                    variant="outline"
                                                    onClick={handleUpdateName}
                                                    disabled={isSaving || !name || name === user?.name}
                                                    className="w-full sm:w-auto shrink-0"
                                                >
                                                    {isSaving ? "Saving..." : "Save"}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="settings-email" className="text-sm font-bricolage">Email Address</Label>
                                            <Input
                                                id="settings-email"
                                                defaultValue={user?.email || ""}
                                                key={user?.email || "email"}
                                                readOnly
                                                className="bg-muted w-full font-bricolage"
                                            />
                                        </div>
                                        <Separator />
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-fit justify-center sm:justify-start"
                                                onClick={handleManageSubscription}
                                                disabled={isSubLoading}
                                            >
                                                <CreditCard className="size-4 mr-2" />
                                                {isSubLoading ? "Loading Portal..." : "Manage Subscription"}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="w-full sm:w-fit justify-center sm:justify-start"
                                                onClick={handleSignOut}
                                            >
                                                <LogOut className="size-4 mr-2" />
                                                Sign out
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === "notifications" && (
                                    <div className="space-y-4">
                                        <div className="flex items-start sm:items-center justify-between gap-3 border rounded-xl p-4">
                                            <div className="flex flex-col space-y-1 min-w-0 flex-1">
                                                <span className="font-semibold text-sm flex items-center gap-2 font-bricolage">
                                                    <Mail className="size-4 shrink-0" />
                                                    Course Updates
                                                </span>
                                                <span className="text-xs text-muted-foreground">Receive emails when new lessons are added.</span>
                                            </div>
                                            <Button
                                                variant={courseUpdates ? "secondary" : "outline"}
                                                size="sm"
                                                onClick={toggleCourseUpdates}
                                                disabled={isNotifLoading}
                                                className="w-24 shrink-0 transition-colors"
                                            >
                                                {courseUpdates ? "Enabled" : "Disabled"}
                                            </Button>
                                        </div>
                                        <div className="flex items-start sm:items-center justify-between gap-3 border rounded-xl p-4">
                                            <div className="flex flex-col space-y-1 min-w-0 flex-1">
                                                <span className="font-semibold text-sm flex items-center gap-2 font-bricolage">
                                                    <User className="size-4 shrink-0" />
                                                    Account Activity
                                                </span>
                                                <span className="text-xs text-muted-foreground">Receive alerts about your account security.</span>
                                            </div>
                                            <Button
                                                variant={accountActivity ? "secondary" : "outline"}
                                                size="sm"
                                                onClick={toggleAccountActivity}
                                                disabled={isNotifLoading}
                                                className="w-24 shrink-0 transition-colors"
                                            >
                                                {accountActivity ? "Enabled" : "Disabled"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
