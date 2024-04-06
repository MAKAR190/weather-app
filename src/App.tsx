import React, { useEffect, useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {Loader} from "./components"
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import {Location, NoPage} from "./pages"
import {reverseGeocode, convertToSlug} from "./utils"

interface LocationObj {
    latitude: number;
    longitude: number;
    locationName: string;
    locationSlug: string;
}

function App() {
    const [userLocation, setUserLocation] = useState<LocationObj | null>(null);
    const [locationError, setLocationError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const locationName = await reverseGeocode(latitude, longitude);
                    const locationSlug = convertToSlug(locationName);
                    setUserLocation({ latitude, longitude, locationName, locationSlug });
                    setLoading(false);
                } catch (error) {
                    console.error('Error getting location name:', error);
                    setLocationError(true);
                    setLoading(false);
                }
            },
            (error) => {
                console.error('Error getting user location:', error);
                setLocationError(true);
                setLoading(false);
            }
        );
    }, []);

    return (
        <BrowserRouter>
            {loading ? (
                <Loader />
            ) : (
                <Routes>
                    {userLocation && !locationError && (
                        <Route path="/" element={<Navigate to={`/location/${userLocation.locationSlug}`} />} />
                    )}
                    {locationError && (
                        <Route path="/" element={<NoPage />} />
                    )}
                    <Route path="location/:location" element={<Location />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            )}
            <ToastContainer />
        </BrowserRouter>
    )
}

export default App;
