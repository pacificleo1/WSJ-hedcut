'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleConvert = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8000/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        setConvertedImage(URL.createObjectURL(blob));
        setStep(3);
      }
    } catch (error) {
      console.error('Error converting image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (convertedImage) {
      const link = document.createElement('a');
      link.href = convertedImage;
      link.download = 'hedcut.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <main className="min-h-screen p-8">
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
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Find...
            </label>
          </div>
        )}

        {step === 2 && previewUrl && (
          <div className="text-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-md mx-auto mb-4"
            />
            <div className="space-y-2">
              <button
                onClick={handleConvert}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                disabled={loading}
              >
                {loading ? 'Converting...' : 'Yes, that's it. Get me my Hedcut'}
              </button>
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                Nah. I have a different pic in mind.
              </button>
            </div>
          </div>
        )}

        {step === 3 && convertedImage && (
          <div className="text-center">
            <h2 className="text-xl mb-4">Here is your WSJ Hedcut Shot. Enjoy.</h2>
            <img
              src={convertedImage}
              alt="Converted"
              className="max-w-md mx-auto mb-4"
            />
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                DOWNLOAD
              </button>
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
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
    </main>
  );
}