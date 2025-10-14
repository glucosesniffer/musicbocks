import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MainPage: React.FC = () => {
  const [data, setData] = useState<{
    data: { image: string; id: number; title: string; year: string }[];
  }>();
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
  function handleNavigate(albumId: number) {
    navigate(`album/${albumId}`);
  }

  return (
    <div className="flex flex-col">
      <div>
        <p>hero banner</p>
      </div>
      <div className="grid grid-cols-4 gap-6 justify-items-center">
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
