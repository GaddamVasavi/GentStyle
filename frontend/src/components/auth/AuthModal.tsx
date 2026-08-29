import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { closeAuthModal, openAuthModal } from '../../store/slices/uiSlice';
import { loginUser, registerUser, clearAuthError } from '../../store/slices/authSlice';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, Lock, User as UserIcon, Phone, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';

export const AuthModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthModalOpen, authModalMode } = useSelector((state: RootState) => state.ui);
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(closeAuthModal());
    dispatch(clearAuthError());
    setForgotMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        handleClose();
      }
    } else if (authModalMode === 'register') {
      const result = await dispatch(registerUser({ email, password, firstName, lastName, phone }));
      if (registerUser.fulfilled.match(result)) {
        handleClose();
      }
    } else if (authModalMode === 'forgot-password') {
      try {
        await authService.forgotPassword(email);
        setForgotMsg('If an account exists with that email, a password reset link has been dispatched.');
      } catch (err: any) {
        setForgotMsg(err.response?.data?.message || 'Error requesting password reset');
      }
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      title={
        authModalMode === 'login'
          ? 'Gentleman Signature Sign In'
          : authModalMode === 'register'
          ? 'Join The Sartorial Guild'
          : 'Recover Your Account'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg flex items-center gap-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {forgotMsg && (
          <div className="p-3 bg-luxury-950/60 border border-luxury-600/60 rounded-lg text-luxury-200 text-xs">
            {forgotMsg}
          </div>
        )}

        {authModalMode === 'register' && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="Alexander"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              leftIcon={<UserIcon className="w-4 h-4" />}
            />
            <Input
              label="Last Name"
              placeholder="Sterling"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="gentleman@gentstyle.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={<Mail className="w-4 h-4" />}
        />

        {authModalMode === 'register' && (
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        )}

        {authModalMode !== 'forgot-password' && (
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />
            {authModalMode === 'login' && (
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => dispatch(openAuthModal('forgot-password'))}
                  className="text-xs text-luxury-400 hover:text-luxury-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          {authModalMode === 'login'
            ? 'Sign In'
            : authModalMode === 'register'
            ? 'Create Gentleman Account'
            : 'Send Reset Link'}
        </Button>

        <div className="text-center pt-2 text-xs text-gray-400 border-t border-gentborder">
          {authModalMode === 'login' ? (
            <p>
              New to GentStyle?{' '}
              <button
                type="button"
                onClick={() => dispatch(openAuthModal('register'))}
                className="text-luxury-400 hover:underline font-semibold"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => dispatch(openAuthModal('login'))}
                className="text-luxury-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};
