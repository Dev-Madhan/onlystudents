import React from "react";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Renders JSON-LD structured data in the document head.
 * Supports Organization, WebSite, Course, BreadcrumbList, and any custom schema.
 *
 * @example
 * <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", ... }} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization schema for the root layout */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Only Students",
        url: "https://only-student.vercel.app",
        logo: "https://only-student.vercel.app/logo.png",
        description:
          "A professional LMS platform for learning new skills through expert-led courses.",
        sameAs: [],
      }}
    />
  );
}

/** WebSite schema with SearchAction for sitelinks search box */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Only Students",
        url: "https://only-student.vercel.app",
        description:
          "Transform your educational journey with expert-led, interactive online courses.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://only-student.vercel.app/courses?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

/**
 * Course schema for individual course pages.
 * Generates Google-rich-results-eligible structured data.
 */
export function CourseJsonLd({
  title,
  description,
  thumbnailUrl,
  slug,
  category,
  level,
  duration,
  price,
  totalLessons,
}: {
  title: string;
  description: string;
  thumbnailUrl: string;
  slug: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  totalLessons: number;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name: title,
        description: description,
        url: `https://only-student.vercel.app/courses/${slug}`,
        image: thumbnailUrl,
        provider: {
          "@type": "Organization",
          name: "Only Students",
          url: "https://only-student.vercel.app",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: `PT${duration}H`,
        },
        educationalLevel: level,
        about: category,
        numberOfCredits: totalLessons,
        offers: {
          "@type": "Offer",
          price: price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `https://only-student.vercel.app/courses/${slug}`,
        },
      }}
    />
  );
}

/** Breadcrumb schema for structured navigation */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
