import { BaseRequest, BaseResponse } from './common'

export interface Attendance {
    id: string
    staffId: string
    date: string
    clockInTime: string
    clockOutTime?: string
    status: 'clocked_in' | 'clocked_out'
    createdAt: string
    updatedAt: string
}

export interface AttendanceBrowseRequest {
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
    status?: 'clocked_in' | 'clocked_out'
}

export interface AttendanceBrowseResponse extends BaseResponse<Attendance> {
    meta: {
        page: number
        pageSize: number
        count: number
        pageCount: number
        hasPreviousPage: boolean
        hasNextPage: boolean
    }
}

export type AttendanceDetailResponse = BaseResponse<Attendance>
export type AttendanceClockInResponse = BaseResponse<Attendance>
export type AttendanceClockOutResponse = BaseResponse<Attendance>
