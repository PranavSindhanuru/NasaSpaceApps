import { Edges, OrbitControls, PerspectiveCamera, Outlines, useTexture, Stars } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { Suspense, useState, useRef, useEffect } from 'react'
import { TextureLoader } from 'three'
import * as THREE from 'three'

import EarthDayMap from '../images/8k_earth_daymap.jpg'
import EarthNightMap from '../images/8k_earth_nightmap.jpg'
import EarthNormalMap from '../images/8k_earth_normal_map.jpg'
import EarthCloudMap from '../images/8k_earth_clouds.jpg'
import EarthSpecularMap from '../images/8k_earth_specular_map.jpg'

import Earthquake from '../modules/earthquake'
import NavBar from '../components/navbar'
import Volcano from '../modules/volcano'

const Modal = () => {

    const [year, setyear] = useState(1965)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [page, setPage] = useState('Earthquake')
    const [volcanoDataElement, setVolcanoDataElement] = useState({})
    const [loading, isLoading] = useState(true)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            isLoading(false);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="h-[100vh] w-[100vw] bg-[#010101] relative flex">
                <Suspense fallback={console.log('done')}>
                    <Canvas shadows>
                        <OrbitControls target={[0, 0, 0]} maxPolarAngle={2} />
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 5.5]} />
                        <Base page={page} year={year} setLatitude={setLatitude} setLongitude={setLongitude} setVolcanoDataElement={setVolcanoDataElement} />
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
                        <div className="absolute rounded left-[35vw] bottom-0 justify-self-center h-[5vh] w-[30vw] bg-[#FAFAFA] bg-opacity-25">
                            <div className="flex justify-around w-full h-[5vh] items-center text-[#FFFFFF] p-2">
                                <div className="">{`Latitude: ${latitude}`}</div>
                                <div className="">{`Longitude: ${longitude}`}</div>
                            </div>
                        </div>
                        <div className="absolute left-0 top-0 h-full w-[15vw]">
                            <NavBar setPage={setPage} page={page} />
                        </div>
                    </div>}
            </div>
        </div>
    )
}

const Base = (props) => {
    // const [hover, setHover] = useState(false)
    const [colorMap, normalMap, specularMap, cloudMap] = useTexture([EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudMap])
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
            <mesh>
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
                {props.page === 'Volcano' && <Volcano setVolcanoDataElement={props.setVolcanoDataElement} />}
            </mesh>
        </>
    )
}



export default Modal
