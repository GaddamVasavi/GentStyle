import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, User as UserIcon, Phone, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/customer/profile', { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ email, password, firstName, lastName, phone }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/customer/profile', { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-2xl border border-luxury-500/20 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl tracking-[0.25em] font-bold gold-gradient-text uppercase">
              GENTSTYLE
            </span>
          </Link>
          <h2 className="text-xl font-serif font-bold text-white">Join The Sartorial Guild</h2>
          <p className="text-xs text-gray-400">Create your account to experience bespoke menswear.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg flex items-center gap-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="James"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              leftIcon={<UserIcon className="w-4 h-4" />}
            />
            <Input
              label="Last Name"
              placeholder="Bond"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="james.bond@gentstyle.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+1 (555) 007-0007"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters with numbers & uppercase"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Create Gentleman Account
          </Button>
        </form>

        <div className="text-center text-xs text-gray-400 border-t border-gentborder pt-4">
          <p>
            Already an esteemed client?{' '}
            <Link to="/login" className="text-luxury-400 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
