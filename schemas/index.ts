import { z } from "zod";

export const CountrySchema = z.object({
  flags: z.object({
    svg: z.url(),
    png: z.url(),
    alt: z.string()
  }),
  name: z.object({
    common: z.string(),
  }),
  tld: z.array(z.string()),
  cca3: z.string(),
  currencies: z.record(
    z.string(),
    z.object({
      name: z.string(),
      symbol: z.string().optional(),
    })
  ),
  capital: z.array(z.string()).optional(),
  region: z.string(),
  languages: z.record(
    z.string(), z.string()
  ),
  borders: z.array(z.string()).optional(),
  population: z.number(),
});

export const CountriesSchema = z.array(CountrySchema)

export type Country = z.infer<typeof CountrySchema>
export type Countries = z.infer<typeof CountriesSchema>