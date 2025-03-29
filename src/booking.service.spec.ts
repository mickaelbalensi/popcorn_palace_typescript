import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking/booking.service';  
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from './showtimes/entities/showtime.entity';  
import { Booking } from './booking/entities/booking.entity';  
import { User } from './users/entities/user.entity';  
import { Theater } from './theaters/entities/theater.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

const mockShowtimeRepository = () => ({
  findOne: jest.fn(),
});

const mockBookingRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

const mockTheaterRepository = () => ({
  findOne: jest.fn(),
});

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('BookingService', () => {
  let service: BookingService;
  let showtimeRepository: jest.Mocked<Repository<Showtime>>;
  let bookingRepository: jest.Mocked<Repository<Booking>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let theaterRepository: jest.Mocked<Repository<Theater>>;
  let logger: typeof mockLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Showtime),
          useFactory: mockShowtimeRepository,
        },
        {
          provide: getRepositoryToken(Booking),
          useFactory: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Theater),
          useFactory: mockTheaterRepository,
        },
        {
          provide: 'Logger', 
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    showtimeRepository = module.get(getRepositoryToken(Showtime));
    bookingRepository = module.get(getRepositoryToken(Booking));
    userRepository = module.get(getRepositoryToken(User));
    theaterRepository = module.get(getRepositoryToken(Theater));
    logger = module.get('Logger');
  });

  it('should allow a customer to book a seat for an available showtime', async () => {
    const user = { id: '123', name: 'John Doe' };
    const theater = { id: 1, name: 'Theater 1', address: '123 Street', max_person: 100 };
    const movie = { id: 1, title: 'Movie 1' };
    const showtime = { id: 1, movie, theater, start_time: new Date(), end_time: new Date() };
    const newBooking = { id: 1, showtime, seatNumber: 1, user };

    showtimeRepository.findOne.mockResolvedValue(showtime as any);
    bookingRepository.findOne.mockResolvedValue(null); 
    bookingRepository.create.mockReturnValue(newBooking as any);  
    bookingRepository.save.mockResolvedValue(newBooking as any);
    userRepository.findOne.mockResolvedValue(user as any);

    const result = await service.bookTicket(1, 1, '123');

    expect(result).toEqual({ bookingId: 1 }); 
    expect(bookingRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      showtime,
      seatNumber: 1,
      user,
    }));
  });

  it('should not allow a customer to book a seat that is already booked', async () => {
    const user = { id: '123', name: 'John Doe' };
    const theater = { id: 1, name: 'Theater 1', address: '123 Street', max_person: 100 };
    const movie = { id: 1, title: 'Movie 1' };
    const showtime = { id: 1, movie, theater, start_time: new Date(), end_time: new Date() };
    const existingBooking = { id: 1, showtime, seatNumber: 1, user };
    
    showtimeRepository.findOne.mockResolvedValue(showtime as any);
    bookingRepository.findOne.mockResolvedValue(existingBooking as any); 
    userRepository.findOne.mockResolvedValue(user as any);

    await expect(service.bookTicket(1, 1, '123')).rejects.toThrowError(
      'Seat 1 is already booked for this showtime'
    );

    expect(bookingRepository.findOne).toHaveBeenCalledWith({
      where: { showtime: { id: 1 }, seatNumber: 1 },
    });
    
    expect(bookingRepository.save).not.toHaveBeenCalled();
  });
});