import React, { useState, useEffect } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { loadInstagramEmbed } from '@/utils/socialScripts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import { TextStyling, TextAlignType, FontWeightType } from '@/types/shared';

type TitleSectionRow = Database['public']['Tables']['title_sections']['Row'];
type SocialEmbedRow = Database['public']['Tables']['social_embeds']['Row'];

interface EventDetail {
  icon: string;
  title: string;
  description: string;
}

const iconMap = {
  calendar: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
  users: <PeopleIcon sx={{ fontSize: 40 }} />,
  medal: <EmojiEventsIcon sx={{ fontSize: 40 }} />
};

const EventDetailCard: React.FC<EventDetail> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
    <div className="flex flex-col items-center text-center gap-3">
      <div className="text-primary mb-2 transform hover:scale-110 transition-transform">
        {iconMap[icon as keyof typeof iconMap]}
      </div>
      <h3 className="text-gray-900 font-semibold text-xl">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

interface TitleSectionProps {
  onInschrijfClick: () => void;
}

interface EditableEventCardProps extends EventDetail {
  isEditing: boolean;
  onChange: (updates: EventDetail) => void;
}

const EditableEventCard: React.FC<EditableEventCardProps> = ({ 
  icon, 
  title, 
  description, 
  isEditing, 
  onChange 
}) => {
  if (!isEditing) {
    return <EventDetailCard icon={icon} title={title} description={description} />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="text-primary mb-2">
          {iconMap[icon as keyof typeof iconMap]}
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ icon, title: e.target.value, description })}
          className="text-gray-900 font-semibold text-base bg-gray-50 px-2 py-1 rounded w-full"
        />
        <textarea
          value={description}
          onChange={(e) => onChange({ icon, title, description: e.target.value })}
          className="text-gray-600 text-sm bg-gray-50 px-2 py-1 rounded w-full"
          rows={3}
        />
      </div>
    </div>
  );
};

