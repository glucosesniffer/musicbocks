import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "../components/Toast";

export const MainPage: React.FC = () => {
  const [data, setData] = useState<{
    data: { image: string; id: number; title: string; year: string }[];
  }>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);
  const navigate = useNavigate();
  const effect = useRef(false);
  useEffect(() => {
    if (effect.current) return;
    effect.current = true;
    const fetchAlbumforMain = async (): Promise<void> => {
      try {
        const res = await fetch("http://localhost:5000/");
        if (!res.ok) {
          console.error("Failed to fetch albums:", res.statusText);
          return;
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
        // Server might not be running - this is expected if backend is down
      }
    };
    fetchAlbumforMain();
  }, []);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", {
        username,
        password,
        email,
      });
      if (res.data.success) {
        setToast({ message: "Account created successfully!", type: "success" });
        document.getElementById("my_modal_4")?.close();
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.message || e.response?.data?.error || "Signup failed";
      setToast({ message: errorMsg, type: "error" });
    }
  }

  function handleNavigate(albumId: number) {
    navigate(`album/${albumId}`);
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
      <div className="flex flex-col">
        <div
          className="relative h-[500px] flex flex-col justify-center mb-10 items-center bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/coversite.png')" }}
        >
          <div className="absolute inset-0 z-0 bg-black/50"></div>
          <h1 className="font-bold mb-10 z-10">Musicbocks</h1>
          <p className="font-bold text-3xl z-10">
            Track albums you've listened to.
          </p>
          <button
            className="btn btn-lg w-full max-w-[200px] mt-5 !bg-white !text-black z-10"
            onClick={() => document.getElementById("my_modal_4").showModal()}
          >
            Get Started Here!
          </button>
          <dialog id="my_modal_4" className="modal">
            <div className="modal-box bg-[#121212] h-[320px]">
              <button
                className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => document.getElementById("my_modal_4")?.close()}
              >
                ✕
              </button>
              <form onSubmit={handleSignUp}>
                <h3 className="font-bold text-lg">Sign Up</h3>
                <label className="input validator join-item mt-5 bg-[#1F1F1F]">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  <input
                    type="email"
                    placeholder="mail@site.com"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="input validator mt-5 bg-[#1F1F1F]">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <input
                    type="username"
                    placeholder="username32"
                    required
                    value={username}
                    onChange={(e: any) => setUsername(e.target.value)}
                  />
                </label>
                <div className="validator-hint hidden">
                  Enter Valid Username
                </div>
                <label className="input validator mt-5 bg-[#1F1F1F]">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle
                        cx="16.5"
                        cy="7.5"
                        r=".5"
                        fill="currentColor"
                      ></circle>
                    </g>
                  </svg>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    minLength="4"
                    onChange={(e: any) => setPassword(e.target.value)}
                    value={password}
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  />
                </label>
                <p className="validator-hint hidden">
                  Must be more than 8 characters, including
                  <br />
                  At least one number <br />
                  At least one lowercase letter <br />
                  At least one uppercase letter
                </p>
                <div className="w-full">
                  <button
                    type="submit"
                    className="btn btn-sm mt-5 !bg-white !text-black"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <h2 className="text-2xl font-bold mb-6">Popular Albums this Week</h2>
          {data?.data && data.data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data.data.slice(0, 5).map((album) => (
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
          ) : (
            <div className="alert alert-info">
              <span>
                No albums available yet. Search for an artist to get started!
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
