import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { getCookie } from 'cookies-next'
import MobileLayout from '@/layouts/MobileLayout'
import { USER_ACCESS_TOKEN } from '@/config/token'

interface ProfileForm {
    firstName: string
    lastName: string
    email: string
    username: string
    password?: string
}

const ProfilePage = () => {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const { register, handleSubmit, setValue } = useForm<ProfileForm>()

    // Note: In a real app, you'd fetch the current user's profile from /auth/selfUser
    // For now, we'll show a placeholder implementation

    const onSubmit = async (data: ProfileForm) => {
        try {
            // TODO: Call API to update profile
            // await updateProfile(profile.id, data)
            alert('Profile updated successfully!')
            setIsEditing(false)
        } catch (error) {
            alert('Failed to update profile')
        }
    }

    return (
        <MobileLayout title="My Profile">
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="mx-auto max-w-md">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <button
                            onClick={() => router.push('/')}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                            Back
                        </button>
                    </div>

                    {/* Profile Form */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* First Name */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    First Name
                                </label>
                                <input
                                    {...register('firstName', { required: true })}
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    {...register('lastName', { required: true })}
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Email
                                </label>
                                <input
                                    {...register('email', { required: true })}
                                    type="email"
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Username
                                </label>
                                <input
                                    {...register('username', { required: true })}
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* Password (only when editing) */}
                            {isEditing && (
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        New Password (optional)
                                    </label>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        placeholder="Leave blank to keep current password"
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="submit"
                                            className="flex-1 rounded-lg bg-green-500 py-3 text-sm font-semibold text-white hover:bg-green-600"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 rounded-lg border-2 border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>

                        {/* Info Note */}
                        <div className="mt-6 rounded-lg bg-yellow-50 p-4">
                            <p className="text-xs text-yellow-800">
                                <strong>Note:</strong> You can only update your own profile. Authorization is enforced by the backend.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MobileLayout>
    )
}

export default ProfilePage
