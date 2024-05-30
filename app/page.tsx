"use client";

import { useState } from 'react';

const questions = [
  { type: 'text', question: 'What is your preferred genre?', name: 'genre', maxLength: 50 },
  { type: 'text', question: 'Who are your favorite authors? (You can list multiple)', name: 'authors', maxLength: 100 },
  { type: 'text', question: 'What language do you prefer?', name: 'language', maxLength: 50 },
  { type: 'text', question: 'What type of story are you in the mood for (e.g., adventure, romance, mystery)?', name: 'storyType', maxLength: 100 },
  { type: 'text', question: 'Do you prefer standalone books or series?', name: 'standaloneOrSeries', maxLength: 50 },
  { type: 'text', question: 'Are there any specific themes or topics you enjoy (e.g., dystopian, space exploration)?', name: 'themes', maxLength: 100 },
];

export default function Home() {
  interface Question {
    type: string;
    question: string;
    name: string;
    maxLength?: number;
  }

  interface Answer {
    [key: string]: any;
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [questions[currentQuestionIndex].name]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      fetchRecommendations(newAnswers);
      setIsCompleted(true);
    }
  };

  const fetchRecommendations = async (answers: Answer) => {
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      const data = await response.json();
      setRecommendations(data[0].split('\n').map((rec: string) => rec.replace(/^\d+\.\s+/, '')));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setRecommendations([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      const target = e.target as HTMLInputElement;
      handleAnswer(target.value.trim());
      target.value = ''; // Clear the input field
    }
  };

  return (
    <div className="flex flex-col text-black justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Book Suggestion App</h1>
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        {questions.slice(0, currentQuestionIndex + 1).map((q: Question, index) => (
          <div key={index} className="mb-6">
            <div className="font-bold mb-2">{q.question}</div>
            <div>
              {q.type === 'text' && !isCompleted && index === currentQuestionIndex && (
                <input
                  type="text"
                  maxLength={q.maxLength}
                  placeholder="Type your answer..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onKeyDown={handleKeyDown}
                />
              )}
            </div>
            {answers[q.name] && (
              <div className="mt-2 italic">
                {answers[q.name]}
              </div>
            )}
          </div>
        ))}
        {isCompleted && (
          <div className="mt-6">
            <div className="flex justify-between">
              <button
                onClick={resetForm}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Reset Form
              </button>
              <button
                onClick={() => fetchRecommendations(answers)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Regenerate
              </button>
            </div>
            <div className="font-bold mb-2">Here are your book recommendations:</div>
            <ul className="list-disc pl-5">
              {recommendations.map((rec: string, index) => (
                <li key={index} className="mb-2">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}