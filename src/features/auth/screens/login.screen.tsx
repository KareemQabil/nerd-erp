import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth, MOCK_USERS } from '../../../core/auth/auth.context';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserMinus, Check, X, LogIn, Lock } from 'lucide-react';

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { selectedUser, selectUser, login } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    if (!selectedUser) return;
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleLogin = async () => {
    if (!selectedUser || pin.length !== 4) return;
    
    setLoading(true);
    setError('');
    
    const success = await login(selectedUser.id, pin);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError(isRTL ? 'رمز PIN خاطئ' : 'Wrong PIN');
      setPin('');
    }
    
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #023047 0%, #012030 50%, #001219 100%)' }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
             style={{ 
               background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)',
               left: '10%',
               top: '10%'
             }} 
        />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
             style={{ 
               background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)',
               right: '10%',
               bottom: '10%'
             }} 
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-12 relative">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div 
            className="w-20 h-20 rounded-[16.4px] flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0.05) 100%)',
              border: '0.8px solid rgba(34,211,238,0.3)'
            }}
          >
            <LogIn className="w-10 h-10" style={{ color: '#22d3ee' }} />
          </div>
          
          <div className="text-center">
            <h1 
              className="mb-3"
              style={{ 
                fontSize: '40px',
                lineHeight: '48px',
                fontWeight: 'bold',
                background: 'linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              NerdPOS
            </h1>
            
            <p 
              className="font-['Almarai']"
              style={{ 
                fontSize: '16px',
                lineHeight: '24px',
                color: '#c2c7ce'
              }}
              dir="auto"
            >
              {isRTL ? 'نظام نقاط البيع الاحترافي' : 'Professional Point of Sale System'}
            </p>
          </div>
          
          <div 
            className="w-20 h-1 rounded-full"
            style={{ background: 'linear-gradient(90deg, #22d3ee 0%, #0891b2 100%)' }}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          
          {/* User Selection Panel */}
          <div
            className="rounded-[16.4px] p-8"
            style={{
              background: 'linear-gradient(180deg, #1a1c1e 0%, #1d2222 50%, #42474e 100%)',
              border: '0.8px solid #42474e',
            }}
          >
            {/* Panel Header */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div 
                className="w-16 h-16 rounded-[16.4px] flex items-center justify-center"
                style={{ 
                  background: 'rgba(34, 211, 238, 0.1)',
                }}
              >
                <Users className="w-8 h-8" style={{ color: '#22d3ee' }} />
              </div>
              
              <div className="text-center">
                <h2 
                  className="font-['Almarai'] mb-2"
                  style={{ 
                    fontSize: '20px',
                    lineHeight: '28px',
                    color: '#e2e2e6',
                    fontWeight: 'bold'
                  }}
                  dir="auto"
                >
                  {isRTL ? 'اختر المستخدم' : 'Select User'}
                </h2>
                <p 
                  className="font-['Almarai']"
                  style={{ 
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#c2c7ce'
                  }}
                  dir="auto"
                >
                  {isRTL ? 'اختر حسابك للمتابعة' : 'Choose your account to continue'}
                </p>
              </div>
            </div>

            {/* User List */}
            <div className="space-y-4">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    selectUser(user);
                    setPin('');
                    setError('');
                  }}
                  className="w-full rounded-[16.4px] p-5 transition-all"
                  style={{
                    background: selectedUser?.id === user.id 
                      ? 'rgba(34, 211, 238, 0.1)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: selectedUser?.id === user.id 
                      ? '0.8px solid #22d3ee' 
                      : '0.8px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex items-center gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-16 h-16 rounded-full overflow-hidden"
                        style={{ 
                          background: 'linear-gradient(135deg, #1a1c1e 0%, #42474e 100%)',
                          border: '2px solid rgba(34, 211, 238, 0.3)'
                        }}
                      >
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                               style={{ color: '#22d3ee', fontSize: '24px', fontWeight: 'bold' }}
                          >
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div 
                        className="absolute bottom-0 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ 
                          [isRTL ? 'left' : 'right']: 0,
                          backgroundColor: user.isActive ? '#10b981' : '#7a7f85',
                          border: '2px solid #1a1c1e'
                        }}
                      >
                        {user.isActive ? (
                          <UserCheck className="w-3 h-3 text-white" />
                        ) : (
                          <UserMinus className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h3 
                        className="font-['Almarai'] mb-1"
                        style={{ 
                          fontSize: '16px',
                          lineHeight: '24px',
                          color: '#e2e2e6',
                          fontWeight: 'bold'
                        }}
                        dir="auto"
                      >
                        {user.name}
                      </h3>
                      <p 
                        className="font-['Almarai']"
                        style={{ 
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#c2c7ce'
                        }}
                        dir="auto"
                      >
                        {isRTL ? 
                          (user.role === 'admin' ? 'مدير' : user.role === 'cashier' ? 'كاشير' : 'مدير عام') 
                          : user.role}
                      </p>
                    </div>
                    
                    {/* Checkmark */}
                    {selectedUser?.id === user.id && (
                      <Check className="w-6 h-6 flex-shrink-0" style={{ color: '#22d3ee' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PIN Entry Panel */}
          <div
            className="rounded-[16.4px] p-8"
            style={{
              background: 'linear-gradient(180deg, #1a1c1e 0%, #1d2222 50%, #42474e 100%)',
              border: '0.8px solid #42474e',
            }}
          >
            {selectedUser ? (
              <div className="flex flex-col h-full">
                {/* PIN Header */}
                <div className="flex flex-col items-center gap-6 mb-8">
                  <div 
                    className="w-16 h-16 rounded-[16.4px] flex items-center justify-center"
                    style={{ background: 'rgba(34, 211, 238, 0.1)' }}
                  >
                    <Lock className="w-8 h-8" style={{ color: '#22d3ee' }} />
                  </div>
                  
                  <div className="text-center">
                    <h2 
                      className="font-['Almarai'] mb-2"
                      style={{ 
                        fontSize: '20px',
                        lineHeight: '28px',
                        color: '#e2e2e6',
                        fontWeight: 'bold'
                      }}
                      dir="auto"
                    >
                      {isRTL ? 'أدخل رمز PIN' : 'Enter PIN'}
                    </h2>
                    <p 
                      className="font-['Almarai']"
                      style={{ 
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#c2c7ce'
                      }}
                      dir="auto"
                    >
                      {isRTL ? 'الرمز الافتراضي: 1234' : 'Default PIN: 1234'}
                    </p>
                  </div>
                </div>
                
                {/* PIN Dots */}
                <div className="flex gap-4 justify-center mb-10" dir="ltr">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-16 h-20 rounded-[12px] flex items-center justify-center transition-all"
                      style={{
                        border: i < pin.length 
                          ? '2px solid #22d3ee' 
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        background: i < pin.length 
                          ? 'rgba(34, 211, 238, 0.1)' 
                          : 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      {i < pin.length && (
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: '#22d3ee' }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Number Pad */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num.toString())}
                      disabled={!selectedUser}
                      className="h-14 rounded-[12px] font-['Inter'] transition-all active:scale-95"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '0.8px solid rgba(255, 255, 255, 0.1)',
                        color: '#e2e2e6',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(34, 211, 238, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      {num}
                    </button>
                  ))}
                  <div /> {/* Empty space */}
                  <button
                    onClick={() => handleNumberClick('0')}
                    disabled={!selectedUser}
                    className="h-14 rounded-[12px] font-['Inter'] transition-all active:scale-95"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '0.8px solid rgba(255, 255, 255, 0.1)',
                      color: '#e2e2e6',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(34, 211, 238, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    0
                  </button>
                  <div /> {/* Empty space */}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleClear}
                    disabled={!selectedUser}
                    className="h-14 rounded-[12px] flex items-center justify-center gap-2 font-['Almarai'] transition-all"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '0.8px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                    dir="auto"
                  >
                    <X className="w-5 h-5" />
                    <span>{isRTL ? 'مسح' : 'Clear'}</span>
                  </button>
                  
                  <button
                    onClick={handleLogin}
                    disabled={!selectedUser || pin.length !== 4 || loading}
                    className="h-14 rounded-[12px] flex items-center justify-center gap-2 font-['Almarai'] transition-all"
                    style={{
                      background: pin.length === 4 
                        ? 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)' 
                        : 'rgba(34, 211, 238, 0.2)',
                      border: '0.8px solid rgba(34, 211, 238, 0.3)',
                      color: pin.length === 4 ? '#001219' : '#22d3ee',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      opacity: pin.length === 4 ? 1 : 0.5,
                    }}
                    dir="auto"
                  >
                    <Check className="w-5 h-5" />
                    <span>{isRTL ? 'دخول' : 'Login'}</span>
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div 
                    className="mt-6 p-4 rounded-[12px] text-center"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '0.8px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <p 
                      className="font-['Almarai']"
                      style={{ 
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#ef4444'
                      }}
                      dir="auto"
                    >
                      {error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // No User Selected State
              <div className="flex flex-col items-center justify-center h-full gap-8">
                <div 
                  className="w-24 h-24 rounded-[16.4px] flex items-center justify-center"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '0.8px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Users className="w-12 h-12" style={{ color: '#7a7f85' }} />
                </div>
                
                <div className="text-center">
                  <h3 
                    className="font-['Almarai'] mb-2"
                    style={{ 
                      fontSize: '20px',
                      lineHeight: '28px',
                      color: '#c2c7ce',
                      fontWeight: 'bold'
                    }}
                    dir="auto"
                  >
                    {isRTL ? 'لم يتم اختيار مستخدم' : 'No User Selected'}
                  </h3>
                  <p 
                    className="font-['Almarai']"
                    style={{ 
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#7a7f85'
                    }}
                    dir="auto"
                  >
                    {isRTL ? 'الرجاء اختيار مستخدم من القائمة' : 'Please select a user from the list'}
                  </p>
                </div>
                
                <div 
                  className="w-full p-4 rounded-[12px]"
                  style={{
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '0.8px solid rgba(34, 211, 238, 0.3)',
                  }}
                >
                  <p 
                    className="font-['Almarai'] text-center"
                    style={{ 
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#22d3ee'
                    }}
                    dir="auto"
                  >
                    {isRTL ? '👈 اختر مستخدماً للمتابعة' : 'Select a user to continue 👉'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
