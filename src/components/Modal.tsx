import React, {useEffect, useRef, useState} from 'react';
import Map from "./Map"
import BlockLayout from "./BlockLayout"
import gsap from 'gsap';
import {Link} from "react-router-dom";
import { reverseGeocode, convertToSlug, fetchCoordinatesFromSlug } from "../utils";

interface Location {id: string, name:string, slug:string}
interface Props {
    isOpen: boolean;
    onClose: (event: React.MouseEvent | KeyboardEvent) => void;
    center: {
        lng:number | undefined;
        lat:number | undefined;
    }
    locations: Array<Location>
}

function debounce(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return function(this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const Modal:React.FC<Props> = ({ isOpen, onClose, center, locations }) =>{
    const modalRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [mapCenter, setMapCenter] = useState(center)
    const [locationSlug, setLocationSlug] = useState<string>("");
    const debouncedHandleSearch = debounce(handleSearch, 1000);

    useEffect(() => {
        if (isOpen) {
            gsap.to(modalRef.current, { opacity: 1, duration: 0.5, y: 0 });
        } else {
            gsap.to(modalRef.current, { opacity: 0, duration: 0.5, y: -50 });
        }
    }, [isOpen]);

    useEffect(() => {
        if(searchText.length){
            debouncedHandleSearch();
        }
    }, [searchText]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose(event);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyPress);
        } else {
            document.removeEventListener('keydown', handleKeyPress);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        async function fetchLocationName(){
            const locationName = await reverseGeocode(mapCenter.lat, mapCenter.lng);
            return convertToSlug(locationName);
        }
        async function setLocationSlugAsync() {
            if(mapCenter.lng && mapCenter.lat){
                const locationSlug = await fetchLocationName();
                setLocationSlug(locationSlug);
            }
        }
        setLocationSlugAsync();
    }, [mapCenter]);

    const handleMapClick = async (event: google.maps.MapMouseEvent) => {
        const clickedLat = event?.latLng?.lat();
        const clickedLng = event?.latLng?.lng();
        setMapCenter({ lat: clickedLat, lng: clickedLng });

        try {
            const locationName = await reverseGeocode(clickedLat, clickedLng);
            setSearchText(locationName);
        } catch (error) {
            console.error('Error fetching location name:', error);
        }
    };
    async function handleSearch () {
        try {
            const slug = convertToSlug(searchText);
            const coordinates = await fetchCoordinatesFromSlug(slug);
            setMapCenter(coordinates);
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchText(value);
    };


    return(
        <div ref={modalRef} className={`w-screen h-screen top-0 overflow-y-auto fixed bg-black bg-opacity-50 ${isOpen ? "block" : "hidden"} p-10`}>
           <div onClick={(e)=>onClose(e)} className="absolute right-2 top-5 cursor-pointer">
               <img src="/cross.svg" alt="cross" />
           </div>
            <div className="flex justify-center items-center h-full sm:pt-[150px] md:pt-0 xl:pt-0 lg:pt-0 xxl:pt-0 w-full">
                <div className='grid sm:place-items-center md:place-items-start xl:place-items-start lg:place-items-start xxl:place-items-start sm:grid-cols-1 md:grid-cols-3 xxl:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
                    <div className="flex flex-col sm:w-[90vw] md:w-[60vw] xxl:w-[60vw] lg:w-[60vw] xl:w-[60vw] h-full justify-center sm:col-span-1 md:col-span-2 xxl:col-span-2 xl:col-span-2 lg:col-span-2">
                    <div className="w-full relative">
                        <input pattern="^(?:[^,\n]*,){3}[^,\n]*$"
                                 placeholder="Please enter a location in the format: street, postcode, town name, country or click on the map after search" className="outline-0 p-3 w-full text-sm" value={searchText} onChange={handleInputChange}/>
                        <Link to={`/location/${locationSlug}`}>
                            <button onClick={(e)=>onClose(e)} className="absolute right-0 top-0 bg-black border-white border-2 p-[10px] duration-[0.1s] hover:border-blue-400 active:border-blue-400">
                                <img src='/add-icon.svg' alt="add-icon" />
                            </button>
                        </Link>
                    </div>
                        <div className="w-full sm:h-[300px] lg:h-[400px] md:h-[400px] xxl:h-[500px] xl:h-[400px]">
                        <Map center={mapCenter} onMapClick={handleMapClick}/>
                        </div>
                    </div>
                   <div className="flex flex-col mx-5 w-full">
                       <h2 className="font-['Roboto_Flex'] font-bold text-white text-3xl">History</h2>
                      <div className="my-3 max-h-[400px] overflow-y-auto">
                          {locations.map((location) => (
                              <Link
                                  onClick={(e)=> onClose(e)}
                                  key={location.id} to={`/location/${location.slug}`}>
                              <BlockLayout
                                  className="p-5 min-w-[250px] rounded-none duration-[0.1s] cursor-pointer border-b-orange-50 border-2 border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10"
                              >
                                  <div className="flex flex-col">
                                      <h3 className="font-['Roboto_Flex'] font-light text-white text-lg">{location.name}</h3>
                                  </div>
                              </BlockLayout>
                              </Link>
                          ))}
                      </div>
                   </div>
                </div>
            </div>
        </div>
    )
}
export default Modal;