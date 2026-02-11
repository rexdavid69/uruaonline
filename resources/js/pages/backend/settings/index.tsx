/* eslint-disable @typescript-eslint/no-explicit-any */
import BackendLayout from '@/layouts/backend/backend-layout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

type SettingItem = {
    id: number;
    key: string;
    label: string | null;
    group: string;
    type: 'string' | 'number' | 'boolean' | 'text' | 'json';
    value: any;
    hint: string | null;
};

export default function SettingsPage(props: {
    settings: Record<string, SettingItem[]>;
}) {
    const groups = useMemo(
        () => Object.keys(props.settings || {}),
        [props.settings],
    );

    // Flatten for submission
    const initialItems = useMemo(() => {
        const all: Array<{
            key: string;
            type: SettingItem['type'];
            value: any;
        }> = [];
        for (const g of groups) {
            for (const item of props.settings[g]) {
                all.push({
                    key: item.key,
                    type: item.type,
                    value: item.value ?? '',
                });
            }
        }
        return all;
    }, [groups, props.settings]);

    const { data, setData, post, processing, recentlySuccessful, errors } =
        useForm({
            items: initialItems,
        });

    const updateValue = (key: string, nextValue: any) => {
        setData(
            'items',
            data.items.map((i) =>
                i.key === key ? { ...i, value: nextValue } : i,
            ),
        );
    };

    const findValue = (key: string) =>
        data.items.find((i) => i.key === key)?.value;

    const submit = () => {
        post('/backend/settings', { preserveScroll: true });
    };

    const titleForGroup = (g: string) => {
        if (g === 'general') return 'General';
        if (g === 'orders') return 'Orders & Quotes';
        if (g === 'notifications') return 'Notifications';
        return g.charAt(0).toUpperCase() + g.slice(1);
    };

    return (
        <BackendLayout title="Settings">
            <Head title="Settings" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Settings
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Update global admin settings for your store.
                        </p>
                    </div>

                    <button
                        onClick={submit}
                        disabled={processing}
                        className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-gray-900"
                    >
                        {processing ? 'Saving...' : 'Save changes'}
                    </button>
                </div>

                {recentlySuccessful && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
                        ✅ Settings saved.
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                        Some settings could not be saved. Please review your
                        inputs.
                    </div>
                )}

                {/* Groups */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* left menu */}
                    <div className="lg:col-span-1">
                        <div className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                            <div className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Sections
                            </div>
                            <div className="mt-3 space-y-2">
                                {groups.map((g) => (
                                    <a
                                        key={g}
                                        href={`#group-${g}`}
                                        className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-950"
                                    >
                                        {titleForGroup(g)}
                                    </a>
                                ))}
                            </div>
                            <a
                                href="/backend/settings/account"
                                className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-950"
                            >
                                Account
                            </a>
                        </div>
                    </div>

                    {/* right forms */}
                    <div className="space-y-6 lg:col-span-2">
                        {groups.map((g) => (
                            <div
                                key={g}
                                id={`group-${g}`}
                                className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold">
                                        {titleForGroup(g)}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Manage {titleForGroup(g).toLowerCase()}{' '}
                                        settings.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {(props.settings[g] || []).map((s) => (
                                        <div
                                            key={s.key}
                                            className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-bold">
                                                        {s.label || s.key}
                                                    </div>
                                                    {s.hint && (
                                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                            {s.hint}
                                                        </div>
                                                    )}
                                                    <div className="mt-1 text-xs text-gray-400">
                                                        {s.key}
                                                    </div>
                                                </div>

                                                <div className="sm:w-72">
                                                    {s.type === 'boolean' ? (
                                                        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold dark:border-gray-800 dark:bg-gray-900">
                                                            <span>
                                                                {findValue(
                                                                    s.key,
                                                                )
                                                                    ? 'Enabled'
                                                                    : 'Disabled'}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    !!findValue(
                                                                        s.key,
                                                                    )
                                                                }
                                                                onChange={(e) =>
                                                                    updateValue(
                                                                        s.key,
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                                className="h-5 w-5 rounded"
                                                            />
                                                        </label>
                                                    ) : s.type === 'text' ? (
                                                        <textarea
                                                            value={
                                                                findValue(
                                                                    s.key,
                                                                ) ?? ''
                                                            }
                                                            onChange={(e) =>
                                                                updateValue(
                                                                    s.key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={4}
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm ring-gray-200 outline-none focus:ring-2 dark:border-gray-800 dark:bg-gray-900"
                                                        />
                                                    ) : s.type === 'number' ? (
                                                        <input
                                                            type="number"
                                                            value={
                                                                findValue(
                                                                    s.key,
                                                                ) ?? 0
                                                            }
                                                            onChange={(e) =>
                                                                updateValue(
                                                                    s.key,
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm ring-gray-200 outline-none focus:ring-2 dark:border-gray-800 dark:bg-gray-900"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={
                                                                findValue(
                                                                    s.key,
                                                                ) ?? ''
                                                            }
                                                            onChange={(e) =>
                                                                updateValue(
                                                                    s.key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm ring-gray-200 outline-none focus:ring-2 dark:border-gray-800 dark:bg-gray-900"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom save button for convenience */}
                <div className="flex justify-end">
                    <button
                        onClick={submit}
                        disabled={processing}
                        className="rounded-2xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-gray-900"
                    >
                        {processing ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </div>
        </BackendLayout>
    );
}
