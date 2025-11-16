import { MapPinX } from "lucide-react";

export default function NotFoundCountry() {
  return (
    <div className="container mx-auto max-w-6xl h-[400px]">
      <div className="h-full flex justify-center items-center gap-3">
        <MapPinX className="animate-bounce w-6 h-6" />
        Country Not Found
      </div>
    </div>
  )
}
