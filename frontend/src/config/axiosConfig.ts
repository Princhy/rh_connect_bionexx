import axios from "axios";

let isRefreshing = false;
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
});

let failedQueue: any[] = [];

axiosInstance.interceptors.request.use(
    async (config: any) => {
        return config;
    },
    (error) => {
        // Gérer l'erreur
        return Promise.reject(error);
    },
);

const processQueue = (error: any, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setInstanceTokens = (token?: string) => {
    if (token) {
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = token;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            // eslint-disable-next-line no-underscore-dangle
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }


            isRefreshing = true;
            // eslint-disable-next-line no-underscore-dangle
            originalRequest._retry = true;
            try {
                const result = await axios.post(
                    `http://localhost:8000/refreshToken`,
                    {},
                    {
                        withCredentials: true,
                    },
                );
                processQueue(null, result.data.accessToken);
                originalRequest.headers.Authorization = result.data.accessToken;
                setInstanceTokens(result.data.accessToken);
                console.log(result.data.accessToken)
                return await axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return await Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;