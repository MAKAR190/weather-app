import { useState, useEffect } from 'react';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    fetchError: Error | null;
}

const useFetch = <T>(url: string | null): FetchState<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchError, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(url){
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const jsonData: T = await response.json();
                    setData(jsonData);
                    setLoading(false);
                }
            } catch (error) {
                setError(error as Error);
                setLoading(false);
            }
        };

        fetchData();

        return () => setData(null);
    }, [url]);

    return { data, loading, fetchError };
};

export default useFetch;
