import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { DocumentList } from "@/components/DocumentList";
import Link from "next/link";

const subcategories = [
  { slug: "booking", title: "Booking" },
  { slug: "planning", title: "Planning" },
  { slug: "day-of", title: "Day Of" },
  { slug: "layouts", title: "Layouts" },
];

export default function ClientsPage() {
  return (
    <>
      <Breadcrumb />
      <ContentBox>
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <p className="text-[#586069] mb-6">
          Booking forms, planning checklists, day-of documents, and room
          layouts.
        </p>
        {subcategories.map((sub) => (
          <section key={sub.slug} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link
                href={`/clients/${sub.slug}`}
                className="text-[#0366d6] hover:underline"
              >
                {sub.title}
              </Link>
            </h2>
            <DocumentList category="clients" subcategory={sub.slug} />
          </section>
        ))}
      </ContentBox>
    </>
  );
}
