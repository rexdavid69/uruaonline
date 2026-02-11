import EmailVerificationNotificationController from "@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController";
import { logout } from "@/routes";
import { Form, Head } from "@inertiajs/react";
import { LoaderCircle, MailCheck } from "lucide-react";

import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/auth-layout";

export default function VerifyEmail({ status }: { status?: string }) {
  return (
    <AuthLayout
      title="Verify email"
      description="Click the link we emailed you to verify your email address."
    >
      <Head title="Email verification" />

      {status === "verification-link-sent" && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
          A new verification link has been sent to your email address.
        </div>
      )}

      <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
            <MailCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Didn’t get the email?
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Check your spam folder, or resend the verification email below.
            </p>
          </div>
        </div>
      </div>

      <Form
        {...EmailVerificationNotificationController.store.form()}
        className="space-y-5"
      >
        {({ processing }) => (
          <>
            <Button
              disabled={processing}
              className="h-11 w-full rounded-2xl bg-cyan-600 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
              variant="default"
            >
              {processing ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Resend verification email"
              )}
            </Button>

            <TextLink
              href={logout()}
              className="mx-auto block text-center text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Log out
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
