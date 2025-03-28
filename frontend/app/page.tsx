'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          steps: 40,
          guidance_scale: 4.5,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setImage(`data:image/png;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Text to Image Generation
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-[#000000] mb-2">
              Enter your prompt
            </label>
            <textarea
            id="prompt"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
          />

          </div>
          
          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading || !prompt.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {image && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Image</h2>
            <div className="relative w-full aspect-square">
              <Image
                src={image}
                alt="Generated image"
                fill
                className="rounded-lg object-contain"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
