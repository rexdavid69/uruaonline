import { login } from "@/routes";
import { Form, Head } from "@inertiajs/react";
import { LoaderCircle, Mail, Lock, User } from "lucide-react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCardLayout from "@/layouts/auth/auth-card-layout";
import RegisteredUserController from "@/actions/App/Http/Controllers/Auth/RegisteredUserController";

export default function Register() {
  return (
    <AuthCardLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <Head title="Register" />

      <Form
        {...RegisteredUserController.store.form()}
        resetOnSuccess={["password", "password_confirmation"]}
        disableWhileProcessing
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            {/* Name */}
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  placeholder="Your full name"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>
              <InputError message={errors.name} />
            </div>

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
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>
              <InputError message={errors.email} />
            </div>

            {/* Password */}
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
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>
              <InputError message={errors.password} />
            </div>

            {/* Confirm password */}
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
                  name="password_confirmation"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>
              <InputError message={errors.password_confirmation} />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={processing}
              className="h-11 w-full rounded-2xl bg-cyan-600 font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60"
              data-test="register-user-button"
            >
              {processing ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating…
                </span>
              ) : (
                "Create account"
              )}
            </Button>

            {/* Login link */}
            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              Already have an account?{" "}
              <TextLink
                href={login()}
                className="font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
              >
                Log in
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthCardLayout>
  );
}
