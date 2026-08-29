import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as any)?.from?.pathname || (user?.role === 'ADMIN' ? '/admin/dashboard' : '/customer/profile');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : from, { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, user, navigate, from, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const loggedUser = result.payload.user;
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/customer/profile', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-2xl border border-luxury-500/20 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl tracking-[0.25em] font-bold gold-gradient-text uppercase">
              GENTSTYLE
            </span>
          </Link>
          <h2 className="text-xl font-serif font-bold text-white">Gentleman Sign In</h2>
          <p className="text-xs text-gray-400">Access your bespoke wardrobe, tracking, and rewards.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg flex items-center gap-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="gentleman@gentstyle.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

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
            <div className="flex justify-end mt-1.5">
              <Link
                to="/forgot-password"
                className="text-xs text-luxury-400 hover:text-luxury-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-gray-400 border-t border-gentborder pt-4">
          <p>
            Do not possess a GentStyle account yet?{' '}
            <Link to="/register" className="text-luxury-400 hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
