import axios from 'axios';

/**
 * Axios instance configured for the CampusFlow backend.
 * BaseURL points to /api so all frontend calls are relative:
 *   api.get('/placements')  → GET http://localhost:5050/api/placements
 *   api.post('/auth/login') → POST http://localhost:5050/api/auth/login
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
    timeout: 15000,
});

// Attach JWT token to every outgoing request (if user is logged in)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle common response errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token expired or invalid, redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on auth pages
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;