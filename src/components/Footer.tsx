import React from 'react';

const Footer = () =>{
    return(
        <footer className="flex items-end justify-center w-full mt-10">
            <span className="font-['Roboto_Flex'] font-light text-white text-sm mx-1">Based on</span>
            <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
                <img src="https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png" alt="open-weather-logo" className="mx-2 max-w-[100px]"/>
            </a>
        </footer>
    )
}

export default Footer;