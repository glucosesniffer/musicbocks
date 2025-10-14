import { useEffect, useRef, useState } from "react";

export const MainPage: React.FC = () => {
  const [data, setData] = useState<{
    data: { image: string; id: number; title: string; year: string }[];
  }>();
  const effect = useRef(false);
  useEffect(() => {
    if (effect.current) return;
    effect.current = true;
    const fetchAlbumforMain = async (): Promise<void> => {
      const res = await fetch("http://localhost:5000/");
      const data = await res.json();
      console.log(data);
      setData(data);
    };
    fetchAlbumforMain();
  }, []);

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
          >
            <img
              src={album?.image}
              alt="Image"
              className="object-cover w-[200px] h-[200px] rounded-md flex hover:outline cursor-pointer"
            />
            <p className="mt-2 cursor-pointer hover:!text-zinc-400 transition-colors duration-200 delay-100 max-w-[240px]">
              {album?.title}
            </p>
            <p className="text-xs text-zinc-500">{album?.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
