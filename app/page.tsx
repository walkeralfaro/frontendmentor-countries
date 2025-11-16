import { CountriesSchema } from "@/schemas"
import CountriesClient from "./countries-client"
import { notFound } from "next/navigation"

export default async function App() {
  'use cache'

  try {

    // 1) Petición con tipado generico y timeout
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,tld,currencies,languages,borders,cca3",
      {
        // cache estática por defecto ("force-cache" en producción)
        // next: { revalidate: false } — implícito
      }
    )

    if (!response.ok) {
      throw new Error("REST Countries API failed")
    }

    const json = await response.json()

    // 2) Validar con Zod
    const parsed = CountriesSchema.safeParse(json)

    if (!parsed.success) {
      console.error(parsed.error)
      throw new Error("Invalid REST API data")
    }

    // 3) Devolver el componente cliente con datos validados
    return <CountriesClient countries={parsed.data} />

  } catch (error) {
    console.error("API ERROR:", error)
    return notFound()
  }
}
