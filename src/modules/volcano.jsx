import { useState, useEffect } from 'react'
import * as THREE from 'three'

import data from '../data/volcano.json'
import { Edges } from '@react-three/drei'

const Volcano = (props) => {

    const [displayData, setDisplayData] = useState([])

    useEffect(() => {
        setDisplayData([...data])
        // setDisplayData([
        //     { longitude: 131, latitude: 34 }, // japan
        //     { longitude: 77, latitude: 14 }, // bengalore
        //     { longitude: -74, latitude: 40 } // new york
        // ])
    }, [])

    const redDots = displayData.map((item) => {
        return <Dots item={item} setVolcanoDataElement={props.setVolcanoDataElement} />
    });

    return (
        <>
            {redDots}
        </>
    )
}

const Dots = (props) => {

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

    const [hover, setHover] = useState(false)
    const modifiedLongitude = props.item.longitude - longitudeOffset;
    const position = coordinatesToPosition(modifiedLongitude, props.item.latitude, 2);
    return (
        <mesh key={`${props.item.longitude}-${props.item.latitude}`} position={position}
            onClick={() => { props.setVolcanoDataElement(props.item) }}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}>
            <sphereGeometry args={[0.02, 1, 1]} />
            <primitive object={redDotMaterial} />
            {hover && <Edges
                scale={1.1}
                threshold={15}
                color="white"
            />}
        </mesh>
    );
}

export default Volcano;