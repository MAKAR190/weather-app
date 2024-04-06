import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const center = {
    lat: -3.745,
    lng: -38.523
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY || ''
    });

    const mapContainerStyle = {
        width: '100%',
        height: '100%'
    };

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(mapInstance:any) {
        const bounds = new window.google.maps.LatLngBounds(center);
        mapInstance.fitBounds(bounds);
        setMap(mapInstance);
    }, []);

    const onUnmount = React.useCallback(function callback() {
        setMap(null);
    }, []);

    return isLoaded ? (
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                { /* Child components, such as markers, info windows, etc. */ }
                <></>
            </GoogleMap>
    ) : <></>;
}

export default React.memo(MyComponent);
