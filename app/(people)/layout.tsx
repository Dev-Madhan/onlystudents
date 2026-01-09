import { ReactNode } from "react";
import Navbar from "@/app/(people)/_components/Navbar";
import FooterSection from "@/components/tailark/footer";

export default function LayoutPublic({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
