import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "../components/Toast";

interface Artist {
  id: number;
  name: string;
  image: string | null;
  genre: string | null;
}

export const ArtistPage: React.FC = () => {
  const { query } = useParams();
  const effect = useRef(false);
  const navigate = useNavigate();
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistRating, setArtistRating] = useState<number>(0);
  const [session, setSession] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);
  useEffect(() => {
    if (effect.current) return;
    effect.current = true;
    const sessionId = localStorage.getItem("sessionId");
    setSession(!!sessionId);

    async function fetchAlbums() {
      try {
        const res = await fetch(
          `http://localhost:5000/artist/${encodeURIComponent(query || "")}`,
        );
        const data = await res.json();
        console.log("Albums data:", data);
        if (data.artist && data.albums) {
          setArtist(data.artist);
          setArtistAlbums(data.albums);
          if (sessionId) {
            fetchArtistRating(data.artist.id);
          }
        } else if (Array.isArray(data)) {
          setArtistAlbums(data);
        } else if (data.success === false) {
          console.error("Error fetching albums:", data.message);
          setArtistAlbums([]);
        } else {
          setArtistAlbums([]);
        }
      } catch (error) {
        console.error("Failed to fetch albums:", error);
        setArtistAlbums([]);
      }
    }
    fetchAlbums();
  }, [query]);

  const fetchArtistRating = async (artistId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/artist/${artistId}/rating`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success && res.data.rating) {
        setArtistRating(res.data.rating);
      }
    } catch (error) {
      // Rating might not exist, that's okay
    }
  };

  const addArtistRating = async (ratingValue: string) => {
    if (!session || !artist) {
      setToast({ message: "Please login to rate artists", type: "warning" });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/artist/rating",
        {
          rating: Number(ratingValue),
          artist_id: artist.id,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        setArtistRating(Number(ratingValue));
        setToast({ message: "Artist rating saved!", type: "success" });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to save rating";
      setToast({ message: errorMsg, type: "error" });
    }
  };
  function handleNavigate(albumId: number) {
    navigate(`/album/${albumId}`);
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Albums by {query}</h1>
          {artist && (
            <div className="flex justify-center items-center gap-4 mb-6">
              {artist.image && (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                {artist.genre && (
                  <p className="text-sm text-base-content/60">{artist.genre}</p>
                )}
                {session && (
                  <div className="mt-2">
                    <p className="text-sm mb-2">Rate this Artist:</p>
                    <div className="rating rating-md">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <input
                          key={starValue}
                          type="radio"
                          name="artist-rating"
                          className="mask mask-star-2"
                          style={{
                            backgroundColor:
                              artistRating >= starValue ? "#fbbf24" : "#4a4a4a",
                          }}
                          value={starValue}
                          checked={artistRating === starValue}
                          onChange={(e) => addArtistRating(e.target.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {!session && (
                  <p className="text-xs text-base-content/60 mt-2">
                    Login to rate this artist
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        {artistAlbums.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="alert alert-info">
              <span>No albums found. Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {artistAlbums.map((album) => (
              <div
                key={album?.id}
                className="cursor-pointer transform hover:scale-105 transition-all"
                onClick={() => handleNavigate(album?.id)}
              >
                <div className="aspect-square w-full">
                  <img
                    src={album?.image || "/placeholder.png"}
                    alt={album?.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold line-clamp-2 leading-tight">
                    {album?.title}
                  </h3>
                  {album?.year && (
                    <p className="text-xs text-base-content/60 mt-1">
                      {album.year}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
