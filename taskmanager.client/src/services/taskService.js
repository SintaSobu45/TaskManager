
import axios from 'axios';

const api = axios.create({
    baseURL: '/api/Tasks',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getTasks = async () => {
    const response = await api.get('/');
    return response.data;
};

export const getTaskById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const createTask = async (task) => {
    const response = await api.post('/', task);
    return response.data;
};

export const updateTask = async (id, task) => {
    const response = await api.put(`/${id}`, task);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};
