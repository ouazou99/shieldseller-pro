'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface Shop {
  id: string;
  shopName: string;
  platform: string;
}

interface CSVUploadFormProps {
  shops: Shop[];
}

export default function CSVUploadForm({ shops }: CSVUploadFormProps) {
  const router = useRouter();
  const [selectedShop, setSelectedShop] = useState(shops[0]?.id || '');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadStats, setUploadStats] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
    setSuccess('');
    setUploadStats(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (!selectedShop) {
      setError('Please select a shop');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Read file content
      const text = await file.text();
      
      // Send to API
      const response = await fetch('/api/listings/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: selectedShop,
          csvData: text,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Upload failed');
        return;
      }
      
      // Show success
      setSuccess(`Successfully uploaded ${data.stats.successful} listings!`);
      setUploadStats(data.stats);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Refresh page after a delay
      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 2000);
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shop Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Shop
        </label>
        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          required
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.shopName} ({shop.platform})
            </option>
          ))}
        </select>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CSV File
        </label>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-500 transition">
          <input
            id="csv-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <label
            htmlFor="csv-file-input"
            className="cursor-pointer"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            
            {file ? (
              <div className="mt-4">
                <div className="flex items-center justify-center space-x-2 text-brand-600">
                  <FileSpreadsheet className="h-5 w-5" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700 mt-2"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  CSV file up to 10MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">{success}</p>
              {uploadStats && (
                <div className="text-xs text-green-700 mt-2 space-y-1">
                  <p>Total: {uploadStats.total}</p>
                  <p>Successful: {uploadStats.successful}</p>
                  {uploadStats.failed > 0 && (
                    <p className="text-red-600">Failed: {uploadStats.failed}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={!file || isLoading}
      >
        {isLoading ? 'Uploading & Analyzing...' : 'Upload & Analyze'}
      </Button>

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          After upload, your listings will be automatically analyzed for violations. 
          This may take a few moments depending on the number of products.
        </p>
      </div>
    </form>
  );
}
