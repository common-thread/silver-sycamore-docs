export function ContentBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e1e4e8] rounded-md p-6 mb-6">
      {children}
    </div>
  );
}
