import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';

import SettingsLayout from '@/layouts/settings/layout';
import UserLayout from '@/layouts/frontend/user-layout'; // ✅ change this path to your actual file

export default function Appearance() {
  return (
    <UserLayout title="Appearance settings">
      <Head title="Appearance settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Appearance settings"
            description="Update your account's appearance settings"
          />

          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </UserLayout>
  );
}
