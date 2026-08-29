import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setUser } from '../../store/slices/authSlice';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Phone, Calendar, Lock, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Login History State
  const [loginHistory, setLoginHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await userService.getProfile();
        if (profileRes.data) {
          setFirstName(profileRes.data.firstName || '');
          setLastName(profileRes.data.lastName || '');
          setPhone(profileRes.data.phone || '');
          if (profileRes.data.dateOfBirth) {
            setDateOfBirth(profileRes.data.dateOfBirth.split('T')[0]);
          }
          dispatch(setUser(profileRes.data));
        }

        const historyRes = await userService.getLoginHistory();
        if (historyRes.data) {
          setLoginHistory(historyRes.data);
        }
      } catch (err) {
        console.error('Failed to load profile details', err);
      }
    }
    loadData();
  }, [dispatch]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg(null);
    try {
      const res = await userService.updateProfile({
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
      });
      dispatch(setUser(res.data));
      setProfileMsg({ type: 'success', text: 'Gentleman credentials updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setIsChangingPass(true);
    setPassMsg(null);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setPassMsg({ type: 'success', text: 'Account password updated securely.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-white">My Profile & Gentleman Credentials</h2>
        <p className="text-xs text-gray-400 mt-1">Manage your personal information, security protocols, and session history.</p>
      </div>

      {/* Profile Form */}
      <section className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-luxury-300 font-semibold flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </h3>

        {profileMsg && (
          <div
            className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
              profileMsg.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-600/50 text-emerald-300'
                : 'bg-red-950/60 border border-red-600/50 text-red-300'
            }`}
          >
            {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Contact concierge to modify registered email address"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />

          <Button type="submit" variant="gold" size="md" isLoading={isUpdatingProfile}>
            Save Personal Details
          </Button>
        </form>
      </section>

      <hr className="border-gentborder" />

      {/* Security & Password */}
      <section className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-luxury-300 font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Security & Authentication</span>
        </h3>

        {passMsg && (
          <div
            className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
              passMsg.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-600/50 text-emerald-300'
                : 'bg-red-950/60 border border-red-600/50 text-red-300'
            }`}
          >
            {passMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{passMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
            />
          </div>

          <Button type="submit" variant="secondary" size="md" isLoading={isChangingPass}>
            Update Password
          </Button>
        </form>
      </section>

      <hr className="border-gentborder" />

      {/* Login History */}
      <section className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-luxury-300 font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Recent Authentication Events</span>
        </h3>

        {loginHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gentborder rounded-lg overflow-hidden">
              <thead className="bg-[#12151b] text-gray-300 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 border-b border-gentborder">Timestamp</th>
                  <th className="p-3 border-b border-gentborder">IP Address</th>
                  <th className="p-3 border-b border-gentborder">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gentborder text-gray-300">
                {loginHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="p-3">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-mono text-gray-400">{item.ipAddress || '127.0.0.1'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 border border-emerald-800 text-emerald-300">
                        SUCCESSFUL
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-500">No login history recorded yet.</p>
        )}
      </section>
    </div>
  );
};
