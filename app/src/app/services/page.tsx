import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { DocumentList } from "@/components/DocumentList";
import Link from "next/link";

const subcategories = [
  { slug: "wedding-packages", title: "Wedding Packages" },
  { slug: "event-packages", title: "Event Packages" },
  { slug: "catering", title: "Catering" },
  { slug: "add-ons", title: "Add-ons" },
];

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb />
      <ContentBox>
        <h1 className="text-2xl font-bold mb-4">Services</h1>
        <p className="text-[#586069] mb-6">
          Wedding packages, event packages, catering menus, and add-on services.
        </p>
        {subcategories.map((sub) => (
          <section key={sub.slug} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link
                href={`/services/${sub.slug}`}
                className="text-[#0366d6] hover:underline"
              >
                {sub.title}
              </Link>
            </h2>
            <DocumentList category="services" subcategory={sub.slug} />
          </section>
        ))}
      </ContentBox>
    </>
  );
}
