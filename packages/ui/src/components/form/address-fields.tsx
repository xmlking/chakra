import { useFormContext } from "#components/form/context";

import { TextField } from "./text-field";

export function AddressFields() {
  const form = useFormContext(); // Access the parent form context

  return (
    <div>
      <h3>Address Information</h3>
      <form.Field name="address.street">
        {(_field) => <TextField label="Street" type="text" />}
      </form.Field>
      <form.Field name="address.city">
        {(_field) => <TextField label="City" type="text" />}
      </form.Field>
      {/* ... other address fields */}
    </div>
  );
}
