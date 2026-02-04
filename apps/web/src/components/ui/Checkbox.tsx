"use client";

import * as React from "react";
import MuiCheckbox, { type CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel, { type FormControlLabelProps } from "@mui/material/FormControlLabel";
import { cn } from "@/lib/cn";

export type CheckboxProps = MuiCheckboxProps & {
  label?: FormControlLabelProps["label"];
  labelPlacement?: FormControlLabelProps["labelPlacement"];
};

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, label, labelPlacement, ...props }, ref) => {
    const control = <MuiCheckbox ref={ref} className={cn(className)} {...props} />;

    if (!label) {
      return control;
    }

    return <FormControlLabel control={control} label={label} labelPlacement={labelPlacement} />;
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
