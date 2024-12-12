import React, { useState, useMemo } from 'react';
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
  <details className="group rounded-lg overflow-hidden">
    <summary 
      className="flex items-center cursor-pointer p-4 bg-primary text-white font-bold rounded-lg transition-all duration-300 hover:bg-primary-dark outline-none"
      role="button"
      tabIndex={0}
    >
      <span className="mr-2 text-xl" role="img" aria-label={icon}>
        {icon}
      </span>
      <span className="flex-1">{question}</span>
      <span 
        className="transform transition-transform duration-300 group-open:rotate-45 text-xl ml-2 w-6 h-6 flex items-center justify-center"
        aria-hidden="true"
      >
        +
      </span>
    </summary>
    <div className="overflow-hidden transition-all duration-300 max-h-0 group-open:max-h-[500px]">
      <div className="p-4 bg-gray-50 rounded-b-lg transform transition-all duration-300 translate-y-[-100%] group-open:translate-y-0">
        <p className="text-gray-700 leading-relaxed">{answer}</p>
        {action && (
          <button
            onClick={onInschrijfClick}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            type="button"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  </details>
);

const SearchBar: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <div className="relative mb-8 group">
    <input
      type="text"
      id="kl-qa-search-input"
      placeholder="Zoek je vraag..."
      value={value}
      onChange={onChange}
      className="w-full p-4 pl-12 text-lg border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
      aria-label="Zoek in veelgestelde vragen"
    />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-primary/50 group-focus-within:text-primary transition-colors duration-300">
      🔍
    </span>
  </div>
);

const CategoryHeader: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-primary/10">
    <span className="text-3xl" role="img" aria-label={icon}>
      {icon}
    </span>
    <h3 className="text-2xl text-gray-800 font-bold font-heading">
      {title}
    </h3>
  </div>
);

const FAQ: React.FC<FAQProps> = ({ onInschrijfClick, onContactClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    <section className="w-full bg-white text-gray-800 p-8 rounded-xl shadow-lg">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-heading">
          Alles wat je wilt weten over De Koninklijke Loop
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Vind snel antwoord op je vragen of neem contact met ons op
        </p>
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {filteredCategories.map((category) => (
          <div 
            key={category.title} 
            className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-100"
          >
            <CategoryHeader title={category.title} icon={category.icon} />
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
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
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
              focus:outline-none focus:ring-2 focus:ring-primary/50
              group"
          >
            <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
              <span className="material-icons-round text-xl">mail</span>
              Stuur ons een bericht
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 