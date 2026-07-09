"use client";

/**
 * Ref: https://github.com/Pixelated21/actify-nextjs/blob/master/src/app/auth/_components/login-card.tsx
 * Ref: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/main/src/features/users/components/user-form-sheet.tsx
 * Shadcn Radio Group Examples: https://shadcnstudio.com/docs/components/radio-group
 */

import { useMutation } from "@tanstack/react-query";
import { useAppForm } from "@workspace/ui/components/form/index";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ButtonGroup } from "@workspace/ui/components/shadcn/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@workspace/ui/components/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/shadcn/input-group";
import { SelectItem } from "@workspace/ui/components/shadcn/select";
import { addDays, addYears } from "date-fns";
import { Check, XIcon } from "lucide-react";
import { m } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";

import { applyZodIssues, parseZodIssues } from "#lib/zod-error-handler";

import { createProjectMutationOptions } from "./api/mutations";
import { addons, PROJECT_STATUSES, projectSchema } from "./schema";
import { frameworksList, planOptions, positionOptions, techOptions } from "./test-data";

type FormData = z.infer<typeof projectSchema>;

// oxlint-disable-next-line react-doctor/no-giant-component
export function FormPage() {
  const form = useAppForm({
    // HINT: Do not include optional fields in defaultValues
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "password",
      email: "",
      rating: 3,
      citizen: false,
      age: 143,
      description: "",
      position: [],
      frameworks: ["react", "vue", "svelte"],
      techStack: [{ label: "nextjs", value: "nextjs" }],
      users: [{ email: "" }],
      plan: "",
      period: {
        from: addDays(new Date(), -1),
        to: addYears(new Date(), 1),
      },
      otp: "432123",
      addons: [],
      status: "draft",
      notifications: {
        email: false,
        sms: false,
        push: false,
      },
      tags: ["sumo"],
      termsAccepted: false,
      files: undefined,
    } satisfies FormData as FormData,
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: ({ value }) => {
      createAction.mutate({ data: value });
    },
  });

  const createAction = useMutation({
    ...createProjectMutationOptions(),
    onSuccess: async (data) => {
      console.debug("Create project response:", data);

      form.reset();
      toast.success("Project created successfully!", {
        description: JSON.stringify(data, null, 2),
        className: "whitespace-pre-wrap font-mono",
      });
      // const queryClient = useQueryClient();
      // await queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
    onError: (error: Error) => {
      console.log(error);

      const issues = parseZodIssues(error.message);
      if (issues) {
        applyZodIssues(form, issues);
        toast.error("Please fix the validation errors");
        return;
      }

      toast.error(error.message);
    },
  });

  if (createAction.isSuccess) {
    return (
      <div className="w-full gap-2 rounded-md border p-2 sm:p-5 md:p-8">
        <m.div
          animate={{ opacity: 1, y: 0 }}
          className="h-full px-3 py-6"
          initial={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
        >
          <m.div
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex w-fit justify-center rounded-full border p-2"
            initial={{ scale: 0.5 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
          >
            <Check className="size-8" />
          </m.div>
          <h2 className="mb-2 text-center text-2xl font-bold text-pretty">Thank you</h2>
          <p className="text-center text-lg text-pretty text-muted-foreground">
            Form submitted successfully, we will get back to you soon
          </p>
        </m.div>
      </div>
    );
  }

  return (
    <div className="container-wrapper">
      <Card>
        <form.AppForm>
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Form Components Demo
            </CardTitle>
            <CardDescription>
              Please fill out the form below and you will be subscribed to our newsletter.
            </CardDescription>
            <CardAction>
              <Button variant="link">Do More</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form.FormWrapper
            // description=" All transactions are secure and encrypted"
            // label="Payment Method"
            >
              <FieldGroup className="mb-6 grid gap-4 md:grid-cols-6">
                <form.AppField name="firstName">
                  {(field) => (
                    <field.TextField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="some disc"
                      label="First Name"
                      tooltip="Enter the title of the announcement"
                      tooltipSide="right"
                    />
                  )}
                </form.AppField>
                <form.AppField name="lastName">
                  {(field) => (
                    <field.TextField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="some disc"
                      label="Last Name"
                      tooltip="Enter the title of the announcement"
                    />
                  )}
                </form.AppField>
                <form.AppField name="email">
                  {(field) => (
                    <field.TextField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="some disc"
                      label="Email"
                      tooltip="Enter the title of the announcement"
                      type="email"
                    />
                  )}
                </form.AppField>
                <form.AppField name="status">
                  {(field) => (
                    <field.SelectField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="some disc"
                      label="Status"
                    >
                      {PROJECT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </field.SelectField>
                  )}
                </form.AppField>
                <form.AppField name="password">
                  {(field) => (
                    <field.PasswordField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="Enter the password"
                      label="Password"
                      tooltip="Enter the password"
                    />
                  )}
                </form.AppField>
                <form.AppField name="otp">
                  {(field) => (
                    <field.OTPField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="This will be shown"
                      label="OTP"
                      maxLength={6}
                    />
                  )}
                </form.AppField>

                <form.AppField name="description">
                  {(field) => (
                    <field.RichEditorField
                      classNames={{ base: "col-span-full" }}
                      description="This will be shown as the heading of the announcement"
                      label="Description"
                      tooltip="Enter the title of the announcement"
                      tooltipSide="right"
                    />
                  )}
                </form.AppField>
                <form.AppField name="position">
                  {(field) => (
                    <field.ToggleGroupField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="This will be shown as the heading of the announcement"
                      label="Which position are you applying for? *"
                      options={positionOptions}
                      multiple
                      variant="outline"
                    />
                  )}
                </form.AppField>
                <form.AppField name="frameworks">
                  {(field) => (
                    <field.MultiSelectField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="This will be shown"
                      label="Frameworks"
                      options={frameworksList}
                      placeholder="Choose frameworks..."
                    />
                  )}
                </form.AppField>
                <form.AppField name="tags">
                  {(field) => (
                    <field.TagField
                      animation="fadeIn"
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      label="Set Tags"
                      maxTags={5}
                      minLength={3}
                      placeholder="Enter your tags"
                      showCount
                      truncate={15}
                      variant="destructive"
                    />
                  )}
                </form.AppField>
                <form.AppField name="age">
                  {(field) => (
                    <field.SliderField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="Adjust the age by sliding"
                      label="Set Age"
                      max={150}
                      min={1}
                    />
                  )}
                </form.AppField>
                <form.AppField name="citizen">
                  {(field) => (
                    <field.SwitchField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="You can enable or disable policy"
                      label="Citizenship"
                    />
                  )}
                </form.AppField>
                <form.AppField name="rating">
                  {(field) => (
                    <field.RatingField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="This will be shown"
                      label="Rating"
                      maxRating={5}
                    />
                  )}
                </form.AppField>
                <form.AppField name="dob">
                  {(field) => (
                    <field.DateField
                      captionLayout="dropdown"
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="your data of birth"
                      label="Date of Birth"
                      mode="single"
                    />
                  )}
                </form.AppField>
                <form.AppField name="period">
                  {(field) => (
                    <field.DateField
                      captionLayout="dropdown"
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="select start and end period"
                      endMonth={addYears(new Date(), 5)}
                      label="Period"
                      mode="range"
                      placeholder="Pick date range"
                      startMonth={addYears(new Date(), -5)}
                    />
                  )}
                </form.AppField>
                <form.AppField name="schedule">
                  {(field) => (
                    <field.DateField
                      captionLayout="dropdown"
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="all scheduled appointments"
                      label="Schedule"
                      mode="multiple"
                      placeholder="Pick all dates"
                    />
                  )}
                </form.AppField>
                {/* <form.AppField name="dob">
                  {(field) => (
                    <field.NaturalLanguageDateField
                      captionLayout="dropdown"
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="your data of birth"
                      label="Date of Birth (Natural Language)"
                      placeholder="enter data of birth"
                    />
                  )}
                </form.AppField> */}
                <form.AppField name="appointment">
                  {(field) => (
                    <field.DateTimeField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="Appointment Date and Time"
                      displayFormat={{ hour12: "yyyy/MM/dd hh:mm aa" }}
                      granularity="minute"
                      hourCycle={12}
                      label="Appointment Date"
                      placeholder="When's your Appointment?"
                      tooltip="Appointment Date and Time"
                    />
                  )}
                </form.AppField>
                <form.AppField name="techStack">
                  {(field) => (
                    <field.MultiSelectProField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      creatable
                      defaultOptions={field.state.value}
                      description="select or create"
                      label="Tech Stack"
                      options={techOptions}
                      placeholder="Choose..."
                    />
                  )}
                </form.AppField>
                <form.AppField name="techStack">
                  {(field) => (
                    <field.CreatableMultiSelectField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      creatable={false}
                      // defaultOptions={field.state.value}
                      description="select or create"
                      label="Tech Stack"
                      options={techOptions}
                      placeholder="Choose..."
                    />
                  )}
                </form.AppField>
                <form.AppField name="files">
                  {(field) => (
                    <field.FileUploadField
                      accept="application/pdf, application/doc, application/docx"
                      classNames={{ base: "col-span-full" }}
                      label="Files"
                      maxFiles={3}
                      maxSize={1_048_576}
                      placeholder="PDF, DOC or DOCX (max. 1MB)"
                    />
                  )}
                </form.AppField>
                {/* <form.AppField name="files">
                  {(field) => (
                    <field.FileUploadField2
                      accept="application/pdf, application/doc, application/docx"
                      label="Files"
                      maxSize={1_048_576}
                      multiple
                      name="files"
                      placeholder="PDF, DOC or DOCX (max. 1MB)"
                    />
                  )}
                </form.AppField> */}
                <form.AppField name="metadata">
                  {(field) => (
                    <field.JSONField
                      classNames={{ base: "col-span-full" }}
                      description="This will be shown as the heading of the announcement"
                      label="Metadata"
                      placeholder='JSON object, e.g. {"plan":"pro"}'
                      rows={3}
                      tooltip="Enter the title of the announcement"
                      tooltipSide="right"
                    />
                  )}
                </form.AppField>
                <FieldSeparator className="col-span-full my-4">Extra</FieldSeparator>
                <form.AppField name="plan">
                  {(field) => (
                    <field.RadioCardField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      // className="grid grid-cols-3 gap-2"
                      description="Choose your subscription plan."
                      label="Subscription Plan"
                      options={planOptions}
                    />
                  )}
                </form.AppField>
                {/* <form.AppField name="plan">
                  {(field) => (
                    <field.SegmentedControlField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      // className="grid grid-cols-3 gap-2"
                      description="Choose your subscription plan."
                      label="Subscription Plan"
                      options={planOptions}
                    />
                  )}
                </form.AppField> */}
                <form.AppField mode="array" name="addons">
                  {(field) => (
                    <field.CheckboxGroupField
                      classNames={{ base: "col-span-full gap-1 md:col-span-2" }}
                      description="Select additional features you'd like to include."
                      label="Add-ons"
                      options={addons}
                    />
                  )}
                </form.AppField>
                <FieldSet className="col-span-full gap-1 md:col-span-2">
                  <FieldContent>
                    <FieldLegend>Notifications</FieldLegend>
                    <FieldDescription>
                      Select how you would like to receive notifications.
                    </FieldDescription>
                  </FieldContent>
                  <FieldGroup data-slot="checkbox-group">
                    <form.AppField name="notifications.email">
                      {(field) => (
                        <field.CheckboxField
                          description="some disc"
                          disabled
                          label="Email"
                          tooltip="disabled this"
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="notifications.sms">
                      {(field) => <field.CheckboxField description="some disc" label="Text" />}
                    </form.AppField>
                    <form.AppField name="notifications.push">
                      {(field) => <field.CheckboxField label="In App" />}
                    </form.AppField>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator className="col-span-full" />
                <form.Field mode="array" name="users">
                  {(field) => (
                    <FieldSet className="col-span-full">
                      <div className="grid grid-flow-col items-center justify-between gap-2">
                        <FieldContent>
                          <FieldLegend className="mb-0" variant="label">
                            User Email Addresses
                          </FieldLegend>
                          <FieldDescription>
                            Add up to 5 users to this project (including yourself).
                          </FieldDescription>
                          {field.state.meta.errors && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Button
                          onClick={() => field.pushValue({ email: "" })}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Add User
                        </Button>
                      </div>
                      <FieldGroup>
                        {field.state.value.map((_, index) => (
                          // oxlint-disable-next-line react-doctor/no-array-index-as-key
                          <form.Field key={index} name={`users[${index}].email`}>
                            {(innerField) => {
                              const isInvalid =
                                innerField.state.meta.isTouched && !innerField.state.meta.isValid;
                              return (
                                <Field data-invalid={isInvalid} orientation="horizontal">
                                  <FieldContent>
                                    <InputGroup>
                                      <InputGroupInput
                                        aria-invalid={isInvalid}
                                        aria-label={`User ${index + 1} email`}
                                        id={innerField.name}
                                        onBlur={innerField.handleBlur}
                                        onChange={(e) => innerField.handleChange(e.target.value)}
                                        type="email"
                                        value={innerField.state.value}
                                      />
                                      {field.state.value.length > 1 && (
                                        <InputGroupAddon align="inline-end">
                                          <InputGroupButton
                                            aria-label={`Remove User ${index + 1}`}
                                            onClick={() => field.removeValue(index)}
                                            size="icon-xs"
                                            type="button"
                                            variant="ghost"
                                          >
                                            <XIcon />
                                          </InputGroupButton>
                                        </InputGroupAddon>
                                      )}
                                    </InputGroup>
                                    {isInvalid && (
                                      <FieldError errors={innerField.state.meta.errors} />
                                    )}
                                  </FieldContent>
                                </Field>
                              );
                            }}
                          </form.Field>
                        ))}
                      </FieldGroup>
                    </FieldSet>
                  )}
                </form.Field>
                <form.AppField name="termsAccepted">
                  {(field) => (
                    <field.CheckboxField
                      classNames={{ base: "col-span-full" }}
                      description="terms conditions"
                      label="Terms"
                      tooltip="terms and conditions"
                    />
                  )}
                </form.AppField>
              </FieldGroup>
            </form.FormWrapper>
          </CardContent>
          <CardFooter className="justify-end">
            <ButtonGroup>
              <form.ResetButton>Reset</form.ResetButton>
              <form.SubmitButton isExecuting={createAction.isPending}>Create</form.SubmitButton>
            </ButtonGroup>
          </CardFooter>
          <form.FormErrors />
        </form.AppForm>
      </Card>
    </div>
  );
}
