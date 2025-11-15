import { Button } from "@/components/ui/button"
import { Country, CountrySchema } from "@/schemas"
import axios from "axios"
import { ArrowLeftIcon } from "lucide-react"
import { notFound } from "next/navigation"

const getCountryDetails = async (code: string) => {

  try {

    const response = await axios.get<Country>(`https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,population,region,subregion,capital,tld,currencies,languages,borders`)

    const parsed = CountrySchema.safeParse(response.data)

    if (!parsed.success) {
      throw new Error('Error API: ', parsed.error)
    }

    return parsed.data

  } catch (error) {
    console.error(error)
    return notFound()

  }
}

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params


  const country = await getCountryDetails(code)
  console.log(country)

  if (!country) {

  }

  return (
    <>

      <Button><ArrowLeftIcon /> Back </Button>

      <img
        src={country.flags.svg}
        alt={country.flags.alt || `The flag from ${country.name.common}`}
        className="max-w-[320px] h-auto w-auto object-contain"
      />

      <div>
        <div>
          <h1>{country.name.common}</h1>

        </div>

        <div>

        </div>

      </div>





    </>
  )
}
