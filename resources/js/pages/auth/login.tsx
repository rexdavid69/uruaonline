import { Form, Head } from '@inertiajs/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { LoaderCircle } from 'lucide-react'
import AuthLayout from '@/layouts/auth-layout'
import { register } from '@/routes'
import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController'

interface LoginProps {
    status?: string
    canResetPassword: boolean
}

export default function Login({ status, }: LoginProps) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-lg">
                <Form
                    {...AuthenticatedSessionController.store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-gray-700">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-semibold text-gray-700">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" />
                                <Label htmlFor="remember" className="text-gray-700">
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Log in
                            </Button>

                            {/* Sign up link */}
                            <div className="text-center text-sm text-gray-500 mt-6">
                                Don't have an account?{' '}
                                <TextLink href={register()} className="text-cyan-600 hover:underline">
                                    Sign up
                                </TextLink>
                            </div>

                            {/* Status message */}
                            {status && (
                                <div className="mt-4 text-center text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    )
}
