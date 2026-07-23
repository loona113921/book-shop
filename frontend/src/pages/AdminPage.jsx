import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBooks, createBook, updateBook, deleteBook } from '../api/books';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, token, logout, loading: authLoading } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    year: '',
    description: '',
    coverImage: '',
    fileUrl: '',
    price: 0,
    status: 'available'
  });

  const categories = ['Роман', 'Детектив', 'Фантастика', 'Наука', 'Поэзия', 'Драма', 'Приключения', 'Детская', 'История', 'Философия'];

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'admin') {
      alert('У вас нет прав администратора');
      navigate('/');
      return;
    }
    loadBooks();
  }, [user, authLoading]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Ошибка загрузки книг:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        year: parseInt(formData.year),
        price: parseFloat(formData.price) || 0
      };

      if (editingBook) {
        await updateBook(editingBook._id, bookData, token);
        alert('✅ Книга обновлена!');
      } else {
        await createBook(bookData, token);
        alert('✅ Книга добавлена!');
      }
      
      resetForm();
      await loadBooks();
    } catch (error) {
      alert('❌ Ошибка при сохранении книги');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту книгу?')) return;
    try {
      await deleteBook(id, token);
      alert('✅ Книга удалена!');
      await loadBooks();
    } catch (error) {
      alert('❌ Ошибка при удалении книги');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      year: book.year.toString(),
      description: book.description,
      coverImage: book.coverImage || '',
      fileUrl: book.fileUrl,
      price: book.price || 0,
      status: book.status || 'available'
    });
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      category: '',
      year: '',
      description: '',
      coverImage: '',
      fileUrl: '',
      price: 0,
      status: 'available'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6AD55]"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#F6AD55]" />
          Админ-панель
        </h1>
      </div>

      <div className="bg-[#3D4A5C] rounded-[40px] shadow-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          {editingBook ? (
            <>
              <Edit2 className="w-5 h-5 text-[#F6AD55]" />
              Редактировать книгу
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-[#F6AD55]" />
              Добавить новую книгу
            </>
          )}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Название книги *"
            className="px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
            required
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Автор *"
            className="px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
            required
          />
          
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] appearance-none pr-10"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B9AAC]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Год написания *"
            className="px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание книги *"
            className="md:col-span-2 px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
            rows="3"
            required
          />
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="Ссылка на обложку"
            className="px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
          />
          <input
            type="text"
            name="fileUrl"
            value={formData.fileUrl}
            onChange={handleChange}
            placeholder="Ссылка на файл книги *"
            className="px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Цена"
            className="px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
          />
          
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#2D3748] text-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] appearance-none pr-10"
            >
              <option value="available">✅ Доступна</option>
              <option value="unavailable">⛔ Недоступна</option>
              <option value="rented">📖 Арендована</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B9AAC]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="btn-float bg-gradient-to-r from-[#F6AD55] to-[#ED8936] hover:from-[#FBBF24] hover:to-[#F6AD55] text-[#1A202C] px-8 py-2.5 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-[#F6AD55]/30 hover:shadow-[#FBBF24]/50"
            >
              {editingBook ? 'Обновить' : 'Добавить'} книгу
            </button>
            {editingBook && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-float bg-[#4A5A6A] hover:bg-[#5A6A7A] text-white px-8 py-2.5 rounded-2xl font-semibold transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-[#3D4A5C] rounded-[40px] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#4A5A6A] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Список книг</h2>
          <span className="text-sm text-[#8B9AAC]">{books.length} книг</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#4A5A6A]">
            <thead className="bg-[#2D3748]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B9AAC] uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B9AAC] uppercase tracking-wider">Автор</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B9AAC] uppercase tracking-wider">Категория</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B9AAC] uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B9AAC] uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-[#3D4A5C] divide-y divide-[#4A5A6A]">
              {books.map(book => (
                <tr key={book._id} className="hover:bg-[#455565] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{book.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0C0D0]">{book.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0C0D0]">{book.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs font-medium ${
                      book.status === 'available' ? 'text-green-400' :
                      book.status === 'rented' ? 'text-[#F6AD55]' :
                      'text-gray-400'
                    }`}>
                      {book.status === 'available' ? 'Доступна' :
                       book.status === 'rented' ? 'Арендована' : 'Недоступна'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-[#8B9AAC] hover:text-[#F6AD55] transition-colors p-1"
                        title="Редактировать"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-[#8B9AAC] hover:text-[#FF6B8A] transition-colors p-1"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;