import { Earth } from 'lucide-react'
 
export default function NotFound() {
  return (
    <div className="container mx-auto max-w-6xl h-[400px]">
      <div className="h-full flex justify-center items-center gap-3">
        <Earth className="animate-pulse w-6 h-6" />
        404 - Page Not Found
      </div>
    </div>
  )
}
