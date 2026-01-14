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
          className="block p-5 rounded no-underline transition-all duration-150"
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h3
            className="font-semibold mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-ink)",
              fontSize: "1.1rem",
            }}
          >
            {c.name}
          </h3>
          <p
            className="text-sm m-0"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {c.desc}
          </p>
        </Link>
      ))}
    </div>
  );
}
