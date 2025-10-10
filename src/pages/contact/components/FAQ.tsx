import React, { useState, useMemo, memo } from 'react';
import { faqData } from './faq.data';
import { useDebounce } from '../../../hooks/ui/useDebounce';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, colors } from '@/styles/shared';

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

const QuestionItem: React.FC<QuestionItemProps> = memo(({
  question,
  answer,
  icon,
  action,
  actionText,
  onInschrijfClick
}) => {
  const handleClick = () => {
    trackEvent('faq', 'question_click', question);
  };

  return (
    <details className="group rounded-lg overflow-hidden" onClick={handleClick}>
      <summary 
        className={cn(
          cc.flex.start,
          'cursor-pointer p-4 text-white rounded-lg outline-none',
          colors.primary.bg,
          colors.primary.hover,
          cc.transition.base
        )}
        role="button"
        tabIndex={0}
      >
        <span className="mr-2 text-xl" role="img" aria-label={icon}>
          {icon}
        </span>
        <span className="flex-1">{question}</span>
        <span 
          className={cn(
            'transform text-xl ml-2 w-6 h-6 group-open:rotate-45',
            cc.flex.center,
            cc.transition.base
          )}
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="overflow-hidden transition-all duration-300 max-h-0 group-open:max-h-[500px]">
        <div className="p-4 bg-gray-50 rounded-b-lg transform transition-all duration-300 translate-y-[-100%] group-open:translate-y-0">
          <p className={cn(cc.text.body, 'text-gray-700')}>{answer}</p>
          {action && (
            <button
              onClick={() => {
                trackEvent('faq', 'action_click', `${actionText} - ${question}`);
                onInschrijfClick?.();
              }}
              className={cn(
                'mt-4 text-white px-6 py-2 rounded-lg',
                colors.primary.bg,
                colors.primary.hover,
                cc.transition.base,
                'hover:-translate-y-0.5',
                cc.shadow.lg,
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
              type="button"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </details>
  );
});

QuestionItem.displayName = 'QuestionItem';

const SearchBar: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = memo(({ value, onChange }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    trackEvent('faq', 'search', e.target.value);
    onChange(e);
  };

  return (
    <div className="relative mb-8 group">
      <input
        type="text"
        id="kl-qa-search-input"
        placeholder="Zoek je vraag..."
        value={value}
        onChange={handleSearch}
        className={cn(
          'w-full p-4 pl-12 text-lg border-2 border-primary/20 rounded-xl',
          cc.text.h5,
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          cc.transition.base
        )}
        aria-label="Zoek in veelgestelde vragen"
      />
      <span className={cn('absolute left-4 top-1/2 -translate-y-1/2 text-xl text-primary/50 group-focus-within:text-primary', cc.transition.colors)}>
        🔍
      </span>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

const CategoryHeader: React.FC<{ title: string; icon: string }> = memo(({ title, icon }) => (
  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-primary/10">
    <span className="text-3xl" role="img" aria-label={icon}>
      {icon}
    </span>
    <h3 className={cn(cc.text.h3, 'text-gray-800', cc.typography.heading)}>
      {title}
    </h3>
  </div>
));

const FAQ: React.FC<FAQProps> = memo(({ onInschrijfClick, onContactClick }) => {
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

  const handleContactClick = () => {
    trackEvent('faq', 'contact_click', 'contact_button');
    onContactClick?.();
  };

  return (
    <section className={cn('w-full bg-white text-gray-800 p-8 rounded-xl', cc.shadow.lg)}>
      <div className={cn(cc.container.narrow, 'text-center mb-12')}>
        <h2 className={cn(cc.text.h1, 'mb-6', colors.primary.text, cc.typography.heading)}>
          Alles wat je wilt weten over De Koninklijke Loop
        </h2>
        <p className={cn(cc.text.h5, cc.text.muted, 'mb-8')}>
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
            className={cn('bg-white rounded-2xl p-6 border border-gray-100', cc.transition.base, 'hover:shadow-lg')}
          >
            <CategoryHeader title={category.title} icon={category.icon} />
            <div className="space-y-4">
              {category.questions.map((qa) => (
                <QuestionItem
                  key={qa.question}
                  {...qa}
                  onInschrijfClick={qa.question.includes('contact') ? handleContactClick : onInschrijfClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8">
          <h3 className={cn(cc.text.h3, 'text-gray-900 mb-4', cc.typography.heading)}>
            Nog vragen?
          </h3>
          <p className={cn(cc.text.muted, 'mb-6')}>
            We helpen je graag verder met al je vragen over De Koninklijke Loop
          </p>
          <button
            onClick={handleContactClick}
            className={cn(
              'text-white px-8 py-3 rounded-xl group',
              colors.primary.bg,
              colors.primary.hover,
              'hover:-translate-y-1',
              cc.shadow.lg,
              cc.transition.base,
              'focus:outline-none focus:ring-2 focus:ring-primary/50'
            )}
          >
            <span className={cn(cc.flex.start, 'gap-2 group-hover:gap-3', cc.transition.base)}>
              <span className="material-icons-round text-xl">mail</span>
              Stuur ons een bericht
            </span>
          </button>
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;