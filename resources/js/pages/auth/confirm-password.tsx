import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";
import { store } from "@/routes/password/confirm";
import { Form, Head } from "@inertiajs/react";
import { LoaderCircle, Lock } from "lucide-react";

export default function ConfirmPassword() {
  return (
    <AuthLayout
      title="Confirm your password"
      description="This is a secure area. Please confirm your password before continuing."
    >
      <Head title="Confirm password" />

      <Form {...store.form()} resetOnSuccess={["password"]} className="space-y-6">
        {({ processing, errors }) => (
          <>
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Password
              </Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  autoFocus
                  className="h-11 rounded-2xl pl-10"
                />
              </div>

              <InputError message={errors.password} />
            </div>

            <Button
              className="h-11 w-full rounded-2xl bg-cyan-600 font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60"
              disabled={processing}
              data-test="confirm-password-button"
            >
              {processing ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Confirming…
                </span>
              ) : (
                "Confirm password"
              )}
            </Button>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
