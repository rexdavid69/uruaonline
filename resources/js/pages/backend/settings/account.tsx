import BackendLayout from "@/layouts/backend/backend-layout";
import { Head, useForm } from "@inertiajs/react";

export default function SettingsAccountPage(props: {
  admin: { name: string; email: string };
}) {
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    name: props.admin.name || "",
    email: props.admin.email || "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const submit = () => {
    post("/backend/settings/account", { preserveScroll: true });
  };

  return (
    <BackendLayout title="Settings • Account">
      <Head title="Settings • Account" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your admin profile and password.
            </p>
          </div>

          <button
            onClick={submit}
            disabled={processing}
            className="rounded-2xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-gray-900"
          >
            {processing ? "Saving..." : "Save changes"}
          </button>
        </div>

        {recentlySuccessful && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
            ✅ Account updated.
          </div>
        )}

        {/* Profile */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Profile</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Basic details for your admin account.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-gray-200 focus:ring-2 dark:border-gray-800 dark:bg-gray-950"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-gray-200 focus:ring-2 dark:border-gray-800 dark:bg-gray-950"
              />
            </Field>
          </div>
        </div>

        {/* Password */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Leave blank if you don’t want to change your password.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Current password" error={errors.current_password}>
              <input
                type="password"
                value={data.current_password}
                onChange={(e) => setData("current_password", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-gray-200 focus:ring-2 dark:border-gray-800 dark:bg-gray-950"
              />
            </Field>

            <div className="hidden md:block" />

            <Field label="New password" error={errors.new_password}>
              <input
                type="password"
                value={data.new_password}
                onChange={(e) => setData("new_password", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-gray-200 focus:ring-2 dark:border-gray-800 dark:bg-gray-950"
              />
            </Field>

            <Field label="Confirm new password" error={errors.new_password_confirmation}>
              <input
                type="password"
                value={data.new_password_confirmation}
                onChange={(e) => setData("new_password_confirmation", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-gray-200 focus:ring-2 dark:border-gray-800 dark:bg-gray-950"
              />
            </Field>
          </div>
        </div>

        {/* Bottom button */}
        <div className="flex justify-end">
          <button
            onClick={submit}
            disabled={processing}
            className="rounded-2xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-gray-900"
          >
            {processing ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </BackendLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-bold">{label}</div>
      {children}
      {error ? (
        <div className="text-sm font-semibold text-red-600">{error}</div>
      ) : null}
    </div>
  );
}
