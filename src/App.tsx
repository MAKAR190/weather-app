import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Loader} from "./components"
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate} from "react-router-dom";
import {Location, NoPage} from "./pages"
import {convertToSlug, reverseGeocode} from "./utils";
import {TemperatureProvider} from './contexts/TemperatureContext';
interface LocationObj {
    latitude: number;
    longitude: number;
    locationName: string;
    locationSlug: string;
}

function App() {
    const [userLocation, setUserLocation] = useState<LocationObj | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [geolocationAllowed, setGeolocationAllowed] = useState<boolean>(true);

    useEffect(() => {
        if (!userLocation && window.location.pathname === "/") {
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
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    setLoading(false);
                    setGeolocationAllowed(false);
                }
            );
        } else {
            setLoading(false);
        }
    }, []);


    return (
        <TemperatureProvider>
            {loading ? (
                <Loader />
            ) : (
                <Routes>
                    {!geolocationAllowed &&
                        <Route path="/" element={<NoPage message="Please, allow your current geolocation!" />}   />
                    }
                    <Route path="/" element={<Navigate to={`/location/${userLocation?.locationSlug}`} />} />
                    <Route path="location/:location" element={<Location locationName={userLocation?.locationName} updateMainLocation={setUserLocation}  setLoading={setLoading} center={{lng:userLocation?.longitude, lat:userLocation?.latitude}} />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            )}
            <ToastContainer />
    </TemperatureProvider>
    )
}

export default App;
