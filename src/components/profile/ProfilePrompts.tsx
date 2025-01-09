import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface Props {
  profile: Profile;
  onUpdate: (prompts: any[]) => Promise<void>;
}

const PROMPT_SUGGESTIONS = [
  "What's your favorite way to use AI in your daily life?",
  "Share an interesting AI project you've worked on",
  "What excites you most about the future of AI?",
  "Describe your ideal AI-powered date",
  "What's your hot take on artificial intelligence?"
];

export function ProfilePrompts({ profile, onUpdate }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [newPrompt, setNewPrompt] = useState({ question: '', answer: '' });

  const prompts = profile.profile_prompts || [];

  const handleAdd = async () => {
    if (!newPrompt.question || !newPrompt.answer) return;
    
    const updatedPrompts = [...prompts, newPrompt];
    await onUpdate(updatedPrompts);
    setNewPrompt({ question: '', answer: '' });
  };

  const handleUpdate = async (index: number, updatedPrompt: any) => {
    const updatedPrompts = prompts.map((p, i) => 
      i === index ? updatedPrompt : p
    );
    await onUpdate(updatedPrompts);
    setEditing(null);
  };

  const handleDelete = async (index: number) => {
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    await onUpdate(updatedPrompts);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Profile Prompts</h3>

      <div className="space-y-6">
        {prompts.map((prompt, index) => (
          <div key={index} className="border-b pb-4">
            {editing === index ? (
              <div className="space-y-3">
                <select
                  value={prompt.question}
                  onChange={(e) => handleUpdate(index, { ...prompt, question: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {PROMPT_SUGGESTIONS.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <textarea
                  value={prompt.answer}
                  onChange={(e) => handleUpdate(index, { ...prompt, answer: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
                <button
                  onClick={() => setEditing(null)}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{prompt.question}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditing(index)}
                      className="text-gray-400 hover:text-purple-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{prompt.answer}</p>
              </div>
            )}
          </div>
        ))}

        {prompts.length < 3 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Add a Prompt</h4>
            <div className="space-y-3">
              <select
                value={newPrompt.question}
                onChange={(e) => setNewPrompt({ ...newPrompt, question: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select a prompt</option>
                {PROMPT_SUGGESTIONS.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <textarea
                value={newPrompt.answer}
                onChange={(e) => setNewPrompt({ ...newPrompt, answer: e.target.value })}
                placeholder="Your answer..."
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
              <button
                onClick={handleAdd}
                disabled={!newPrompt.question || !newPrompt.answer}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prompt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}