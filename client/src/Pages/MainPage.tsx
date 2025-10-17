import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const MainPage: React.FC = () => {
  const [data, setData] = useState<{
    data: { image: string; id: number; title: string; year: string }[];
  }>();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const effect = useRef(false);
  useEffect(() => {
    if (effect.current) return;
    effect.current = true;
    const fetchAlbumforMain = async (): Promise<void> => {
      const res = await fetch("http://localhost:5000/");
      const data = await res.json();
      //console.log(data);
      setData(data);
    };
    fetchAlbumforMain();
  }, []);

  async function handleSignUp() {
    try {
      const res = await axios.post("http://localhost:5000/signup", {
        username,
        password,
        email,
      });
      if (res.status === 200) {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  function handleNavigate(albumId: number) {
    navigate(`album/${albumId}`);
  }

  return (
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
        <form method="dialog" onSubmit={handleSignUp}>
          <dialog id="my_modal_4" className="modal">
            <div className="modal-box bg-[#121212] h-[320px]">
              <form method="dialog">
                <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2 ">
                  ✕
                </button>
              </form>
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
              <div className="validator-hint hidden">Enter Valid Username</div>
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
                <button className="btn btn-sm mt-5 !bg-white !text-black">
                  Sign Up
                </button>
              </div>
            </div>
          </dialog>
        </form>
      </div>
      <p className="text-gray-200 font-bold">Popular Albums this Week</p>
      <div className="grid grid-cols-4 gap-6 justify-items-center flex justify-between p-6 w-[950px] mx-auto my-5">
        {data?.data?.map((album) => (
          <div
            key={album?.id}
            className="flex flex-col cursor-pointer hover:!text-zinc-400 transition-colors duration-200 delay-100"
            onClick={() => handleNavigate(album?.id)}
          >
            <img
              src={album?.image}
              alt="Image"
              className="object-cover w-[200px] h-[200px] rounded-md flex hover:outline cursor-pointer"
            />
            <p className="mt-2 cursor-pointer hover:!text-zinc-400 transition-colors duration-200 delay-100 max-w-[240px]">
              {album?.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
