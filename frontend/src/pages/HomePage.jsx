import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getBooks } from '../api/books';
import { useAuth } from '../context/AuthContext';
import BookList from '../components/BookList';
import Filters from '../components/Filters';
import AuthModal from '../components/AuthModal';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    sort: ''
  });
  const { user } = useAuth();

  const categories = [
    'Роман', 'Детектив', 'Фантастика', 'Наука', 
    'Поэзия', 'Драма', 'Приключения', 'Детская', 
    'История', 'Философия'
  ];

  // Читаем параметры из URL при загрузке
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const favoritesParam = params.get('favorites');
    if (favoritesParam === 'true') {
      setShowFavorites(true);
    }
  }, [location]);

  // Обновляем URL при изменении режима избранного
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (showFavorites) {
      params.set('favorites', 'true');
    } else {
      params.delete('favorites');
    }
    const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    navigate(newUrl, { replace: true });
  }, [showFavorites]);

  useEffect(() => {
    loadBooks();
  }, [filters, showFavorites, user]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks(filters);
      
      let booksWithFavorites = data.books.map(book => ({
        ...book,
        isFavorite: user?.favorites?.includes(book._id) || false
      }));

      // Фильтр по избранному
      if (showFavorites && user) {
        booksWithFavorites = booksWithFavorites.filter(book => book.isFavorite);
      }

      // Фильтр по арендованным книгам (если выбрано в сортировке)
      if (filters.sort === 'rented' && user) {
        booksWithFavorites = booksWithFavorites.filter(book => book.isRented);
      }

      setBooks(booksWithFavorites || []);
    } catch (error) {
      console.error('Ошибка загрузки книг:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (bookId, isFavorite) => {
    setBooks(prev => {
      const updatedBooks = prev.map(book => {
        if (book._id === bookId) {
          return {
            ...book,
            isFavorite
          };
        }
        return book;
      });

      if (showFavorites && !isFavorite) {
        return updatedBooks.filter(book => book._id !== bookId);
      }

      return updatedBooks;
    });
  };

  const toggleFavoritesMode = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowFavorites(!showFavorites);
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const hasFavorites = user?.favorites?.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={toggleFavoritesMode}
              className={`flex items-center gap-1 transition-all duration-300 hover:scale-110 ${
                showFavorites 
                  ? 'text-[#FF6B8A]' 
                  : hasFavorites 
                    ? 'text-[#FF6B8A]' 
                    : 'text-[#8B9AAC] hover:text-white'
              }`}
              title={showFavorites ? 'Показать все книги' : 'Показать только избранное'}
            >
              <Heart className={`w-5 h-5 ${(showFavorites || hasFavorites) ? 'fill-[#FF6B8A]' : ''}`} />
            </button>
          )}
          
          {!user && (
            <button
              onClick={toggleFavoritesMode}
              className="text-[#8B9AAC] hover:text-white transition-colors"
              title="Войдите в аккаунт, чтобы видеть избранное"
            >
              <Heart className="w-5 h-5" />
            </button>
          )}
          
          <span className="text-sm text-[#CBD5E0] bg-[#1A202C] px-4 py-2 rounded-lg border border-[#4A5568]">
            {books.length} книг
          </span>
          
          {showFavorites && (
            <span className="text-xs text-[#FF6B8A] bg-[#FF6B8A]/10 px-3 py-1 rounded-full border border-[#FF6B8A]/30">
              Избранное
            </span>
          )}
          
          {filters.sort === 'rented' && (
            <span className="text-xs text-[#F6AD55] bg-[#F6AD55]/10 px-3 py-1 rounded-full border border-[#F6AD55]/30">
              Мои арендованные
            </span>
          )}
        </div>
      </div>
      
      <Filters 
        filters={filters} 
        setFilters={setFilters} 
        categories={categories}
      />
      
      <div className="min-h-[350px] transition-all duration-200">
        <BookList 
          books={books} 
          loading={loading} 
          onFavoriteToggle={handleFavoriteToggle}
          onAuthRequired={handleAuthRequired}
        />
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default HomePage;