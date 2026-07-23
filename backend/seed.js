const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Book = require('./models/Book');
const User = require('./models/User');
require('dotenv').config();
// ВАШИ ЛЮБИМЫЕ КНИГИ с локальными обложками
const books = [
  {
    title: "Гарри Поттер и философский камень",
    author: "Дж.К. Роулинг",
    category: "Фантастика",
    year: 1997,
    description: "Первая книга о мальчике-волшебнике, который узнает о своем великом предназначении.",
    coverImage: "/covers/harry_potter.jpg",
    fileUrl: "/files/harry_potter.txt",
    price: 0,
    likesCount: 0
  },
  {
    title: "Война и мир",
    author: "Лев Толстой",
    category: "Роман",
    year: 1869,
    description: "Великий роман-эпопея о судьбах России в эпоху Наполеоновских войн.",
    coverImage: "/covers/war_and_peace.jpg",
    fileUrl: "/files/war_and_peace.txt",
    price: 0,
    likesCount: 0
  },
  {
    title: "Преступление и наказание",
    author: "Федор Достоевский",
    category: "Роман",
    year: 1866,
    description: "Философский роман о преступлении, наказании и искуплении.",
    coverImage: "/covers/crime_punishment.jpg",
    fileUrl: "/files/crime_and_punishment.txt",
    price: 0,
    likesCount: 0
  },
  {
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    category: "Роман",
    year: 1967,
    description: "Мистический роман о дьяволе, любви и творчестве в сталинской Москве.",
    coverImage: "/covers/master_margarita.jpg",
    fileUrl: "/files/master_and_margarita.txt",
    price: 0,
    likesCount: 0
  },
  {
    title: "1984",
    author: "Джордж Оруэлл",
    category: "Фантастика",
    year: 1949,
    description: "Антиутопический роман о тоталитарном обществе будущего.",
    coverImage: "/covers/1984.jpg",
    fileUrl: "/files/1984.txt",
    price: 0,
    likesCount: 0
  },
  {
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
    category: "Детская",
    year: 1943,
    description: "Мудрая сказка-притча о дружбе, любви и ответственности.",
    coverImage: "/covers/little_prince.jpg",
    fileUrl: "/files/little_prince.txt",
    price: 0,
    likesCount: 0
  },
  {
    title: "Анна Каренина",
    author: "Лев Толстой",
    category: "Роман",
    year: 1877,
    description: "Трагическая история любви на фоне светской жизни России XIX века.",
    coverImage: "/covers/anna_karenina.jpg",
    fileUrl: "/files/anna_karenina.txt",
    price: 0,
    likesCount: 0
  },
  {
    title: "Солярис",
    author: "Станислав Лем",
    category: "Фантастика",
    year: 1961,
    description: "Философская научная фантастика о контакте с непостижимым разумом океана.",
    coverImage: "/covers/solaris.jpg",
    fileUrl: "/files/solaris.txt",
    price: 0,
    likesCount: 0
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Подключено к MongoDB');
    
    // Очищаем коллекции
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ База данных очищена');
    
    // Создаем администратора
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: 'admin@admin.com',
      password: adminPassword,
      name: 'Администратор',
      role: 'admin',
      favorites: []
    });
    await admin.save();
    console.log('✅ Администратор создан (admin@admin.com / admin123)');
    
    // Добавляем книги
    const inserted = await Book.insertMany(books);
    console.log(`✅ Добавлено ${inserted.length} книг в библиотеку`);
    
    console.log('\n📚 Список добавленных книг:');
    inserted.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" — ${book.author} (${book.year})`);
    });
    
    console.log('\n🔐 Данные для входа:');
    console.log('   Администратор: admin@admin.com / admin123');
    console.log('   Пользователи: регистрация по email');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при добавлении данных:', error);
    process.exit(1);
  }
}

seedDatabase();
