import { ThemeToggle } from "../theme/theme-toggle";

export default function Header() {

  return (
    <div className="bg-card shadow-md">
      <nav className="container mx-auto max-w-6xl px-4 py-6 md:px-6 flex justify-between items-center">
        <p className="font-bold">Where in the world?</p>
        <ThemeToggle />
      </nav>

    </div>
  )
}