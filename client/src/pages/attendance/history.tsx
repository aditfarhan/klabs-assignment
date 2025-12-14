import React from 'react'
import { useRouter } from 'next/router'
import MobileLayout from '@/layouts/MobileLayout'
import { useGetMyAttendanceQuery } from '@/services/attendance'

const AttendanceHistoryPage = () => {
    const router = useRouter()
    const { data: attendanceData, isLoading } = useGetMyAttendanceQuery({
        page: 0,
        pageSize: 30,
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const calculateDuration = (clockIn: string, clockOut?: string) => {
        if (!clockOut) return 'In Progress'

        const start = new Date(clockIn)
        const end = new Date(clockOut)
        const diff = end.getTime() - start.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.round((diff % (1000 * 60 * 60)) / (1000 * 60))

        return `${hours}h ${minutes}m`
    }

    return (
        <MobileLayout title="Attendance History">
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Attendance History
                        </h1>
                        <button
                            onClick={() => router.push('/attendance')}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                            Back
                        </button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Loading attendance records...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading &&
                        (!attendanceData?.data || attendanceData.data.length === 0) && (
                            <div className="rounded-lg bg-white p-12 text-center shadow">
                                <p className="text-gray-600">No attendance records found.</p>
                            </div>
                        )}

                    {/* Attendance Records */}
                    {!isLoading && attendanceData?.data && attendanceData.data.length > 0 && (
                        <div className="space-y-3">
                            {attendanceData.data.map((item) => {
                                const attendance = item.attributes
                                return (
                                    <div
                                        key={attendance.id}
                                        className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    {formatDate(attendance.date)}
                                                </p>
                                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">In:</span>
                                                        <span>{formatTime(attendance.clockInTime)}</span>
                                                    </div>
                                                    {attendance.clockOutTime && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">Out:</span>
                                                            <span>{formatTime(attendance.clockOutTime)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Duration:</span>
                                                        <span>
                                                            {calculateDuration(
                                                                attendance.clockInTime,
                                                                attendance.clockOutTime
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${attendance.status === 'clocked_in'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                >
                                                    {attendance.status === 'clocked_in'
                                                        ? 'Active'
                                                        : 'Completed'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination Info */}
                    {attendanceData?.meta && (
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Showing {attendanceData.data.length} of {attendanceData.meta.count}{' '}
                            records
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    )
}

export default AttendanceHistoryPage
