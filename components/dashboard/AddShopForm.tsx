'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AddShopForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: '',
    shopId: '',
    platform: 'tiktok',
    shopUrl: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add shop');
        return;
      }

      // Success - refresh page to show new shop
      router.refresh();
      
      // Reset form
      setFormData({
        shopName: '',
        shopId: '',
        platform: 'tiktok',
        shopUrl: '',
      });
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Shop Name"
          name="shopName"
          value={formData.shopName}
          onChange={handleChange}
          placeholder="My TikTok Shop"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          >
            <option value="tiktok">TikTok Shop</option>
            <option value="amazon" disabled>Amazon (Coming Soon)</option>
            <option value="shopify" disabled>Shopify (Coming Soon)</option>
            <option value="walmart" disabled>Walmart (Coming Soon)</option>
          </select>
        </div>
      </div>

      <Input
        label="Shop ID"
        name="shopId"
        value={formData.shopId}
        onChange={handleChange}
        placeholder="123456789"
        required
      />

      <Input
        label="Shop URL (Optional)"
        name="shopUrl"
        value={formData.shopUrl}
        onChange={handleChange}
        placeholder="https://shop.tiktok.com/yourshop"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> For now, add your shop details manually. After adding, 
          you can upload your listings via CSV to start monitoring.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Add Shop
      </Button>
    </form>
  );
}
