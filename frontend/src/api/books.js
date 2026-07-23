import axios from 'axios';

const API_URL = 'http://localhost:500/api';

// Получить все книги
export const getBooks = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/books`, { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке книг:', error);
    throw error;
  }
};

// Получить одну книгу
export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке книги:', error);
    throw error;
  }
};

// Добавить/удалить из избранного
export const toggleFavorite = async (bookId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/favorites/toggle`,
      { bookId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при изменении избранного:', error);
    throw error;
  }
};

// Получить избранные книги
export const getFavorites = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/favorites/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении избранного:', error);
    throw error;
  }
};

// Регистрация
// Регистрация (без имени)
export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
};

// Вход
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
};

// Проверка токена
export const checkAuth = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
    throw error;
  }
};

// CRUD для админа
export const createBook = async (bookData, token) => {
  try {
    const response = await axios.post(`${API_URL}/books`, bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении книги:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData, token) => {
  try {
    const response = await axios.put(`${API_URL}/books/${id}`, bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении книги:', error);
    throw error;
  }
};

export const deleteBook = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении книги:', error);
    throw error;
  }
};

export const rentBook = async (id, userId, duration) => {
  try {
    const response = await axios.post(`${API_URL}/books/${id}/rent`, { userId, duration });
    return response.data;
  } catch (error) {
    console.error('Ошибка при аренде книги:', error);
    throw error;
  }
};

export const returnBook = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/books/${id}/return`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при возврате книги:', error);
    throw error;
  }
};