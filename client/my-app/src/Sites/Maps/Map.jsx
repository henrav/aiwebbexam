import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';


function ReturnMap(){
    const mapRef = useRef();

    useEffect(() => {
        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });

        return () => map.setTarget(null); // Cleanup on unmount
    }, []);

    return (
        <div style={{zIndex: -999}}>
            <div ref={mapRef} style={{width: '80vw', height: '80vh'}}/>
        </div>
    );
}

export default function MapComponent() {
    return (

        <ReturnMap />

    );
}