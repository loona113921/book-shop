import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite } from '../api/books';

const BookCard = ({ book, onFavoriteToggle, onAuthRequired }) => {
  const { user, token, updateUserFavorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    setLoading(true);
    try {
      const result = await toggleFavorite(book._id, token);
      setIsFavorite(result.isFavorite);
      
      // Обновляем список избранного в контексте
      if (updateUserFavorites) {
        updateUserFavorites(result.favorites);
      }
      
      if (onFavoriteToggle) {
        onFavoriteToggle(book._id, result.isFavorite);
      }
    } catch (error) {
      console.error('Ошибка при изменении избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasCover = book.coverImage && book.coverImage !== '' && !book.coverImage.includes('placeholder');

  return (
    <div className="bg-[#3D4A5C] rounded-[32px] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group book-card">
      <div className="relative overflow-hidden">
        {hasCover ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-[#2D3748] to-[#3D4A5C]"></div>
        )}
        
        <button
          onClick={handleFavoriteClick}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 transition-colors ${
            loading ? 'opacity-50' : ''
          }`}
        >
          <Heart 
            className={`w-6 h-6 transition-colors ${
              isFavorite 
                ? 'text-[#FF6B8A] fill-[#FF6B8A]' 
                : 'text-[#CBD5E0] drop-shadow-lg'
            }`}
          />
        </button>
        
        {book.isRented && (
          <div className="absolute bottom-3 left-3 right-3 bg-[#1A202C]/80 backdrop-blur-sm text-[#F6AD55] text-xs px-3 py-1.5 rounded-2xl text-center flex items-center justify-center gap-2">
            <Calendar className="w-3 h-3" />
            до {new Date(book.rentEndDate).toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate flex-1 mb-1" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-[#B0C0D0] mb-2">{book.author}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-[#2D3748] text-[#B0C0D0] px-2 py-0.5 rounded-full truncate max-w-[100px]">
            {book.category}
          </span>
          <span className="text-xs text-[#4A5A6A]">•</span>
          <span className="text-xs text-[#8B9AAC]">{book.year}</span>
        </div>
        <p className="text-sm text-[#B0C0D0] mb-3 line-clamp-2">{book.description}</p>
        <Link
          to={`/book/${book._id}`}
          className="btn-float block w-full text-center bg-gradient-to-r from-[#F6AD55] to-[#ED8936] hover:from-[#FBBF24] hover:to-[#F6AD55] text-[#1A202C] font-semibold px-4 py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-[#F6AD55]/30 hover:shadow-[#FBBF24]/50"
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Читать
        </Link>
      </div>
    </div>
  );
};

export default BookCard;