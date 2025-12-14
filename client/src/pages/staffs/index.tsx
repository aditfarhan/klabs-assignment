import React from 'react'
import { useRouter } from 'next/router'
import MobileLayout from '@/layouts/MobileLayout'
import { useGetListStaffsQuery } from '@/services/staffs'

const StaffsPage = () => {
    const router = useRouter()
    const { data: staffsData, isLoading } = useGetListStaffsQuery({
        page: 0,
        pageSize: 20,
    })

    return (
        <MobileLayout title="Staff Directory">
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
                        <button
                            onClick={() => router.push('/')}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                            Back
                        </button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="py-12 text-center">
                            <p className="text-gray-600">Loading staff list...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading &&
                        (!staffsData?.data || staffsData.data.length === 0) && (
                            <div className="rounded-lg bg-white p-12 text-center shadow">
                                <p className="text-gray-600">No staff members found.</p>
                            </div>
                        )}

                    {/* Staff List */}
                    {!isLoading && staffsData?.data && staffsData.data.length > 0 && (
                        <div className="space-y-3">
                            {staffsData.data.map((item) => {
                                const staff = item.attributes
                                return (
                                    <div
                                        key={staff.id}
                                        className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {staff.firstName} {staff.lastName}
                                                </h3>
                                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Staff ID:</span>
                                                        <span>{staff.staffId}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Username:</span>
                                                        <span>{staff.username}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Email:</span>
                                                        <span>{staff.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Count */}
                    {staffsData?.count && (
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Total {staffsData.count} staff members
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    )
}

export default StaffsPage
