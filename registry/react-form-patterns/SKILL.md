---
name: react-form-patterns
description: patterns for building forms in React using form contexts and composable field components. covers form context setup, reusable field components that read from context, and integration with libraries like TanStack Form, React Hook Form, or Formik. reference this skill when building or modifying forms.
---

# React Form Patterns

## Overview

This skill defines the preferred pattern for building non-trivial forms in React. The core idea: a form-library provider or context configures fields and validation, and reusable field components consume that form state directly. This makes form construction flexible and keeps form UI decoupled from form logic.

## The pattern

### Form Context → Form → Field Components

```
MyFormContext (configures fields, validation, default values)
  └── Form wrapper
        ├── InputField name="firstName"
        ├── InputField name="lastName"
        ├── TextareaField name="bio"
        ├── SelectField name="role" options={roleOptions}
        └── SubmitButton
```

Each layer has a clear job:

1. **Form Context** — created per-form, configures the form library (TanStack Form, React Hook Form, Formik). Defines the field schema, validation rules, default values, and submit handler. Wraps the form's children so they can access form state via context.

2. **Reusable Field Components** — generic, form-library-aware input components (`InputField`, `TextareaField`, `SelectField`, `CheckboxField`, etc.) that read from the form context by name. They handle rendering the input, displaying labels, showing validation errors, and updating form state — all without knowing which specific form they're in.

3. **Form Composition** — the actual form is assembled declaratively by placing field components inside the form context. The form's structure is visible in the JSX.

### Example with React Hook Form

```tsx
// create-invoice-form-context.tsx — the form context for this specific form
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createInvoiceSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  amount: z.number().positive("Amount must be positive"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});

type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;

export function CreateInvoiceFormContext({
  onSubmit,
  children,
}: {
  onSubmit: (data: CreateInvoiceFormValues) => void;
  children: React.ReactNode;
}) {
  const methods = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      clientName: "",
      amount: 0,
      dueDate: "",
      notes: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}
```

```tsx
// Reusable field components — shared across all forms
// components/ui/input-field.tsx
import { useFormContext } from "react-hook-form";

export function InputField({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} {...register(name)} />
      {error && <span>{error.message as string}</span>}
    </div>
  );
}
```

```tsx
// Usage — composing the form declaratively
function CreateInvoicePage() {
  const handleSubmit = (data) => { /* ... */ };

  return (
    <CreateInvoiceFormContext onSubmit={handleSubmit}>
      <InputField name="clientName" label="Client Name" />
      <InputField name="amount" label="Amount" type="number" />
      <InputField name="dueDate" label="Due Date" type="date" />
      <TextareaField name="notes" label="Notes" />
      <SubmitButton>Create Invoice</SubmitButton>
    </CreateInvoiceFormContext>
  );
}
```

### Why this pattern

- **Flexible UI composition.** You can arrange fields however you want — in columns, in tabs, in collapsible sections — without changing form logic. The field components just need to be inside the context.
- **Reusable field components.** `InputField`, `TextareaField`, etc. are written once and used across every form. Styling, error display, and accessibility are consistent everywhere.
- **Form logic is contained.** Each form's schema, validation, and defaults are in one place (the form context). You can review what a form expects without reading the JSX.
- **Easy to extend.** Adding a new field type (date picker, file upload, rich text) means creating one new field component. It works in every form immediately.

## Guidelines

### One form context per non-trivial form

Don't try to make a single generic form context that handles every form via configuration. Each substantial form has its own context or provider setup that defines its specific schema and validation. The *field components* are generic and reusable; the *form context* is specific.

For a tiny form with one or two fields and no reusable field components, local state or the project's existing lightweight pattern is fine. Introduce a form context when validation, field reuse, dirty tracking, async submission, or multi-step behavior would otherwise spread logic across the JSX.

### Field components are base UI

