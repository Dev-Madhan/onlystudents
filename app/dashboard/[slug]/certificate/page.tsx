import { getCertificateData } from "@/app/data/course/get-certificate-data";
import { CertificatePage } from "./_components/CertificatePage";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return {
    title: `Certificate of Completion — ${slug}`,
    description: "Your certificate of completion for this course.",
  };
}

export default async function CertificateRoute({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<CertificatePageSkeleton />}>
      <CertificateLoader slug={slug} />
    </Suspense>
  );
}

async function CertificateLoader({ slug }: { slug: string }) {
  const data = await getCertificateData(slug);
  return <CertificatePage data={data} />;
}

function CertificatePageSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="w-full max-w-2xl h-72 rounded-2xl" />
      <Skeleton className="h-10 w-48" />
    </div>
  );
}
