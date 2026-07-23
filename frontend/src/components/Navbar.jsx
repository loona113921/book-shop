import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import logoSticker from '../assets/logo-sticker.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-[#2D3748] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-4 text-4xl font-bold hover:text-[#F6AD55] transition-colors">
              <img 
                src={logoSticker} 
                alt="Книжный мир" 
                className="w-14 h-14 object-contain"
              />
              <span className="hidden sm:inline">Книжный Мир</span>
              <span className="sm:hidden">КМ</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-[#CBD5E0] hidden md:inline">
                    {user.email}
                  </span>
                  
                  {/* Кнопка Админ-панель с иконкой Shield */}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="text-[#F6AD55] hover:text-[#ED8936] transition-colors px-3 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 border border-[#F6AD55]/30"
                    >
                      <Shield className="w-4 h-4" />
                      Админ-панель
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="text-[#CBD5E0] hover:text-white transition-colors px-3 py-2 rounded-2xl text-sm font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Выйти</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-float bg-gradient-to-r from-[#F6AD55] to-[#ED8936] hover:from-[#FBBF24] hover:to-[#F6AD55] text-[#1A202C] px-5 py-2 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#F6AD55]/30 hover:shadow-[#FBBF24]/50"
                >
                  <LogIn className="w-4 h-4" />
                  Войти
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar;