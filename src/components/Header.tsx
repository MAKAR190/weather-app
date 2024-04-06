import React from 'react';
import {toast } from 'react-toastify'
import {toastOptions} from "../utils";
interface Props {
    toggleModal: React.MouseEventHandler<HTMLDivElement>;
}
const Header:React.FC<Props> = ({toggleModal})=>{
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
        <header className="flex justify-between items-center w-full p-3">
            <div onClick={toggleModal} className="flex items-center cursor-pointer">
                <img src="/location-icon.svg" alt="location-icon" className="mx-2"/>
                <h1 className="text-white text-xl font-medium font-['Bakbak_One']">Fortaleza</h1>
                <img src="/arrow-icon.svg" alt="arrow-icon"  className="pt-1.5 mx-3"/>
            </div>
            <div className="cursor-pointer" onClick={handleCopyUrl}>
                <img src="/share-icon.svg" alt="share-icon" />
            </div>
        </header>
    )
}

export default Header;