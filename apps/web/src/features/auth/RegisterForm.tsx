"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input, Checkbox, Spinner } from "@/components/ui";
import { Form, FormField, FormError, FormLabel } from "@/components/forms";
import axios from "axios";
import { apiClient } from "@/lib/api";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    acceptTerms: z.boolean().optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export type RegisterPayload = {
  email: string;
  password: string;
};

export type RegisterFormProps = {
  onSubmit?: (values: RegisterPayload) => Promise<void> | void;
  loading?: boolean;
};

export default function RegisterForm({ onSubmit, loading }: RegisterFormProps) {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true,
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: RegisterValues) => {
    if (onSubmit) {
      await onSubmit({ email: values.email, password: values.password });
      return;
    }

    try {
      await apiClient.post("/register", {
        email: values.email,
        password: values.password,
      });

      form.clearErrors("root");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message || error.message
        : error instanceof Error
          ? error.message
          : "Unable to create account";

      form.setError("root", {
        type: "server",
        message,
      });
    }
  };

  const isSubmitting = loading ?? form.formState.isSubmitting;

  return (
    <Form form={form} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              fullWidth
            />
          )}
        />
        <FormError message={form.formState.errors.email?.message} />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <Input {...field} id="password" type="password" autoComplete="new-password" fullWidth />
          )}
        />
        <FormError message={form.formState.errors.password?.message} />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <Input
              {...field}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              fullWidth
            />
          )}
        />
        <FormError message={form.formState.errors.confirmPassword?.message} />
      </div>

      <div className="flex items-center justify-between">
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              label={
                <span className="text-sm">
                  I agree to the{" "}
                  <Link className="font-semibold text-blue-700" href="/terms">
                    terms
                  </Link>
                </span>
              }
            />
          )}
        />
        <Link href="/login" className="text-sm font-semibold text-blue-700 hover:underline">
          Already have an account?
        </Link>
      </div>

      <FormError message={form.formState.errors.root?.message} />

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size={18} />
            Creating account...
          </span>
        ) : (
          "Create account"
        )}
      </Button>
    </Form>
  );
}
