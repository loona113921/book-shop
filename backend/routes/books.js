const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// =========================================
// GET /api/books - Получение всех книг с сортировкой
// =========================================
router.get('/', async (req, res) => {
  try {
    const { category, author, sort, search } = req.query;
    
    // Строим фильтр
    let filter = {};
    if (category) filter.category = category;
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };
    
    // Строим сортировку
    let sortOption = {};
    if (sort === 'year') sortOption = { year: -1 };
    else if (sort === 'author') sortOption = { author: 1 };
    else if (sort === 'category') sortOption = { category: 1 };
    else sortOption = { createdAt: -1 }; // По умолчанию новые сверху
    
    const books = await Book.find(filter).sort(sortOption);
    
    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    console.error('Ошибка при получении книг:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении книг'
    });
  }
});

// =========================================
// GET /api/books/:id - Получение одной книги
// =========================================
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }
    res.json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Ошибка при получении книги:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении книги'
    });
  }
});

// =========================================
// POST /api/books - Добавление новой книги (админ)
// =========================================
router.post('/', async (req, res) => {
  try {
    const { title, author, category, year, description, coverImage, fileUrl, price } = req.body;
    
    // Валидация
    if (!title || !author || !category || !year || !description || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля'
      });
    }
    
    const newBook = new Book({
      title,
      author,
      category,
      year,
      description,
      coverImage: coverImage || 'https://via.placeholder.com/200x300?text=No+Cover',
      fileUrl,
      price: price || 0
    });
    
    await newBook.save();
    
    res.status(201).json({
      success: true,
      message: 'Книга успешно добавлена',
      book: newBook
    });
  } catch (error) {
    console.error('Ошибка при добавлении книги:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при добавлении книги'
    });
  }
});

// =========================================
// PUT /api/books/:id - Обновление книги (админ)
// =========================================
router.put('/:id', async (req, res) => {
  try {
    const { title, author, category, year, description, coverImage, fileUrl, price, status } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }
    
    // Обновляем поля
    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (year) book.year = year;
    if (description) book.description = description;
    if (coverImage) book.coverImage = coverImage;
    if (fileUrl) book.fileUrl = fileUrl;
    if (price !== undefined) book.price = price;
    if (status) book.status = status;
    
    await book.save();
    
    res.json({
      success: true,
      message: 'Книга успешно обновлена',
      book
    });
  } catch (error) {
    console.error('Ошибка при обновлении книги:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении книги'
    });
  }
});

// =========================================
// DELETE /api/books/:id - Удаление книги (админ)
// =========================================
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }
    
    res.json({
      success: true,
      message: 'Книга успешно удалена',
      book
    });
  } catch (error) {
    console.error('Ошибка при удалении книги:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при удалении книги'
    });
  }
});

// =========================================
// POST /api/books/:id/rent - Аренда книги
// =========================================
router.post('/:id/rent', async (req, res) => {
  try {
    const { userId, duration } = req.body; // duration: '2weeks', 'month', '3months'
    
    if (!userId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать пользователя и срок аренды'
      });
    }
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }
    
    // Проверяем доступность
    if (book.status === 'unavailable') {
      return res.status(400).json({
        success: false,
        message: 'Книга временно недоступна'
      });
    }
    
    if (book.isRented) {
      return res.status(400).json({
        success: false,
        message: 'Книга уже арендована'
      });
    }
    
    // Рассчитываем дату окончания аренды
    const rentEndDate = new Date();
    switch(duration) {
      case '2weeks':
        rentEndDate.setDate(rentEndDate.getDate() + 14);
        break;
      case 'month':
        rentEndDate.setMonth(rentEndDate.getMonth() + 1);
        break;
      case '3months':
        rentEndDate.setMonth(rentEndDate.getMonth() + 3);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Некорректный срок аренды'
        });
    }
    
    // Обновляем книгу
    book.isRented = true;
    book.rentedBy = userId;
    book.rentEndDate = rentEndDate;
    book.status = 'rented';
    
    await book.save();
    
    res.json({
      success: true,
      message: `Книга успешно арендована до ${rentEndDate.toLocaleDateString()}`,
      book
    });
  } catch (error) {
    console.error('Ошибка при аренде книги:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при аренде книги'
    });
  }
});

// =========================================
// POST /api/books/:id/return - Возврат книги
// =========================================
router.post('/:id/return', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }
    
    if (!book.isRented) {
      return res.status(400).json({
        success: false,
        message: 'Книга не находится в аренде'
      });
    }
    
    // Возвращаем книгу
    book.isRented = false;
    book.rentedBy = null;
    book.rentEndDate = null;
    book.status = 'available';
    
    await book.save();
    
    res.json({
      success: true,
      message: 'Книга успешно возвращена',
      book
    });
  } catch (error) {
    console.error('Ошибка при возврате книги:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при возврате книги'
    });
  }
});

module.exports = router;