// Components
import PasswordResetLinkController from "@/actions/App/Http/Controllers/Auth/PasswordResetLinkController";
import { login } from "@/routes";
import { Form, Head } from "@inertiajs/react";
import { LoaderCircle, Mail, ArrowLeft } from "lucide-react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";

export default function ForgotPassword({ status }: { status?: string }) {
  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email to receive a password reset link"
    >
      <Head title="Forgot password" />

      {status && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
          {status}
        </div>
      )}

      <Form {...PasswordResetLinkController.store.form()} className="space-y-6">
        {({ processing, errors }) => (
          <>
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
                  type="email"
                  name="email"
                  autoComplete="off"
                  autoFocus
                  placeholder="you@example.com"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>

              <InputError message={errors.email} />
            </div>

            <Button
              className="h-11 w-full rounded-2xl bg-cyan-600 font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60"
              disabled={processing}
              data-test="email-password-reset-link-button"
            >
              {processing ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Email password reset link"
              )}
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              <TextLink
                href={login()}
                className="inline-flex items-center gap-2 font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
