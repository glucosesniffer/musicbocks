import { useEffect, useRef, useState } from "react"

export const MainPage: React.FC = () =>{
    const [data, setData] = useState<{data:{image:string, id: number}[]}>()
    const effect = useRef(false)
    useEffect(()=>{
        if (effect.current) return 
        effect.current = true
        const fetchAlbumforMain = async(): Promise<void> =>{
            const res = await fetch("http://localhost:5000/")
            const data = await res.json()
            console.log(data)
            setData(data)
        }
        fetchAlbumforMain()
    },[])

            return(
                <div className="flex flex-col">
                <div>
                    <p>hero banner</p> 
                </div>
                <div className="flex flex-row flex-wrap">
            {data?.data?.map((album) => (
                    <img key={album?.id} src={album?.image} alt="Image" className="object-cover w-[200px] h-[200px] rounded-md flex ml-5 mt-5 hover:outline cursor-pointer" />
            ))}
                </div>
                </div>
            )   
}