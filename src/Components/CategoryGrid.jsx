
import {
  BookOpen,
  PlaySquare,
  ClipboardList,
  Layers3,
  Flower2,
  FileText,
  BadgePercent,
  Tag,
} from "lucide-react";

const categories = [
  { name: "Digital Books", icon: BookOpen, color: "gold", href: "#products" },
  { name: "Online Courses", icon: PlaySquare, color: "blue", href: "#courses" },
  { name: "MPSC Study Material", icon: ClipboardList, color: "pink", href: "#mpsc" },
  { name: "Combo Packs", icon: Layers3, color: "blue", href: "#offers" },
  { name: "Spiritual Books", icon: Flower2, color: "teal", href: "#products" },
  { name: "E-Books", icon: FileText, color: "blue", href: "#products" },
  { name: "New Arrivals", icon: BadgePercent, color: "purple", href: "#products" },
  { name: "Offers", icon: Tag, color: "gold", href: "#offers" },
];

export default function CategoryGrid() {
  return (
    <section className="category-section container" aria-label="Shop by category">
      {categories.map(({ name, icon: Icon, color, href }) => (
        <a className="category-item" href={href} key={name}>
          <span className={`category-icon ${color}`}>
            <Icon size={23} strokeWidth={2.2} />
          </span>
          <span>{name}</span>
        </a>
      ))}
    </section>
  );
}
