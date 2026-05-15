import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('spectra_admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized - clear token and redirect/refresh
            localStorage.removeItem('spectra_admin_token');
            localStorage.removeItem('spectra_admin_user');
            window.location.reload(); // This will trigger the App.jsx to show Login
        }
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
        localStorage.setItem('spectra_admin_token', response.data.token);
        localStorage.setItem('spectra_admin_user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (err) {
        console.error('Logout error:', err);
    } finally {
        localStorage.removeItem('spectra_admin_token');
        localStorage.removeItem('spectra_admin_user');
    }
};

export const getSessions = async () => {
    const response = await api.get('/auth/sessions');
    return response.data;
};

export const terminateSession = async (sessionId) => {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
};

export const loginMfa = async (userId, token) => {
    const response = await api.post('/auth/login-mfa', { userId, token });
    if (response.data.token) {
        localStorage.setItem('spectra_admin_token', response.data.token);
        localStorage.setItem('spectra_admin_user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const getMfaSetup = async () => {
    try {
        const response = await api.get('/auth/mfa-setup');
        return response.data;
    } catch (error) {
        console.error('API Error (MFA Setup):', error.response || error);
        throw error;
    }
};

export const verifyMfaSetup = async (token) => {
    const response = await api.post('/auth/mfa-verify', { token });
    return response.data;
};

export const getJournalTree = async () => {
    const response = await api.get('/articles/tree');
    return response.data;
};

export const createYear = async (year) => {
    const response = await api.post('/articles/init-year', { year });
    return response.data;
};

export const createCategory = async (issueId, title) => {
    const response = await api.post('/articles/category', { issueId, title });
    return response.data;
};

export const uploadArticle = async (formData) => {
    const response = await api.post('/articles/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteArticle = async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
};

export const updateArticle = async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/articles/category/${id}`);
    return response.data;
};

export const deleteYear = async (id) => {
    const response = await api.delete(`/articles/year/${id}`);
    return response.data;
};

// About APIs
export const getAboutSections = async () => {
    const response = await api.get('/about');
    return response.data;
};
export const createAboutSection = async (data) => {
    const response = await api.post('/about', data);
    return response.data;
};
export const updateAboutSection = async (id, data) => {
    const response = await api.put(`/about/${id}`, data);
    return response.data;
};
export const deleteAboutSection = async (id) => {
    const response = await api.delete(`/about/${id}`);
    return response.data;
};

// Editorial APIs
export const getEditorialMembers = async () => {
    const response = await api.get('/editorial');
    return response.data;
};
export const createEditorialMember = async (data) => {
    const response = await api.post('/editorial', data);
    return response.data;
};
export const updateEditorialMember = async (id, data) => {
    const response = await api.put(`/editorial/${id}`, data);
    return response.data;
};
export const deleteEditorialMember = async (id) => {
    const response = await api.delete(`/editorial/${id}`);
    return response.data;
};

// Gallery APIs
export const getGalleryImages = async () => {
    const response = await api.get('/gallery');
    return response.data;
};
export const uploadGalleryImage = async (formData) => {
    const response = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
export const updateGalleryImage = async (id, data) => {
    const response = await api.put(`/gallery/${id}`, data);
    return response.data;
};
export const deleteGalleryImage = async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
};

export default api;
