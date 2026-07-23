import React from 'react';
import BookCard from './BookCard';
import emptySticker from '../assets/empty-sticker.png';

const BookList = ({ books, loading, onFavoriteToggle, onAuthRequired }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6AD55]"></div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-[#FCD34D] rounded-[32px] shadow-2xl shadow-[#FCD34D]/40 px-8 py-6 flex items-center justify-center overflow-visible relative border-2 border-[#FBBF24]/50 min-h-[100px]">
        <div className="flex items-center gap-2 relative">
          <div className="absolute -top-14 -left-18 translate-y-0">
            <img 
              src={emptySticker} 
              alt="Книги не найдены" 
              className="w-33 h-33 object-contain drop-shadow-lg"
            />
          </div>
          <p className="text-xl font-bold text-[#2D3748] ml-20">Книги не найдены</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[300px]">
      {books.map(book => (
        <BookCard 
          key={book._id} 
          book={book} 
          onFavoriteToggle={onFavoriteToggle}
          onAuthRequired={onAuthRequired}
        />
      ))}
    </div>
  );
};

export default BookList;