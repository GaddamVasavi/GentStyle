import React, { useState, useEffect } from 'react';
import { addressService, AddressDto } from '../../services/address.service';
import { Address } from '../../types/auth.types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress1, setStreetAddress1] = useState('');
  const [streetAddress2, setStreetAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [isDefaultShipping, setIsDefaultShipping] = useState(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await addressService.getAddresses();
      if (res.data) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openCreateModal = () => {
    setEditingAddress(null);
    setFullName('');
    setPhone('');
    setStreetAddress1('');
    setStreetAddress2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('United States');
    setIsDefaultShipping(addresses.length === 0);
    setIsDefaultBilling(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setStreetAddress1(addr.streetAddress1);
    setStreetAddress2(addr.streetAddress2 || '');
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
    setIsDefaultShipping(addr.isDefaultShipping);
    setIsDefaultBilling(addr.isDefaultBilling);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload: AddressDto = {
      fullName,
      phone,
      streetAddress1,
      streetAddress2: streetAddress2 || undefined,
      city,
      state,
      postalCode,
      country,
      isDefaultShipping,
      isDefaultBilling,
    };

    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, payload);
      } else {
        await addressService.createAddress(payload);
      }
      setIsModalOpen(false);
      await loadAddresses();
    } catch (err) {
      console.error('Failed to save address', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you certain you wish to delete this address?')) {
      try {
        await addressService.deleteAddress(id);
        await loadAddresses();
      } catch (err) {
        console.error('Failed to delete address', err);
      }
    }
  };

  const handleSetDefaultShipping = async (id: string) => {
    try {
      await addressService.setDefaultShipping(id);
      await loadAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefaultBilling = async (id: string) => {
    try {
      await addressService.setDefaultBilling(id);
      await loadAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white">Address Book</h2>
          <p className="text-xs text-gray-400 mt-1">Manage global delivery destinations and billing addresses for swift checkout.</p>
        </div>
        <Button variant="gold" size="sm" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add Delivery Address
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading delivery addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-xl border border-gentborder space-y-4">
          <MapPin className="w-10 h-10 text-luxury-400 mx-auto opacity-70" />
          <h3 className="font-serif text-lg text-white">No Addresses Registered</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Provide your primary delivery location to streamline your bespoke acquisitions.
          </p>
          <Button variant="outline" size="sm" onClick={openCreateModal} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Register First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="glass-panel p-6 rounded-xl border border-gentborder hover:border-luxury-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{addr.fullName}</span>
                  <div className="flex gap-2">
                    {addr.isDefaultShipping && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-luxury-900 border border-luxury-600 text-luxury-200">
                        Default Shipping
                      </span>
                    )}
                    {addr.isDefaultBilling && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-800 border border-gray-600 text-gray-300">
                        Default Billing
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-300 leading-relaxed space-y-1">
                  <p>{addr.streetAddress1}</p>
                  {addr.streetAddress2 && <p>{addr.streetAddress2}</p>}
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="font-medium text-gray-400">{addr.country}</p>
                  <p className="text-gray-400 pt-1">Phone: {addr.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gentborder/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {!addr.isDefaultShipping && (
                    <button
                      onClick={() => handleSetDefaultShipping(addr.id)}
                      className="text-xs text-luxury-400 hover:text-luxury-300 font-medium"
                    >
                      Make Default Shipping
                    </button>
                  )}
                  {!addr.isDefaultBilling && !addr.isDefaultShipping && <span>•</span>}
                  {!addr.isDefaultBilling && (
                    <button
                      onClick={() => handleSetDefaultBilling(addr.id)}
                      className="text-xs text-gray-400 hover:text-gray-200"
                    >
                      Make Default Billing
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? 'Update Destination' : 'Add New Destination'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Recipient Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Lord Sterling"
              required
            />
            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
              required
            />
          </div>

          <Input
            label="Street Address Line 1"
            value={streetAddress1}
            onChange={(e) => setStreetAddress1(e.target.value)}
            placeholder="100 Mayfair Luxury Boulevard"
            required
          />

          <Input
            label="Street Address Line 2 (Suite / Penthouse / Unit)"
            value={streetAddress2}
            onChange={(e) => setStreetAddress2(e.target.value)}
            placeholder="Penthouse 7B"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              required
            />
            <Input
              label="State / Province"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="NY"
              required
            />
            <Input
              label="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="10001"
              required
            />
          </div>

          <Input
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States"
            required
          />

          <div className="flex flex-col gap-2 pt-2 text-xs text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefaultShipping}
                onChange={(e) => setIsDefaultShipping(e.target.checked)}
                className="rounded bg-gentcard border-gentborder text-luxury-600 focus:ring-luxury-500"
              />
              <span>Set as default shipping address</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefaultBilling}
                onChange={(e) => setIsDefaultBilling(e.target.checked)}
                className="rounded bg-gentcard border-gentborder text-luxury-600 focus:ring-luxury-500"
              />
              <span>Set as default billing address</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="md" isLoading={isSaving}>
              {editingAddress ? 'Save Changes' : 'Add Destination'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
