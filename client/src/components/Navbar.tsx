
export const Navbar = () =>{
        return(
            <div className="bg-[#000000]">
                <div className="flex justify-between p-6 w-[950px] mx-auto">
                <p>logo and stuff</p>
               <ul className="flex space-x-4">
                    <li><a href="" className="!text-white hover:!text-gray-400 transition-colors duration-200 delay-100">Sign in</a></li> 
                    <li><a href="" className="!text-white hover:!text-gray-400 transition-colors duration-200 delay-100">Albums</a></li>
                    <input className="rounded-xl w-40 p-2 h-7 outline-none bg-[#1F1F1F]"></input>
                </ul>
                </div> 
            </div>
        )
}