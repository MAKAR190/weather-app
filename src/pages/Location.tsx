import React, {useEffect, useState, useRef} from 'react';
import {BlockLayout, Modal, Header, Footer, Loader} from "../components"
import {NoPage} from "../pages"
import {reverseGeocode, fetchCoordinatesFromSlug, convertToSlug} from "../utils"
import { useParams, useLocation } from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import useFetch from "../hooks/useFetch";
import {unixTimeToHour, unixTimeToDay, formatPeriod} from "../utils";
import { useTemperature } from '../contexts/TemperatureContext';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

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

interface WeatherInfo {
    icon: string;
    main: string;
    description: string;
    id: number;
}
interface NeededCurrentData {
    dt:  number;
    name: string | undefined;
    main: {
        temp: number;
        temp_max: number;
        temp_min: number;
        humidity: number;
        pressure: number;
    }
    weather: Array<WeatherInfo>;
    wind: {
        speed: number;
    }
}
interface WeatherHourData {
  dt: number;
  main:{
    temp: number;
   }
    weather: Array<WeatherInfo>;
}
interface NeededHourlyData {
   list: Array<WeatherHourData>;
}
interface WeatherDayData {
    dt: number;
    temp:{
        max: number;
        min: number;
    }
    weather: Array<WeatherInfo>;
}
interface NeededDailyData {
    list: Array<WeatherDayData>;
}



