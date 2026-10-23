import { CountriesSchema } from "@/schemas"
import CountriesClient from "./countries-client"
import { notFound } from "next/navigation"
import countriesData from "@/data.json"

export default async function App() {
  'use cache'

  // 1) Normalizar el shape de data.json (v2) al modelo que consume la UI (v3.1)
  const normalized = countriesData.map((country) => ({
    name: { common: country.name },
    flags: {
      svg: country.flags.svg,
      alt: `The flag of ${country.name}`,
    },
    population: country.population,
    region: country.region,
    capital: country.capital ? [country.capital] : undefined,
    cca3: country.alpha3Code,
  }))

  // 2) Validar con Zod
  const parsed = CountriesSchema.safeParse(normalized)

  if (!parsed.success) {
    console.error(parsed.error)
    notFound()
  }

  // 3) Devolver el componente cliente con datos validados
  return <CountriesClient countries={parsed.data} />
}
