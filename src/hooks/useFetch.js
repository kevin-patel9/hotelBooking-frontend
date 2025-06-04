import { useState } from 'react';
import { axiosInstance } from '../config';

export const useFetch = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refetchData = async (url) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(url);
            setData(res.data);
            setError(null);
        } catch (err) {
            setError(err);
            setData([]);
        }
        setLoading(false);
    };

    return { data, loading, error, refetchData };
};