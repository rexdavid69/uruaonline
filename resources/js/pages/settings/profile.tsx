import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import UserLayout from '@/layouts/frontend/user-layout';

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;

  return (
    <UserLayout title="Profile settings">
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-8">
          <HeadingSmall
            title="Profile settings"
            description="Update your name and email address"
          />

         

          <Form
            {...ProfileController.update.form()}
            options={{ preserveScroll: true }}
            className="space-y-10"
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                {/* ================= Profile Info Card ================= */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      Profile information
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      This is your identity on UruaOnline. Keep it accurate for orders and quotes.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        className="mt-1 block w-full"
                        defaultValue={auth.user.name}
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Full name"
                      />
                      <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        defaultValue={auth.user.email}
                        name="email"
                        required
                        autoComplete="username"
                        placeholder="Email address"
                      />
                      <InputError className="mt-2" message={errors.email} />
                    </div>
                  </div>

                  {/* Email verification block (same card, aligned) */}
                  {mustVerifyEmail && auth.user.email_verified_at === null && (
                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
                      <p className="text-sm">
                        Your email address is unverified.{' '}
                        <Link
                          href={send()}
                          as="button"
                          className="underline decoration-amber-400 underline-offset-4 transition-colors hover:decoration-current"
                        >
                          Click here to resend the verification email.
                        </Link>
                      </p>

                      {status === 'verification-link-sent' && (
                        <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                          A new verification link has been sent to your email address.
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* Save row */}
                <div className="flex items-center gap-4">
                  <Button disabled={processing} data-test="update-profile-button">
                    Save changes
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      Saved
                    </p>
                  </Transition>
                </div>
              </>
            )}
          </Form>

          {/* ================= Danger Zone Card ================= */}
          <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/40 dark:bg-gray-900">
            <div className="mb-3">
              <h3 className="text-base font-semibold text-red-700 dark:text-red-300">
                Danger zone
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Permanently delete your account and all associated data.
              </p>
            </div>

            {/* Your existing component */}
            <DeleteUser />
          </section>
        </div>
      </SettingsLayout>
    </UserLayout>
  );
}
