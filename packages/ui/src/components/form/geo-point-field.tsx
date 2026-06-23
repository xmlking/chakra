/**
 * Source: https://github.com/VivienSSS/ocampoapartments/blob/master/src/components/ui/forms/fields/geo-point.tsx
 */

import { Field } from "#components/shadcn/field";
import { Input } from "#components/shadcn/input";

import { useFieldContext } from "./context";

type GeoPoint = { lat: number; lng: number };

export function GeoPointField() {
  const field = useFieldContext<GeoPoint>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <div className="flex gap-2">
        <Input
          onChange={(e) => {
            const lat = Number.parseFloat(e.target.value);
            if (!Number.isNaN(lat)) {
              field.handleChange({
                lat,
                lng: field.state.value?.lng ?? 0,
              });
            }
          }}
          placeholder="Latitude"
          step="0.00001"
          type="number"
          value={field.state.value?.lat ?? ""}
        />
        <Input
          onChange={(e) => {
            const lng = Number.parseFloat(e.target.value);
            if (!Number.isNaN(lng)) {
              field.handleChange({
                lat: field.state.value?.lat ?? 0,
                lng,
              });
            }
          }}
          placeholder="Longitude"
          step="0.00001"
          type="number"
          value={field.state.value?.lng ?? ""}
        />
      </div>
    </Field>
  );
}
