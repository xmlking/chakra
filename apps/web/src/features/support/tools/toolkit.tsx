"use generative";

import { defineToolkit } from "@assistant-ui/react";
import { z } from "zod";

import { WeatherCard } from "../ui/weather-card";

// oxlint-disable-next-line import/no-default-export react/only-export-components
export default defineToolkit({
  get_weather: {
    description: "Get the current weather for a city.",
    parameters: z.object({ city: z.string() }),
    execute: async ({ city }) => fetchWeather(city), // server-only
    render: ({ args, result }) => <WeatherCard args={args} result={result} />, // client-only
  },
});

function fetchWeather(city: string) {
  console.log({ city });
  return `${city} sunny`;
}
