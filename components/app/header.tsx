import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";

export default function Header() {

  return (
    <div className="bg-card shadow-md">
      <nav className="container mx-auto max-w-7xl px-4 py-6 md:px-6 flex justify-between items-center">
        <Link href='/' className="font-bold md:text-xl">Where in the world?</Link>
        <ThemeToggle />
      </nav>

    </div>
  )
}