import { useState, useRef, useEffect } from "react"
import { GiEarthCrack, GiHotSurface } from "react-icons/gi";
import { FaVolcano } from "react-icons/fa6";

const NavBar = (props) => {

    const [expand, setExpand] = useState(false)

    var ref = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (ref.current) {
                if (!ref.current.contains(e.target)) {
                    setExpand(false);
                }
            }
        }
        document.addEventListener("mousedown", handler)
    })

    return (
        <div className="text-[#FFFFFF] h-full w-full relative">
            <div className={`absolute p-2 flex cursor-pointer ${expand ? '-translate-x-full' : 'translate-x-0'} transition-all`} onClick={() => setExpand(!expand)}>
                <div className="w-9">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 hover:w-9 hover:h-9 transition-all">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
                <div className="ml-2 text-xl">{props.page}</div>
            </div>
            <div className={`absolute h-full w-full bg-[#FAFAFA] bg-opacity-25 ${expand ? 'translate-x-0' : '-translate-x-full'} transition-all relative`} ref={ref}>
                <div className={`h-fit w-full grid grid-rows-4 gap-4 justif-center items-center`}>
                    <div className="flex justify-center items-center mt-2 h-9">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 cursor-pointer hover:w-9 hover:h-9 transition-all" onClick={() => setExpand(!expand)}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-[#84BCDA] transition-all" onClick={() => { props.setPage('Earthquake'); setExpand(false) }}>
                        <div className="mx-2">
                            <GiEarthCrack className="h-6 w-6" />
                        </div>
                        <div className="">Earthquake</div>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-[#84BCDA] transition-all" onClick={() => { props.setPage('Volcano'); setExpand(false) }}>
                        <div className="mx-2">
                            <FaVolcano className="h-6 w-6" />
                        </div>
                        <div className="">Volcano</div>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-[#84BCDA] transition-all" onClick={() => { props.setPage('Drought'); setExpand(false) }}>
                        <div className="mx-2">
                            <GiHotSurface className="h-6 w-6" />
                        </div>
                        <div className="">Drought</div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 mb-10 w-full px-2 font-normal flex items-center justify-center cursor-pointer hover:text-[#84BCDA] transition-all" onClick={() => { props.setPage('Resources'); setExpand(false) }}>Resources</div>
            </div>
        </div>
    )
}

export default NavBar