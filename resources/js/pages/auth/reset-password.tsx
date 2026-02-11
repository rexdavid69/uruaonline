import NewPasswordController from "@/actions/App/Http/Controllers/Auth/NewPasswordController";
import { Form, Head } from "@inertiajs/react";
import { LoaderCircle, Mail, Lock } from "lucide-react";

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  return (
    <AuthLayout title="Reset password" description="Choose a new password below">
      <Head title="Reset password" />

      <Form
        {...NewPasswordController.store.form()}
        transform={(data) => ({ ...data, token, email })}
        resetOnSuccess={["password", "password_confirmation"]}
        className="space-y-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Email
              </Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  readOnly
                  className="h-11 rounded-2xl pl-10 opacity-90"
                />
              </div>

              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                New password
              </Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  autoFocus
                  placeholder="Create a new password"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>

              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Confirm password
              </Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  autoComplete="new-password"
                  placeholder="Repeat the new password"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>

              <InputError message={errors.password_confirmation} />
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-2xl bg-cyan-600 font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60"
              disabled={processing}
              data-test="reset-password-button"
            >
              {processing ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Resetting…
                </span>
              ) : (
                "Reset password"
              )}
            </Button>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
