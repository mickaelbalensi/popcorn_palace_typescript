import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from '../src/booking.service'; 
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from '../src/booking.entity';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

// Define better mock types that match the actual services
interface MockRepository<T = any> {
  save: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  [key: string]: any;
}

interface MockHttpService {
  get: jest.Mock;
  [key: string]: any;
}

interface MockConfigService {
  get: jest.Mock;
  [key: string]: any;
}

// Create factory functions for mocks
const mockBookingRepository = (): MockRepository<Booking> => ({
  save: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

const mockHttpService = (): MockHttpService => ({
  get: jest.fn(),
});

const mockConfigService = (): MockConfigService => ({
  get: jest.fn(),
});

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: MockRepository<Booking>;
  let httpService: MockHttpService;
  let configService: MockConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useFactory: mockBookingRepository,
        },
        {
          provide: HttpService,
          useFactory: mockHttpService,
        },
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get(getRepositoryToken(Booking));
    httpService = module.get(HttpService) as unknown as MockHttpService;
    configService = module.get(ConfigService) as unknown as MockConfigService;

    // Setup config service default values
    configService.get.mockImplementation((key: string) => {
      if (key === 'SHOWTIMES_SERVICE_URL') return 'http://showtime-service:3003';
      if (key === 'THEATERS_SERVICE_URL') return 'http://theater-service:3002';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow a customer to book a seat for an available showtime', async () => {
    // Mock data
    const userId = '123';
    const showtimeId = 1;
    const seatNumber = 1;
    const bookingId = 1;
    const theaterId = 1;
    
    // Mock API responses
    const showtime = { 
      id: showtimeId,
      theaterId: theaterId,
      movie: { id: 1, title: 'Movie 1' },
      start_time: new Date().toISOString(), 
      end_time: new Date().toISOString() 
    };
    
    const theater = {
      id: theaterId,
      name: 'Theater 1',
      address: '123 Street',
      max_person: 100
    };
    
    // Mock HTTP responses with RxJS observables
    httpService.get.mockImplementation((url: string) => {
      if (url.includes(`/showtimes/${showtimeId}`)) {
        return of({
          data: showtime,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
        } as AxiosResponse);
      }
      if (url.includes(`/theaters/${theaterId}`)) {
        return of({
          data: theater,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
        } as AxiosResponse);
      }
      return of({
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { url },
      } as AxiosResponse);
    });

    // Mock repository methods
    bookingRepository.findOne.mockResolvedValue(null); // Seat not booked yet
    bookingRepository.create.mockReturnValue({ 
      id: bookingId, 
      showtimeId, 
      seatNumber, 
      userId,
      createdAt: new Date()
    });
    bookingRepository.save.mockResolvedValue({ id: bookingId });

    const result = await service.bookTicket(showtimeId, seatNumber, userId);

    expect(result).toEqual({ bookingId });
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining(`/showtimes/${showtimeId}`));
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining(`/theaters/${theaterId}`));
    expect(bookingRepository.findOne).toHaveBeenCalledWith({
      where: { showtimeId, seatNumber },
    });
    expect(bookingRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      showtimeId,
      seatNumber,
      userId,
    }));
  });

  it('should not allow a customer to book a seat that is already booked', async () => {
    // Mock data
    const userId = '123';
    const showtimeId = 1;
    const seatNumber = 1;
    const theaterId = 1;
    
    // Mock existing booking
    const existingBooking = { 
      id: 1, 
      showtimeId, 
      seatNumber, 
      userId 
    };
    
    // Mock API responses
    const showtime = { 
      id: showtimeId,
      theaterId: theaterId,
      movie: { id: 1, title: 'Movie 1' },
      start_time: new Date().toISOString(), 
      end_time: new Date().toISOString() 
    };
    
    const theater = {
      id: theaterId,
      name: 'Theater 1',
      address: '123 Street',
      max_person: 100
    };
    
    // Mock HTTP responses
    httpService.get.mockImplementation((url: string) => {
      if (url.includes(`/showtimes/${showtimeId}`)) {
        return of({
          data: showtime,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
        } as AxiosResponse);
      }
      if (url.includes(`/theaters/${theaterId}`)) {
        return of({
          data: theater,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
        } as AxiosResponse);
      }
      return of({
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { url },
      } as AxiosResponse);
    });

    bookingRepository.findOne.mockResolvedValue(existingBooking);

    await expect(service.bookTicket(showtimeId, seatNumber, userId)).rejects.toThrow(ConflictException);
    
    expect(bookingRepository.findOne).toHaveBeenCalledWith({
      where: { showtimeId, seatNumber },
    });
    
    expect(bookingRepository.save).not.toHaveBeenCalled();
  });

  it('should handle showtime not found error', async () => {
    const userId = '123';
    const showtimeId = 999; // Non-existent showtime
    const seatNumber = 1;
    
    // Mock HTTP error for showtime not found
    httpService.get.mockImplementation((url: string) => {
      if (url.includes(`/showtimes/${showtimeId}`)) {
        return throwError(() => ({
          response: {
            status: 404,
            data: 'Not found'
          }
        }));
      }
      return of({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url },
      } as AxiosResponse);
    });

    await expect(service.bookTicket(showtimeId, seatNumber, userId)).rejects.toThrow(NotFoundException);
  });

  it('should handle theater not found error', async () => {
    const userId = '123';
    const showtimeId = 1;
    const seatNumber = 1;
    const theaterId = 999; // Non-existent theater
    
    // Mock showtime with non-existent theater
    const showtime = { 
      id: showtimeId,
      theaterId: theaterId,
      movie: { id: 1, title: 'Movie 1' },
      start_time: new Date().toISOString(), 
      end_time: new Date().toISOString() 
    };
    
    // Mock HTTP responses
    httpService.get.mockImplementation((url: string) => {
      if (url.includes(`/showtimes/${showtimeId}`)) {
        return of({
          data: showtime,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
        } as AxiosResponse);
      }
      if (url.includes(`/theaters/${theaterId}`)) {
        return throwError(() => ({
          response: {
            status: 404,
            data: 'Not found'
          }
        }));
      }
      return of({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url },
      } as AxiosResponse);
    });

    await expect(service.bookTicket(showtimeId, seatNumber, userId)).rejects.toThrow(NotFoundException);
  });

  it('should validate seat number against theater capacity', async () => {
    const userId = '123';
    const showtimeId = 1;
    const seatNumber = 101; // Exceeds max_person (100)
    const theaterId = 1;
    
    // Mock API responses
    const showtime = { 
      id: showtimeId,
      theaterId: theaterId,
      movie: { id: 1, title: 'Movie 1' },
      start_time: new Date().toISOString(), 
      end_time: new Date().toISOString() 
    };
    
    const theater = {
      id: theaterId,
      name: 'Theater 1',
      address: '123 Street',
      max_person: 100
    };
    
    // Mock HTTP responses
    httpService.get.mockImplementation((url: string) => {
      if (url.includes(`/showtimes/${showtimeId}`)) {
        return of({
          data: showtime,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
        } as AxiosResponse);
      }
      if (url.includes(`/theaters/${theaterId}`)) {
        return of({
          data: theater,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
        } as AxiosResponse);
      }
      return of({
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { url },
      } as AxiosResponse);
    });

    await expect(service.bookTicket(showtimeId, seatNumber, userId)).rejects.toThrow(BadRequestException);
  });
});