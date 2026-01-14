import Link from "next/link";

const categories = [
  {
    slug: "services",
    name: "Services",
    desc: "Wedding packages, event packages, catering menus",
  },
  {
    slug: "clients",
    name: "Clients",
    desc: "Booking forms, planning checklists, room layouts",
  },
  {
    slug: "staff",
    name: "Staff",
    desc: "Training programs, procedures, HR forms",
  },
  {
    slug: "operations",
    name: "Operations",
    desc: "Appointment forms, bar tracking, facilities",
  },
  {
    slug: "deliverables",
    name: "Deliverables",
    desc: "Recipe app and other projects",
  },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/${c.slug}`}
          className="block p-4 border border-[#e1e4e8] rounded-md hover:border-[#0366d6] no-underline bg-white"
        >
          <h3 className="font-semibold text-[#0366d6]">{c.name}</h3>
          <p className="text-sm text-[#586069] mt-1">{c.desc}</p>
        </Link>
      ))}
    </div>
  );
}
