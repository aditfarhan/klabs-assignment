import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { AttendanceStatus } from '../entities/attendance.entity';

export class GetAttendanceDto extends PageOptionsDto {
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsEnum(AttendanceStatus)
    @IsOptional()
    status?: AttendanceStatus;
}
