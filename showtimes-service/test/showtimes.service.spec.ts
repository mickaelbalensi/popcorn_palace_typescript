import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from '../src/showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../src/entities/showtimes.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

const mockShowtimeRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'MOVIES_SERVICE_URL') return 'http://movies-service:3001';
    if (key === 'THEATERS_SERVICE_URL') return 'http://theaters-service:3002';
    return null;
  }),
};

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepository: jest.Mocked<Repository<Showtime>>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ShowtimesService,
        { 
          provide: getRepositoryToken(Showtime), 
          useFactory: mockShowtimeRepository 
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    showtimeRepository = module.get(getRepositoryToken(Showtime));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should add a new showtime successfully', async () => {
    const theater = { id: 1, name: 'Theater 1', max_person: 100, address: '123 Theater St' };
    const movie = { id: 1, title: 'Movie 1' };
    const newShowtime = { 
      id: 1,
      movieId: movie.id,
      theaterId: theater.id,
      startTime: new Date('2025-04-01T12:00:00.000Z'),
      endTime: new Date('2025-04-01T14:00:00.000Z'), 
      price: 10
    };
    const showtimeData = {
      movieId: 1,
      price: 10,
      theater: 'Theater 1',
      startTime: '2025-04-01T12:00:00.000Z',
      endTime: '2025-04-01T14:00:00.000Z',
    };

    // Mock HTTP responses for theater and movie service
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
      if (url.includes('theaters')) {
        const response: AxiosResponse = {
          data: theater,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url, method: 'GET' } as any,
        };
        return of(response);
      } else if (url.includes('movies')) {
        const response: AxiosResponse = {
          data: movie,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url, method: 'GET' } as any,
        };
        return of(response);
      }
      return of({} as AxiosResponse);
    });

    showtimeRepository.find.mockResolvedValue([]);
    showtimeRepository.create.mockReturnValue(newShowtime as any);
    showtimeRepository.save.mockResolvedValue(newShowtime as any);

    const result = await service.addShowtime(showtimeData);

    expect(result).toEqual(newShowtime);
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('theaters/name/Theater 1'));
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('movies/1'));
  });

  it('should throw an error if the theater is not found', async () => {
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
        if (url.includes('theaters')) {
          throw { response: { status: 404 } };
        } else if (url.includes('movies')) {
          const response: AxiosResponse = {
            data: { id: 1, title: 'Movie 1' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url, method: 'GET' } as any,
          };
          return of(response);
        }
        return of({} as AxiosResponse);
      });

    await expect(service.addShowtime({ 
      movieId: 1, 
      price: 10, 
      theater: 'Theater 1', 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString() 
    })).rejects.toThrow('Theater not found');

    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('theaters/name/Theater 1'));
  });

  it('should throw an error if there are overlapping showtimes', async () => {
    const theater = { id: 1, name: 'Theater 1', max_person: 100, address: '123 Theater St' };
    const overlappingShowtime = [
      {
        id: 1,
        theaterId: 1,
        startTime: new Date('2025-04-01T12:30:00.000Z'),
        endTime: new Date('2025-04-01T14:30:00.000Z'),
      },
    ];

    // Mock HTTP response for theater service
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
      const response: AxiosResponse = {
        data: theater,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url, method: 'GET' } as any,
      };
      return of(response);
    });

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
    const theater = { id: 1, name: 'Theater 1', max_person: 100, address: '123 Theater St' };
    const movie = { id: 1, title: 'Movie 1' };
    const newShowtime = { 
      id: 2, 
      movieId: movie.id, 
      theaterId: theater.id, 
      startTime: new Date('2025-04-01T15:00:00.000Z'), 
      endTime: new Date('2025-04-01T17:00:00.000Z'), 
      price: 10 
    };

    // Mock HTTP responses
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
      if (url.includes('theaters/name')) {
        const response: AxiosResponse = {
          data: theater,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url, method: 'GET' } as any,
        };
        return of(response);
      } else if (url.includes('movies')) {
        const response: AxiosResponse = {
          data: movie,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url, method: 'GET' } as any,
        };
        return of(response);
      }
      return of({} as AxiosResponse);
    });

    showtimeRepository.find.mockResolvedValue([]);
    showtimeRepository.create.mockReturnValue(newShowtime as any);
    showtimeRepository.save.mockResolvedValue(newShowtime as any);

    const result = await service.addShowtime({ 
      movieId: 1, 
      price: 10, 
      theater: 'Theater 1', 
      startTime: '2025-04-01T15:00:00.000Z', 
      endTime: '2025-04-01T17:00:00.000Z'
    });
    
    expect(result).toEqual(newShowtime);
  });

  it('should allow showtimes in different theaters at the same time', async () => {
    const theater2 = { 
      id: 2, 
      name: 'Theater 2', 
      address: '456 Cinema Ave', 
      max_person: 120 
    };
    const movie = { id: 1, title: 'Movie 1' };
    const newShowtime = { 
      id: 3, 
      movieId: movie.id, 
      theaterId: theater2.id, 
      startTime: new Date('2025-04-01T12:30:00.000Z'), 
      endTime: new Date('2025-04-01T14:30:00.000Z'), 
      price: 10 
    };

    // Mock HTTP responses
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
      if (url.includes('theaters/name')) {
        const response: AxiosResponse = {
          data: theater2,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url, method: 'GET' } as any,
        };
        return of(response);
      } else if (url.includes('movies')) {
        const response: AxiosResponse = {
          data: movie,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url, method: 'GET' } as any,
        };
        return of(response);
      }
      return of({} as AxiosResponse);
    });

    showtimeRepository.find.mockResolvedValue([]);
    showtimeRepository.create.mockReturnValue(newShowtime as any);
    showtimeRepository.save.mockResolvedValue(newShowtime as any);

    const result = await service.addShowtime({ 
      movieId: 1, 
      price: 10, 
      theater: 'Theater 2', 
      startTime: '2025-04-01T12:30:00.000Z', 
      endTime: '2025-04-01T14:30:00.000Z'
    });
    
    expect(result).toEqual(newShowtime);
  });
});