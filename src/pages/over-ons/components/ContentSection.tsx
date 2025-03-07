import React from 'react';

interface ContentSectionProps {
  icon: string;
  title: string;
  content: string[];
  isThankYou?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({ icon, title, content, isThankYou }) => {
  return (
    <div 
      className="bg-white p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary group cursor-default"
      tabIndex={0}
    >
      <h2 className="flex items-center gap-3 mb-6 relative pb-3">
        <i className="material-icons-round text-2xl text-primary transition-transform duration-300 group-hover:-translate-y-1">
          {icon}
        </i>
        <div className="flex flex-col">
          <span className="material-icons-round text-[14px] text-primary/60 font-light mb-1">
            {icon}
          </span>
          <span className="font-['Roboto_Slab'] text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary/20 transition-all duration-300 group-hover:w-24 group-hover:bg-primary" />
      </h2>
      <div className="space-y-4 font-['Roboto_Slab']">
        {content.map((paragraph, index) => (
          isThankYou && index === content.length - 1 ? (
            <p key={index} className="text-center font-medium text-gray-900 mt-6 p-4 bg-primary/10 rounded-lg">
              <i className="material-icons-round text-primary align-middle mr-1">
                favorite
              </i>
              <span className="font-medium">{paragraph}</span>
            </p>
          ) : (
            <p key={index} className="text-gray-600 font-light leading-relaxed">
              {paragraph}
            </p>
          )
        ))}
      </div>
    </div>
  );
};

export default ContentSection;