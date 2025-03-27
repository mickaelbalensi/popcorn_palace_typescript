// src/showtimes/entities/showtime.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Theater } from 'src/theaters/entities/theater.entity';
import { Booking } from 'src/booking/entities/booking.entity';
@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, { eager: true })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Theater, { eager: true })
  @JoinColumn({ name: 'theater_id' })
  theater: Theater;

  @OneToMany(() => Booking, (booking) => booking.showtime)
  bookings: Booking[];

  @Column('timestamp')
  start_time: Date;

  @Column('timestamp')
  end_time: Date;

  @Column('decimal')
  price: number;
}