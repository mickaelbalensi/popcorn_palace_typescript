import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { User } from '../../users/entities/user.entity' 

@Entity()
@Unique(['showtime', 'seatNumber']) // Ensures no duplicate seat for the same showtime
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, { onDelete: 'CASCADE' })
  showtime: Showtime;

  @Column()
  seatNumber: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}