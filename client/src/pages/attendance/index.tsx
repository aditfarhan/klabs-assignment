import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import MobileLayout from '@/layouts/MobileLayout'
import {
    usePostClockInMutation,
    usePostClockOutMutation,
    useGetMyAttendanceQuery,
} from '@/services/attendance'

const AttendancePage = () => {
    const router = useRouter()
    const [todayAttendance, setTodayAttendance] = useState<any>(null)

    // RTK Query hooks
    const [clockIn, { isLoading: isClockingIn, isSuccess: clockInSuccess }] =
        usePostClockInMutation()
    const [
        clockOut,
        { isLoading: isClockingOut, isSuccess: clockOutSuccess },
    ] = usePostClockOutMutation()
    const { data: attendanceData, refetch } = useGetMyAttendanceQuery({
        page: 0,
        pageSize: 1,
    })

    // Get today's attendance on load
    useEffect(() => {
        if (attendanceData?.data && attendanceData.data.length > 0) {
            const today = new Date().toISOString().split('T')[0]
            const todayRecord = attendanceData.data.find(
                (item) => item.attributes.date.split('T')[0] === today
            )
            setTodayAttendance(todayRecord?.attributes || null)
        }
    }, [attendanceData])

    // Refetch after clock in/out
    useEffect(() => {
        if (clockInSuccess || clockOutSuccess) {
            refetch()
        }
    }, [clockInSuccess, clockOutSuccess, refetch])

    const handleClockIn = async () => {
        try {
            await clockIn().unwrap()
            alert('Successfully clocked in!')
        } catch (error: any) {
            alert(error?.data?.message || 'Failed to clock in')
        }
    }

    const handleClockOut = async () => {
        if (!todayAttendance) return

        try {
            await clockOut(todayAttendance.id).unwrap()
            alert('Successfully clocked out!')
        } catch (error: any) {
            alert(error?.data?.message || 'Failed to clock out')
        }
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getStatusColor = () => {
        if (!todayAttendance) return 'bg-gray-100'
        return todayAttendance.status === 'clocked_in'
            ? 'bg-green-100'
            : 'bg-blue-100'
    }

    const getStatusText = () => {
        if (!todayAttendance) return 'Not Clocked In'
        return todayAttendance.status === 'clocked_in'
            ? 'Clocked In'
            : 'Clocked Out'
    }

    return (
        <MobileLayout title="Attendance">
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="mx-auto max-w-md space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Attendance System
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* Status Card */}
                    <div
                        className={`rounded-lg p-6 shadow-md ${getStatusColor()} transition-colors duration-300`}
                    >
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-600">
                                Current Status
                            </p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                {getStatusText()}
                            </p>

                            {todayAttendance && (
                                <div className="mt-4 space-y-2">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-semibold">Clock In: </span>
                                        {formatTime(todayAttendance.clockInTime)}
                                    </div>
                                    {todayAttendance.clockOutTime && (
                                        <div className="text-sm text-gray-700">
                                            <span className="font-semibold">Clock Out: </span>
                                            {formatTime(todayAttendance.clockOutTime)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {!todayAttendance && (
                            <button
                                onClick={handleClockIn}
                                disabled={isClockingIn}
                                className="w-full rounded-lg bg-green-500 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {isClockingIn ? 'Clocking In...' : 'Clock In'}
                            </button>
                        )}

                        {todayAttendance && todayAttendance.status === 'clocked_in' && (
                            <button
                                onClick={handleClockOut}
                                disabled={isClockingOut}
                                className="w-full rounded-lg bg-blue-500 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {isClockingOut ? 'Clocking Out...' : 'Clock Out'}
                            </button>
                        )}

                        {todayAttendance && todayAttendance.status === 'clocked_out' && (
                            <div className="rounded-lg bg-gray-100 p-4 text-center">
                                <p className="text-sm font-semibold text-gray-700">
                                    You have completed your attendance for today!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex space-x-3">
                        <button
                            onClick={() => router.push('/attendance/history')}
                            className="flex-1 rounded-lg border-2 border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400"
                        >
                            View History
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 rounded-lg border-2 border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </MobileLayout>
    )
}

export default AttendancePage
