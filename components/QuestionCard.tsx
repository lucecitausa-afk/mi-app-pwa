
import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onAnswer: (selectedIndex: number) => void;
  showFeedback: boolean;
  selectedAnswer: number | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  total,
  onAnswer,
  showFeedback,
  selectedAnswer
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-5 md:p-8 max-w-2xl w-full mx-auto border border-slate-100">
      <div className="flex justify-between items-center mb-5">
        <span className="text-[10px] md:text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">
          {question.topic}
        </span>
        <span className="text-xs font-semibold text-slate-400">
          Q{index + 1} of {total}
        </span>
      </div>

      <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-6 leading-tight md:leading-relaxed">
        {question.question}
      </h2>

      <div className="space-y-3 md:space-y-4 mb-6">
        {question.options.map((option, idx) => {
          let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center gap-3 ";
          
          if (showFeedback) {
            if (idx === question.correctIndex) {
              buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-100";
            } else if (idx === selectedAnswer && idx !== question.correctIndex) {
              buttonClass += "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-100";
            } else {
              buttonClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
            }
          } else {
            buttonClass += selectedAnswer === idx 
              ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md" 
              : "bg-white border-slate-100 hover:border-indigo-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98]";
          }

          return (
            <button
              key={idx}
              disabled={showFeedback}
              onClick={() => onAnswer(idx)}
              className={buttonClass}
            >
              <span className="font-medium text-sm md:text-base leading-snug">{option}</span>
              <div className="flex-shrink-0">
                {showFeedback && idx === question.correctIndex && (
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showFeedback && idx === selectedAnswer && idx !== question.correctIndex && (
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`p-4 md:p-5 rounded-xl ${selectedAnswer === question.correctIndex ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
            <h4 className={`font-bold text-sm uppercase tracking-wide mb-2 ${selectedAnswer === question.correctIndex ? 'text-emerald-800' : 'text-red-800'}`}>
              {selectedAnswer === question.correctIndex ? '✓ Correct' : '✕ Incorrect'}
            </h4>
            <div className="text-slate-700 text-sm md:text-base whitespace-pre-line leading-relaxed border-t border-black/5 pt-2">
              <span className="font-bold text-slate-900">Step-by-step:</span>
              <p className="mt-1 italic">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
