import React from 'react';
import {Radio} from "react-loader-spinner"
const Loader = () => {
    return (
        <Radio
            visible={true}
            height="10"
            width="10"
            colors={["#4169E1", "#4169E1", "#4169E1"]}
            ariaLabel="radio-loading"
            wrapperClass="w-screen h-screen flex justify-center items-center bg-black bg-opacity-50"
        />
    )
}

export default Loader;