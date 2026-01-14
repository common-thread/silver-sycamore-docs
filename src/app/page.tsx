import { InitiativesTable } from "@/components/InitiativesTable";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ContentBox } from "@/components/ContentBox";

export default function Home() {
  return (
    <>
      <ContentBox>
        <h1 className="text-2xl font-bold mb-2">
          Silver Sycamore Document Library
        </h1>
        <p className="text-[#586069]">Internal documentation hub for staff.</p>
      </ContentBox>

      <ContentBox>
        <h2 className="text-xl font-semibold mb-4">Priority Initiatives</h2>
        <InitiativesTable />
      </ContentBox>

      <ContentBox>
        <h2 className="text-xl font-semibold mb-4">Browse Documents</h2>
        <CategoryGrid />
      </ContentBox>
    </>
  );
}
