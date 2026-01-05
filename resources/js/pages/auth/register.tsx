//import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCardLayout from '@/layouts/auth/auth-card-layout';
import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';

export default function Register() {
    return (
        <AuthCardLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />

            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Name */}
                            <div className="relative">
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-gray-800
                                               focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] transition"
                                />
                                <Label
                                    htmlFor="name"
                                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                                               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400
                                               peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600
                                               peer-focus:text-sm"
                                >
                                    Name
                                </Label>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-gray-800
                                               focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] transition"
                                />
                                <Label
                                    htmlFor="email"
                                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                                               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400
                                               peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600
                                               peer-focus:text-sm"
                                >
                                    Email address
                                </Label>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-gray-800
                                               focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] transition"
                                />
                                <Label
                                    htmlFor="password"
                                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                                               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400
                                               peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600
                                               peer-focus:text-sm"
                                >
                                    Password
                                </Label>
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-gray-800
                                               focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] transition"
                                />
                                <Label
                                    htmlFor="password_confirmation"
                                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                                               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400
                                               peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600
                                               peer-focus:text-sm"
                                >
                                    Confirm password
                                </Label>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full py-2 bg-gradient-to-r from-[#00c6ff] to-[#005bea]
                                           text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2
                                           hover:from-[#00e5ff] hover:to-[#0041d0] transition-colors duration-300"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center text-sm text-gray-500 mt-6">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-[#00f0ff] hover:underline">
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthCardLayout>
    );
}
