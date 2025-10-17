import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Navbar: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const sessionRef = useRef("");
  const userRef = useRef("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // console.log(password, username);
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`search/${encodeURIComponent(query)}`);
  }

  async function handleSignin() {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      sessionRef.current = res?.data.sessionId;
      userRef.current = res?.data.data;
      localStorage.setItem("sessionId", sessionRef.current);
      localStorage.setItem("userName", userRef.current);
      // window.location.reload();
      console.log(res.data);
    } catch (e: any) {
      console.log(e.message);
    }
  }
  async function handleLogout() {
    await axios.delete("http://localhost:5000/logout");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userName");
    // window.location.reload();
  }

  useEffect(() => {
    const id = localStorage.getItem("sessionId");
    const username = localStorage.getItem("userName");
    // console.log(id, username);
  }, []);
  return (
    <div className="bg-[#000000]">
      <div className="flex flex-row items-center justify-between p-4 w-[950px] mx-auto">
        <a href="/">
          <img src="/app-logo.png" className="w-[120px]" />
        </a>
        <ul className="flex space-x-4">
          {localStorage.getItem("sessionId") ? (
            <>
              <p>{localStorage.getItem("userName")}</p>
              <p
                onClick={handleLogout}
                className="hover:text-gray-400 cursor-pointer"
              >
                Logout
              </p>
            </>
          ) : (
            <button
              className="btn btn-sm"
              onClick={() => document.getElementById("my_modal_3")?.showModal()}
            >
              Login
            </button>
          )}
          <form method="dialog" onSubmit={handleSignin}>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box bg-[#121212] h-[250px]">
                <form method="dialog">
                  <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2 ">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Login</h3>
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
                  <button className="btn btn-sm mt-5 !bg-white !text-black">
                    Login
                  </button>
                </div>
              </div>
            </dialog>
          </form>
          <form onSubmit={handleSearch}>
            <li>
              <input
                className="rounded-md w-40 p-2 h-8 outline-none bg-[#1F1F1F]"
                placeholder="search: artist"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </li>
          </form>
        </ul>
      </div>
    </div>
  );
};
