import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Artist {
  id: number;
  artistName: string;
  artistImageURL: string;
  artistGenre: string;
}

const SearchPage: React.FC = () => {
  const { query } = useParams();
  const referenceToEffect = useRef(false);
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (referenceToEffect.current) return;
    referenceToEffect.current = true; //once effect has run
    setLoading(true);
    setError(null);
    const fetchArtistData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/search/${query}`);
        const data = await res.json();
        if (data.success === false) {
          console.error("Search error:", data.message);
          setError(data.message || "No artists found");
          setArtists([]);
        } else if (Array.isArray(data)) {
          setArtists(data);
          setError(null);
        } else {
          setArtists([]);
          setError("No artists found");
        }
      } catch (error) {
        console.error("Failed to fetch artists:", error);
        setError("Failed to search. Please try again.");
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtistData();
  }, [query]);

  function handleArtistClick(artistName: string) {
    navigate(`/artist/${encodeURIComponent(artistName)}`);
  }

  return (
    <div className="flex flex-col w-full">
      <p className="!text-2xl font-bold mb-6">Search Results for "{query}"</p>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : artists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => handleArtistClick(artist.artistName)}
            >
              <figure className="px-6 pt-6">
                <img
                  src={artist.artistImageURL || "/placeholder.png"}
                  alt={artist.artistName}
                  className="rounded-full w-32 h-32 object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{artist.artistName}</h2>
                {artist.artistGenre && (
                  <p className="text-sm text-base-content/60">
                    {artist.artistGenre}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <span>No results found</span>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
