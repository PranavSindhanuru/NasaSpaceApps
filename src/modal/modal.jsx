import { Edges, OrbitControls, PerspectiveCamera, Outlines, useTexture, Stars, PerformanceMonitor } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { Suspense, useState, useRef, useEffect } from 'react'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import round from 'lodash/round'
import Switch from '@mui/material/Switch';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import EarthDayMap from '../images/8k_earth_daymap.jpg'
import EarthNightMap from '../images/8k_earth_nightmap.jpg'
import EarthNormalMap from '../images/8k_earth_normal_map.jpg'
import EarthCloudMap from '../images/8k_earth_clouds.jpg'
import EarthSpecularMap from '../images/8k_earth_specular_map.jpg'
import DroughtFrequency from '../images/drought_frequency.png'
import DroughtMortalityRisk from '../images/drought_mortality_risk.png'
import DroughtEconomicRisk from '../images/drought_economic_risk.png'
import FloodFrequency from '../images/flood_frequency.png'
import FloodMortalityRisk from '../images/flood_mortality_risk.png'
import FloodEconomicRisk from '../images/flood_economic_risk.png'


import Earthquake from '../modules/earthquake'
import NavBar from '../components/navbar'
import Volcano from '../modules/volcano'

const Modal = () => {

    const [year, setyear] = useState(1965)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [page, setPage] = useState('Earthquake')
    const [droughtType, setDroughtType] = useState('DroughtMortalityRisk')
    const [floodType, setFloodType] = useState('FloodMortalityRisk')
    const [volcanoDataElement, setVolcanoDataElement] = useState()
    const [loading, isLoading] = useState(true)
    const [BCE, setBCE] = useState(true)
    const [CE, setCE] = useState(true)

    const [dpr, setDpr] = useState(2)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            isLoading(false);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [])

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="h-[100vh] w-[100vw] bg-[#010101] relative flex">
                <Suspense fallback={null}>
                    <Canvas shadows={{ enabled: true, type: 'pcfsoft' }} frameloop="demand" dpr={dpr}>
                        <PerformanceMonitor factor={1} onChange={({ factor }) => setDpr(round(0.5 + 1.5 * factor, 1))} flipflops={3} onFallback={() => setDpr(1)} />
                        <OrbitControls target={[0, 0, 0]} maxPolarAngle={2} dampingFactor={0.1} rotateSpeed={0.5} />
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 5.5]} />
                        <Base page={page} year={year} setLatitude={setLatitude} setLongitude={setLongitude} setVolcanoDataElement={setVolcanoDataElement} BCE={BCE} CE={CE} droughtType={droughtType} floodType={floodType} />
                    </Canvas>
                </Suspense>
                {loading && <div className="absolute h-screen w-screen right-0 top-0 bg-[#FAFAFA] bg-opacity-25 flex justify-center items-center">
                    <div class="relative">
                        <div class="w-20 h-20 border-blue-200 border-2 rounded-full flex justify-center items-center text-[#FFFFFF]"> Loading </div>
                        <div class="w-20 h-20 border-blue-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
                    </div>
                </div>}
                {!loading &&
                    <div className="">
                        {page === 'Earthquake' && <div className="absolute rounded right-0 top-0 h-fit w-[20vw] bg-[#FAFAFA] bg-opacity-25 p-5">
                            <div className="flex justify-between items-center text-[#FFFFFF] font-semibold">
                                <div className="mr-2">Year: </div>
                                <input className='bg-[#000000] w-full h-full p-2 outline-none rounded' type="number" min={1965} max={2016} value={year} onChange={(e) => setyear(e.target.value)} />
                            </div>
                        </div>}
                        {page === 'Earthquake' && <div className="absolute rounded left-0 bottom-0 h-fit w-fit bg-[#FAFAFA] bg-opacity-25 p-2">
                            <div className="text-[#FFFFFF] text-xs">
                                Circle size represents earthquake magnitude
                            </div>
                        </div>}
                        {page === 'Volcano' && <div className="absolute rounded left-0 bottom-0 h-fit w-fit bg-[#FAFAFA] bg-opacity-25 p-2">
                            <div className="text-[#FFFFFF] text-xs">
                                Click on each point for more information
                            </div>
                        </div>}
                        {(page === 'Drought' || page === 'Flood') && <div className="absolute rounded left-0 bottom-0 h-fit w-fit bg-[#FAFAFA] bg-opacity-25 p-2">
                            <div className="text-[#FFFFFF] text-xs">
                                Risk increases in direct correlation with the intensity of color
                            </div>
                        </div>}
                        {page === 'Volcano' && volcanoDataElement?.volcano_name && <div className="absolute rounded right-0 top-0 h-fit w-fit bg-[#FAFAFA] bg-opacity-25 p-5">
                            <div className="grid grid-rows-8 items-center text-[#FFFFFF]">
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Name: </div>
                                    <div className="">{volcanoDataElement?.volcano_name}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Type: </div>
                                    <div className="">{volcanoDataElement?.primary_volcano_type}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Last Eruption: </div>
                                    <div className="">{volcanoDataElement?.last_eruption_year}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Country: </div>
                                    <div className="">{volcanoDataElement?.country}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Region: </div>
                                    <div className="">{volcanoDataElement?.region}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Subregion: </div>
                                    <div className="">{volcanoDataElement?.subregion}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Elevation: </div>
                                    <div className="">{volcanoDataElement?.elevation}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold mr-2">Rocks: </div>
                                    <div className="">{volcanoDataElement?.major_rock_1}</div>
                                </div>
                            </div>
                        </div>}
                        {page !== 'Resources' &&
                            <div className="">
                                <div className="absolute rounded left-[35vw] bottom-0 justify-self-center h-[5vh] w-[30vw] bg-[#FAFAFA] bg-opacity-25 z-10">
                                    <div className="flex justify-around w-full h-[5vh] items-center text-[#FFFFFF] p-2">
                                        <div className="">{`Latitude: ${latitude}`}</div>
                                        <div className="">{`Longitude: ${longitude}`}</div>
                                    </div>
                                </div>
                                <div className="absolute left-0 top-0 h-full w-[15vw]">
                                    <NavBar setPage={setPage} page={page} />
                                </div>
                            </div>
                        }
                        {page === 'Volcano' && <div className="absolute rounded right-0 bottom-0 h-fit w-fit bg-[#FAFAFA] bg-opacity-25 p-3 text-[#FFFFFF]">
                            <div className="font-semibold flex justif-center items-center"> Last Eruption </div>
                            <div className="flex justify-between items-center mt-3">
                                <div className="mr-3">BCE</div>
                                <Switch defaultChecked color="default" onChange={() => setBCE(!BCE)} />
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <div className="mr-3">CE</div>
                                <Switch defaultChecked color="default" onChange={() => setCE(!CE)} />
                            </div>
                        </div>}
                        {page === 'Drought' && <div className="absolute rounded right-0 top-0 h-fit w-fit bg-[#FAFAFA] bg-opacity-25 p-5">
                            <div className="font-semibold text-[#FFFFFF] flex justif-center items-center">Drought Risk Categories</div>
                            <div className="mt-2 h-12 w-[15vw]">
                                <Box style={{ outline: 'none', border: 'none' }}>
                                    <Select
                                        sx={{
                                            color: "white",
                                            '.MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '.MuiSvgIcon-root ': {
                                                fill: "white",
                                            }
                                        }}
                                        value={droughtType}
                                        onChange={(e) => setDroughtType(e.target.value)}
                                        style={{ backgroundColor: 'black', color: 'white', width: '100%', outline: 'none', border: 'none' }}
                                        IconProps
                                    >
                                        <MenuItem value={'DroughtMortalityRisk'}>Mortality Risk</MenuItem>
                                        <MenuItem value={'DroughtEconomicRisk'}>Economic Risk</MenuItem>
                                        <MenuItem value={'DroughtFrequency'}>Frequency</MenuItem>
                                    </Select>
                                </Box>
                            </div>
                        </div>}
                        {page === 'Flood' && <div className="absolute rounded right-0 top-0 h-fit w-fit bg-[#FAFAFA] bg-opacity-25 p-5">
                            <div className="font-semibold text-[#FFFFFF] flex justif-center items-center">Flood Risk Categories</div>
                            <div className="mt-2 h-12 w-[15vw]">
                                <Box style={{ outline: 'none', border: 'none' }}>
                                    <Select
                                        sx={{
                                            color: "white",
                                            '.MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '.MuiSvgIcon-root ': {
                                                fill: "white",
                                            }
                                        }}
                                        value={floodType}
                                        onChange={(e) => setFloodType(e.target.value)}
                                        style={{ backgroundColor: 'black', color: 'white', width: '100%', outline: 'none', border: 'none' }}
                                        IconProps
                                    >
                                        <MenuItem value={'FloodMortalityRisk'}>Mortality Risk</MenuItem>
                                        <MenuItem value={'FloodEconomicRisk'}>Economic Risk</MenuItem>
                                        <MenuItem value={'FloodFrequency'}>Frequency</MenuItem>
                                    </Select>
                                </Box>
                            </div>
                        </div>}
                        {page === 'Resources' && <div className="absolute z-0 left-0 top-0 w-full h-full bg-[#000000] bg-opacity-25">
                            <div className="relative h-full w-full">
                                <div className="h-full w-full flex justify-center items-center text-[#FFFFFF]">
                                    <div className="grid grid-rows-3 px-5 h-fit w-fit rounded divide-y border">
                                        <div className="py-5 grid grid-cols-3">
                                            <div className="">Earthquake </div>
                                            <div className="col-span-2 cursor-pointer underline text-[#84BCDA]" onClick={() => window.open('https://www.kaggle.com/datasets/usgs/earthquake-database', '_blank')}>https://www.kaggle.com/datasets/usgs/earthquake-database</div>
                                        </div>
                                        <div className="py-5 grid grid-cols-3">
                                            <div className="">Volcano </div>
                                            <div className="col-span-2 cursor-pointer underline text-[#84BCDA]" onClick={() => window.open('https://www.kaggle.com/datasets/jessemostipak/volcano-eruptions', '_blank')}>https://www.kaggle.com/datasets/jessemostipak/volcano-eruptions</div>
                                        </div>
                                        <div className="py-5 grid grid-cols-3">
                                            <div className="">Drought </div>
                                            <div className="col-span-2 cursor-pointer underline text-[#84BCDA]" onClick={() => window.open('https://worldview.earthdata.nasa.gov/', '_blank')}>https://worldview.earthdata.nasa.gov/</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-0 top-0 h-full w-[15vw]">
                                    <NavBar setPage={setPage} page={page} />
                                </div>
                            </div>
                        </div>}
                    </div>}
            </div>
        </div>
    )
}

