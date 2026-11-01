import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { loginRole, registerCitizen, verifyOtp, forgotPassword } from '../api';
import {
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserLoggedIn: (user: UserProfile) => void;
  currentUser?: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserLoggedIn,
  currentUser
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const [loginRoleSelected, setLoginRoleSelected] = useState<UserRole>('citizen');
  const [usernameOrPhone, setUsernameOrPhone] = useState('citizen');
  const [password, setPassword] = useState('password123');

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('Pass@1234');
  const [regState, setRegState] = useState('Punjab');
  const [regDistrict, setRegDistrict] = useState('Ludhiana');
  const [regLocality, setRegLocality] = useState('Bhaini Sahib');

  // OTP state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

  // Status/Error state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickRoleSelect = async (role: UserRole) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await loginRole(role);
      onUserLoggedIn(res.user);
      setSuccessMessage(`Signed in successfully as ${res.user.full_name} (${res.user.role.toUpperCase()})`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await loginRole(loginRoleSelected, usernameOrPhone, password);
      onUserLoggedIn(res.user);
      setSuccessMessage(`Signed in as ${res.user.full_name}`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await registerCitizen({
        full_name: regFullName,
        phone: regPhone,
        email: regEmail,
        password: regPassword,
        state: regState,
        district: regDistrict,
        locality: regLocality
      });

      setOtpPhone(regPhone);
      setSimulatedOtp('492018'); // Demo OTP provided to ease instant login verification
      setAuthMode('otp');
      setSuccessMessage('Account created! A 6-digit OTP code has been dispatched to your mobile.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await verifyOtp(otpPhone, otpValue);
      onUserLoggedIn(res.user);
      setSuccessMessage('Phone verified & identity authenticated successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await forgotPassword(otpPhone || '9814012345');
      setSimulatedOtp('581903');
      setSuccessMessage(res.message || 'Password reset code generated.');
      setAuthMode('otp');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending reset code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[92dvh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 mx-auto flex items-center justify-center text-emerald-700 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            JanDrishti Civic Identity
          </h2>
          <p className="text-xs text-slate-500">
            Citizen, Panchayat Official & District Administration Gateway
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {authMode !== 'otp' && (
          <div className="flex border-b border-slate-200 mb-6 text-sm">
            <button
              onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
                authMode === 'login'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
                authMode === 'register'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Citizen Sign Up
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MODE: SIGN IN */}
        {authMode === 'login' && (
          <div className="space-y-4">
            {/* Quick Demo Switcher */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick 1-Click Role Login (Auditors & Judges)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickRoleSelect('citizen')}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-colors"
                >
                  <span className="font-bold block text-emerald-800">Citizen</span>
                  <span className="text-[10px] text-slate-500">Resident / Activist</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoleSelect('official')}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 hover:border-amber-500 hover:bg-amber-50/50 text-left transition-colors"
                >
                  <span className="font-bold block text-amber-800">Gram Pradhan</span>
                  <span className="text-[10px] text-slate-500">Panchayat Official</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoleSelect('admin')}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-colors"
                >
                  <span className="font-bold block text-blue-800">BDO / Admin</span>
                  <span className="text-[10px] text-slate-500">Block Development Officer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoleSelect('superadmin')}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-colors"
                >
                  <span className="font-bold block text-purple-800">SuperAdmin</span>
                  <span className="text-[10px] text-slate-500">State Oversight Auditor</span>
                </button>
              </div>
            </div>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">Or credentials login</span>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Username / Phone</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={usernameOrPhone}
                    onChange={e => setUsernameOrPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* MODE: CITIZEN REGISTRATION */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Gurpreet Kaur"
                value={regFullName}
                onChange={e => setRegFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Mobile (for OTP)</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="citizen@village.in"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-medium text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={regState}
                  onChange={e => setRegState(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  required
                  value={regDistrict}
                  onChange={e => setRegDistrict(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Gram Panchayat</label>
                <input
                  type="text"
                  required
                  value={regLocality}
                  onChange={e => setRegLocality(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Account Password</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Register Citizen Account & Verify'}
            </button>
          </form>
        )}

        {/* MODE: OTP VERIFICATION */}
        {authMode === 'otp' && (
          <form onSubmit={handleOtpVerify} className="space-y-4 text-xs">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-900">
              <span className="font-bold block">Mobile Verification</span>
              <p className="text-[11px] mt-0.5">
                Enter the 6-digit code received on mobile number: <span className="font-mono font-bold">{otpPhone || '9876543210'}</span>
              </p>
              {simulatedOtp && (
                <div className="mt-2 text-[11px] bg-white p-2 rounded border border-emerald-300">
                  <span className="text-slate-500">Development Demo SMS: </span>
                  <span className="font-mono font-bold text-emerald-800 tracking-wider text-sm">{simulatedOtp}</span>
                </div>
              )}
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="492018"
                value={otpValue}
                onChange={e => setOtpValue(e.target.value)}
                className="w-full px-3 py-2.5 text-center text-lg font-mono tracking-widest bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otpValue.length < 4}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
            >
              {isLoading ? 'Verifying OTP...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full py-1 text-slate-500 hover:text-slate-700 text-xs"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* MODE: FORGOT PASSWORD */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Registered Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9814012345"
                value={otpPhone}
                onChange={e => setOtpPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs"
            >
              {isLoading ? 'Sending Code...' : 'Send Password Reset Code'}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full py-1 text-slate-500 hover:text-slate-700 text-xs"
            >
              Back to Sign In
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
