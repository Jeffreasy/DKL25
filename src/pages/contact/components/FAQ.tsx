import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { faqData } from './faq.data';
import { useDebounce } from '../../../hooks/ui/useDebounce';

interface FAQProps {
  onInschrijfClick?: () => void;
  onContactClick?: () => void;
}

interface QuestionItemProps {
  question: string;
  answer: string;
  icon: string;
  action?: boolean;
  actionText?: string;
  onInschrijfClick?: () => void;
}

interface FAQCategory {
  title: string;
  icon: string;
  questions: FAQItem[];
}

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
  action?: boolean;
  actionText?: string;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  answer,
  icon,
  action,
  actionText,
  onInschrijfClick
}) => (
  <details className="group">
    <summary 
      className="flex items-center cursor-pointer p-4 bg-primary text-white font-bold rounded-lg transition-colors duration-300 hover:bg-secondary"
      role="button"
      tabIndex={0}
    >
      <span className="mr-2 text-xl" role="img" aria-label={icon}>
        {icon}
      </span>
      <span className="flex-1">{question}</span>
      <span className="transform transition-transform duration-300 group-open:rotate-45 text-xl" aria-hidden="true">
        +
      </span>
    </summary>
    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
      <p className="text-gray-700 leading-relaxed">{answer}</p>
      {action && (
        <button
          onClick={onInschrijfClick}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          type="button"
        >
          {actionText}
        </button>
      )}
    </div>
  </details>
);

const SearchBar: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <div className="mb-8">
    <input
      type="text"
      id="kl-qa-search-input"
      placeholder="🔍 Zoek je vraag..."
      value={value}
      onChange={onChange}
      className="w-full p-3 text-base border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
      aria-label="Zoek in veelgestelde vragen"
    />
  </div>
);

const BackToTopButton: React.FC<{
  show: boolean;
  onClick: () => void;
}> = ({ show, onClick }) => (
  <button
    onClick={onClick}
    className={`fixed bottom-5 right-5 w-12 h-12 bg-primary text-white rounded-full shadow-lg transition-all duration-300 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 z-50 ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
    aria-label="Terug naar boven"
  >
    ⬆
  </button>
);

const FAQ: React.FC<FAQProps> = ({ onInschrijfClick, onContactClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCategories = useMemo(() => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    return faqData
      .map((category: FAQCategory) => ({
        ...category,
        questions: category.questions.filter((q: FAQItem) => 
          q.question.toLowerCase().includes(searchLower) ||
          q.answer.toLowerCase().includes(searchLower)
        )
      }))
      .filter((category: FAQCategory) => category.questions.length > 0);
  }, [debouncedSearchTerm]);

  return (
    <section className="w-full bg-white text-gray-800 p-8 rounded-lg">
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h2 className="text-4xl md:text-5xl text-center text-primary font-bold mb-8">
          Alles wat je wilt weten over De Koninklijke Loop
        </h2>
        
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCategories.map((category) => (
          <div 
            key={category.title} 
            className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:shadow-xl"
          >
            <h3 className="flex items-center text-2xl text-secondary font-bold mb-4 pb-2 border-b-2 border-secondary">
              <span className="mr-2 text-3xl" role="img" aria-label={category.icon}>
                {category.icon}
              </span>
              {category.title}
            </h3>
            <div className="space-y-4">
              {category.questions.map((qa) => (
                <QuestionItem
                  key={qa.question}
                  {...qa}
                  onInschrijfClick={qa.question.includes('contact') ? onContactClick : onInschrijfClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Nog vragen?
          </h3>
          <p className="text-gray-600 mb-6">
            We helpen je graag verder met al je vragen over De Koninklijke Loop
          </p>
          <button
            onClick={onContactClick}
            className="bg-primary text-white px-8 py-3 rounded-xl
              font-medium hover:-translate-y-1 hover:shadow-lg 
              transition-all duration-300 hover:bg-primary-dark
              focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <span className="flex items-center gap-2">
              <span className="material-icons-round text-xl">mail</span>
              Stuur ons een bericht
            </span>
          </button>
        </div>
      </div>

      <BackToTopButton 
        show={showBackToTop}
        onClick={handleBackToTop}
      />
    </section>
  );
};

export default FAQ; 