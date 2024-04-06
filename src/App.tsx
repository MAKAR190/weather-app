import React, {useEffect, useState} from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {Loader} from "./components"
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate} from "react-router-dom";
import {Location, NoPage} from "./pages"
import {convertToSlug, reverseGeocode} from "./utils";

interface LocationObj {
    latitude: number;
    longitude: number;
    locationName: string;
    locationSlug: string;
}

function App() {
    const [userLocation, setUserLocation] = useState<LocationObj | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const {latitude, longitude} = position.coords;
                    try {
                        const locationName = await reverseGeocode(latitude, longitude);
                        const locationSlug = convertToSlug(locationName);
                        setUserLocation({latitude, longitude, locationName, locationSlug});
                        setLoading(false);
                    } catch (error) {
                        console.error('Error getting location name:', error);
                        setLoading(false);
                    }
                },
            );
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Routes>
                    <Route path="/" element={<Navigate to={`/location/${userLocation?.locationSlug}`} />} />
                    <Route path="location/:location" element={<Location locationName={userLocation?.locationName} updateMainLocation={setUserLocation}  setLoading={setLoading} center={{lng:userLocation?.longitude, lat:userLocation?.latitude}} />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            )}
            <ToastContainer />
    </>
    )
}

export default App;
