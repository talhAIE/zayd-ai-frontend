import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "69420",
    },
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
    (config:any) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error:any) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error:any) => {
        // Handle common errors like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login
            localStorage.removeItem('AiTutorUser');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;