import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import SettingsLayout from '@/layouts/settings/layout';
import UserLayout from '@/layouts/frontend/user-layout';
import { Head, Link } from '@inertiajs/react';
import { Lock, ShieldCheck } from 'lucide-react';

export default function Security() {
  return (
    <UserLayout title="Security settings">
      <Head title="Security settings" />

      <SettingsLayout>
        <div className="space-y-8">
          <HeadingSmall
            title="Security settings"
            description="Manage your password and two-factor authentication"
          />

         

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Password */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-100 p-2 dark:bg-gray-800">
                  <Lock className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Password
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Change your password regularly to keep your account secure.
                  </p>

                  <div className="mt-4">
                    <Button asChild>
                      <Link href="/settings/password">Update password</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* 2FA */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-100 p-2 dark:bg-gray-800">
                  <ShieldCheck className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Two-factor authentication
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Add an extra layer of protection when logging in.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                      <Link href="/settings/two-factor">Manage 2FA</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Optional: future section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Sessions
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Coming soon: view devices logged into your account and sign out remotely.
            </p>
          </section>
        </div>
      </SettingsLayout>
    </UserLayout>
  );
}
