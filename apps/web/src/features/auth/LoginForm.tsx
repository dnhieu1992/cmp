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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;

export type LoginFormProps = {
  onSubmit?: (values: LoginValues) => Promise<void> | void;
  loading?: boolean;
};

export default function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: LoginValues) => {
    if (onSubmit) {
      await onSubmit(values);
      return;
    }

    try {
      await apiClient.post("/login", {
        email: values.email,
        password: values.password,
      });

      form.clearErrors("root");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message || error.message
        : error instanceof Error
          ? error.message
          : "Unable to sign in";

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
            <Input
              {...field}
              id="password"
              type="password"
              autoComplete="current-password"
              fullWidth
            />
          )}
        />
        <FormError message={form.formState.errors.password?.message} />
      </div>

      <div className="flex items-center justify-between">
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              label="Remember me"
            />
          )}
        />
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <FormError message={form.formState.errors.root?.message} />

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size={18} />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
    </Form>
  );
}
