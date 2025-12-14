import { Injectable } from '@nestjs/common';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { AttendanceDto } from './dto/attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
    AttendanceNotFoundError,
    AlreadyClockedInError,
    AlreadyClockedOutError,
} from '../../errors/ResourceError';

@Injectable()
export class AttendanceService {
    async clockIn(staffId: string): Promise<Attendance> {
        // Check if staff already clocked in today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            where: {
                staffId,
                date: today,
                status: AttendanceStatus.CLOCKED_IN,
            },
        });

        if (existingAttendance) {
            AlreadyClockedInError();
        }

        const attendance = new Attendance();
        attendance.staffId = staffId;
        attendance.date = today;
        attendance.clockInTime = new Date();
        attendance.status = AttendanceStatus.CLOCKED_IN;

        await attendance.save();

        const createdAttendance = await Attendance.findOne({
            where: { id: attendance.id },
        });

        return createdAttendance;
    }

    async clockOut(staffId: string, attendanceId: string): Promise<Attendance> {
        const attendance = await Attendance.findOne({
            where: { id: attendanceId, staffId },
        });

        if (!attendance) {
            AttendanceNotFoundError();
        }

        if (attendance.status === AttendanceStatus.CLOCKED_OUT) {
            AlreadyClockedOutError();
        }

        attendance.clockOutTime = new Date();
        attendance.status = AttendanceStatus.CLOCKED_OUT;

        await attendance.save();

        const updatedAttendance = await Attendance.findOne({
            where: { id: attendance.id },
        });

        return updatedAttendance;
    }

    async getMyAttendance(
        staffId: string,
        options: GetAttendanceDto,
    ): Promise<{
        attendances: AttendanceDto[];
        count: number;
        meta: PageMetaDto;
    }> {
        const whereFilters: FindOptionsWhere<Attendance> = { staffId };

        if (options.startDate) {
            whereFilters.date = MoreThanOrEqual(new Date(options.startDate));
        }

        if (options.endDate) {
            // Combine with existing date filter if startDate exists
            if (options.startDate) {
                whereFilters.date = [
                    {
                        date: MoreThanOrEqual(new Date(options.startDate)),
                    } as any,
                    {
                        date: LessThanOrEqual(new Date(options.endDate)),
                    } as any,
                ] as any;
            } else {
                whereFilters.date = LessThanOrEqual(new Date(options.endDate));
            }
        }

        if (options.status) {
            whereFilters.status = options.status;
        }

        const [attendances, count] = await Attendance.findAndCount({
            where: whereFilters,
            take: options.pageSize,
            skip: options.page * options.pageSize,
            order: {
                date: 'DESC',
                clockInTime: 'DESC',
            },
        });

        const meta = new PageMetaDto({
            itemCount: count,
            pageOptionsDto: options,
        });

        const attendanceDto = attendances.map((att) => new AttendanceDto(att));
        return { attendances: attendanceDto, count, meta };
    }

    async findOne(id: string, staffId: string): Promise<AttendanceDto> {
        const attendance = await Attendance.findOne({
            where: { id, staffId },
        });

        if (!attendance) {
            AttendanceNotFoundError();
        }

        return new AttendanceDto(attendance);
    }
}
