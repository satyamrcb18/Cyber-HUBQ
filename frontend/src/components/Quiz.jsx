import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, RefreshCw } from 'lucide-react';

const quizQuestions = [
  {
    question: "What is the primary indicator of a potentially malicious email (Phishing)?",
    options: [
      "It has an attachment.",
      "A sense of urgency and requesting sensitive info.",
      "It comes from an unknown sender.",
      "It contains images."
    ],
    answer: 1
  },
  {
    question: "Which of these makes a password truly strong?",
    options: [
      "Using your pet's name and birth year.",
      "A short but complex combination like '@B7!'.",
      "Using the same long password across all sites.",
      "A long passphrase (e.g., 'BlueHorsesRunFast!42')."
    ],
    answer: 3
  },
  {
    question: "What does Multi-Factor Authentication (MFA/2FA) do?",
    options: [
      "Encrypts your password in the database.",
      "Requires a second form of verification besides a password.",
      "Automatically logs you out after 5 minutes.",
      "Scans your computer for malware before login."
    ],
    answer: 1
  },
  {
    question: "You find a USB drive in the parking lot. What should you do?",
    options: [
      "Plug it into your personal laptop to see who owns it.",
      "Plug it into your work computer and run an antivirus scan.",
      "Turn it in to IT or security without plugging it in.",
      "Format it immediately and use it."
    ],
    answer: 2
  },
  {
    question: "Why should you keep your software and OS updated?",
    options: [
      "To get new colorful themes.",
      "To patch known security vulnerabilities.",
      "To prevent your computer from overflowing with data.",
      "To make your internet connection faster."
    ],
    answer: 1
  }
];

const Quiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerOptionClick = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === quizQuestions[currentQ].answer) {
      setScore(score + 1);
    }
    
    // Auto advance after 1.5s
    setTimeout(() => {
      setSelectedOption(null);
      setIsAnswered(false);
      
      const nextQuestion = currentQ + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQ(nextQuestion);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const getMaturityLevel = () => {
    if (score === 5) return { level: 'Cyber Ninja', color: 'var(--success)' };
    if (score >= 3) return { level: 'Security Aware', color: '#eab308' }; // yellow
    return { level: 'High Risk', color: 'var(--danger)' };
  };

  return (
    <div className="glass-panel animate-slide-down" style={{ animationDelay: '0.2s', height: '100%' }}>
      <h2 className="title" style={{ marginBottom: '20px' }}>
        <HelpCircle className="icon-accent" size={24} /> Self-Assessment Quiz
      </h2>

      {showScore ? (
        <div className="score-section fade-in">
          <Award size={64} color={getMaturityLevel().color} style={{ margin: '0 auto 20px', display: 'block' }} />
          <h3 style={{ textAlign: 'center', fontSize: '1.8rem', margin: '0 0 10px 0' }}>Score: {score} / 5</h3>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Your Cyber Security Maturity Level: <strong style={{ color: getMaturityLevel().color, fontSize: '1.2rem' }}>{getMaturityLevel().level}</strong>
          </p>
          
          <div style={{ textAlign: 'center' }}>
            <button className="btn" onClick={restartQuiz}>
              <RefreshCw size={18} /> Retake Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Question {currentQ + 1} of {quizQuestions.length}
            </span>
            <h3 style={{ fontSize: '1.2rem', marginTop: '10px', lineHeight: '1.4' }}>
              {quizQuestions[currentQ].question}
            </h3>
          </div>
          
          <div className="options-container">
            {quizQuestions[currentQ].options.map((option, index) => {
              
              let btnClass = "option-btn";
              let Icon = null;

              if (isAnswered) {
                if (index === quizQuestions[currentQ].answer) {
                  btnClass += " correct";
                  Icon = <CheckCircle size={18} />;
                } else if (index === selectedOption) {
                  btnClass += " incorrect";
                  Icon = <XCircle size={18} />;
                }
              }

              return (
                <button
                  key={index}
                  className={btnClass}
                  onClick={() => handleAnswerOptionClick(index)}
                  disabled={isAnswered}
                >
                  <span style={{ flex: 1, textAlign: 'left' }}>{option}</span>
                  {Icon}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .icon-accent { color: var(--accent); }
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        
        .progress-bar-container {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.3s ease;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .option-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .option-btn:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.15); /* Accent tint */
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-1px);
        }
        
        .option-btn.correct {
          background: rgba(34, 197, 94, 0.2);
          border-color: var(--success);
          color: #fff;
        }
        .option-btn.incorrect {
          background: rgba(239, 68, 68, 0.2);
          border-color: var(--danger);
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Quiz;
