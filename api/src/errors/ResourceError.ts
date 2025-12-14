import { HttpStatus } from '@nestjs/common';
import ApiError from './ApiError';

/**
 * Admin-Related Errors
 */
export const NoStaffFoundError = () => {
  throw new ApiError(
    HttpStatus.NOT_FOUND,
    'Staff not found',
    'Staff with the specified ID is not found',
  );
};

export const StaffAlreadyExistsError = () => {
  throw new ApiError(
    HttpStatus.CONFLICT,
    'Staff already exists',
    'There already exists an staff with this email',
  );
};

/**
 * Auth-Related Errors
 */

export const WrongPasswordError = () => {
  throw new ApiError(
    HttpStatus.UNAUTHORIZED,
    'Wrong password',
    'The password you provided is incorrect',
  );
};

/**
 * Attendance-Related Errors
 */
export const AttendanceNotFoundError = () => {
  throw new ApiError(
    HttpStatus.NOT_FOUND,
    'Attendance not found',
    'Attendance record with the specified ID is not found',
  );
};

export const AlreadyClockedInError = () => {
  throw new ApiError(
    HttpStatus.CONFLICT,
    'Already clocked in',
    'You have already clocked in today',
  );
};

export const AlreadyClockedOutError = () => {
  throw new ApiError(
    HttpStatus.CONFLICT,
    'Already clocked out',
    'You have already clocked out for this attendance record',
  );
};
