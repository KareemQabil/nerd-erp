import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, MOCK_USERS } from "../../../core/auth/auth.context";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserMinus,
  Check,
  X,
  LogIn,
  Lock,
} from "lucide-react";

export default function LoginScreen() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { selectedUser, selectUser, login } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    if (!selectedUser) return;
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const handleLogin = async () => {
    if (!selectedUser || pin.length !== 4) return;

    setLoading(true);
    setError("");

    const success = await login(selectedUser.id, pin);

    if (success) {
      navigate("/dashboard");
    } else {
      setError(isRTL ? "رمز PIN خاطئ" : "Wrong PIN");
      setPin("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] left-[10%] top-[10%]" />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] right-[10%] bottom-[10%]" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-12 relative">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-[16.4px] flex items-center justify-center bg-primary-container border border-primary">
            <LogIn className="w-10 h-10 text-primary" />
          </div>

          <div className="text-center">
            <h1 className="mb-3 text-[40px] leading-[48px] font-bold text-primary">
              NerdPOS
            </h1>

            <p
              className="font-['Almarai'] text-base leading-6 text-text-primary"
              dir="auto"
            >
              {isRTL
                ? "نظام نقاط البيع الاحترافي"
                : "Professional Point of Sale System"}
            </p>
          </div>

          <div className="w-20 h-1 rounded-full bg-primary" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          {/* User Selection Panel */}
          <div className="rounded-[16.4px] p-8 bg-surface border border-border-subtle">
            {/* Panel Header */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[16.4px] flex items-center justify-center bg-primary-container">
                <Users className="w-8 h-8 text-primary" />
              </div>

              <div className="text-center">
                <h2
                  className="font-['Almarai'] mb-2 text-xl leading-7 font-bold text-text-primary"
                  dir="auto"
                >
                  {isRTL ? "اختر المستخدم" : "Select User"}
                </h2>
                <p
                  className="font-['Almarai'] text-sm leading-5 text-text-secondary"
                  dir="auto"
                >
                  {isRTL
                    ? "اختر حسابك للمتابعة"
                    : "Choose your account to continue"}
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
                    setPin("");
                    setError("");
                  }}
                  className={`w-full rounded-[16.4px] p-5 transition-all border ${
                    selectedUser?.id === user.id
                      ? "bg-primary-container border-primary"
                      : "bg-surface-variant border-border-subtle"
                  }`}
                >
                  <div
                    className="flex items-center gap-4"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface border-2 border-primary">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`absolute bottom-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface ${
                          user.isActive ? "bg-success" : "bg-text-muted"
                        }`}
                        style={{
                          [isRTL ? "left" : "right"]: 0,
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
                    <div
                      className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <h3
                        className="font-['Almarai'] mb-1 text-base leading-6 font-bold text-text-primary"
                        dir="auto"
                      >
                        {user.name}
                      </h3>
                      <p
                        className="font-['Almarai']"
                        style={{
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: "var(--on-surface-variant)",
                        }}
                        dir="auto"
                      >
                        {isRTL
                          ? user.role === "admin"
                            ? "مدير"
                            : user.role === "cashier"
                            ? "كاشير"
                            : "مدير عام"
                          : user.role}
                      </p>
                    </div>

                    {/* Checkmark */}
                    {selectedUser?.id === user.id && (
                      <Check className="w-6 h-6 shrink-0 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PIN Entry Panel */}
          <div className="rounded-[16.4px] p-8 bg-surface border border-border-subtle">
            {selectedUser ? (
              <div className="flex flex-col h-full">
                {/* PIN Header */}
                <div className="flex flex-col items-center gap-6 mb-8">
                  <div
                    className="w-16 h-16 rounded-[16.4px] flex items-center justify-center"
                    style={{ background: "var(--primary-container)" }}
                  >
                    <Lock
                      className="w-8 h-8"
                      style={{ color: "var(--primary)" }}
                    />
                  </div>

                  <div className="text-center">
                    <h2
                      className="font-['Almarai'] mb-2"
                      style={{
                        fontSize: "20px",
                        lineHeight: "28px",
                        color: "var(--on-surface)",
                        fontWeight: "bold",
                      }}
                      dir="auto"
                    >
                      {isRTL ? "أدخل رمز PIN" : "Enter PIN"}
                    </h2>
                    <p
                      className="font-['Almarai']"
                      style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "var(--on-surface-variant)",
                      }}
                      dir="auto"
                    >
                      {isRTL ? "الرمز الافتراضي: 1234" : "Default PIN: 1234"}
                    </p>
                  </div>
                </div>

                {/* PIN Dots */}
                <div className="flex gap-4 justify-center mb-10" dir="ltr">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-16 h-20 rounded-[12px] flex items-center justify-center transition-all border-2 ${
                        i < pin.length
                          ? "border-primary bg-primary-container"
                          : "border-border-subtle bg-surface-variant"
                      }`}
                    >
                      {i < pin.length && (
                        <div className="w-4 h-4 rounded-full bg-primary" />
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
                      className="h-14 rounded-[12px] font-['Inter'] transition-all active:scale-95 bg-surface-variant border border-border-subtle text-text-primary text-xl font-bold hover:bg-primary-container hover:border-primary hover:text-primary"
                    >
                      {num}
                    </button>
                  ))}
                  <div /> {/* Empty space */}
                  <button
                    onClick={() => handleNumberClick("0")}
                    disabled={!selectedUser}
                    className="h-14 rounded-[12px] font-['Inter'] transition-all active:scale-95 bg-surface-variant border border-border-subtle text-text-primary text-xl font-bold hover:bg-primary-container hover:border-primary hover:text-primary"
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
                    className="h-14 rounded-[12px] flex items-center justify-center gap-2 font-['Almarai'] transition-all bg-error/10 border border-error text-error text-sm font-bold"
                    dir="auto"
                  >
                    <X className="w-5 h-5" />
                    <span>{isRTL ? "مسح" : "Clear"}</span>
                  </button>

                  <button
                    onClick={handleLogin}
                    disabled={!selectedUser || pin.length !== 4 || loading}
                    className={`h-14 rounded-[12px] flex items-center justify-center gap-2 font-['Almarai'] transition-all border border-primary text-sm font-bold ${
                      pin.length === 4
                        ? "bg-primary text-on-primary opacity-100"
                        : "bg-primary-container text-primary opacity-50"
                    }`}
                    dir="auto"
                  >
                    <Check className="w-5 h-5" />
                    <span>{isRTL ? "دخول" : "Login"}</span>
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-6 p-4 rounded-[12px] text-center bg-error/10 border border-error">
                    <p
                      className="font-['Almarai'] text-sm leading-5 text-error"
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
                <div className="w-24 h-24 rounded-[16.4px] flex items-center justify-center bg-surface-variant border border-border-subtle">
                  <Users className="w-12 h-12 text-text-muted" />
                </div>

                <div className="text-center">
                  <h3
                    className="font-['Almarai'] mb-2"
                    style={{
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "var(--on-surface-variant)",
                      fontWeight: "bold",
                    }}
                    dir="auto"
                  >
                    {isRTL ? "لم يتم اختيار مستخدم" : "No User Selected"}
                  </h3>
                  <p
                    className="font-['Almarai']"
                    style={{
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "var(--on-surface-variant)",
                    }}
                    dir="auto"
                  >
                    {isRTL
                      ? "الرجاء اختيار مستخدم من القائمة"
                      : "Please select a user from the list"}
                  </p>
                </div>

                <div className="w-full p-4 rounded-[12px] bg-primary-container border border-primary">
                  <p
                    className="font-['Almarai'] text-center text-sm leading-5 text-primary"
                    dir="auto"
                  >
                    {isRTL
                      ? "👈 اختر مستخدماً للمتابعة"
                      : "Select a user to continue 👉"}
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
