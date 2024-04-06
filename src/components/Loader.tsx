import React from 'react';
import {Radio} from "react-loader-spinner"
const Loader = () => {
    return (
        <Radio
            visible={true}
            colors={["#4169E1", "#4169E1", "#4169E1"]}
            ariaLabel="radio-loading"
            wrapperClass="w-full fixed h-full flex top-0 flex justify-center items-center bg-[#4169E1] bg-opacity-50"
        />
    )
}

export default Loader;