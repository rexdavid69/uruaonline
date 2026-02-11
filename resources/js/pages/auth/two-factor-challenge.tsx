import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OTP_MAX_LENGTH } from "@/hooks/use-two-factor-auth";
import AuthLayout from "@/layouts/auth-layout";
import { store } from "@/routes/two-factor/login";
import { Form, Head } from "@inertiajs/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { KeyRound } from "lucide-react";
import { useMemo, useState } from "react";

export default function TwoFactorChallenge() {
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [code, setCode] = useState("");

  const authConfigContent = useMemo(() => {
    if (showRecoveryInput) {
      return {
        title: "Recovery Code",
        description:
          "Enter one of your emergency recovery codes to confirm access.",
        toggleText: "Use an authentication code instead",
      };
    }

    return {
      title: "Authentication Code",
      description:
        "Enter the authentication code from your authenticator app.",
      toggleText: "Use a recovery code instead",
    };
  }, [showRecoveryInput]);

  return (
    <AuthLayout title={authConfigContent.title} description={authConfigContent.description}>
      <Head title="Two-Factor Authentication" />

      <Form
        {...store.form()}
        className="space-y-6"
        resetOnError
        resetOnSuccess={!showRecoveryInput}
      >
        {({ errors, processing, clearErrors }) => (
          <>
            {showRecoveryInput ? (
              <div className="grid gap-2">
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="recovery_code"
                    type="text"
                    placeholder="Enter recovery code"
                    autoFocus
                    required
                    className="h-11 rounded-2xl pl-10"
                    disabled={processing}
                  />
                </div>
                <InputError message={errors.recovery_code} />
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900/40">
                <div className="flex justify-center">
                  <InputOTP
                    name="code"
                    maxLength={OTP_MAX_LENGTH}
                    value={code}
                    onChange={(v) => setCode(v)}
                    disabled={processing}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="mt-3">
                  <InputError message={errors.code} />
                </div>
              </div>
            )}

            <Button type="submit" className="h-11 w-full rounded-2xl bg-cyan-600 font-semibold text-white hover:bg-cyan-700" disabled={processing}>
              Continue
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              <button
                type="button"
                className="font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                onClick={() => {
                  setShowRecoveryInput(!showRecoveryInput);
                  clearErrors();
                  setCode("");
                }}
              >
                {authConfigContent.toggleText}
              </button>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
