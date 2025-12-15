import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "../components/Toast";

interface Review {
  review_id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  album_id: number;
  title: string;
  year: string;
  image: string;
  artist_name: string;
  artist_id: number;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile_picture: string | null;
}

export const ProfilePage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editText, setEditText] = useState<string>("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/profile", {
        withCredentials: true,
      });
      if (res.data.success) {
        setProfile(res.data.data);
        setProfilePictureUrl(res.data.data.profile_picture || "");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setToast({
          message: "Please login to view your profile",
          type: "error",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/profile/reviews", {
        withCredentials: true,
      });
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setToast({
          message: "Please login to view your profile",
          type: "error",
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        setToast({ message: "Failed to load reviews", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await axios.put(
          "http://localhost:5000/profile/picture",
          { profile_picture: base64String },
          { withCredentials: true },
        );
        if (res.data.success) {
          setProfilePictureUrl(base64String);
          setToast({ message: "Profile picture updated!", type: "success" });
          await fetchProfile();
        }
      } catch (error: any) {
        setToast({
          message:
            error.response?.data?.message || "Failed to update profile picture",
          type: "error",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (review: Review) => {
    setEditingReview(review.review_id);
    setEditRating(review.rating);
    setEditText(review.review_text || "");
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditText("");
  };

  const saveEdit = async (reviewId: number) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/review/update",
        {
          review_id: reviewId,
          rating: editRating,
          review_text: editText,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        setToast({ message: "Review updated!", type: "success" });
        await fetchReviews();
        setEditingReview(null);
      }
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Failed to update review",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {profilePictureUrl ? (
                  <img src={profilePictureUrl} alt={profile?.username} />
                ) : (
                  <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 flex items-center justify-center text-2xl">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile?.username}</h2>
              <p className="text-sm text-base-content/60">{profile?.email}</p>
              <label className="btn btn-sm btn-outline mt-2 cursor-pointer">
                Upload Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
        {reviews.length === 0 ? (
          <div className="alert alert-info">
            <span>
              You haven't reviewed any albums yet. Start rating albums to see
              them here!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div
                key={review.review_id}
                className="card bg-base-200 shadow-xl"
              >
                <div className="card-body">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={review.image}
                        alt={review.title}
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                        onClick={() => navigate(`/album/${review.album_id}`)}
                      />
                    </div>
                    <div className="flex-grow">
                      <h2
                        className="card-title cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/album/${review.album_id}`)}
                      >
                        {review.title}
                      </h2>
                      <p
                        className="text-sm text-base-content/60 cursor-pointer hover:text-primary"
                        onClick={() =>
                          navigate(
                            `/artist/${encodeURIComponent(review.artist_name)}`,
                          )
                        }
                      >
                        by {review.artist_name}
                      </p>
                      {review.year && (
                        <p className="text-xs text-base-content/50">
                          {review.year}
                        </p>
                      )}

                      {editingReview === review.review_id ? (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="label">
                              <span className="label-text">Rating</span>
                            </label>
                            <div className="rating rating-lg">
                              {[1, 2, 3, 4, 5].map((starValue) => (
                                <input
                                  key={starValue}
                                  type="radio"
                                  name={`edit-rating-${review.review_id}`}
                                  className="mask mask-star-2 bg-yellow-400"
                                  checked={editRating === starValue}
                                  onChange={() => setEditRating(starValue)}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Review</span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered w-full h-32"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              placeholder="Write your review..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => saveEdit(review.review_id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <div className="rating rating-sm mb-2">
                            {[1, 2, 3, 4, 5].map((starValue) => (
                              <input
                                key={starValue}
                                type="radio"
                                className="mask mask-star-2 bg-yellow-400"
                                checked={review.rating === starValue}
                                readOnly
                              />
                            ))}
                          </div>
                          {review.review_text && (
                            <p className="text-base-content/80 mt-2">
                              {review.review_text}
                            </p>
                          )}
                          <button
                            className="btn btn-sm btn-outline mt-4"
                            onClick={() => startEdit(review)}
                          >
                            Edit Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
