
import React, { useState } from 'react';   
import { fetchGEDQuestions } from './services/questionsService';
import { Question, UserAnswer, AppState, Difficulty } from './types';
import { Button } from './components/Button';
import { QuestionCard } from './components/QuestionCard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  const startQuiz = async (difficulty: Difficulty) => {
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      // Pass the current question history to help Gemini generate new content
      const data = await fetchGEDQuestions(10, difficulty, questionHistory);
      
      // Update history with new question texts (keep last 30 to manage prompt size)
      const newHistory = [...questionHistory, ...data.map(q => q.question)].slice(-30);
      setQuestionHistory(newHistory);
      
      setQuestions(data);
      setCurrentIndex(0);
      setUserAnswers([]);
      setAppState('QUIZ');
      setShowFeedback(false);
      setSelectedAnswer(null);
    } catch (error) {
      alert("Error loading questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === questions[currentIndex].correctIndex;
    setUserAnswers(prev => [
      ...prev,
      {
        questionId: questions[currentIndex].id,
        selectedIndex: index,
        isCorrect
      }
    ]);
  };

  const nextQuestion = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
    } else {
      setAppState('RESULTS');
    }
  };

  const getScore = () => {
    return userAnswers.filter(a => a.isCorrect).length;
  };

  const getValuation = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { title: "Outstanding!", msg: "You're ready for the actual exam. Keep this momentum!", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (percentage >= 70) return { title: "Great Job!", msg: "You have a solid foundation. Just a few more reviews and you're set.", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 50) return { title: "Getting There", msg: "Good effort. Focus on the topics where you missed questions.", color: "text-amber-600", bg: "bg-amber-50" };
    return { title: "Keep Practicing", msg: "The GED Math exam requires persistent practice. Review the explanations carefully.", color: "text-red-600", bg: "bg-red-50" };
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mt-6 text-center">Preparing Your Practice Set...</h2>
        <p className="text-slate-500 mt-2 text-center text-sm">Generating 10 custom GED-style math questions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState('HOME')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-sm">NY</span>
            </div>
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">GED<span className="text-indigo-600 italic">Math</span></h1>
          </div>
          {appState === 'QUIZ' && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Progress</span>
              <span className="font-black text-indigo-600">{currentIndex + 1}/10</span>
            </div>
          )}
        </div>
        {appState === 'QUIZ' && (
          <div className="w-full h-1 bg-slate-50">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 flex items-start justify-center">
        {appState === 'HOME' && (
          <div className="max-w-xl w-full text-center py-6 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 relative inline-block">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1509228468518-180dd482180c?auto=format&fit=crop&q=80&w=400" 
                  alt="Math Prep" 
                  className="rounded-2xl w-full max-w-[280px] md:max-w-sm mx-auto"
                />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">Master the GED Math Exam</h2>
            <p className="text-base md:text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed px-4">
              Sharpen your skills with dynamic practice tests designed specifically for the New York GED requirements.
            </p>
            <div className="flex flex-col gap-3 px-4 sm:px-0">
              <Button size="lg" onClick={() => setAppState('DIFFICULTY')} className="shadow-xl shadow-indigo-100 py-4 text-lg">
                Start Practice Session
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button variant="outline" size="lg" className="border-slate-200" onClick={() => window.open('https://www.ged.com/policies/new_york/', '_blank')}>
                Review NY Standards
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3 px-2">
              {[
                { label: "Questions", val: "Unique" },
                { label: "Solutions", val: "Step-by-step" },
                { label: "Difficulty", val: "Customized" },
                { label: "Platform", val: "Mobile-first" }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-indigo-600 font-black text-sm">{item.val}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {appState === 'DIFFICULTY' && (
          <div className="max-w-xl w-full text-center py-6 md:py-12 animate-in fade-in zoom-in-95 duration-500 px-4">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">Choose Difficulty</h2>
            <p className="text-slate-500 mb-10">Select a level that matches your current preparation.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'easy' as Difficulty, title: 'Easy', desc: 'Fundamentals, fractions, and simple algebra.', color: 'border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700' },
                { id: 'medium' as Difficulty, title: 'Medium', desc: 'Standard GED level. Geometry and complex algebra.', color: 'border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700' },
                { id: 'hard' as Difficulty, title: 'Hard', desc: 'Advanced problem solving and statistics.', color: 'border-amber-100 hover:border-amber-500 hover:bg-amber-50 text-amber-700' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => startQuiz(lvl.id)}
                  className={`group p-6 bg-white border-2 rounded-2xl text-left transition-all duration-300 active:scale-95 flex flex-col gap-1 ${lvl.color}`}
                >
                  <span className="text-xl font-black uppercase tracking-tight">{lvl.title}</span>
                  <span className="text-slate-500 text-sm group-hover:text-inherit transition-colors">{lvl.desc}</span>
                </button>
              ))}
              <Button variant="outline" className="mt-4" onClick={() => setAppState('HOME')}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {appState === 'QUIZ' && questions.length > 0 && (
          <div className="w-full flex flex-col items-center gap-6">
            <QuestionCard 
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              onAnswer={handleAnswer}
              showFeedback={showFeedback}
              selectedAnswer={selectedAnswer}
            />
            {showFeedback && (
              <div className="w-full max-w-2xl pb-10 px-4">
                <Button fullWidth size="lg" onClick={nextQuestion} className="py-4 shadow-lg active:scale-95">
                  {currentIndex === questions.length - 1 ? 'Finish & See Results' : 'Next Question'}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        )}

        {appState === 'RESULTS' && (
          <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 text-center animate-in zoom-in-95 duration-500 border border-slate-100">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white">
                {getScore()}/10 CORRECT
              </div>
            </div>

            <h2 className={`text-3xl md:text-5xl font-black mb-3 ${getValuation(getScore()).color}`}>
              {getValuation(getScore()).title}
            </h2>
            <p className="text-slate-600 text-sm md:text-lg mb-8 leading-relaxed px-4">
              {getValuation(getScore()).msg}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100">
                <div className="text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-1">Score</div>
                <div className="text-3xl font-black text-emerald-600">{getScore() * 10}%</div>
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Missed</div>
                <div className="text-3xl font-black text-slate-400">{questions.length - getScore()}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={() => setAppState('DIFFICULTY')} className="py-4 shadow-lg">New Practice Session</Button>
              <Button variant="outline" size="lg" onClick={() => setAppState('HOME')} className="py-4">Finish & Go Home</Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 bg-white">
        <p>© 2024 GED Math Master NY • Empowering Students</p>
      </footer>
    </div>
  );
};

export default App;
