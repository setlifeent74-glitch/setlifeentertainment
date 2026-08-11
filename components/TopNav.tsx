import NavLink from "./NavLink";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/issues", label: "Issues" },
  { href: "/about", label: "About" },
  { href: "/submit", label: "Submit a Story" },
  { href: "/contact", label: "Contact" },
];

export default function TopNav({ active }: { active: string }) {
  return (
    <nav className="top-nav">
      {LINKS.map((link) => (
        <NavLink key={link.href} href={link.href} active={link.href === active}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
