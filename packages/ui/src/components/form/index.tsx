import { createFormHook } from "@tanstack/react-form";

import { CheckboxField } from "./checkbox-field";
import { CheckboxGroupField } from "./checkbox-group-field";
import { fieldContext, formContext } from "./context";
import { CreatableMultiSelectField } from "./creatable-multi-select-field";
import { DateField } from "./date-field";
import { DateTimeField } from "./date-time-field";
// import { DateTimeField } from "./date-time-field-shadcn";
import { FileUploadField } from "./file-upload-field";
import { FileUploadField2 } from "./file-upload-field2";
import { FormErrors } from "./form-errors";
import { FormWrapper } from "./form-wrapper";
import { GeoPointField } from "./geo-point-field";
import { HiddenField } from "./hidden-field";
import { JSONField } from "./json-field";
import { MultiSelectField } from "./multi-select-field";
import { MultiSelectProField } from "./multi-select-pro-field";
import { NumberField } from "./number-field";
import { OTPField } from "./otp-field";
import { PasswordField } from "./password-field";
import { RadioCardField, RadioGroupField } from "./radio-group-field";
import { RatingField } from "./rating-field";
import { ResetButton } from "./reset-button";
import { RichEditorField } from "./rich-editor-field";
import { SegmentedControlField } from "./segmented-control-field";
import { SelectField } from "./select-field";
import { SingleSelectField } from "./single-select-field";
import { SliderField } from "./slider-field";
import { SubmitButton } from "./submit-button";
import { SwitchField } from "./switch-field";
import { TagField } from "./tag-field";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { ToggleGroupField } from "./toggle-group-field";

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
    NumberField,
    SliderField,
    HiddenField,
    TextareaField,
    SelectField,
    TagField,
    MultiSelectField,
    SingleSelectField,
    MultiSelectProField,
    CreatableMultiSelectField,
    CheckboxField,
    SwitchField,
    RatingField,
    ToggleGroupField,
    DateField,
    DateTimeField,
    OTPField,
    CheckboxGroupField,
    FileUploadField,
    FileUploadField2,
    GeoPointField,
    JSONField,
    RadioGroupField,
    RadioCardField,
    SegmentedControlField,
    RichEditorField,
  },
  formComponents: {
    SubmitButton,
    ResetButton,
    FormWrapper,
    FormErrors,
  },
  fieldContext,
  formContext,
});

export { useAppForm, withFieldGroup, withForm };
