import { BorderCountriesSchema, CountrySchema } from "@/schemas"
import countriesData from "@/data.json"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Índice por código alpha-3 para buscar sin recorrer el array completo
const countriesByCode = new Map(
  countriesData.map((country) => [country.alpha3Code.toUpperCase(), country])
)

// Convierte el shape v2 de data.json al modelo v3.1 que consume la UI
const normalizeCountry = (raw: (typeof countriesData)[number]) => {
  const nativeKey =
    raw.languages[0]?.iso639_1 ??
    raw.languages[0]?.iso639_2 ??
    "native"

  return {
    flags: {
      svg: raw.flags.svg,
      alt: `The flag of ${raw.name}`,
    },
    name: {
      common: raw.name,
      nativeName: {
        [nativeKey]: {
          official: raw.nativeName,
          common: raw.nativeName,
        },
      },
    },
    tld: raw.topLevelDomain,
    currencies: Object.fromEntries(
      (raw.currencies ?? []).map((currency) => [
        currency.code,
        { name: currency.name, symbol: currency.symbol },
      ])
    ),
    capital: raw.capital ? [raw.capital] : undefined,
    region: raw.region,
    subregion: raw.subregion,
    languages: Object.fromEntries(
      raw.languages.map((language) => [
        language.iso639_1 ?? language.iso639_2 ?? language.name,
        language.name,
      ])
    ),
    borders: raw.borders,
    population: raw.population,
  }
}

export const getCountryDetails = async (code: string) => {
  'use cache'

  if (!code) notFound()

  const normalizedCode = code.trim().toUpperCase()

  // -------------------------------
  // 1) País principal desde data.json
  // -------------------------------
  const rawCountry = countriesByCode.get(normalizedCode)

  if (!rawCountry) notFound()

  const parsedCountry = CountrySchema.safeParse(normalizeCountry(rawCountry))

  if (!parsedCountry.success) {
    console.error(parsedCountry.error)
    notFound()
  }

  const country = parsedCountry.data

  // -------------------------------
  // 2) Fronterizos desde data.json
  // -------------------------------
  const formattedBorders = (country.borders ?? []).map((border) => ({
    code: border,
    name: countriesByCode.get(border.toUpperCase())?.name ?? border,
  }))

  const parsedBorders = BorderCountriesSchema.safeParse(formattedBorders)

  if (!parsedBorders.success) {
    console.error(parsedBorders.error)
    notFound()
  }

  // -------------------------------
  // 3) Resultado final
  // -------------------------------
  return {
    country,
    borderCountries: parsedBorders.data,
  }
}

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const { country, borderCountries } = await getCountryDetails(code)
  const borderMap = Object.fromEntries(borderCountries.map(c => [c.code, c.name]))

  return (
    <>
      <div className="container mx-auto max-w-7xl p-8 flex justify-center md:pt-18">

        <div className="space-y-14 md:w-full">

          <Link href="/" className="flex justify-between px-5 py-2 bg-card shadow-xl/20 items-center gap-2 w-[100] ">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>

          <div className="space-y-14 md:flex justify-between items-start">
            <img
              src={country.flags.svg}
              alt={country.flags.alt || `The flag from ${country.name.common}`}
              className="w-[320px] h-auto object-contain md:w-[580px] md:max-h-[400px]"
            />

            <div className="w-[320] space-y-10 md:w-[540]">
              <div>
                <h1 className="text-3xl font-bold">{country.name.common}</h1>
              </div>

              <div className="space-y-10 md:flex md:justify-between md:mb-0 md:gap-10">
                <div className="space-y-3 ">
                  <p><span className="font-semibold">Native Name: </span>{Object.values(country.name.nativeName)[0].official}</p>
                  <p><span className="font-semibold">Population: </span>{country.population.toLocaleString('en-US')}</p>
                  <p><span className="font-semibold">Region: </span>{country.region}</p>
                  <p><span className="font-semibold">Region: </span>{country.subregion}</p>
                  <p><span className="font-semibold">Capital: </span>{country.capital?.join(", ")}</p>
                </div>

                <div className="space-y-3 ">
                  <p><span className="font-semibold">Top Level Domain: </span>{country.tld[0]}</p>
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
