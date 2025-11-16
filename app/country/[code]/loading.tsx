import { Loader2Icon } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl h-[400px]">
      <div className="h-full flex justify-center items-center gap-3">
        <Loader2Icon className="animate-spin w-6 h-6" />
        Loading country...
      </div>
    </div>
  )
}
