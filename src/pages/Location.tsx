import React, {useEffect, useState} from 'react';
import {BlockLayout, Modal, Header, Footer} from "../components"
import {NoPage} from "../pages"
import {reverseGeocode, fetchCoordinatesFromSlug, convertToSlug} from "../utils"
import { useParams, useLocation } from "react-router-dom";
import {v4 as uuidv4} from "uuid";

interface Center {
    lng: number | undefined;
    lat: number | undefined;
}
interface LocationObj {
    latitude: number;
    longitude: number;
    locationName: string;
    locationSlug: string;
}

interface Props {
    center: Center;
    locationName: string | undefined;
    updateMainLocation: (location: LocationObj | null) => void;
    setLoading: (bool: boolean) => void;
}

function Location({ center, locationName, updateMainLocation, setLoading }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, reportError] = useState(false);
    const { location } = useParams();
    const {pathname} = useLocation();


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if(pathname === "/") {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const {latitude, longitude} = position.coords;
                    try {
                        const locationName = await reverseGeocode(latitude, longitude);
                        const locationSlug = convertToSlug(locationName);
                        reportError(false);
                        updateMainLocation({latitude, longitude, locationName, locationSlug});
                        setLoading(false);
                    } catch (error) {
                        console.error('Error getting location name:', error);
                        reportError(true);
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    reportError(true);
                    setLoading(false);
                }
            );
        } else{
            setLoading(false)
            reportError(false);
        }
    }, [pathname, setLoading, updateMainLocation ]);

    useEffect(() => {
        const saveToLocalStorage = () => {
            if (locationName) {
                const history = JSON.parse(localStorage.getItem('locationHistory') || '[]');
                history.push({ id: uuidv4(), name: locationName, slug: convertToSlug(locationName) });
                localStorage.setItem('locationHistory', JSON.stringify(history));
            }
        };

        saveToLocalStorage();

    }, [locationName, setLoading, updateMainLocation])

    useEffect(() => {
        const fetchLocationInfo = async () => {
            if (location) {
                try {
                    const { lat, lng } = await fetchCoordinatesFromSlug(location);
                    const locationName = await reverseGeocode(lat, lng);
                    reportError(false);
                    updateMainLocation({ latitude: lat, longitude: lng, locationName, locationSlug: location });
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching location info:', error);
                    reportError(true);
                    setLoading(false);
                }
            }
        };

        fetchLocationInfo();
    }, [location, pathname, setLoading, updateMainLocation]);

    return (
        <div className="App">
            {error ? <NoPage message="Loaction not found..." />
            :  <>
                    <Header toggleModal={toggleModal} />
                    <main>
                        <section>
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center w-full">
                                    <img src="/test-icon.png" alt={"test"} className="w-[80%] max-w-[300px]"/>
                                </div>
                                <h2 className="font-bold text-white text-center text-5xl font-sans-['Merriweather']">
                                    28º
                                </h2>
                                <div className="my-7">
                                    <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg">Precipitations</p>
                                    <div className="flex justify-center items-center w-full">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-md mx-2">Max.: 31º</p>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-md mx-2">Min.: 25º</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xxl:grid-cols-3 xl:grid-cols-3 w-[90%] mx-auto">
                            <BlockLayout className="w-full my-2 sm:col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-3 xxl:col-span-3 mx-auto p-5">
                                <div className="flex justify-around h-full items-center">
                                    <div className="flex justify-center items-center">
                                        <img src="/rain-data-icon.svg" alt="rain-data-icon" />
                                        <h5 className="font-['Roboto_Flex'] text-center font-medium text-white text-md mx-1">6%</h5>
                                    </div>      <div className="flex justify-center items-center">
                                    <img src="/humidity-data-icon.svg" alt="humidity-data-icon" />
                                    <h5 className="font-['Roboto_Flex'] text-center font-medium text-white text-md mx-1">90%</h5>
                                </div>      <div className="flex justify-center items-center">
                                    <img src="/wind-data-icon.svg" alt="wind-data-icon" />
                                    <h5 className="font-['Roboto_Flex'] text-center font-medium text-white text-md mx-1">19 km/h</h5>
                                </div>
                                </div>
                            </BlockLayout>
                            <BlockLayout className="w-full sm:col-span-1 md:col-span-1 lg:col-span-2 xxl:col-span-2 xl:col-span-2 mx-auto p-3 sm:mb-5 md:mb-5 lg:mb-0 xl:mb-0 xxl:mb-0 sm:mt-5 md:mt-5 lg:mt-0 xl:mt-0 xxl:mt-0 xl:rounded-r-none xxl:rounded-r-none lg:rounded-r-none">
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <h5 className="font-['Roboto_Flex'] text-center font-bold text-white text-lg mx-1">Today</h5>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">Mar, 9</p>
                                    </div>
                                    <div className="flex justify-start items-center overflow-x-auto whitespace-nowrap my-5">
                                        <div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                            <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                            <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                            <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                        </div> <div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div> <div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div> <div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div> <div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div><div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div><div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div><div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div><div className="flex flex-col items-center duration-[0.1s] justify-center bg-transparent border-2 border-transparent py-2 rounded-xl bg-opacity-0 active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">29ºC</p>
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[100px]"/>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">15.00</p>
                                    </div>
                                    </div>
                                </div>
                            </BlockLayout>
                            <BlockLayout className="w-full mx-auto p-3 max-h-[280px] overflow-y-auto scrollbar-hide xl:rounded-l-none xxl:rounded-l-none lg:rounded-l-none">
                                <div className="flex justify-between">
                                    <h5 className="font-['Roboto_Flex'] text-center font-bold text-white text-lg mx-1">Next Forecast</h5>
                                    <img src="/calendar-icon.svg" alt="calendar-icon"/>
                                </div>
                                <div className="flex flex-col my-2 ">
                                    <div className="flex cursor-pointer justify-between items-center max-h-[50px]">
                                        <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm mx-1">Monday</h6>
                                        <div className="w-[33.3%] flex justify-center">
                                            <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[80px] max-w-[120px]"/>
                                        </div>
                                        <div className="flex w-[33.3%] justify-end">
                                            <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">13º</p>
                                            <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">10º</p>
                                        </div>
                                    </div><div className="flex justify-between items-center max-h-[50px]">
                                    <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm  mx-1">Tuesday</h6>
                                    <div className="w-[33.3%] flex justify-center">
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[80px] max-w-[120px]"/>
                                    </div>
                                    <div className="flex w-[33.3%] justify-end">
                                        <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">13º</p>
                                        <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">10º</p>
                                    </div>
                                </div><div className="flex justify-between items-center max-h-[50px]">
                                    <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm  mx-1">Wednesday</h6>
                                    <div className="w-[33.3%] flex justify-center">
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[80px] max-w-[120px]"/>
                                    </div>
                                    <div className="flex w-[33.3%] justify-end">
                                        <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">13º</p>
                                        <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">10º</p>
                                    </div>
                                </div><div className="flex justify-between items-center max-h-[50px]">
                                    <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm  mx-1">Thursday</h6>
                                    <div className="w-[33.3%] flex justify-center">
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[80px] max-w-[120px]"/>
                                    </div>
                                    <div className="flex w-[33.3%] justify-end">
                                        <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">13º</p>
                                        <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">10º</p>
                                    </div>
                                </div><div className="flex justify-between items-center max-h-[50px]">
                                    <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm  mx-1">Friday</h6>
                                    <div className="w-[33.3%] flex justify-center">
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[80px] max-w-[120px]"/>
                                    </div>
                                    <div className="flex w-[33.3%] justify-end">
                                        <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">13º</p>
                                        <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">10º</p>
                                    </div>
                                </div><div className="flex justify-between items-center max-h-[50px]">
                                    <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm  mx-1">Saturday</h6>
                                    <div className="w-[33.3%] flex justify-center">
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[80px] max-w-[120px]"/>
                                    </div>
                                    <div className="flex w-[33.3%] justify-end">
                                        <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">13º</p>
                                        <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">10º</p>
                                    </div>
                                </div><div className="flex justify-between items-center max-h-[50px]">
                                    <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm  mx-1">Sunday</h6>
                                    <div className="w-[33.3%] flex justify-center">
                                        <img src="/test-small-icon.svg" alt="test-small-icon" className="min-w-[80px] max-w-[120px]"/>
                                    </div>
                                    <div className="flex w-[33.3%] justify-end">
                                        <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">13º</p>
                                        <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">10º</p>
                                    </div>
                                </div>
                                </div>
                            </BlockLayout>
                        </section>
                    </main>
                    <Footer />
                    <Modal center={center} isOpen={isOpen} onClose={toggleModal} />
                </>
            }

        </div>
    );
}

export default Location;
