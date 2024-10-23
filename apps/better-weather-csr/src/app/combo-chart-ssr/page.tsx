import ComboChartPageComponent from "@/components/ComboChartPageComponent";
import { FC } from "react";

// Page component
const Page: FC<{ searchParams: any }> = ({ searchParams }) => {
  console.log(searchParams);
  return <ComboChartPageComponent searchParams={searchParams} />;
};

// Ensure `searchParams` are passed in
export async function generateStaticParams() {
  return [{ searchParams: {} }];
}

export default Page;
