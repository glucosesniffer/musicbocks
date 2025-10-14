import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`search/${encodeURIComponent(query)}`);
  }
  function handleSignin(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="bg-[#000000]">
      <div className="flex flex-row items-center justify-between p-4 w-[950px] mx-auto">
        <a href="/">
          <img src="/app-logo.png" className="w-[120px]" />
        </a>
        <ul className="flex space-x-4">
          <button
            className="btn btn-sm"
            onClick={() => document.getElementById("my_modal_3")?.showModal()}
          >
            Login
          </button>
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
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input type="email" placeholder="mail@site.com" required />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
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
                  minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
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
