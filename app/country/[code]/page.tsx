import { Suspense } from "react";
import CountryPage from "./country-page";
import Loading from "./loading";

export default function Page(props: any) {
  return (
    <Suspense fallback={<Loading/>} >
      <CountryPage {...props} />
    </Suspense>
  );
}