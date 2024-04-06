import React, {useEffect} from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Props {
    center: {
        lat:number | undefined;
        lng:number | undefined;
    };
    onMapClick: (event: google.maps.MapMouseEvent) => void;
}
function MyComponent({center, onMapClick }:Props) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY || ''
    });

    const mapContainerStyle = {
        width: '100%',
        height: '100%'
    };

    const [map, setMap] = React.useState(null);
    const [markerPosition, setMarkerPosition] = React.useState<{ lat: number; lng: number } | null>({
        lat: center.lat || 0,
        lng: center.lng || 0
    });

    const onLoad = React.useCallback(function callback(mapInstance: any) {
        if (center.lat !== undefined && center.lng !== undefined) {
            mapInstance.setCenter({ lat: center.lat, lng: center.lng });
            setMap(mapInstance);
        }
    }, [center]);

    const onUnmount = React.useCallback(function callback() {
        setMap(null);
    }, []);

    useEffect(() => {
        setMarkerPosition({ lat: center.lat || 0, lng: center.lng || 0 });
    }, [center])
    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const clickedLat = event?.latLng?.lat();
        const clickedLng = event?.latLng?.lng();
        setMarkerPosition({ lat: clickedLat || 0, lng: clickedLng || 0 });
        onMapClick(event);
    };

    return isLoaded ? (
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: center.lat || 0, lng: center.lng || 0 }}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
            >
                {markerPosition && <Marker position={{ lat: markerPosition.lat, lng: markerPosition.lng }} />}
            </GoogleMap>
    ) : <></>;
}

export default React.memo(MyComponent);
