import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { apiBaseQuery } from '@/utils/api'
import {
    AttendanceBrowseRequest,
    AttendanceBrowseResponse,
    AttendanceClockInResponse,
    AttendanceClockOutResponse,
    AttendanceDetailResponse,
} from '@/types/attendance'

const api = createApi({
    reducerPath: 'attendance',
    baseQuery: apiBaseQuery,
    tagTypes: ['Attendance'],
    refetchOnMountOrArgChange: true,
    keepUnusedDataFor: 259200, // 3 days
    endpoints: (builder) => ({
        postClockIn: builder.mutation<AttendanceClockInResponse, void>({
            query: () => ({
                url: '/v1/attendance/clock-in',
                method: 'POST',
            }),
            invalidatesTags: ['Attendance'],
        }),
        postClockOut: builder.mutation<AttendanceClockOutResponse, string>({
            query: (attendanceId) => ({
                url: `/v1/attendance/clock-out/${attendanceId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Attendance'],
        }),
        getMyAttendance: builder.query<AttendanceBrowseResponse, AttendanceBrowseRequest>({
            query: (params) => ({
                params,
                url: '/v1/attendance/my',
            }),
            providesTags: ['Attendance'],
        }),
        getAttendanceDetail: builder.query<AttendanceDetailResponse, string>({
            query: (id) => ({
                url: `/v1/attendance/${id}`,
            }),
            providesTags: ['Attendance'],
        }),
    }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
})

// Export hooks for usage in functional components
export const {
    usePostClockInMutation,
    usePostClockOutMutation,
    useGetMyAttendanceQuery,
    useGetAttendanceDetailQuery,
} = api

export default api
