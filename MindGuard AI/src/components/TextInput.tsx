import React, { useState } from 'react';

interface TextInputProps {
  onAnalyze: (text: string) => void;
  isProcessing: boolean;
}

const EXAMPLE_TEXTS = [
  {
    label: "😊 Positive",
    text: "I'm feeling really good today! Had a great conversation with my friend and I'm looking forward to the weekend. Things are finally starting to look up."
  },
  {
    label: "😰 Anxious",
    text: "I've been feeling so anxious lately. Can't sleep well, constantly worried about everything. My heart races when I think about work tomorrow."
  },
  {
    label: "😢 Depressed",
    text: "Nothing feels worth it anymore. I'm exhausted all the time and feel completely alone. Nobody understands what I'm going through. Everything feels hopeless."
  },
  {
    label: "🆘 Crisis",
    text: "I can't go on like this anymore. I feel like I want to end it all. No one would even notice if I was gone. I don't see any reason to continue living."
  }
];

export const TextInput: React.FC<TextInputProps> = ({ onAnalyze, isProcessing }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const handleExampleClick = (exampleText: string) => {
    setText(exampleText);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Text Analysis</h3>
          <p className="text-sm text-gray-500">RoBERTa/DistilBERT sentiment & stress detection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze for mental health indicators..."
          className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          disabled={isProcessing}
        />
        
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_TEXTS.map((example, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleExampleClick(example.text)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition disabled:opacity-50"
              disabled={isProcessing}
            >
              {example.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isProcessing}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Text
            </>
          )}
        </button>
      </form>
    </div>
  );
};
