const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 500;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: '📚 Библиотека электронных книг API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      auth: '/api/auth',
      favorites: '/api/favorites'
    }
  });
});

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Подключено к MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📖 API доступно по адресу: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  });

// Фоновая задача для проверки аренды
const Book = require('./models/Book');
setInterval(async () => {
  try {
    const now = new Date();
    const expiredRentals = await Book.find({
      isRented: true,
      rentEndDate: { $lt: now }
    });
    
    if (expiredRentals.length > 0) {
      console.log(`🔔 Найдено ${expiredRentals.length} книг с истекшим сроком аренды:`);
      expiredRentals.forEach(book => {
        console.log(`   📕 "${book.title}" - арендована пользователем ${book.rentedBy}, срок истек ${book.rentEndDate.toLocaleDateString()}`);
      });
    }
  } catch (error) {
    console.error('Ошибка в фоновой задаче:', error);
  }
}, 30000);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('❌ Необработанная ошибка:', err);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});