import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes/showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtimes/entities/showtime.entity';
import { Movie } from './movies/entities/movie.entity';
import { Theater } from './theaters/entities/theater.entity';

const mockShowtimeRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockMovieRepository = () => ({ 
  findOne: jest.fn() 
});

const mockTheaterRepository = () => ({ 
  findOne: jest.fn() 
});

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepository: jest.Mocked<Repository<Showtime>>;
  let movieRepository: jest.Mocked<Repository<Movie>>;
  let theaterRepository: jest.Mocked<Repository<Theater>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { 
          provide: getRepositoryToken(Showtime), 
          useFactory: mockShowtimeRepository 
        },
        { 
          provide: getRepositoryToken(Movie), 
          useFactory: mockMovieRepository 
        },
        { 
          provide: getRepositoryToken(Theater), 
          useFactory: mockTheaterRepository 
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    showtimeRepository = module.get(getRepositoryToken(Showtime));
    movieRepository = module.get(getRepositoryToken(Movie));
    theaterRepository = module.get(getRepositoryToken(Theater));
  });

  it('should add a new showtime successfully', async () => {
    const theater = { id: 1, name: 'Theater 1' } as Theater;
    const movie = { id: 1, title: 'Movie 1' } as Movie;
    const newShowtime = { 
        id: 1,
        movie,
        theater,
        start_time: new Date('2025-04-01T12:00:00.000Z'),
        end_time: new Date('2025-04-01T14:00:00.000Z'), 
        price: 10
    };
    const showtimeData = {
        movieId: 1,
        price: 10,
        theater: 'Theater 1',
        startTime: '2025-04-01T12:00:00.000Z',
        endTime: '2025-04-01T14:00:00.000Z',
      };

    theaterRepository.findOne.mockResolvedValue(theater);
    movieRepository.findOne.mockResolvedValue(movie);
    showtimeRepository.find.mockResolvedValue([]);
    showtimeRepository.create.mockReturnValue(newShowtime as any);
    showtimeRepository.save.mockResolvedValue(newShowtime as any);

    const result = await service.addShowtime(showtimeData);
  
    expect(result).toEqual({
      id: newShowtime.id,
      price: newShowtime.price,
      movieId: movie.id,
      theater: theater.name,
      startTime: newShowtime.start_time,
      endTime: newShowtime.end_time,
    });
  });

  it('should throw an error if the theater is not found', async () => {
    theaterRepository.findOne.mockResolvedValue(null);
    await expect(service.addShowtime({ 
      movieId: 1, 
      price: 10, 
      theater: 'Theater 1', 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString() 
    })).rejects.toThrow('Theater not found');
  });

it('should throw an error if there are overlapping showtimes', async () => {
    const theater = { id: 1, name: 'Theater 1' };
    const overlappingShowtime = [
      {
        id: 1,
        theater: { id: 1 },
        start_time: new Date('2025-04-01T12:30:00.000Z'),
        end_time: new Date('2025-04-01T14:30:00.000Z'),
      },
    ];

    theaterRepository.findOne.mockResolvedValue(theater as any);
    showtimeRepository.find.mockResolvedValue(overlappingShowtime as any);

    await expect(
      service.addShowtime({
        movieId: 1,
        price: 10,
        theater: 'Theater 1',
        startTime: '2025-04-01T11:00:00.000Z', 
        endTime: '2025-04-01T13:00:00.000Z',
      })
    ).rejects.toThrow('There are overlapping showtimes for this theater');
  });

  it('should create a showtime when no overlap exists', async () => {
    const theater = { id: 1, name: 'Theater 1' };
    const movie = { id: 1, title: 'Movie 1' };
    const newShowtime = { id: 2, movie, theater, start_time: new Date(), end_time: new Date(), price: 10 };

    theaterRepository.findOne.mockResolvedValue(theater as any);
    movieRepository.findOne.mockResolvedValue(movie as any);
    showtimeRepository.find.mockResolvedValue([]);
    showtimeRepository.create.mockReturnValue(newShowtime as any);
    showtimeRepository.save.mockResolvedValue(newShowtime as any);

    await expect(service.addShowtime({ 
      movieId: 1, 
      price: 10, 
      theater: 'Theater 1', 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString() 
    })).resolves.toEqual({
      id: newShowtime.id,
      price: newShowtime.price,
      movieId: movie.id,
      theater: theater.name,
      startTime: newShowtime.start_time,
      endTime: newShowtime.end_time,
    });
  });

  it('should prevent showtimes with exactly the same time', async () => {
    const theater = { id: 1, name: 'Theater 1' };
    const sameTimeShowtime = [{ id: 1 }];

    theaterRepository.findOne.mockResolvedValue(theater as any);
    showtimeRepository.find.mockResolvedValue(sameTimeShowtime as any);
    
    await expect(service.addShowtime({ 
      movieId: 1, 
      price: 10, 
      theater: 'Theater 1', 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString() 
    })).rejects.toThrow('There are overlapping showtimes for this theater');
  });

  it('should allow showtimes in different theaters at the same time', async () => {
    const theater1 = { 
      id: 1, 
      name: 'Theater 1', 
      address: '123 Theater St', 
      max_person: 100 
    };
    const theater2 = { 
      id: 2, 
      name: 'Theater 2', 
      address: '456 Cinema Ave', 
      max_person: 120 
    };
    const movie = { id: 1, title: 'Movie 1' };
    const newShowtime = { 
      id: 3, 
      movie, 
      theater: theater2, 
      start_time: new Date('2025-04-01T12:30:00.000Z'), 
      end_time: new Date('2025-04-01T14:30:00.000Z'), 
      price: 10 
    };

    theaterRepository.findOne.mockImplementation((options) => {
      if ((options.where as any).name === 'Theater 1') {
        return Promise.resolve(theater1);
      }
      return Promise.resolve(theater2);
    });

    movieRepository.findOne.mockResolvedValue(movie as any);
    showtimeRepository.find.mockResolvedValue([]);
    showtimeRepository.create.mockReturnValue(newShowtime as any);
    showtimeRepository.save.mockResolvedValue(newShowtime as any);

    await expect(service.addShowtime({ 
      movieId: 1, 
      price: 10, 
      theater: 'Theater 2', 
      startTime: new Date('2025-04-01T11:30:00.000Z').toISOString(), 
      endTime: new Date('2025-04-01T13:30:00.000Z').toISOString() 
    })).resolves.toEqual({
      id: newShowtime.id,
      price: newShowtime.price,
      movieId: movie.id,
      theater: theater2.name,
      startTime: newShowtime.start_time,
      endTime: newShowtime.end_time,
    });
  });
});
