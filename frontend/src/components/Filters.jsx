import React from 'react';
import { Bookmark, User, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Filters = ({ filters, setFilters, categories }) => {
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#3D4A5C]/50 backdrop-blur-sm rounded-[32px] p-6 mb-8 border border-[#4A5A6A]/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Категория */}
        <div>
          <label className="block text-sm font-semibold text-[#CBD5E0] mb-2 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#F6AD55]" />
            Категория
          </label>
          <div className="relative">
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#2D3748] text-white border border-[#4A5A6A] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] focus:border-transparent transition appearance-none pr-10"
            >
              <option value="">Все категории</option>
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
        </div>

        {/* Автор */}
        <div>
          <label className="block text-sm font-semibold text-[#CBD5E0] mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[#F6AD55]" />
            Автор
          </label>
          <input
            type="text"
            name="author"
            value={filters.author}
            onChange={handleChange}
            placeholder="Поиск по автору..."
            className="w-full px-4 py-2.5 bg-[#2D3748] text-white border border-[#4A5A6A] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] focus:border-transparent transition placeholder:text-[#8B9AAC]"
          />
        </div>

        {/* Сортировка */}
        <div>
          <label className="block text-sm font-semibold text-[#CBD5E0] mb-2 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#F6AD55]" />
            Сортировка
          </label>
          <div className="relative">
            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#2D3748] text-white border border-[#4A5A6A] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] focus:border-transparent transition appearance-none pr-10"
            >
              <option value="">По умолчанию</option>
              <option value="year">По году (новые)</option>
              <option value="author">По автору (А-Я)</option>
              <option value="category">По категории</option>
              {user && (
                <option value="rented">Мои арендованные</option>
              )}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B9AAC]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;