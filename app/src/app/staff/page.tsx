import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { DocumentList } from "@/components/DocumentList";
import Link from "next/link";

const subcategories = [
  { slug: "training", title: "Training" },
  { slug: "procedures", title: "Procedures" },
  { slug: "hr", title: "HR" },
];

export default function StaffPage() {
  return (
    <>
      <Breadcrumb />
      <ContentBox>
        <h1 className="text-2xl font-bold mb-4">Staff</h1>
        <p className="text-[#586069] mb-6">
          Training programs, procedures, and HR forms.
        </p>
        {subcategories.map((sub) => (
          <section key={sub.slug} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link
                href={`/staff/${sub.slug}`}
                className="text-[#0366d6] hover:underline"
              >
                {sub.title}
              </Link>
            </h2>
            <DocumentList category="staff" subcategory={sub.slug} />
          </section>
        ))}
      </ContentBox>
    </>
  );
}
