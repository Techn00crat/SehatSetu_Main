'use client'; // only for app router

import { useState } from 'react';

export default function GeminiInput() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: input }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
      >click
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {output && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Result:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
