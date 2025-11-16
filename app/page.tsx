// app/page.tsx
import { CountriesSchema } from "@/schemas"
import CountriesClient from "./countries-client"
import axios from "axios"
import { notFound } from "next/navigation"

// TEMPORAL
import { countriesData } from "@/countries"

export default async function App() {
  'use cache'

  try {
    // const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,tld,currencies,languages,borders,cca3")
    const response = countriesData

    // Validar con Zod
    // const parsed = CountriesSchema.safeParse(response.data)
    const parsed = CountriesSchema.safeParse(response)

    if (!parsed.success) {
      throw new Error( 'REST API error:', parsed.error)
      // console.error("REST API error:", parsed.error)
      // return notFound()
    }

    return <CountriesClient countries={parsed.data} />
    
  } catch (error) {
    console.error("PROBLEMS!:", error)
    return notFound()
  }
}
