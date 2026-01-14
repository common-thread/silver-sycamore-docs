import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import Link from "next/link";

export default function DeliverablesPage() {
  return (
    <>
      <Breadcrumb />
      <ContentBox>
        <h1 className="text-2xl font-bold mb-4">Deliverables</h1>
        <p className="text-[#586069] mb-6">Projects and special deliverables.</p>

        <div className="grid gap-4">
          <Link
            href="/deliverables/recipe-app"
            className="block p-4 border border-[#e1e4e8] rounded-md hover:border-[#0366d6] no-underline bg-white"
          >
            <h3 className="font-semibold text-[#0366d6]">Recipe App</h3>
            <p className="text-sm text-[#586069] mt-1">
              Digital recipe management system for catering operations
            </p>
          </Link>
        </div>
      </ContentBox>
    </>
  );
}
