import { createStart } from "@tanstack/react-start";

import {
  evlogErrorAdapter,
  taggedErrorAdapter,
  zodErrorAdapter,
} from "#lib/serialization-adapters";

export const startInstance = createStart(() => ({
  // defaultSsr: false,
  // requestMiddleware: [csrfMiddleware, errorMiddleware],
  // functionMiddleware: [zodCapture, cors],
  serializationAdapters: [taggedErrorAdapter, evlogErrorAdapter, zodErrorAdapter],
}));
