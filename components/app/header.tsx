import { ThemeToggle } from "../theme/theme-toggle";

export default function Header() {

  return (
    <div className="bg-card shadow">
      <nav className="container mx-auto max-w-7xl p-4 md:px-6 flex justify-between items-center">
        <p className="font-bold">Where in the world?</p>
        <ThemeToggle />
      </nav>

    </div>
  )
}