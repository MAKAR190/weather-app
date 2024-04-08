import React from 'react';
import {toast } from 'react-toastify'
import {toastOptions} from "../utils";
import { useTemperature } from '../contexts/TemperatureContext';
interface Props {
    toggleModal: React.MouseEventHandler<HTMLDivElement>;
    place: string | undefined;
}
const Header:React.FC<Props> = ({toggleModal, place})=>{
    const { temperatureUnit, toggleTemperatureUnit } = useTemperature();
    const handleCopyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                console.log('URL copied to clipboard:', currentUrl);
                toast.success("URL copied to clipboard!", toastOptions);
            })
            .catch((error) => {
                console.error('Failed to copy URL:', error);
            });
    };

    return (
        <>
        <header className="flex justify-between items-center w-full p-3">
            <div onClick={toggleModal} className="flex sm:w-[80%] xxl:w-[33.3%] lg:w-[33.3%] xl:w-[33.3%] md:w-[33.3%] items-center cursor-pointer">
                <img src="/location-icon.svg" alt="location-icon" className="mx-2"/>
                <h1 className="text-white text-xl font-medium font-['Bakbak_One']">{place}</h1>
                <img src="/arrow-icon.svg" alt="arrow-icon"  className="pt-1.5 mx-3"/>
            </div>
            <ul className="items-start sm:hidden justify-start w-[33.3%] min-w-[300px] text-sm font-medium text-gray-900 border border-gray-200 rounded-lg md:flex lg:flex xl:flex xxl:flex bg-blue-900">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                        <input
                            id="horizontal-list-radio-fahrenheit-dt"
                            type="radio"
                            value="fahrenheit-dt"
                            name="list-radio-dt"
                            className="w-4 h-4 outline-none text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            checked={temperatureUnit === 'fahrenheit'}
                            onChange={toggleTemperatureUnit}
                        />
                        <label htmlFor="horizontal-list-radio-fahrenheit-dt" className="w-full whitespace-nowrap py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Fahrenheit</label>
                    </div>
                </li>
                <li className="w-full dark:border-gray-600">
                    <div className="flex justify-center items-center w-full ps-3">
                        <input
                            id="horizontal-list-radio-celsius-dt"
                            type="radio"
                            value="celsius"
                            name="list-radio"
                            className="w-4 h-4  text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            checked={temperatureUnit === 'celsius'}
                            onChange={toggleTemperatureUnit}
                        />
                        <label htmlFor="horizontal-list-radio-celsius-dt" className="w-full whitespace-nowrap py-3 ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">Celsius</label>
                    </div>
                </li>
            </ul>
            <div className="cursor-pointer w-[33.3%] flex justify-end" onClick={handleCopyUrl}>
                <img src="/share-icon.svg" alt="share-icon" />
            </div>
        </header>
            <ul className="items-start sm:flex justify-start w-full min-w-[300px] text-sm font-medium text-gray-900 md:hidden lg:hidden xl:hidden xxl:hidden bg-blue-900">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                    <div className="flex items-center ps-3">
                        <input
                            id="horizontal-list-radio-fahrenheit-sm"
                            type="radio"
                            value="fahrenheit"
                            name="list-radio"
                            className="w-4 h-4 outline-none text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            checked={temperatureUnit === 'fahrenheit'}
                            onChange={toggleTemperatureUnit}
                        />
                        <label htmlFor="horizontal-list-radio-fahrenheit-sm" className="w-full whitespace-nowrap py-3 ms-2 text-sm font-medium text-gray-50">Fahrenheit</label>
                    </div>
                </li>
                <li className="w-full">
                    <div className="flex justify-center items-center w-full ps-3">
                        <input
                            id="horizontal-list-radio-celsius-sm"
                            type="radio"
                            value="celsius-sm"
                            name="list-radio-sm"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            checked={temperatureUnit === 'celsius'}
                            onChange={toggleTemperatureUnit}
                        />
                        <label htmlFor="horizontal-list-radio-celsius-sm" className="w-full whitespace-nowrap py-3 ms-2  text-sm font-medium text-gray-50">Celsius</label>
                    </div>
                </li>
            </ul>
        </>
    )
}

export default Header;