interface CustomEditorProps {
  value: string;
  onChange: (newValue: string, styling: TextStyling) => void;
  isEditing: boolean;
  className?: string;
  initialStyling?: TextStyling;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  value,
  onChange,
  isEditing,
  className,
  initialStyling
}) => {
  const defaultStyling: TextStyling = {
    fontSize: '16px',
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#000000',
    lineHeight: '1.5',
    letterSpacing: '0px'
  };

  // Eerst de state declaraties
  const [fontSize, setFontSize] = useState(initialStyling?.fontSize || defaultStyling.fontSize);
  const [fontWeight, setFontWeight] = useState<FontWeightType>(initialStyling?.fontWeight || defaultStyling.fontWeight);
  const [textAlign, setTextAlign] = useState<TextAlignType>(initialStyling?.textAlign || defaultStyling.textAlign);
  const [color, setColor] = useState(initialStyling?.color || defaultStyling.color);
  const [lineHeight, setLineHeight] = useState(initialStyling?.lineHeight || defaultStyling.lineHeight);
  const [letterSpacing, setLetterSpacing] = useState(initialStyling?.letterSpacing || defaultStyling.letterSpacing);

  // Dan de useEffect hooks
  useEffect(() => {
    console.log('CustomEditor mounted with initialStyling:', initialStyling);
  }, []);

  useEffect(() => {
    console.log('Current styling state:', {
      fontSize,
      fontWeight,
      textAlign,
      color,
      lineHeight,
      letterSpacing
    });
  }, [fontSize, fontWeight, textAlign, color, lineHeight, letterSpacing]);

  // Update styling wanneer initialStyling verandert
  useEffect(() => {
    if (initialStyling) {
      setFontSize(initialStyling.fontSize);
      setFontWeight(initialStyling.fontWeight);
      setTextAlign(initialStyling.textAlign);
      setColor(initialStyling.color);
      setLineHeight(initialStyling.lineHeight);
      setLetterSpacing(initialStyling.letterSpacing);
    }
  }, [initialStyling]);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontSize = e.target.value;
    setFontSize(newFontSize);
    onChange(value, {
      fontSize: newFontSize,
      fontWeight,
      textAlign,
      color,
      lineHeight,
      letterSpacing
    });
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontWeight = e.target.value as FontWeightType;
    setFontWeight(newFontWeight);
    onChange(value, {
      fontSize,
      fontWeight: newFontWeight,
      textAlign,
      color,
      lineHeight,
      letterSpacing
    });
  };

  const handleTextAlignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTextAlign = e.target.value as TextAlignType;
    setTextAlign(newTextAlign);
    onChange(value, {
      fontSize,
      fontWeight,
      textAlign: newTextAlign,
      color,
      lineHeight,
      letterSpacing
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(value, {
      fontSize,
      fontWeight,
      textAlign,
      color: newColor,
      lineHeight,
      letterSpacing
    });
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLineHeight = e.target.value;
    setLineHeight(newLineHeight);
    onChange(value, {
      fontSize,
      fontWeight,
      textAlign,
      color,
      lineHeight: newLineHeight,
      letterSpacing
    });
  };

  const handleLetterSpacingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLetterSpacing = e.target.value;
    setLetterSpacing(newLetterSpacing);
    onChange(value, {
      fontSize,
      fontWeight,
      textAlign,
      color,
      lineHeight,
      letterSpacing: newLetterSpacing
    });
  };

  if (!isEditing) {
    return (
      <div 
        className={className}
        style={{
          fontSize: initialStyling?.fontSize || defaultStyling.fontSize,
          fontWeight: initialStyling?.fontWeight || defaultStyling.fontWeight,
          textAlign: initialStyling?.textAlign || defaultStyling.textAlign,
          color: initialStyling?.color || defaultStyling.color,
          lineHeight: initialStyling?.lineHeight || defaultStyling.lineHeight,
          letterSpacing: initialStyling?.letterSpacing || defaultStyling.letterSpacing
        }}
      >
        {value}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center gap-2 p-1 bg-gray-700 rounded">
          <span className="text-xs text-gray-200 font-medium">Grootte:</span>
          <select 
            value={fontSize}
            onChange={handleFontSizeChange}
            className="px-2 py-1 rounded border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
          >
            {['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-700 rounded">
          <span className="text-xs text-gray-200 font-medium">Dikte:</span>
          <select
            value={fontWeight}
            onChange={handleFontWeightChange}
            className="px-2 py-1 rounded border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
          >
            <option value="normal">Normal</option>
            <option value="semibold">Semi Bold</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-700 rounded">
          <span className="text-xs text-gray-200 font-medium">Uitlijning:</span>
          <select
            value={textAlign}
            onChange={handleTextAlignChange}
            className="px-2 py-1 rounded border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
          >
            <option value="left">Links</option>
            <option value="center">Midden</option>
            <option value="right">Rechts</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-700 rounded">
          <span className="text-xs text-gray-200 font-medium">Regelhoogte:</span>
          <select
            value={lineHeight}
            onChange={handleLineHeightChange}
            className="px-2 py-1 rounded border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
          >
            {['1', '1.25', '1.5', '1.75', '2'].map(size => (
              <option key={size} value={size}>{size}x</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-700 rounded">
          <span className="text-xs text-gray-200 font-medium">Letterafstand:</span>
          <select
            value={letterSpacing}
            onChange={handleLetterSpacingChange}
            className="px-2 py-1 rounded border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
          >
            {['-2px', '-1px', '0px', '1px', '2px', '4px'].map(spacing => (
              <option key={spacing} value={spacing}>Spacing {spacing}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-700 rounded">
          <span className="text-xs text-gray-200 font-medium">Kleur:</span>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-8 h-8 rounded cursor-pointer border border-gray-600 hover:border-gray-500"
            title="Tekstkleur"
          />
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value, {
          fontSize,
          fontWeight,
          textAlign,
          color,
          lineHeight,
          letterSpacing
        })}
        className={`${className} p-2 rounded-lg min-h-[100px] bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200`}
        style={{
          fontSize,
          fontWeight,
          textAlign,
          color,
          lineHeight,
          letterSpacing,
        }}
      />
    </div>
  );
};

type StyleableField = 'title' | 'subtitle' | 'cta_text';

const TitleSection: React.FC<TitleSectionProps> = ({ onInschrijfClick }) => {
  const [data, setData] = useState<TitleSectionRow | null>(null);
  const [editData, setEditData] = useState<TitleSectionRow | null>(null);
  const [socialEmbeds, setSocialEmbeds] = useState<SocialEmbedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [titleResponse, embedsResponse] = await Promise.all([
        supabase.from('title_sections').select('*').single(),
        supabase.from('social_embeds').select('*')
      ]);

      if (titleResponse.error) {
        console.error('Error fetching title section:', titleResponse.error);
      } else {
        setData(titleResponse.data);
      }

      if (embedsResponse.error) {
        console.error('Error fetching social embeds:', embedsResponse.error);
      } else {
        setSocialEmbeds(embedsResponse.data || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (socialEmbeds.length > 0) {
      loadInstagramEmbed();
    }
  }, [socialEmbeds]);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return;
    }

    setIsAdmin(data !== null);
  };

  const handleStartEditing = () => {
    setEditData({
      ...data!,
      styling: {
        title: {
          fontSize: data?.styling?.title?.fontSize || '16px',
          fontWeight: data?.styling?.title?.fontWeight || 'normal',
          textAlign: data?.styling?.title?.textAlign || 'left',
          color: data?.styling?.title?.color || '#000000',
          lineHeight: data?.styling?.title?.lineHeight || '1.5',
          letterSpacing: data?.styling?.title?.letterSpacing || '0px'
        },
        subtitle: {
          fontSize: data?.styling?.subtitle?.fontSize || '16px',
          fontWeight: data?.styling?.subtitle?.fontWeight || 'normal',
          textAlign: data?.styling?.subtitle?.textAlign || 'left',
          color: data?.styling?.subtitle?.color || '#000000',
          lineHeight: data?.styling?.subtitle?.lineHeight || '1.5',
          letterSpacing: data?.styling?.subtitle?.letterSpacing || '0px'
        },
        cta_text: {
          fontSize: data?.styling?.cta_text?.fontSize || '16px',
          fontWeight: data?.styling?.cta_text?.fontWeight || 'normal',
          textAlign: data?.styling?.cta_text?.textAlign || 'left',
          color: data?.styling?.cta_text?.color || '#000000',
          lineHeight: data?.styling?.cta_text?.lineHeight || '1.5',
          letterSpacing: data?.styling?.cta_text?.letterSpacing || '0px'
        }
      }
    });
    setIsEditing(true);

    console.log('Starting edit with data:', {
      original: data,
      editCopy: {
        ...data!,
        styling: {
          title: { /* ... */ },
          subtitle: { /* ... */ },
          cta_text: { /* ... */ }
        }
      }
    });
  };

  const handleCancelEditing = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleSaveAll = async () => {
    if (!editData || !data) return;
    setIsSaving(true);

    try {
      // Maak een diepe kopie van de data
      const updateData = {
        ...editData,
        styling: JSON.parse(JSON.stringify(editData.styling)) // Diepe kopie van styling
      };

      console.log('Saving with styling:', updateData.styling);

      const { error: updateError } = await supabase
        .from('title_sections')
        .update(updateData)
        .eq('id', data.id);

      if (updateError) throw updateError;

      // Haal de nieuwe data op
      const { data: refreshedData, error: fetchError } = await supabase
        .from('title_sections')
        .select('*')
        .eq('id', data.id)
        .single();

      if (fetchError) throw fetchError;

      console.log('Saved data:', refreshedData);
      
      // Update de lokale state met de nieuwe data
      setData(refreshedData);
      setEditData(null);
      setIsEditing(false);
      toast.success('Wijzigingen opgeslagen');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Er ging iets mis bij het opslaan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: StyleableField, value: string, styling?: TextStyling) => {
    if (!editData) return;

    console.log(`Updating ${field} with styling:`, styling);

    const updatedStyling = {
      ...editData.styling,
      [field]: styling ? { ...styling } : editData.styling?.[field]
    };

    const updatedData = {
      ...editData,
      [field]: value,
      styling: updatedStyling
    };

    console.log('Updated data:', updatedData);
    setEditData(updatedData);
  };

  const handleEventDetailChange = (index: number, updates: EventDetail) => {
    if (!editData) return;
    const newDetails = [...editData.event_details];
    newDetails[index] = updates;
    setEditData({ ...editData, event_details: newDetails });
  };

  if (isLoading) {
    return (
      <div className="py-16 px-5 bg-white font-heading text-center">
        <div className="animate-pulse-slow">
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  console.log('Current data styling:', data?.styling);
  console.log('Current editData styling:', editData?.styling);

  return (
    <section className="relative w-full bg-gradient-to-b from-[#ff9328]/40 to-[#ff9328]/50 py-8 text-center font-heading overflow-hidden isolate">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEditing}
                className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white text-gray-600"
                title="Annuleren"
              >
                <CloseIcon />
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-primary p-2 rounded-full shadow-md hover:bg-primary-dark text-white disabled:opacity-50"
                title="Opslaan"
              >
                <SaveIcon />
              </button>
            </>
          ) : (
            <button
              onClick={handleStartEditing}
              className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              title="Bewerken"
            >
              <EditIcon />
            </button>
          )}
        </div>
      )}

      <div className="max-w-[900px] mx-auto px-8 py-12 relative z-10">
        <div className="relative rounded-2xl p-8">
          <div className="flex flex-col gap-4">
            <CustomEditor
              value={editData?.title || data?.title || ''}
              onChange={(value, styling) => handleFieldChange('title', value, styling)}
              isEditing={isEditing}
              className="font-heading"
              initialStyling={data?.styling?.title}
            />
            <CustomEditor
              value={editData?.subtitle || data?.subtitle || ''}
              onChange={(value, styling) => handleFieldChange('subtitle', value, styling)}
              isEditing={isEditing}
              className="font-heading"
              initialStyling={data?.styling?.subtitle}
            />
            <CustomEditor
              value={editData?.cta_text || data?.cta_text || ''}
              onChange={(value, styling) => handleFieldChange('cta_text', value, styling)}
              isEditing={isEditing}
              className="font-heading text-primary"
              initialStyling={data?.styling?.cta_text}
            />
          </div>

          {/* Video */}
          <div className="mt-8 max-w-[600px] mx-auto">
            <div className="rounded-xl">
              <div className="relative w-full aspect-video rounded-lg shadow-lg overflow-hidden">
                <iframe
                  src="https://streamable.com/e/opjpma"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  allow="autoplay"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="De Koninklijke Loop promotievideo"
                />
              </div>
            </div>
          </div>

          {/* Event Details Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {(editData?.event_details || data?.event_details).map((detail, index) => (
              <EditableEventCard
                key={index}
                {...detail}
                isEditing={isEditing}
                onChange={(updates) => handleEventDetailChange(index, updates)}
              />
            ))}
          </div>

          {/* Inschrijf Button */}
          <div className="mt-12">
            <button
              onClick={onInschrijfClick}
              className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3 mx-auto"
            >
              <span>Schrijf je nu in</span>
              <ArrowForwardIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mt-8 mb-8 w-full h-[3px] bg-gradient-to-r from-primary to-primary-light" />

      <div className="max-w-[900px] mx-auto px-4 py-6 relative">
        {/* Social Media Section Title */}
        <div className="mb-8 text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-gray-900 font-bold tracking-tight mb-2">
            Laatste Nieuws
          </h2>
          <p className="text-[clamp(1.25rem,3vw,1.5rem)] text-gray-600">
            Bekijk op onze social media
          </p>
        </div>

        {/* Social Embeds */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
          {socialEmbeds.map((embed) => (
            <div 
              key={embed.id}
              className="w-full flex justify-center"
            >
              <div 
                dangerouslySetInnerHTML={{ __html: embed.embed_code }}
                className="w-full max-w-[500px] bg-white rounded-lg shadow-md overflow-hidden"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TitleSection; 