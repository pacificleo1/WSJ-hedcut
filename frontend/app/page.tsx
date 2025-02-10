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
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-12">
        Get your own WSJ Hedcut Shot
      </h1>

      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="file-input-label"
              >
                Choose file
              </label>
              <span className="text-gray-500">
                {selectedImage ? selectedImage.name : 'No file chosen'}
              </span>
              <span className="find-button">
                Find...
              </span>
            </div>
          </div>
        )}

        {step === 2 && previewUrl && (
          <div className="image-container">
            <img
              src={previewUrl}
              alt="Preview"
              className="preview-image"
            />
            <div className="button-container">
              <button
                onClick={handleConvert}
                className="action-button primary-button"
                disabled={loading}
              >
                {loading ? 'Converting...' : 'Yes, that\'s it. Get me my Hedcut'}
              </button>
              <button
                onClick={() => setStep(1)}
                className="action-button secondary-button"
              >
                Nah. I have a different pic in mind.
              </button>
            </div>
          </div>
        )}

        {step === 3 && convertedImage && (
          <div className="image-container">
            <h2 className="text-xl mb-4">Here is your WSJ Hedcut Shot. Enjoy.</h2>
            <img
              src={convertedImage}
              alt="Converted"
              className="preview-image"
            />
            <div className="button-container">
              <button
                onClick={handleDownload}
                className="action-button primary-button"
              >
                DOWNLOAD
              </button>
              <button
                onClick={() => setStep(1)}
                className="action-button secondary-button"
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