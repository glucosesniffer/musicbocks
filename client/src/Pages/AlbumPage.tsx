import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "../components/Toast";

interface Review {
  id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  username: string;
  user_id: number;
}

interface AlbumInfo {
  id: number;
  title: string;
  year: string;
  image: string;
  rating: number | null;
  review_text: string | null;
  artist_name: string;
  artist_id: number;
  reviews: Review[];
}

export const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [albumInfo, setInfo] = useState<AlbumInfo | null>(null);
  const [session, setSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  const fetchAlbumInfo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/album/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setInfo(data);
      setReviewText(data.review_text || "");

      // Check if user is logged in by checking if we got a rating field (even if null)
      // Also check localStorage as fallback
      const hasSession = localStorage.getItem("sessionId") !== null;
      setSession(hasSession);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching album:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbumInfo();
  }, [id]);

  const addRating = async (ratingValue: string) => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      setToast({ message: "Please login to rate albums", type: "warning" });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/review",
        {
          rating: Number(ratingValue),
          album_id: albumInfo?.id,
          review_text: reviewText || null,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        setToast({ message: "Rating saved!", type: "success" });
        await fetchAlbumInfo();
      }
    } catch (error: any) {
      console.error("Error adding rating:", error);
      const errorMsg = error.response?.data?.message || "Failed to save rating";
      setToast({ message: errorMsg, type: "error" });
    }
  };

  const saveReview = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      setToast({ message: "Please login to write reviews", type: "warning" });
      return;
    }

    if (!albumInfo) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/review",
        {
          rating: albumInfo.rating || 0,
          album_id: albumInfo.id,
          review_text: reviewText || null,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        setToast({ message: "Review saved!", type: "success" });
        await fetchAlbumInfo();
      }
    } catch (error: any) {
      console.error("Error saving review:", error);
      const errorMsg = error.response?.data?.message || "Failed to save review";
      setToast({ message: errorMsg, type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!albumInfo) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="alert alert-error">
          <span>Album not found</span>
        </div>
      </div>
    );
  }

  const currentRating = albumInfo.rating ? Number(albumInfo.rating) : 0;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Album Cover and Info */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={albumInfo.image}
              className="rounded-lg w-full max-w-md shadow-2xl"
              alt={albumInfo.title}
            />
            <div className="mt-6 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{albumInfo.title}</h1>
              <p className="text-lg text-base-content/60 mb-1">Album</p>
              {albumInfo.artist_name && (
                <p
                  className="text-base text-white cursor-pointer hover:underline mb-1"
                  onClick={() =>
                    navigate(
                      `/artist/${encodeURIComponent(albumInfo.artist_name)}`,
                    )
                  }
                >
                  by {albumInfo.artist_name}
                </p>
              )}
              <p className="text-sm text-base-content/50">{albumInfo.year}</p>
            </div>
          </div>

          {/* Rating and Review Section */}
          <div className="flex flex-col gap-6">
            {/* Rating Section */}
            <div
              className="card shadow-xl"
              style={{ backgroundColor: "#121212" }}
            >
              <div className="card-body">
                <h2 className="card-title text-white">Rate this Album</h2>
                <div className="rating rating-lg">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <input
                      key={starValue}
                      type="radio"
                      name="rating"
                      className="mask mask-star-2"
                      style={{
                        backgroundColor:
                          currentRating >= starValue ? "#1DB954" : "#4a4a4a",
                      }}
                      aria-label={`${starValue} star`}
                      value={starValue}
                      disabled={!session}
                      checked={currentRating === starValue}
                      onChange={(e) => addRating(e.target.value)}
                    />
                  ))}
                </div>
                {!session && (
                  <div className="alert alert-warning mt-4">
                    <span>Login to rate this album</span>
                  </div>
                )}
                {session && currentRating > 0 && (
                  <p className="text-sm text-white/60 mt-2">
                    Your rating: {currentRating} out of 5
                  </p>
                )}
              </div>
            </div>

            {/* Review Section */}
            <div
              className="card shadow-xl"
              style={{ backgroundColor: "#121212" }}
            >
              <div className="card-body">
                <h2 className="card-title text-white">Write a Review</h2>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder={
                    session
                      ? "Share your thoughts about this album..."
                      : "Login to write a review"
                  }
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={!session}
                />
                {session ? (
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn"
                      style={{
                        backgroundColor: "#3b82f6",
                        borderColor: "#3b82f6",
                        color: "white",
                      }}
                      onClick={saveReview}
                    >
                      Save Review
                    </button>
                  </div>
                ) : (
                  <div className="alert alert-info mt-4">
                    <span>Login to write a review</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Public Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          {albumInfo.reviews && albumInfo.reviews.length > 0 ? (
            <div className="space-y-4">
              {albumInfo.reviews.map((review) => (
                <div
                  key={review.id}
                  className="card shadow-lg"
                  style={{ backgroundColor: "#121212" }}
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-xs">
                              {review.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold">{review.username}</span>
                      </div>
                      <div className="rating rating-sm">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <input
                            key={starValue}
                            type="radio"
                            className="mask mask-star-2"
                            style={{
                              backgroundColor:
                                review.rating >= starValue
                                  ? "#1DB954"
                                  : "#4a4a4a",
                            }}
                            checked={review.rating === starValue}
                            readOnly
                          />
                        ))}
                      </div>
                    </div>
                    {review.review_text && (
                      <p className="text-white/80 mt-2">{review.review_text}</p>
                    )}
                    <p className="text-xs text-white/50 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <span>No reviews yet. Be the first to review this album!</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
