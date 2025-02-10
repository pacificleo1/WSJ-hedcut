'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  // ... other states ...

  const handleConvert = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      // Use environment variable for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/convert`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        setConvertedImage(URL.createObjectURL(blob));
        setStep(3);
      } else {
        console.error('Error converting image:', await response.text());
      }
    } catch (error) {
      console.error('Error converting image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        Get your own WSJ Hedcut Shot
      </h1>

      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="imageInput"
            />
            <label
              htmlFor="imageInput"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Find...
            </label>
          </div>
        )}

        {step === 2 && previewUrl && (
          <div className="text-center">
            <div className="relative w-full max-w-md mx-auto aspect-square mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover rounded-lg shadow-lg"
                style={{ maxHeight: '400px', width: 'auto', margin: '0 auto' }}
              />
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={handleConvert}
                className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Converting...' : 'Yes, that\'s it. Get me my Hedcut'}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Nah. I have a different pic in mind.
              </button>
            </div>
          </div>
        )}

        {step === 3 && convertedImage && (
          <div className="text-center">
            <h2 className="text-xl mb-4">Here is your WSJ Hedcut Shot. Enjoy.</h2>
            <div className="relative w-full max-w-md mx-auto aspect-square mb-4">
              <img
                src={convertedImage}
                alt="Converted"
                className="object-cover rounded-lg shadow-lg"
                style={{ maxHeight: '400px', width: 'auto', margin: '0 auto' }}
              />
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={handleDownload}
                className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                DOWNLOAD
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Take me home.
              </button>
            </div>
            <p className="text-sm mt-4 text-gray-500">
              A pacificleo creation.
              <br />
              ALL Rights Acknowledged. TL/DR: Don't Sue me.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}