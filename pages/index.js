import '../styles/globals.css';
import React, { useState } from 'react';

export default function AIBotDashboard() {
  const [assistantConfig, setAssistantConfig] = useState({
    name: '',
    model: 'gpt-4o',
    greeting: '',
    purpose: '',
    openaiKey: '',
    ghlApiKey: '',
    ghlSource: ''
  });

  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    setStatus('Connecting...');
    try {
      const response = await fetch('/api/connect-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assistantConfig)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Assistant connected: ${data.assistant_id}`);
      } else {
        setStatus(`❌ Error: ${data.error || 'Something went wrong.'}`);
      }
    } catch (err) {
      console.error('Connection error:', err);
      setStatus('❌ Connection failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Connect Assistant to GHL</h1>

        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Assistant Name"
          value={assistantConfig.name}
          onChange={(e) => setAssistantConfig({ ...assistantConfig, name: e.target.value })}
        />

        <select
          className="border p-2 rounded w-full mb-4"
          value={assistantConfig.model}
          onChange={(e) => setAssistantConfig({ ...assistantConfig, model: e.target.value })}
        >
          <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
          <option value="gpt-4">GPT 4</option>
          <option value="gpt-4o">GPT 4o</option>
        </select>

        <textarea
          className="border p-2 rounded w-full mb-4"
          rows={2}
          placeholder="Assistant Greeting"
          value={assistantConfig.greeting}
          onChange={(e) => setAssistantConfig({ ...assistantConfig, greeting: e.target.value })}
        />

        <textarea
          className="border p-2 rounded w-full mb-4"
          rows={3}
          placeholder="What is the assistant's purpose?"
          value={assistantConfig.purpose}
          onChange={(e) => setAssistantConfig({ ...assistantConfig, purpose: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="OpenAI API Key"
          value={assistantConfig.openaiKey}
          onChange={(e) => setAssistantConfig({ ...assistantConfig, openaiKey: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="GHL API Key"
          value={assistantConfig.ghlApiKey}
          onChange={(e) => setAssistantConfig({ ...assistantConfig, ghlApiKey: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full mb-6"
          placeholder="GHL Source (sub-account ID)"
          value={assistantConfig.ghlSource}
          onChange={(e) => setAssistantConfig({ ...assistantConfig, ghlSource: e.target.value })}
        />

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded shadow-md hover:bg-green-700"
          >
            Connect Assistant
          </button>
        </div>

        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
}
