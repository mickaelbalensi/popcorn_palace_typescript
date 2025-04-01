import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../src/movies/movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../src/movies/entities/movie.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

// Create a mock for the movie repository
const mockMovieRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies = [
        { id: 1, title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8.8, releaseYear: 2010 },
        { id: 2, title: 'The Dark Knight', genre: 'Action', duration: 152, rating: 9.0, releaseYear: 2008 },
      ];

      // Mock repository find method
      mockMovieRepository.find.mockReturnValue(movies);

      const result = await service.findAll();
      expect(result).toEqual(movies);
      expect(mockMovieRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const movieData = { title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8.8, releaseYear: 2010 };

      // Mock repository create method
      mockMovieRepository.create.mockReturnValue(movieData);
      mockMovieRepository.save.mockReturnValue(movieData);

      const result = await service.create(movieData);

      expect(result).toEqual(movieData);
      expect(mockMovieRepository.create).toHaveBeenCalledWith(movieData);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(movieData);
    });

    it('should throw conflict exception if movie with same title already exists', async () => {
      const movieData = { title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8.8, releaseYear: 2010 };
      
      mockMovieRepository.findOne.mockResolvedValue({ id: 1, ...movieData });

      await expect(service.create(movieData))
        .rejects
        .toThrow(ConflictException);
      
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { title: movieData.title } });
      expect(mockMovieRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateByTitle', () => {
    it('should update a movie by title', async () => {
      const existingMovie = { id: 1, title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8.8, releaseYear: 2010 };
      const updatedData = { title: 'Inception', genre: 'Sci-Fi', duration: 150, rating: 9.0, releaseYear: 2010 };

      // Mock repository findOne and save methods
      mockMovieRepository.findOne.mockReturnValue(existingMovie);
      mockMovieRepository.save.mockReturnValue({ ...existingMovie, ...updatedData });

      const result = await service.updateByTitle('Inception', updatedData);

      expect(result.title).toBe(updatedData.title);
      expect(result.duration).toBe(updatedData.duration);
      expect(result.rating).toBe(updatedData.rating);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { title: 'Inception' } });
      expect(mockMovieRepository.save).toHaveBeenCalledWith({ ...existingMovie, ...updatedData });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieRepository.findOne.mockReturnValue(null);

      await expect(service.updateByTitle('Nonexistent Movie', { title: 'New Title', genre: 'New Genre', duration: 120, rating: 7.5, releaseYear: 2022 }))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('deleteMovieByTitle', () => {
    it('should delete a movie by title', async () => {
      const existingMovie = { id: 1, title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8.8, releaseYear: 2010 };

      // Mock repository findOne and delete methods
      mockMovieRepository.findOne.mockReturnValue(existingMovie);
      mockMovieRepository.delete.mockReturnValue({ affected: 1 });

      const result = await service.deleteMovieByTitle('Inception');

      expect(result).toBeUndefined();
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { title: 'Inception' } });
      expect(mockMovieRepository.delete).toHaveBeenCalledWith({ id: existingMovie.id });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieRepository.findOne.mockReturnValue(null);

      await expect(service.deleteMovieByTitle('Nonexistent Movie'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});