Field components (`InputField`, `TextareaField`, `SelectField`, etc.) usually belong in the base UI layer (`src/components/ui/` or similar). They are form-library-aware but domain-free — they don't know about invoices, users, or agents. If a project keeps form adapters separate from visual primitives, put the library-aware wrappers in that established form layer and keep the raw input primitives domain-free.

### Form contexts live with their feature

The form context for creating an invoice lives in the invoices feature module. It's domain-specific code.

```
src/
  features/
    invoices/
      components/
        create-invoice-form-context.tsx
        create-invoice-form.tsx
        edit-invoice-form-context.tsx
        edit-invoice-form.tsx
  components/
    ui/
      input-field.tsx
      textarea-field.tsx
      select-field.tsx
      checkbox-field.tsx
      submit-button.tsx
```

### Validation at the schema level

Define validation in the form schema (Zod, Yup, or the form library's native validation), not in individual field components. Field components display errors — they don't define validation rules.

### Keep field components simple

A field component should handle:
- Rendering the input element
- Displaying the label
- Showing validation errors
- Connecting to form state via context

It should not handle:
- Business logic
- Data fetching
- Conditional form behavior (which fields appear based on other fields)

Conditional logic — showing/hiding fields based on other field values, dynamically changing options — belongs in the form composition or the form context, not inside individual field components.

### Form-level state vs. field-level state

The form library manages form state. Don't duplicate it into local `useState` calls. If you need a field's current value to drive conditional logic, read it from the form context:

```tsx
// Good: read from form context
const { watch } = useFormContext();
const paymentType = watch("paymentType");

// Bad: duplicate state
const [paymentType, setPaymentType] = useState("");
```

### Multi-step and wizard forms

For forms that span multiple steps, the form context wraps all steps. Each step is a component that renders a subset of fields. Step navigation and per-step validation are handled outside the individual field components:

```tsx
<CreateAccountFormContext onSubmit={handleSubmit}>
  {step === 1 && <AccountDetailsStep onNext={() => setStep(2)} />}
  {step === 2 && <ProfileStep onBack={() => setStep(1)} onNext={() => setStep(3)} />}
  {step === 3 && <ReviewStep onBack={() => setStep(2)} />}
</CreateAccountFormContext>
```

The form context persists state across steps because it wraps the whole wizard. Each step component validates only its own fields before advancing via the form library's `trigger()` method (React Hook Form) or equivalent.

### Field arrays (dynamic fields)

For forms where the user can add/remove entries — invoice line items, team members, tags — use the form library's field array support:

```tsx
// React Hook Form
const { fields, append, remove } = useFieldArray({ name: "lineItems" });

return (
  <>
    {fields.map((field, index) => (
      <div key={field.id}>
        <InputField name={`lineItems.${index}.description`} label="Description" />
        <InputField name={`lineItems.${index}.amount`} label="Amount" type="number" />
        <button onClick={() => remove(index)}>Remove</button>
      </div>
    ))}
    <button onClick={() => append({ description: "", amount: 0 })}>Add line item</button>
  </>
);
```

Note: for nested field names like `lineItems.0.description`, the simple `errors[name]` pattern in field components won't work. Use a path-aware accessor like `get(errors, name)` from a utility library, or the form library's built-in error accessor.

### Dirty tracking and unsaved changes

Use the form library's dirty-state tracking to warn users before navigating away from a form with unsaved changes:

```tsx
const { formState: { isDirty } } = useFormContext();

// With React Router
useBeforeUnload(
  useCallback((e) => {
    if (isDirty) e.preventDefault();
  }, [isDirty])
);
```

### Adapting to the project's form library

This pattern works with any form library that provides a context/provider mechanism:

- **React Hook Form:** `FormProvider` + `useFormContext`
- **TanStack Form:** `formApi` passed via context or render props
- **Formik:** `<Formik>` wrapper + `useFormikContext`

Match whatever the project already uses. Don't introduce a new form library for consistency with this skill — adapt the pattern to the existing library.
