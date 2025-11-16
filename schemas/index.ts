import { z } from "zod";

// Countries from main page
export const CountryResumeSchema = z.object({
  flags: z.object({
    svg: z.url(),
    alt: z.string()
  }),
  name: z.object({
    common: z.string(),
  }),
  region: z.string(),
  capital: z.array(z.string()).optional(),
  cca3: z.string(),
  population: z.number(),
});

export const CountriesSchema = z.array(CountryResumeSchema)

export type CountryResume = z.infer<typeof CountryResumeSchema>
export type Countries = z.infer<typeof CountriesSchema>

// Country card
export const CountrySchema = z.object({
  flags: z.object({
    svg: z.url(),
    alt: z.string()
  }),
  name: z.object({
    common: z.string(),
    nativeName: z.record(
      z.string(),
      z.object({
        official: z.string(),
        common: z.string()
      })
    )
  }),
  tld: z.array(z.string()),
  currencies: z.record(
    z.string(),
    z.object({
      name: z.string(),
      symbol: z.string().optional(),
    })
  ),
  capital: z.array(z.string()).optional(),
  region: z.string(),
  subregion: z.string(),
  languages: z.record(
    z.string(), z.string()
  ),
  borders: z.array(z.string()).optional(),
  population: z.number(),
});

export type Country = z.infer<typeof CountrySchema>


// Border Countries
export const BorderCountrySchema = z.object({
  name: z.string(),
  code: z.string(),
});

export const BorderCountriesSchema = z.array(BorderCountrySchema);

export type BorderCountry = z.infer<typeof BorderCountrySchema>;
export type BorderCountries = z.infer<typeof BorderCountriesSchema>;