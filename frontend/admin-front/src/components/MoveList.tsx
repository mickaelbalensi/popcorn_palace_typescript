// // components/MovieList.jsx
// import React from 'react';

// function MovieList({ movies, onViewMovie, onEditMovie, onDeleteMovie }) {
//   return (
//     <div className="movie-list">
//       <h2>All Movies</h2>
//       {movies.length === 0 ? (
//         <p>No movies found. Add a new movie!</p>
//       ) : (
//         <div className="movie-grid">
//           {movies.map((movie) => (
//             <div key={movie.id} className="movie-card">
//               <div className="movie-poster">
//                 {movie.posterUrl ? (
//                   <img src={movie.posterUrl} alt={`${movie.title} poster`} />
//                 ) : (
//                   <div className="placeholder-poster">{movie.title.charAt(0)}</div>
//                 )}
//               </div>
//               <div className="movie-info">
//                 <h3>{movie.title}</h3>
//                 <p>{movie.year}</p>
//                 <p>{movie.genre}</p>
//               </div>
//               <div className="movie-actions">
//                 <button onClick={() => onViewMovie(movie.id)}>View</button>
//                 <button onClick={() => onEditMovie(movie)}>Edit</button>
//                 <button onClick={() => onDeleteMovie(movie.title)}>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MovieList;

// // components/MovieForm.jsx
// import React, { useState, useEffect } from 'react';

// function MovieForm({ movie, onSubmit, onCancel }) {
//   const [formData, setFormData] = useState({
//     title: '',
//     director: '',
//     year: '',
//     genre: '',
//     synopsis: '',
//     posterUrl: '',
//     rating: '',
//   });

//   useEffect(() => {
//     if (movie) {
//       setFormData({
//         title: movie.title || '',
//         director: movie.director || '',
//         year: movie.year || '',
//         genre: movie.genre || '',
//         synopsis: movie.synopsis || '',
//         posterUrl: movie.posterUrl || '',
//         rating: movie.rating || '',
//       });
//     }
//   }, [movie]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <div className="movie-form">
//       <h2>{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="title">Title</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="director">Director</label>
//           <input
//             type="text"
//             id="director"
//             name="director"
//             value={formData.director}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="year">Year</label>
//             <input
//               type="number"
//               id="year"
//               name="year"
//               value={formData.year}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="genre">Genre</label>
//             <input
//               type="text"
//               id="genre"
//               name="genre"
//               value={formData.genre}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="synopsis">Synopsis</label>
//           <textarea
//             id="synopsis"
//             name="synopsis"
//             value={formData.synopsis}
//             onChange={handleChange}
//             rows="4"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="posterUrl">Poster URL</label>
//           <input
//             type="url"
//             id="posterUrl"
//             name="posterUrl"
//             value={formData.posterUrl}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="rating">Rating</label>
//           <input
//             type="number"
//             id="rating"
//             name="rating"
//             min="1"
//             max="10"
//             step="0.1"
//             value={formData.rating}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-actions">
//           <button type="button" onClick={onCancel}>
//             Cancel
//           </button>
//           <button type="submit">
//             {movie ? 'Update Movie' : 'Add Movie'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default MovieForm;

// // components/MovieDetails.jsx
// import React from 'react';

// function MovieDetails({ movie, onBack, onEdit, onDelete }) {
//   return (
//     <div className="movie-details">
//       <div className="movie-details-header">
//         <h2>{movie.title}</h2>
//         <div className="movie-details-actions">
//           <button onClick={onBack}>Back</button>
//           <button onClick={onEdit}>Edit</button>
//           <button onClick={onDelete}>Delete</button>
//         </div>
//       </div>

//       <div className="movie-details-content">
//         <div className="movie-details-poster">
//           {movie.posterUrl ? (
//             <img src={movie.posterUrl} alt={`${movie.title} poster`} />
//           ) : (
//             <div className="placeholder-poster large">
//               {movie.title.charAt(0)}
//             </div>
//           )}
//         </div>

//         <div className="movie-details-info">
//           <p><strong>Director:</strong> {movie.director}</p>
//           <p><strong>Year:</strong> {movie.year}</p>
//           <p><strong>Genre:</strong> {movie.genre}</p>
//           {movie.rating && <p><strong>Rating:</strong> {movie.rating}/10</p>}
          
//           <div className="movie-details-synopsis">
//             <h3>Synopsis</h3>
//             <p>{movie.synopsis || 'No synopsis available.'}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MovieDetails;