import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Attendance, AttendanceStatus } from '../entities/attendance.entity';

export class AttendanceDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    staffId: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    clockInTime: Date;

    @ApiProperty({ required: false })
    clockOutTime?: Date;

    @ApiProperty({ enum: AttendanceStatus })
    status: AttendanceStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @Exclude()
    staff: any;

    constructor(attendance: Attendance) {
        if (!attendance) {
            return;
        }
        this.id = attendance.id;
        this.staffId = attendance.staffId;
        this.date = attendance.date;
        this.clockInTime = attendance.clockInTime;
        this.clockOutTime = attendance.clockOutTime;
        this.status = attendance.status;
        this.createdAt = attendance.createdAt;
        this.updatedAt = attendance.updatedAt;
    }
}
