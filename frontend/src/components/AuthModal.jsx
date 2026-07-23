import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Проверка на совпадение паролей ТОЛЬКО при регистрации
    if (!isLogin && !showAdminLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    let result;

    if (showAdminLogin) {
      try {
        const response = await fetch('http://localhost:500/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password })
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          window.location.reload();
          onClose();
          setLoading(false);
          return;
        } else {
          setError('Неверный логин или пароль');
          setLoading(false);
          return;
        }
      } catch (err) {
        setError('Ошибка подключения к серверу');
        setLoading(false);
        return;
      }
    }

    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(email, password);
    }

    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  const switchToAdminLogin = () => {
    setShowAdminLogin(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchToUserLogin = () => {
    setShowAdminLogin(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setConfirmPassword('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#2D3748] rounded-[32px] p-8 max-w-md w-full border border-[#4A5568] shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-2">
          {showAdminLogin ? 'Вход для администратора' : (isLogin ? 'Вход' : 'Регистрация')}
        </h2>
        
        {showAdminLogin && (
          <p className="text-[#CBD5E0] text-sm mb-6">Введите логин и пароль администратора</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type={showAdminLogin ? 'text' : 'email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={showAdminLogin ? 'Логин' : 'Email'}
            className="w-full px-4 py-3 bg-[#1A202C] text-white border border-[#4A5568] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
            required
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full px-4 py-3 bg-[#1A202C] text-white border border-[#4A5568] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
            required
          />
          
          {/* Поле "Повторите пароль" ТОЛЬКО для регистрации */}
          {!isLogin && !showAdminLogin && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              className="w-full px-4 py-3 bg-[#1A202C] text-white border border-[#4A5568] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F6AD55] placeholder:text-[#8B9AAC]"
              required
            />
          )}
          
          {error && (
            <p className="text-[#FF6B8A] text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-float bg-gradient-to-r from-[#F6AD55] to-[#ED8936] hover:from-[#FBBF24] hover:to-[#F6AD55] text-[#1A202C] py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-[#F6AD55]/30 hover:shadow-[#FBBF24]/50 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : (showAdminLogin ? 'Войти как администратор' : (isLogin ? 'Войти' : 'Зарегистрироваться'))}
          </button>
        </form>
        
        {!showAdminLogin && (
          <button
            onClick={switchToAdminLogin}
            className="w-full mt-4 text-[#8B9AAC] hover:text-[#CBD5E0] text-xs transition-colors underline underline-offset-2"
          >
            Вход для администратора
          </button>
        )}
        
        {showAdminLogin && (
          <button
            onClick={switchToUserLogin}
            className="w-full mt-4 text-[#8B9AAC] hover:text-[#CBD5E0] text-xs transition-colors underline underline-offset-2"
          >
            ← Вернуться к входу для пользователей
          </button>
        )}
        
        {!showAdminLogin && (
          <button
            onClick={switchMode}
            className="w-full mt-2 text-[#CBD5E0] hover:text-[#F6AD55] text-sm transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-2 text-[#8B9AAC] hover:text-white text-sm transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default AuthModal;