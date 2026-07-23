import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BookOpen, Clock } from 'lucide-react';
import { getBookById, rentBook, returnBook } from '../api/books';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentDuration, setRentDuration] = useState('2weeks');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const rentOptions = [
    { value: '2weeks', label: '2 недели' },
    { value: 'month', label: '1 месяц' },
    { value: '3months', label: '3 месяца' }
  ];

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    setLoading(true);
    try {
      const data = await getBookById(id);
      setBook(data.book);
    } catch (error) {
      console.error('Ошибка загрузки книги:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const userId = user._id || user.id || 'user123';
      await rentBook(id, userId, rentDuration);
      await loadBook();
    } catch (error) {
      console.error('Ошибка при аренде книги:', error);
    }
  };

  const handleReturn = async () => {
    try {
      await returnBook(id);
      await loadBook();
    } catch (error) {
      console.error('Ошибка при возврате книги:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6AD55]"></div>
      </div>
    );
  }

  if (!book) {
    return <div className="text-center py-12 text-[#8B9AAC]">Книга не найдена</div>;
  }

  const hasCover = book.coverImage && book.coverImage !== '' && !book.coverImage.includes('placeholder');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-[#F6AD55] hover:text-[#ED8936] transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад к списку
      </button>
      
      <div className="bg-[#3D4A5C] rounded-[40px] shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-3 gap-0">
          <div className="md:col-span-1 bg-[#2D3748] p-0 flex items-center justify-center">
            {hasCover ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover min-h-[400px] max-h-[600px]"
              />
            ) : (
              <div className="w-full h-full min-h-[400px] max-h-[600px] bg-gradient-to-br from-[#2D3748] to-[#3D4A5C]"></div>
            )}
          </div>
          <div className="md:col-span-2 p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{book.title}</h1>
                <p className="text-xl text-[#B0C0D0] mb-4">{book.author}</p>
              </div>
              {/* Статус только текстом */}
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                book.status === 'available' ? 'text-green-400' :
                book.status === 'rented' ? 'text-[#F6AD55]' :
                'text-gray-400'
              }`}>
                {book.status === 'available' ? 'Доступна' :
                 book.status === 'rented' ? 'Арендована' : 'Недоступна'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-[#F6AD55]/10 text-[#F6AD55] rounded-full text-sm font-medium">
                {book.category}
              </span>
              <span className="px-3 py-1 bg-[#2D3748] text-[#B0C0D0] rounded-full text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {book.year}
              </span>
            </div>

            <p className="text-[#B0C0D0] mb-6 leading-relaxed border-l-4 border-[#F6AD55] pl-4">
              {book.description}
            </p>

            {book.status === 'available' && (
              <div className="border-t border-[#4A5A6A] pt-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#F6AD55]" />
                  Арендовать книгу
                </h3>
                
                <div className="flex flex-wrap gap-6 mb-4">
                  {rentOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="rentDuration"
                          value={option.value}
                          checked={rentDuration === option.value}
                          onChange={(e) => setRentDuration(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                          rentDuration === option.value 
                            ? 'border-[#F6AD55] bg-[#F6AD55]/20' 
                            : 'border-[#8B9AAC] group-hover:border-[#CBD5E0]'
                        }`}>
                          {rentDuration === option.value && (
                            <div className="w-2 h-2 rounded-full bg-[#F6AD55]"></div>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm transition-colors ${
                        rentDuration === option.value 
                          ? 'text-[#F6AD55] font-medium' 
                          : 'text-[#B0C0D0] group-hover:text-white'
                      }`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleRent}
                  className="btn-float bg-gradient-to-r from-[#F6AD55] to-[#ED8936] hover:from-[#FBBF24] hover:to-[#F6AD55] text-[#1A202C] px-8 py-2.5 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-[#F6AD55]/30 hover:shadow-[#FBBF24]/50"
                >
                  Арендовать
                </button>
              </div>
            )}

            {book.status === 'rented' && (
              <div className="border-t border-[#4A5A6A] pt-6">
                <div className="bg-[#F6AD55]/10 rounded-3xl p-4 mb-4">
                  <p className="text-[#F6AD55] font-medium flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Книга арендована до: <span className="font-bold">{new Date(book.rentEndDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </p>
                </div>
                <button
                  onClick={handleReturn}
                  className="btn-float bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-8 py-2.5 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-400/50"
                >
                  Вернуть книгу
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default BookPage;