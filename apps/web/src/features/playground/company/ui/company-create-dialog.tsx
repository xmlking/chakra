import { Badge } from "@workspace/ui/components/reui/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/shadcn/field";
import { Input } from "@workspace/ui/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { PlusIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  industryBadgeVariant,
  PersonOption,
  planBadgeVariant,
  stageBadgeVariant,
} from "../columns";
import {
  INDUSTRY_OPTIONS,
  PEOPLE,
  PLAN_OPTIONS,
  STAGE_OPTIONS,
  type CompanyIndustry,
  type CompanyPlan,
  type CompanyStage,
} from "../data";

const FORM_ID = "columns-5-company-form";

export interface CompanyFormValues {
  name: string;
  domain: string;
  description: string;
  ownerId: string;
  stage: CompanyStage;
  industry: CompanyIndustry;
  arr: number;
  employees: number;
  location: string;
  plan: CompanyPlan;
}

const EMPTY_FORM: CompanyFormValues = {
  name: "",
  domain: "",
  description: "",
  ownerId: PEOPLE[0].id,
  stage: "Discovery",
  industry: "Developer tools",
  arr: 0,
  employees: 0,
  location: "",
  plan: "Team",
};

interface CompanyCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: CompanyFormValues) => void;
}

export function CompanyCreateDialog({ open, onOpenChange, onCreate }: CompanyCreateDialogProps) {
  const [values, setValues] = useState<CompanyFormValues>(EMPTY_FORM);

  const trimmedName = values.name.trim();
  const canSubmit = trimmedName.length > 0;

  function update<TKey extends keyof CompanyFormValues>(key: TKey, value: CompanyFormValues[TKey]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleOpenChange(next: boolean) {
    // The form is a one-shot: reopening always starts from a clean record.
    if (!next) setValues(EMPTY_FORM);
    onOpenChange(next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onCreate({ ...values, name: trimmedName });
    setValues(EMPTY_FORM);
    onOpenChange(false);
  }

  const ownerOptions = PEOPLE.map((person) => ({
    value: person.id,
    label: person.name,
  }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>Create an account and assign its owner.</DialogDescription>
        </DialogHeader>

        <form id={FORM_ID} className="grid gap-6" onSubmit={handleSubmit}>
          {/* Fields: only this body scrolls, so header and footer stay put, and
              px-1/-mx-1 gives the 3px focus ring room the clip box would cut. */}
          <div className="-mx-1 grid max-h-[52svh] gap-5 overflow-y-auto px-1">
            <FieldGroup className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-name">Company name</FieldLabel>
                <Input
                  id="columns-5-name"
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Acme Inc."
                />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-description">Description</FieldLabel>
                <Textarea
                  id="columns-5-description"
                  value={values.description}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="What is this account about?"
                  className="min-h-20 resize-none"
                />
              </Field>
            </FieldGroup>

            <div className="grid gap-3 min-[360px]:grid-cols-2">
              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-domain">Domain</FieldLabel>
                <Input
                  id="columns-5-domain"
                  value={values.domain}
                  onChange={(event) => update("domain", event.target.value)}
                  placeholder="acme.com"
                />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-owner-select">Owner</FieldLabel>
                <Select
                  value={values.ownerId}
                  items={ownerOptions}
                  onValueChange={(next) => next && update("ownerId", next)}
                >
                  <SelectTrigger id="columns-5-owner-select">
                    <SelectValue>
                      <PersonOption personId={values.ownerId} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    <SelectGroup>
                      {ownerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <PersonOption personId={option.value} />
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-stage-select">Stage</FieldLabel>
                <Select
                  value={values.stage}
                  items={STAGE_OPTIONS}
                  onValueChange={(next) => next && update("stage", next as CompanyStage)}
                >
                  <SelectTrigger id="columns-5-stage-select">
                    <SelectValue>
                      <Badge variant={stageBadgeVariant[values.stage]}>{values.stage}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    <SelectGroup>
                      {STAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <Badge variant={stageBadgeVariant[option.value]}>{option.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-industry-select">Industry</FieldLabel>
                <Select
                  value={values.industry}
                  items={INDUSTRY_OPTIONS}
                  onValueChange={(next) => next && update("industry", next as CompanyIndustry)}
                >
                  <SelectTrigger id="columns-5-industry-select">
                    <SelectValue>
                      <Badge variant={industryBadgeVariant[values.industry]}>
                        {values.industry}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    <SelectGroup>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <Badge variant={industryBadgeVariant[option.value]}>{option.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-plan-select">Plan</FieldLabel>
                <Select
                  value={values.plan}
                  items={PLAN_OPTIONS}
                  onValueChange={(next) => next && update("plan", next as CompanyPlan)}
                >
                  <SelectTrigger id="columns-5-plan-select">
                    <SelectValue>
                      <Badge variant={planBadgeVariant[values.plan]}>{values.plan}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    <SelectGroup>
                      {PLAN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <Badge variant={planBadgeVariant[option.value]}>{option.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-arr">ARR</FieldLabel>
                <Input
                  id="columns-5-arr"
                  type="number"
                  min={0}
                  step={1000}
                  value={values.arr}
                  onChange={(event) => update("arr", Number(event.target.value))}
                />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-employees">Employees</FieldLabel>
                <Input
                  id="columns-5-employees"
                  type="number"
                  min={0}
                  value={values.employees}
                  onChange={(event) => update("employees", Number(event.target.value))}
                />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="columns-5-location">Location</FieldLabel>
                <Input
                  id="columns-5-location"
                  value={values.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="City, country"
                />
              </Field>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" form={FORM_ID} disabled={!canSubmit}>
              <PlusIcon data-icon="inline-start" aria-hidden="true" />
              Add company
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
