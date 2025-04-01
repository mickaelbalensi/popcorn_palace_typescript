// src/movies/entities/movie.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  genre: string;

  @Column()
  duration: number;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ name: 'release_year' })
  releaseYear: number;
}