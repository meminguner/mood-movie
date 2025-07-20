'use client';

import React, { useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function FilmRobotuPage() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setStarted(true);
    setMessages([]);
    setRecommendations(null);
    setInput('');
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/film-robotu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([{ role: 'assistant', content: data.reply }]);
      } else {
        setError('Film Robotu başlatılamadı.');
      }
    } catch (e) {
      setError('Sunucuya bağlanılamadı.');
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setError(null);
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setLoading(true);
    setInput('');
    try {
      const res = await fetch('http://localhost:8080/api/film-robotu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      if (data.recommendations) {
        setMessages(newMessages);
        setRecommendations(data.recommendations);
      } else if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(newMessages);
        setError('Film Robotu cevap veremedi.');
      }
    } catch (e) {
      setMessages(newMessages);
      setError('Sunucuya bağlanılamadı.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Film Robotu</h1>
      {!started ? (
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          onClick={handleStart}
          disabled={loading}
        >
          Film Robotu'nu Başlat
        </button>
      ) : (
        <>
          <div className="mb-4 h-64 overflow-y-auto border rounded p-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg max-w-xs bg-gray-200 animate-pulse">Film Robotu yazıyor...</div>
              </div>
            )}
          </div>
          {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
          {!recommendations ? (
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Cevabınızı yazın..."
                autoFocus
                disabled={loading}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSend}
                disabled={loading}
              >
                Gönder
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Sana Özel Film Önerileri:</h2>
              <ul className="list-disc pl-6">
                {recommendations.map((film, idx) => (
                  <li key={idx}>{film}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
} 