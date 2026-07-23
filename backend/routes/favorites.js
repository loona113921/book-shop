const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware для проверки токена
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Неверный токен'
    });
  }
};

// Добавить в избранное
router.post('/toggle', authenticate, async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }

    const isFavorite = user.favorites.includes(bookId);
    
    if (isFavorite) {
      // Удаляем из избранного
      user.favorites = user.favorites.filter(id => id.toString() !== bookId);
      book.likesCount = Math.max(0, book.likesCount - 1);
    } else {
      // Добавляем в избранное
      user.favorites.push(bookId);
      book.likesCount = (book.likesCount || 0) + 1;
    }

    await user.save();
    await book.save();

    res.json({
      success: true,
      isFavorite: !isFavorite,
      likesCount: book.likesCount,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Ошибка при изменении избранного:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при изменении избранного'
    });
  }
});

// Получить избранные книги
router.get('/my', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Ошибка получения избранного:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения избранного'
    });
  }
});

module.exports = router;