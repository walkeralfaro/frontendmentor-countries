import { Button } from "@/components/ui/button"
import { BorderCountriesSchema, CountrySchema } from "@/schemas"
import axios from "axios"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const getCountryDetails = async (code: string) => {
  try {
    // 1) Primera petición (detalles del país)
    const response = await axios.get(
      `https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,population,region,subregion,capital,tld,currencies,languages,borders`
    )

    const parsedCountry = CountrySchema.safeParse(response.data)
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

    // 3) Petición de países fronterizos
    const codes = borders.join(",")
    const bordersUrl = `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name,cca3`

    const bordersRes = await axios.get(bordersUrl)

    // 4) Transformar y validar
    const formatted = bordersRes.data.map((c: any) => ({
      name: c.name.common,
      code: c.cca3
    }))

    const parsedBorders = BorderCountriesSchema.safeParse(formatted)
    if (!parsedBorders.success) {
      console.error(parsedBorders.error)
      return notFound()
    }

    return {
      country,
      borderCountries: parsedBorders.data
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
      {/* <Button><ArrowLeftIcon /> Back </Button> */}

      <div className="container mx-auto max-w-7xl p-8 flex flex-col items-center space-y-14">

        <div className="w-full flex ">
          <Link href="/" className="flex justify-between px-5 py-2 bg-card shadow-xl/20 items-center gap-2 w-[100] ">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
        </div>

        <img
          src={country.flags.svg}
          alt={country.flags.alt || `The flag from ${country.name.common}`}
          className="max-w-[320px] h-auto w-auto object-contain"
        />

        <div className="space-y-10">
          <div>
            <h1 className="text-3xl font-bold">{country.name.common}</h1>
          </div>

          <div className="space-y-3">
            <p><span className="font-semibold">Native Name: </span>{Object.values(country.name.nativeName)[0].official}</p>
            <p><span className="font-semibold">Population: </span>{country.population.toLocaleString('en-US')}</p>
            <p><span className="font-semibold">Region: </span>{country.region}</p>
            <p><span className="font-semibold">Region: </span>{country.subregion}</p>
            <p><span className="font-semibold">Capital: </span>{country.capital}</p>
          </div>

          <div className="space-y-3">
            <p><span className="font-semibold">Top Level Domain:</span>{country.tld[0]}</p>
            <p><span className="font-semibold">Currencies: </span>{Object.values(country.currencies).map(c => c.name).join(', ')}</p>
            <p><span className="font-semibold">Languages: </span>{Object.values(country.languages).map(l => l).join(', ')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-5">Border Countries:</h2>

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






    </>
  )
}
