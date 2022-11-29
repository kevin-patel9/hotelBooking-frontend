import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://hotels-booking.onrender.com"
})