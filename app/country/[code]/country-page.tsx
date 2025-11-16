import { BorderCountriesSchema, CountrySchema } from "@/schemas"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const getCountryDetails = async (code: string) => {
  'use cache'

  try {
    // 1) Primera petición — detalles del país
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,population,region,subregion,capital,tld,currencies,languages,borders`,
      { cache: "force-cache" } // SSG total
    )

    if (!res.ok) return notFound()

    const data = await res.json()

    const parsedCountry = CountrySchema.safeParse(data)
    if (!parsedCountry.success) {
      console.error(parsedCountry.error)
      return notFound()
    }

    const country = parsedCountry.data
    const borders = country.borders ?? []

    // 2) Si no tiene fronteras → devolver solo country
    if (borders.length === 0) {
      return { country, borderCountries: [] }
    }

    // 3) Obtener países fronterizos
    const codes = borders.join(",")
    const bordersRes = await fetch(
      `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name,cca3`,
      { cache: "force-cache" }
    )

    if (!bordersRes.ok) return notFound()

    const bordersData = await bordersRes.json()

    // 4) Transformar y validar
    const formatted = bordersData.map((c: any) => ({
      name: c.name.common,
      code: c.cca3,
    }))

    const parsedBorders = BorderCountriesSchema.safeParse(formatted)
    if (!parsedBorders.success) {
      console.error(parsedBorders.error)
      return notFound()
    }

    return {
      country,
      borderCountries: parsedBorders.data,
    }
  } catch (error) {
    console.error(error)
    return notFound()
  }
}


export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const { country, borderCountries } = await getCountryDetails(code)
  const borderMap = Object.fromEntries(borderCountries.map(c => [c.code, c.name]))

  return (
    <>
      <div className="container mx-auto max-w-6xl p-8 flex justify-center md:pt-18">

        <div className="space-y-14 md:w-full">

          <div className="w-full flex">
            <Link href="/" className="flex justify-between px-5 py-2 bg-card shadow-xl/20 items-center gap-2 w-[100] ">
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Link>
          </div>

          <div className="space-y-14 md:flex justify-between items-start">
            <img
              src={country.flags.svg}
              alt={country.flags.alt || `The flag from ${country.name.common}`}
              className="max-w-[320px] h-auto w-auto object-contain md:max-w-[500px]"
            />

            <div className="space-y-10 md:w-[480]">
              <div>
                <h1 className="text-3xl font-bold">{country.name.common}</h1>
              </div>

              <div className="space-y-10 md:flex md:justify-between md:mb-0">
                <div className="space-y-3 max-w-[250]">
                  <p><span className="font-semibold">Native Name: </span>{Object.values(country.name.nativeName)[0].official}</p>
                  <p><span className="font-semibold">Population: </span>{country.population.toLocaleString('en-US')}</p>
                  <p><span className="font-semibold">Region: </span>{country.region}</p>
                  <p><span className="font-semibold">Region: </span>{country.subregion}</p>
                  <p><span className="font-semibold">Capital: </span>{country.capital}</p>
                </div>

                <div className="space-y-3 max-w-[250]">
                  <p><span className="font-semibold">Top Level Domain:</span>{country.tld[0]}</p>
                  <p><span className="font-semibold">Currencies: </span>{Object.values(country.currencies).map(c => c.name).join(', ')}</p>
                  <p><span className="font-semibold">Languages: </span>{Object.values(country.languages).map(l => l).join(', ')}</p>
                </div>

              </div>


              <div className="md:w-full">
                <h2 className="text-xl font-semibold mb-5 md:text-base">Border Countries:</h2>

                <div className="flex flex-wrap gap-3">

                  {country.borders?.map(border => (
                    <Link
                      href={`/country/${border}`}
                      key={border}
                      className="bg-card px-5 py-1 shadow-xl/20"
                    >
                      {borderMap[border] ?? border}
                    </Link>
                  ))}

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>






    </>
  )
}
