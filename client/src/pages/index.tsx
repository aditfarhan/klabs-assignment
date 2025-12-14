import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import MobileLayout from '@/layouts/MobileLayout'
import { deleteCookie } from 'cookies-next'
import { USER_ACCESS_TOKEN } from '@/config/token'

const HomePage = () => {
    const router = useRouter()

    const handleLogout = () => {
        // Clear the access token cookie
        deleteCookie(USER_ACCESS_TOKEN)

        // Redirect to login
        router.push('/login')
    }

    return (
        <MobileLayout title="Home">
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="mx-auto max-w-md space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            HR System
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Welcome to the HRIS Dashboard
                        </p>
                    </div>

                    {/* Navigation Cards */}
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/attendance')}
                            className="w-full rounded-lg bg-white p-6 text-left shadow-md transition-all hover:shadow-lg"
                        >
                            <h2 className="text-xl font-semibold text-gray-900">
                                📅 Attendance
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Clock in/out and view attendance history
                            </p>
                        </button>

                        <button
                            onClick={() => router.push('/staffs')}
                            className="w-full rounded-lg bg-white p-6 text-left shadow-md transition-all hover:shadow-lg"
                        >
                            <h2 className="text-xl font-semibold text-gray-900">
                                👥 Staff Directory
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                View all staff members
                            </p>
                        </button>

                        <button
                            onClick={() => router.push('/profile')}
                            className="w-full rounded-lg bg-white p-6 text-left shadow-md transition-all hover:shadow-lg"
                        >
                            <h2 className="text-xl font-semibold text-gray-900">
                                👤 My Profile
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                View and update your profile
                            </p>
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full rounded-lg border-2 border-red-500 bg-white py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </MobileLayout>
    )
}

export default HomePage
