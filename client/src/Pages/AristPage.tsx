import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ArtistPage: React.FC = () => {
  const { query } = useParams();
  const effect = useRef(false);
  const navigate = useNavigate();
  const [artistAlbums, setArtistAlbums] = useState([]);
  useEffect(() => {
    if (effect.current) return;
    effect.current = true;
    async function fetchAlbums() {
      const res = await fetch(
        `http://localhost:5000/artist/${encodeURIComponent(query)}`
      );
      const data = await res.json();
      console.log(data);
      setArtistAlbums(data);
    }
    fetchAlbums();
  }, []);
  function handleNavigate(albumId: number) {
    navigate(`/album/${albumId}`);
  }

  return (
    <div className="flex flex-col">
      <p>Albums for </p>
      <div className="container mx-auto grid grid-cols-4 gap-6">
        {artistAlbums.map((album) => (
          <div
            key={album?.id}
            onClick={() => handleNavigate(album?.id)}
            className="cursor-pointer hover:outline"
          >
            <img
              src={album?.image}
              alt={album?.name}
              className="w-full h-full object-cover rounded-md"
            />
            <p className="mt-2 text-center text-sm font-medium">
              {album?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
