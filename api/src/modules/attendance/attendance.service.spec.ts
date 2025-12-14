import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import {
    AttendanceNotFoundError,
    AlreadyClockedInError,
    AlreadyClockedOutError,
} from '../../errors/ResourceError';

describe('AttendanceService', () => {
    let service: AttendanceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AttendanceService],
        }).compile();

        service = module.get<AttendanceService>(AttendanceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('clockIn', () => {
        it('should create attendance record successfully', async () => {
            const staffId = 'test-staff-id';
            const mockAttendance = {
                id: 'test-id',
                staffId,
                date: new Date(),
                clockInTime: new Date(),
                status: AttendanceStatus.CLOCKED_IN,
            } as Attendance;

            // Mock the findOne to return null (no existing attendance)
            jest.spyOn(Attendance, 'findOne').mockResolvedValueOnce(null);

            // Mock save to succeed
            const saveSpy = jest.spyOn(Attendance.prototype, 'save').mockResolvedValue(undefined);

            // Mock second findOne to return created attendance
            jest.spyOn(Attendance, 'findOne').mockResolvedValueOnce(mockAttendance);

            const result = await service.clockIn(staffId);

            expect(result).toEqual(mockAttendance);
            expect(saveSpy).toHaveBeenCalled();
        });

        it('should throw error if already clocked in today', async () => {
            const staffId = 'test-staff-id';
            const existingAttendance = {
                id: 'existing-id',
                staffId,
                status: AttendanceStatus.CLOCKED_IN,
            } as Attendance;

            jest.spyOn(Attendance, 'findOne').mockResolvedValueOnce(existingAttendance);

            await expect(service.clockIn(staffId)).rejects.toThrow();
        });
    });

    describe('clockOut', () => {
        it('should update attendance with clock out time', async () => {
            const staffId = 'test-staff-id';
            const attendanceId = 'test-attendance-id';
            const mockAttendance = {
                id: attendanceId,
                staffId,
                status: AttendanceStatus.CLOCKED_IN,
                save: jest.fn().mockResolvedValue(undefined),
            } as any;

            jest.spyOn(Attendance, 'findOne')
                .mockResolvedValueOnce(mockAttendance)
                .mockResolvedValueOnce({ ...mockAttendance, status: AttendanceStatus.CLOCKED_OUT });

            const result = await service.clockOut(staffId, attendanceId);

            expect(result.status).toBe(AttendanceStatus.CLOCKED_OUT);
            expect(mockAttendance.save).toHaveBeenCalled();
        });

        it('should throw error if attendance not found', async () => {
            jest.spyOn(Attendance, 'findOne').mockResolvedValueOnce(null);

            await expect(service.clockOut('staff-id', 'attendance-id')).rejects.toThrow();
        });

        it('should throw error if already clocked out', async () => {
            const mockAttendance = {
                status: AttendanceStatus.CLOCKED_OUT,
            } as Attendance;

            jest.spyOn(Attendance, 'findOne').mockResolvedValueOnce(mockAttendance);

            await expect(service.clockOut('staff-id', 'attendance-id')).rejects.toThrow();
        });
    });

    describe('getMyAttendance', () => {
        it('should return attendance list with pagination', async () => {
            const staffId = 'test-staff-id';
            const mockAttendances = [
                { id: '1', staffId, clockInTime: new Date() } as Attendance,
                { id: '2', staffId, clockInTime: new Date() } as Attendance,
            ];

            const options = {
                page: 0,
                pageSize: 10,
            } as GetAttendanceDto;

            jest.spyOn(Attendance, 'findAndCount').mockResolvedValue([mockAttendances, 2]);

            const result = await service.getMyAttendance(staffId, options);

            expect(result.attendances).toHaveLength(2);
            expect(result.count).toBe(2);
            expect(result.meta).toBeDefined();
        });
    });

    describe('findOne', () => {
        it('should return attendance if found', async () => {
            const mockAttendance = {
                id: 'test-id',
                staffId: 'test-staff-id',
            } as Attendance;

            jest.spyOn(Attendance, 'findOne').mockResolvedValue(mockAttendance);

            const result = await service.findOne('test-id', 'test-staff-id');

            expect(result).toBeDefined();
            expect(result.id).toBe('test-id');
        });

        it('should throw error if not found', async () => {
            jest.spyOn(Attendance, 'findOne').mockResolvedValue(null);

            await expect(service.findOne('test-id', 'test-staff-id')).rejects.toThrow();
        });
    });
});