const Base = (props) => {
    // const [hover, setHover] = useState(false)
    const [colorMap, normalMap, specularMap, cloudMap, droughtFreqMap, droughtMortalityRiskMap, droughtEconomicRiskMap, floodFrequencyMap, floodMortalityRiskMap, floodEconomicRiskMap] = useTexture([
        EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudMap, DroughtFrequency, DroughtMortalityRisk, DroughtEconomicRisk, FloodFrequency, FloodMortalityRisk, FloodEconomicRisk
    ])
    const globeRef = useRef();

    const handleGlobeClick = (e) => {
        const intersects = e.intersections;
        if (intersects?.length > 0) {
            const intersectionPoint = intersects[0].point;
            const radius = 2;

            const longitude = Math.atan2(intersectionPoint.z, intersectionPoint.x);
            const latitude = Math.asin(intersectionPoint.y / radius);

            const longitudeDegrees = (longitude * 180) / Math.PI;
            const latitudeDegrees = (latitude * 180) / Math.PI;

            const longitudeDirection = longitudeDegrees >= 0 ? 'W' : 'E';
            const latitudeDirection = latitudeDegrees >= 0 ? 'N' : 'S';

            const longitudePositive = Math.abs(longitudeDegrees);
            const latitudePositive = Math.abs(latitudeDegrees);

            const formattedLongitude = `${longitudePositive.toFixed(4)}° ${longitudeDirection}`;
            const formattedLatitude = `${latitudePositive.toFixed(4)}° ${latitudeDirection}`;

            // console.log(`Longitude: ${formattedLongitude}, Latitude: ${formattedLatitude}`);

            props.setLatitude(formattedLatitude);
            props.setLongitude(formattedLongitude);
        }
    };


    return (
        <>
            <ambientLight intensity={2} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            {props?.page === 'Drought' &&
                <>
                    {props.droughtType === 'DroughtFrequency' && <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[2, 64, 64]} />
                        <meshPhongMaterial map={droughtFreqMap} opacity={0.6} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
                    </mesh>}
                    {props.droughtType === 'DroughtMortalityRisk' && <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[2, 64, 64]} />
                        <meshPhongMaterial map={droughtMortalityRiskMap} opacity={0.9} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
                    </mesh>}
                    {props.droughtType === 'DroughtEconomicRisk' && <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[2, 64, 64]} />
                        <meshPhongMaterial map={droughtEconomicRiskMap} opacity={0.9} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
                    </mesh>}
                </>
            }
            {props?.page === 'Flood' &&
                <>
                    {props.floodType === 'FloodFrequency' && <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[2, 64, 64]} />
                        <meshPhongMaterial map={floodFrequencyMap} opacity={0.6} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
                    </mesh>}
                    {props.floodType === 'FloodMortalityRisk' && <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[2, 64, 64]} />
                        <meshPhongMaterial map={floodMortalityRiskMap} opacity={0.9} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
                    </mesh>}
                    {props.floodType === 'FloodEconomicRisk' && <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[2, 64, 64]} />
                        <meshPhongMaterial map={floodEconomicRiskMap} opacity={0.9} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
                    </mesh>}
                </>
            }
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial map={cloudMap} opacity={0.4} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
            </mesh>
            <mesh
                // onPointerEnter={() => setHover(true)}
                // onPointerLeave={() => setHover(false)}
                {...props}
                ref={globeRef}
                onClick={handleGlobeClick}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onPointerMove={(e) => handleGlobeClick(e)}
            >
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial specularMap={specularMap} map={colorMap} />
                <meshStandardMaterial map={colorMap} normalMap={normalMap} />
                {props.page === 'Earthquake' && <Earthquake year={props.year} />}
                {props.page === 'Volcano' && <Volcano setVolcanoDataElement={props.setVolcanoDataElement} BCE={props.BCE} CE={props.CE} />}
            </mesh>
        </>
    )
}



export default Modal
