import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/simulate-error")({
  component() {
    const [shouldError, setShouldError] = useState(false);

    return (
      <div className="section">
        <div className="name-container">
          <div className="inner">
            {shouldError && <ThrowSyntheticError />}
            <button
              type="button"
              className="title simulate-error"
              onClick={() => setShouldError(true)}
            >
              <h1>Error Test</h1>
              <h2>click to simulate error</h2>
            </button>
          </div>
        </div>
      </div>
    );
  },
});

function ThrowSyntheticError() {
  useEffect(() => {
    throw new SyntheticError();
  }, []);
  return null;
}

class SyntheticError extends Error {
  constructor(_message?: string, _options?: ErrorOptions) {
    super("Synthetic error");
    this.name = "SyntheticError";
  }
}
