"use generative";

import { defineToolkit } from "@assistant-ui/react";
import { z } from "zod";

// oxlint-disable-next-line import/no-default-export react/only-export-components
export default defineToolkit({
  get_weather: {
    description: "Get current weather for a location.",
    parameters: z.object({
      location: z.string().describe("City name or zip code"),
      unit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
    }),
    execute: async ({ location, unit }) => {
      // "use client"; // marks this as a frontend tool
      return fetchWeatherAPI(location, unit);
    },
    render: ({ args, result }) => {
      if (!result) return <div>Fetching weather for {args.location}…</div>;
      return (
        <div className="weather-card">
          <h3>{args.location}</h3>
          <p>
            {result.temperature}° {args.unit}
          </p>
          <p>{result.conditions}</p>
        </div>
      );
    },
  },
});

function fetchWeatherAPI(city: string, unit: "celsius" | "fahrenheit" | undefined) {
  console.log({ city, unit });
  return {
    temperature: 25,
    conditions: "Sunny",
  };
}
