import {
    Controller,
    Post,
    Get,
    Param,
    Query,
    ValidationPipe,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller({ version: '1', path: 'attendance' })
@ApiTags('Attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('clock-in')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ description: 'Successfully clocked in' })
    async clockIn(@Req() req: Request) {
        const staffId = String(req.user?.id);
        const attendance = await this.attendanceService.clockIn(staffId);
        return { data: attendance };
    }

    @Post('clock-out/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'Successfully clocked out' })
    async clockOut(@Param('id') id: string, @Req() req: Request) {
        const staffId = String(req.user?.id);
        const attendance = await this.attendanceService.clockOut(staffId, id);
        return { data: attendance };
    }

    @Get('my')
    @ApiOkResponse({ description: 'Get my attendance history' })
    async getMyAttendance(
        @Query(ValidationPipe) options: GetAttendanceDto,
        @Req() req: Request,
    ) {
        const staffId = String(req.user?.id);
        const { attendances, count, meta } =
            await this.attendanceService.getMyAttendance(staffId, options);
        return { data: attendances, count, meta };
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Get single attendance record' })
    async findOne(@Param('id') id: string, @Req() req: Request) {
        const staffId = String(req.user?.id);
        const attendance = await this.attendanceService.findOne(id, staffId);
        return { data: attendance };
    }
}
