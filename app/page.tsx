"use client";

import { useState, useRef, useEffect } from 'react';
import Loading from './loading';

const questions = [
  { type: 'text', question: 'What is your preferred genre?', name: 'genre', maxLength: 50 },
  { type: 'text', question: 'Who are your favorite authors? (You can list multiple)', name: 'authors', maxLength: 100 },
  { type: 'text', question: 'What language do you prefer?', name: 'language', maxLength: 50 },
  { type: 'text', question: 'What type of story are you in the mood for (e.g., adventure, romance, mystery)?', name: 'storyType', maxLength: 100 },
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
  const [loading, setLoading] = useState(false);
  const answerRef = useRef<HTMLDivElement | null>(null);

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
    setLoading(true); // Set loading to true before fetching
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
    setLoading(false); // Set loading to false after fetching
  };

  const resetForm = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setRecommendations([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      handleAnswer(target.value.trim());
      target.value = ''; // Clear the input field
    }
  };

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [answers]);

  return (
    <div className="flex flex-col text-black justify-center items-center min-h-screen bg-gray-100">
      
      <div className="w-full max-w-3xl flex flex-col justify-end bg-white p-8 rounded-lg shadow-lg ">
      <h1 className="text-2xl font-bold mb-6 text-center shadow-md py-2">Book Suggestion App</h1>
        <div className='shadow-md p-2 text-sm  rounded h-[30dvh] overflow-auto'>
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
                <div ref={answerRef} className="mt-2 italic">
                  {answers[q.name]}
                </div>
              )}
            </div>
          ))}
        </div>
        {isCompleted && (
          <div className="mt-6 text-sm">
            <div className="flex justify-between shadow-md p-2 rounded">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
              >
                Reset Form
              </button>
              <button
                onClick={() => fetchRecommendations(answers)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
              >
                Regenerate
              </button>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="font-bold my-4 text-lg shadow-md p-2 rounded">Here are your book recommendations:</div>
                <ul className="list-disc shadow-md p-2 rounded">
                  {recommendations.map((rec: string, index) => (
                    <li key={index} className="mb-2">{rec}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