function Location({ center, locationName, updateMainLocation, setLoading }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, reportError] = useState(false);
    const [stateCenter, setStateCenter] = useState(center);
    const { temperatureUnit } = useTemperature();
    const [locations, setLocations] = useState(JSON.parse(localStorage.getItem('locationHistory') || '[]').reverse());
    const { location } = useParams();
    const {pathname} = useLocation();
    const mainSection = useRef<HTMLElement | null>(null);

    const apiUnit = temperatureUnit === "celsius" ? "metric" : "standard";

    const { data: currentData, loading: currentLoading, fetchError: currentError } = useFetch<NeededCurrentData>(
        stateCenter.lat && stateCenter.lng
            ? `https://api.openweathermap.org/data/2.5/weather?lat=${stateCenter.lat}&lon=${stateCenter.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=${apiUnit}`
            : null
    );  const { data: hourlyData, loading: hourlyLoading, fetchError: hourlyError } = useFetch<NeededHourlyData>(
        stateCenter.lat && stateCenter.lng
            ? `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${stateCenter.lat}&lon=${stateCenter.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=${apiUnit}`
            : null
    );
    const { data: dailyData, loading: dailyLoading, fetchError: dailyError } = useFetch<NeededDailyData>(
        stateCenter.lat && stateCenter.lng
            ? `https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${stateCenter.lat}&lon=${stateCenter.lng}&cnt=7&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=${apiUnit}`
            : null
    );

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    useGSAP(() => {
        const animateElements = () => {
            gsap.fromTo(".fetchAnimated", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
        };

        animateElements();
    }, [currentData, hourlyData, dailyData, mainSection]);

    useEffect(() => {
        const saveToLocalStorage = () => {
            if (locationName) {
                const history = JSON.parse(localStorage.getItem('locationHistory') || '[]');
                history.push({ id: uuidv4(), name: locationName, slug: convertToSlug(locationName) });
                setLocations((prev:any)=>([
                    { id: uuidv4(), name: locationName, slug: convertToSlug(locationName) },
                    ...prev
            ]))
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
                    setStateCenter({ lat, lng,})
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




    const icon = "https://openweathermap.org/img/w/" + currentData?.weather[0].icon + ".png";

    return (
        <>
            {error ? <NoPage message="Location not found..." />
            :  currentData && hourlyData && dailyData && !currentLoading && !hourlyLoading && !dailyLoading && !currentError && !hourlyError && !dailyError ? <>
                    <Header toggleModal={toggleModal} place={currentData?.name}/>
                    <main ref={mainSection}>
                        <section>
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center w-full">
                                    <img src={icon} alt="weather-icon" className="fetchAnimated w-[5%] min-w-[60px]"/>
                                </div>
                                <h2 className="font-bold text-white text-center text-5xl font-sans-['Merriweather']">
                                    {Math.round(currentData.main.temp)}º
                                </h2>
                                <div className="my-7">
                                    <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg">Precipitations</p>
                                    <div className="flex justify-center items-center w-full">
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-md mx-2">Max.: {Math.round(currentData.main.temp_max)}º</p>
                                        <p className="font-['Alegreya_Sans'] text-center font-light text-white text-md mx-2">{currentData.weather[0].description.toUpperCase()}</p>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-md mx-2">Min.: {Math.round(currentData.main.temp_min)}º</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="fetchAnimated grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xxl:grid-cols-3 xl:grid-cols-3 w-[90%] mx-auto">
                            <BlockLayout className="w-full my-2 sm:col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-3 xxl:col-span-3 mx-auto p-5">
                                <div className="flex justify-around h-full items-center">
                                    <div className="flex justify-center items-center">
                                        <img src="/pressure-icon.svg" alt="pressure-icon" />
                                        <h5 className="font-['Roboto_Flex'] text-center font-medium text-white text-md mx-1">{currentData.main.pressure}</h5>
                                    </div>      <div className="flex justify-center items-center">
                                    <img src="/humidity-data-icon.svg" alt="humidity-data-icon" />
                                    <h5 className="font-['Roboto_Flex'] text-center font-medium text-white text-md mx-1">{currentData.main.humidity}%</h5>
                                </div>      <div className="flex justify-center items-center">
                                    <img src="/wind-data-icon.svg" alt="wind-data-icon" />
                                    <h5 className="font-['Roboto_Flex'] text-center font-medium text-white text-md mx-1">{currentData.wind.speed} km/h</h5>
                                </div>
                                </div>
                            </BlockLayout>
                            <BlockLayout className="w-full sm:col-span-1 md:col-span-1 lg:col-span-2 xxl:col-span-2 xl:col-span-2 mx-auto p-3 sm:mb-5 md:mb-5 lg:mb-0 xl:mb-0 xxl:mb-0 sm:mt-5 md:mt-5 lg:mt-0 xl:mt-0 xxl:mt-0 xl:rounded-r-none xxl:rounded-r-none lg:rounded-r-none">
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <h5 className="font-['Roboto_Flex'] text-center font-bold text-white text-lg mx-1">24h Forecast</h5>
                                        <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">{formatPeriod(currentData.dt)}</p>
                                    </div>
                                    <div className="flex justify-start items-center overflow-x-auto whitespace-nowrap my-5 py-2">
                                        {hourlyData.list.slice(0, 24).map((data, i)=>(
                                            <div key={uuidv4()} className={`flex flex-col items-center duration-[0.1s] justify-center border-2 py-2 rounded-xl active:border-2 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10 hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 ${i === 0 ? "bg-blue-400 border-blue-400 bg-opacity-10" : " bg-opacity-0 bg-transparent border-transparent" }`}>
                                                <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">{Math.round(data.main.temp)}º</p>
                                                <img src={"https://openweathermap.org/img/w/" + data?.weather[0].icon + ".png"} alt="weather-icon" className="min-w-[60px]"/>
                                                <p className="font-['Roboto_Flex'] text-center font-light text-white text-lg mx-1">{unixTimeToHour(data.dt)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </BlockLayout>
                            <BlockLayout className="w-full mx-auto p-3 max-h-[280px] overflow-y-auto scrollbar-hide xl:rounded-l-none xxl:rounded-l-none lg:rounded-l-none">
                                <div className="flex justify-between">
                                    <h5 className="font-['Roboto_Flex'] text-center font-bold text-white text-lg mx-1">Next Forecast</h5>
                                    <img src="/calendar-icon.svg" alt="calendar-icon"/>
                                </div>
                                <div className="flex flex-col my-2">
                                    {dailyData.list.map(data=>(
                                        <div key={uuidv4()} className="flex justify-between items-center max-h-[50px]">
                                            <h6 className="font-['Roboto_Flex'] w-[33.3%] font-light text-white text-sm mx-1">{unixTimeToDay(data.dt)}</h6>
                                            <div className="w-[33.3%] flex justify-center">
                                                <img src={"https://openweathermap.org/img/w/" + data?.weather[0].icon + ".png"} alt="weather-icon" className="min-w-[60px] max-w-[80px]"/>
                                            </div>
                                            <div className="flex w-[33.3%] justify-end">
                                                <p className="font-['Alegreya_Sans'] font-light text-white text-lg mx-1">{Math.round(data.temp.max)}º</p>
                                                <p className="font-['Alegreya_Sans'] opacity-50 text-center font-light text-white text-lg mx-1">{Math.round(data.temp.min)}º</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </BlockLayout>
                        </section>
                    </main>
                    <Footer />
                    <Modal center={center} isOpen={isOpen} onClose={toggleModal} locations={locations}/>
                </>
           : <Loader /> }
        </>
    );
}

export default Location;
