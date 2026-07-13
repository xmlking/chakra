"use client";

import { CloudSun } from "lucide-react";

export const WeatherCard = ({ args, result }: { args: { city: string }; result: any }) => {
  console.log({ args, result });
  return <CloudSun className="size-4" />;
};
