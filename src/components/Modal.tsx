import React, {useEffect, useRef} from 'react';
import Map from "./Map"
import BlockLayout from "./BlockLayout"
import gsap from 'gsap';
import {Link} from "react-router-dom";
interface Props {
    isOpen: boolean;
    onClose: (event: React.MouseEvent | KeyboardEvent) => void;
}

const Modal:React.FC<Props> = ({ isOpen, onClose }) =>{
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            gsap.to(modalRef.current, { opacity: 1, duration: 0.5, y: 0 });
        } else {
            gsap.to(modalRef.current, { opacity: 0, duration: 0.5, y: -50 });
        }
    }, [isOpen]);

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


    return(
        <div ref={modalRef} className={`w-screen h-screen top-0 overflow-y-auto fixed bg-black bg-opacity-50 ${isOpen ? "block" : "hidden"} p-10`}>
           <div onClick={(e)=>onClose(e)} className="absolute right-5 top-5 cursor-pointer">
               <img src="/cross.svg" alt="cross" />
           </div>
            <div className="flex justify-center items-center h-full sm:pt-[500px] md:pt-0 xl:pt-0 lg:pt-0 xxl:pt-0 w-full">
                <div className='grid sm:place-items-center md:place-items-start xl:place-items-start lg:place-items-start xxl:place-items-start sm:grid-cols-1 md:grid-cols-3 xxl:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
                    <div className="flex flex-col sm:w-[90vw] md:w-[60vw] xxl:w-[60vw] lg:w-[60vw] xl:w-[60vw] h-full justify-center sm:col-span-1 md:col-span-2 xxl:col-span-2 xl:col-span-2 lg:col-span-2">
                    <div className="w-full relative">
                        <input placeholder="Find your desired location..." className="outline-0 p-3 w-full"/>
                        <Link to="/">
                            <button className="absolute right-0 top-0 bg-black border-white border-2 p-3 duration-[0.1s] hover:border-blue-400 active:border-blue-400">
                                <img src='/add-icon.svg' alt="add-icon" />
                            </button>
                        </Link>
                    </div>
                        <div className="w-full h-[400px]">
                        <Map/>
                        </div>
                    </div>
                   <div className="flex flex-col mx-5 w-full">
                       <h2 className="font-['Roboto_Flex'] font-bold text-white text-3xl">History</h2>
                      <div className="my-3 max-h-[400px] overflow-y-auto">
                          <BlockLayout className="p-5 min-w-[250px] rounded-none duration-[0.1s] cursor-pointer border-b-orange-50 border-2 border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10">
                           <div className="flex flex-col">
                               <h3 className="font-['Roboto_Flex'] font-light text-white text-lg">Rome</h3>
                           </div>
                       </BlockLayout>  <BlockLayout className="p-5 min-w-[250px]  rounded-none duration-[0.1s] cursor-pointer border-b-orange-50 border-2 border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10">
                           <div className="flex flex-col">
                               <h3 className="font-['Roboto_Flex'] font-light text-white text-lg">Rome</h3>
                           </div>
                       </BlockLayout>  <BlockLayout className="p-5 min-w-[250px] rounded-none duration-[0.1s] cursor-pointer border-b-orange-50 border-2 border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10">
                           <div className="flex flex-col">
                               <h3 className="font-['Roboto_Flex'] font-light text-white text-lg">Rome</h3>
                           </div>
                       </BlockLayout><BlockLayout className="p-5 min-w-[250px] rounded-none duration-[0.1s] cursor-pointer border-b-orange-50 border-2 border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10">
                           <div className="flex flex-col">
                               <h3 className="font-['Roboto_Flex'] font-light text-white text-lg">Rome</h3>
                           </div>
                       </BlockLayout><BlockLayout className="p-5 min-w-[250px] rounded-none duration-[0.1s] cursor-pointer border-b-orange-50 border-2 border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10">
                           <div className="flex flex-col">
                               <h3 className="font-['Roboto_Flex'] font-light text-white text-lg">Rome</h3>
                           </div>
                       </BlockLayout><BlockLayout className="p-5 min-w-[250px] rounded-none duration-[0.1s] cursor-pointer border-b-orange-50 border-2 border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-10 active:border-blue-400 active:bg-blue-400 active:bg-opacity-10">
                           <div className="flex flex-col">
                               <h3 className="font-['Roboto_Flex'] font-light text-white text-lg">Rome</h3>
                           </div>
                       </BlockLayout>
                      </div>
                   </div>
                </div>
            </div>
        </div>
    )
}
export default Modal;