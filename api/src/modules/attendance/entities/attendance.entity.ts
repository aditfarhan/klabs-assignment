import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityWithUUID } from '../../../common/base.entity';
import { Staff } from '../../staff/entities/staff.entity';

export enum AttendanceStatus {
  CLOCKED_IN = 'clocked_in',
  CLOCKED_OUT = 'clocked_out',
}

@Entity()
export class Attendance extends BaseEntityWithUUID {
  @Column()
  staffId: string;

  @ManyToOne(() => Staff, (staff) => staff.attendances)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp' })
  clockInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOutTime: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.CLOCKED_IN,
  })
  status: AttendanceStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
