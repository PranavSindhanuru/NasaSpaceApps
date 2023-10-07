import { useState, useEffect } from 'react'
import * as THREE from 'three'

import data from '../data/nasa_earthquake_database.json'

const Earthquake = (props) => {

    const [displayData, setDisplayData] = useState([])

    useEffect(() => {
        setDisplayData([...data].filter((item) => item.year === props.year.toString()))
    }, [props.year])

    const coordinatesToPosition = (longitude, latitude, radius) => {
        const phi = ((90 - latitude) * Math.PI) / 180;
        const theta = ((180 - longitude) * Math.PI) / 180;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    };

    const longitudeOffset = 180;

    const redDotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.7 });

    const redDots = displayData.map((item) => {
        const modifiedLongitude = item.Longitude - longitudeOffset;
        const position = coordinatesToPosition(modifiedLongitude, item.Latitude, 2);
        return (
            <mesh key={`${item.longitude}-${item.latitude}`} position={position}>
                <sphereGeometry args={[item.Magnitude / 200, 8, 8]} />
                <primitive object={redDotMaterial} />
            </mesh>
        );
    });

    return (
        <>
            {redDots}
        </>
    )
}

export default Earthquake;