import { Form, Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import AuthLayout from "@/layouts/auth-layout";
import { register } from "@/routes";
import AuthenticatedSessionController from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  redirect?: string;
}

export default function Login({ status, canResetPassword, redirect }: LoginProps) {
  return (
    <AuthLayout
      title="Welcome back"
      description="Log in with your email and password to continue"
    >
      <Head title="Log in" />

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Status */}
          {status && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              {status}
            </div>
          )}

    <Form
  {...AuthenticatedSessionController.store.form()}
  resetOnSuccess={["password"]}
  className="flex flex-col gap-6"
>
  {({ processing, errors }) => (
    <>
      {/* Redirect helper */}
      {redirect && (
        <input type="hidden" name="redirect" value={redirect} />
      )}

      {/* Email */}
      <div className="grid gap-2">
        <Label
          htmlFor="email"
          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Email address
        </Label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 rounded-2xl pl-10"
          />
        </div>

        <InputError message={errors.email} />
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Password
          </Label>

          {canResetPassword && (
            <TextLink
              href="/forgot-password"
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
            >
              Forgot password?
            </TextLink>
          )}
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
            className="h-11 rounded-2xl pl-10"
          />
        </div>

        <InputError message={errors.password} />
      </div>

      {/* Remember */}
      <div className="flex items-center space-x-3">
        <Checkbox id="remember" name="remember" />
        <Label
          htmlFor="remember"
          className="text-sm text-slate-700 dark:text-slate-200"
        >
          Remember me
        </Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={processing}
        className="h-11 w-full rounded-2xl bg-cyan-600 font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60"
      >
        {processing ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Logging in…
          </span>
        ) : (
          "Log in"
        )}
      </Button>
    </>
  )}
</Form>

        </div>

        {/* Subtle note */}
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          By logging in, you agree to our terms and privacy policy.
        </p>
      </div>
    </AuthLayout>
  );
}
