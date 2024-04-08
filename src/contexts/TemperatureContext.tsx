import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TemperatureUnit = 'fahrenheit' | 'celsius';

interface TemperatureContextType {
    temperatureUnit: TemperatureUnit;
    toggleTemperatureUnit: () => void;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const useTemperature = () => {
    const context = useContext(TemperatureContext);
    if (!context) {
        throw new Error('useTemperature must be used within a TemperatureProvider');
    }
    return context;
};

interface Props {
    children: ReactNode;
}

export const TemperatureProvider: React.FC<Props> = ({ children }) => {
    const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
        const storedUnit = localStorage.getItem('temperatureUnit');
        return (storedUnit === 'celsius' || storedUnit === 'fahrenheit') ? storedUnit : 'fahrenheit';
    });

    useEffect(() => {
        localStorage.setItem('temperatureUnit', temperatureUnit);
    }, [temperatureUnit]);

    const toggleTemperatureUnit = () => {
        setTemperatureUnit(prevUnit => prevUnit === 'fahrenheit' ? 'celsius' : 'fahrenheit');
    };

    return (
        <TemperatureContext.Provider value={{ temperatureUnit, toggleTemperatureUnit }}>
            {children}
        </TemperatureContext.Provider>
    );
};
