import { ToastOptions } from 'react-toastify';
export const reverseGeocode = async (latitude:number | undefined, longitude: number | undefined) => {
    const apiKey = process.env.REACT_APP_MAPS_API_KEY;
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
    } else {
        throw new Error('Location not found');
    }
};
export const convertToSlug = (text:string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};
export const fetchCoordinatesFromSlug = async (slug: string,  reportError?: (bool:boolean) => void) => {
    const locationName = slug
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

    try {
        const apiKey = process.env.REACT_APP_MAPS_API_KEY;
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng  };
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw new Error('Failed to fetch coordinates');
    }
};

export function unixTimeToHour(unixTime:number) {
    const date = new Date(unixTime * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}
export function unixTimeToDay(unixTime:number) {
    const date = new Date(unixTime * 1000);

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayOfWeek = weekdays[date.getDay()];

    return dayOfWeek;
}

export function formatPeriod(startUnixTime:number) {
    const startDate = new Date(startUnixTime * 1000);
    const endDate = new Date((startUnixTime + 86400) * 1000);

    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const endMonth = endDate.toLocaleString('default', { month: 'short' });

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
        return `${startMonth}, ${startDay}-${endDay}`;
    } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
}


export const toastOptions: ToastOptions = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
};