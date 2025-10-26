import {ReactNode} from "react";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";
import Logo from "@/app/src/assets/images/Logo.png"
import Image from "next/image";

export default function AuthLayout( { children } : { children: ReactNode } ) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link href='/' className={buttonVariants({
                variant: 'outline',
                className: 'absolute top-4 left-4'
            })}>
                <ArrowLeft className="size-4 font-mono" />
                Back
            </Link>

            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link className="flex items-center gap-2 self-center font-mono font-medium" href="/">
                    <Image src={Logo} alt="Logo" width={32} height={32} />
                    Only Students.
                </Link>
                {children}

                <div className="text-balance text-center text-xs text-muted-foreground font-serif font-medium">
                    By clicking continue, you agree to our <span className="hover:text-primary hover:underline text-primary">Terms of service</span> and <span className="hover:text-primary hover:underline text-primary">Privacy Policy</span>.
                </div>
            </div>
        </div>
    );
}