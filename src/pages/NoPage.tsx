import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const NoPage = ({message}: {message?:string;}) => {
    const imageRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });

        tl.to(imageRef.current, { duration: 1, y: -20 })
            .to(imageRef.current, { duration: 2, y: 20 });

        const cleanup = () => {
            tl.kill();
        };

        return cleanup;
    }, []);

    return(
        <div className="App">
            <div className="flex flex-col w-[99%] h-screen justify-center items-center">
                <img ref={imageRef}  src="/sad-icon.png" alt="sad-icon" />
                <h1 className="font-bold text-white text-center text-7xl font-sans-['Merriweather']">{message || "404"}</h1>
                <Link to="/">
                  <button className="my-10 text-white bg-black border-blue-400 border-2 rounded-2xl px-5 py-3 duration-[0.1s] hover:border-white">Home</button>
                </Link>
            </div>
        </div>
    )
}

export default  NoPage;