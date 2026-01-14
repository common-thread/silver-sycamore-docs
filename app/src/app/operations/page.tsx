import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { DocumentList } from "@/components/DocumentList";
import Link from "next/link";

const subcategories = [
  { slug: "forms", title: "Forms" },
  { slug: "bar", title: "Bar" },
  { slug: "catering", title: "Catering" },
  { slug: "facilities", title: "Facilities" },
];

export default function OperationsPage() {
  return (
    <>
      <Breadcrumb />
      <ContentBox>
        <h1 className="text-2xl font-bold mb-4">Operations</h1>
        <p className="text-[#586069] mb-6">
          Appointment forms, bar tracking, catering operations, and facilities
          management.
        </p>
        {subcategories.map((sub) => (
          <section key={sub.slug} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link
                href={`/operations/${sub.slug}`}
                className="text-[#0366d6] hover:underline"
              >
                {sub.title}
              </Link>
            </h2>
            <DocumentList category="operations" subcategory={sub.slug} />
          </section>
        ))}
      </ContentBox>
    </>
  );
}
