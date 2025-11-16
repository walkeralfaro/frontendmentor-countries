'use client'

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Countries } from "@/schemas"
import { Search } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export default function CountriesClient({ countries }: { countries: Countries }) {

  const [region, setRegion] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return countries
      .filter(country => {
        // 1. Región
        if (region !== "all" && country.region !== region) {
          return false
        }

        // 2. Búsqueda por nombre (prefix)
        if (search.trim() !== "") {
          const name = country.name.common.toLowerCase()
          const query = search.toLowerCase()
          return name.startsWith(query)
        }

        return true
      })
  }, [region, search, countries])

  return (
    <>
      {/* Filters */}
      <div className="container mx-auto max-w-7xl p-6 flex flex-col gap-10">

        <InputGroup className="h-12 rounded border-none bg-white">
          <InputGroupInput
            placeholder="Search for a country..."
            onChange={e => setSearch(e.target.value)}
          />
          <InputGroupAddon className="px-5 h-20"><Search /></InputGroupAddon>
        </InputGroup>

        <Select
          value={region}
          onValueChange={(value) => setRegion(value)}
        >
          <SelectTrigger className="border-none rounded min-h-12 w-[200px] bg-white">
            <SelectValue placeholder="Filter by Region" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Africa">Africa</SelectItem>
              <SelectItem value="Americas">Americas</SelectItem>
              <SelectItem value="Asia">Asia</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Oceania">Oceania</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>


      </div>

      {/* Cards */}
      <div className="container mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 place-items-center">
          {
            filtered.map((country) => (
              <Link href={`/country/${country.cca3}`} key={country.cca3}>
                <Card className={`justify-between border-none rounded-none py-8 pt-0 w-[260] h-[340]`}>
                  <img
                    src={country.flags.svg}
                    alt={country.flags.alt || `The flag from ${country.name.common}`}
                    className="max-h-[180px] h-auto w-auto object-contain"
                  />
                  <CardContent className="space-y-5">
                    <CardTitle className="text-2xl font-bold">
                      {country.name.common}
                    </CardTitle>

                    <div>
                      <p><span className="font-semibold">Population: </span>{country.population.toLocaleString('en-US')}</p>
                      <p><span className="font-semibold">Region: </span>{country.region}</p>
                      <p><span className="font-semibold">Capital: </span>{country.capital}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          }
        </div>
      </div>
    </>
  )
}