import { Suspense } from "react";
import CountryPage from "./country-page";

export default function Page(props: any) {
  return (
    <Suspense fallback="Cargando país...">
      <CountryPage {...props} />
    </Suspense>
  );
}