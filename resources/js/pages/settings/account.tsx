/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import UserLayout from '@/layouts/frontend/user-layout';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

type NotificationPrefs = {
  order_updates?: boolean;
  quote_updates?: boolean;
  promotions?: boolean;
};

type AccountForm = {
  phone: string;
  preferred_contact: 'email' | 'phone' | 'whatsapp';
  company_name: string;
  job_title: string;

  country: string;
  state: string;
  city: string;
  address_line1: string;
  address_line2: string;
  postal_code: string;

  locale: string;
  timezone: string;

  notification_preferences: NotificationPrefs;
};

export default function Account() {
  const { auth } = usePage<SharedData>().props;

  // IMPORTANT: TS currently doesn't know extra fields exist on auth.user.
  // We'll safely read them using "as any" until you update SharedData types.
  const user = auth.user as any;

  const { data, setData, patch, processing, recentlySuccessful, errors } =
    useForm<AccountForm>({
      phone: user.phone ?? '',
      preferred_contact: user.preferred_contact ?? 'email',
      company_name: user.company_name ?? '',
      job_title: user.job_title ?? '',

      country: user.country ?? '',
      state: user.state ?? '',
      city: user.city ?? '',
      address_line1: user.address_line1 ?? '',
      address_line2: user.address_line2 ?? '',
      postal_code: user.postal_code ?? '',

      locale: user.locale ?? '',
      timezone: user.timezone ?? '',

      notification_preferences: {
        order_updates: user.notification_preferences?.order_updates ?? true,
        quote_updates: user.notification_preferences?.quote_updates ?? true,
        promotions: user.notification_preferences?.promotions ?? false,
      },
    });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    patch('/settings/account', { preserveScroll: true }); // or route('settings.account.update')
  }

  return (
    <UserLayout title="Account settings">
      <Head title="Account settings" />

      <SettingsLayout>
        <div className="space-y-8">
          <HeadingSmall
            title="Account settings"
            description="Update your business info, address, and preferences"
          />

          

          <form onSubmit={submit} className="space-y-10">
            {/* Personal & Business */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Personal & Business
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  These details help us contact you about orders and quotes.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+234..."
                  />
                  <InputError message={errors.phone as any} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="preferred_contact">Preferred contact</Label>
                  <select
                    id="preferred_contact"
                    value={data.preferred_contact}
                    onChange={(e) =>
                      setData('preferred_contact', e.target.value as AccountForm['preferred_contact'])
                    }
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-cyan-500 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-200"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <InputError message={errors.preferred_contact as any} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company_name">Company name</Label>
                  <Input
                    id="company_name"
                    value={data.company_name}
                    onChange={(e) => setData('company_name', e.target.value)}
                    placeholder="UruaOnline Ltd"
                  />
                  <InputError message={errors.company_name as any} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="job_title">Job title</Label>
                  <Input
                    id="job_title"
                    value={data.job_title}
                    onChange={(e) => setData('job_title', e.target.value)}
                    placeholder="Procurement / Engineer"
                  />
                  <InputError message={errors.job_title as any} />
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Default address
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Used as a default for quotes and order delivery details.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                    placeholder="Nigeria"
                  />
                  <InputError message={errors.country as any} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={data.state}
                    onChange={(e) => setData('state', e.target.value)}
                    placeholder="Akwa Ibom"
                  />
                  <InputError message={errors.state as any} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    placeholder="Uyo"
                  />
                  <InputError message={errors.city as any} />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="address_line1">Address line 1</Label>
                  <Input
                    id="address_line1"
                    value={data.address_line1}
                    onChange={(e) => setData('address_line1', e.target.value)}
                    placeholder="Street address"
                  />
                  <InputError message={errors.address_line1 as any} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="postal_code">Postal code</Label>
                  <Input
                    id="postal_code"
                    value={data.postal_code}
                    onChange={(e) => setData('postal_code', e.target.value)}
                    placeholder="Postal code"
                  />
                  <InputError message={errors.postal_code as any} />
                </div>

                <div className="grid gap-2 md:col-span-3">
                  <Label htmlFor="address_line2">Address line 2</Label>
                  <Input
                    id="address_line2"
                    value={data.address_line2}
                    onChange={(e) => setData('address_line2', e.target.value)}
                    placeholder="Apartment, suite, landmark (optional)"
                  />
                  <InputError message={errors.address_line2 as any} />
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Preferences
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Control how the platform behaves for you.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="locale">Locale</Label>
                  <Input
                    id="locale"
                    value={data.locale}
                    onChange={(e) => setData('locale', e.target.value)}
                    placeholder="en"
                  />
                  <InputError message={errors.locale as any} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={data.timezone}
                    onChange={(e) => setData('timezone', e.target.value)}
                    placeholder="Africa/Lagos"
                  />
                  <InputError message={errors.timezone as any} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Order updates
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Get notified when your order status changes.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!data.notification_preferences.order_updates}
                    onChange={(e) =>
                      setData('notification_preferences', {
                        ...data.notification_preferences,
                        order_updates: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Quote updates
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Get notified when your quote is ready or updated.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!data.notification_preferences.quote_updates}
                    onChange={(e) =>
                      setData('notification_preferences', {
                        ...data.notification_preferences,
                        quote_updates: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Promotions
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Occasional product updates and offers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!data.notification_preferences.promotions}
                    onChange={(e) =>
                      setData('notification_preferences', {
                        ...data.notification_preferences,
                        promotions: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center gap-4">
              <Button disabled={processing} type="submit" data-test="update-account-button">
                Save changes
              </Button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Saved</p>
              </Transition>
            </div>
          </form>
        </div>
      </SettingsLayout>
    </UserLayout>
  );
}
