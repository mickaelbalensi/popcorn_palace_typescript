import { useState } from "react";

const AddMovieForm = () => {
  const [movie, setMovie] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    releaseYear: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const MOVIES_API_URL = import.meta.env.VITE_MOVIES_SERVICE_URL || 'http://localhost:3001',
    const response = await fetch(`${MOVIES_API_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...movie,
        duration: Number(movie.duration),
        rating: Number(movie.rating),
        releaseYear: Number(movie.releaseYear),
      }),
    });

    if (response.ok) {
      alert("Movie added successfully!");
      setMovie({ title: "", genre: "", duration: "", rating: "", releaseYear: "" });
    } else {
      alert("Error adding movie!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add a New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "genre", "duration", "rating", "releaseYear"].map((field) => (
          <div key={field}>
            <label className="block font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={movie[field as keyof typeof movie]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovieForm;