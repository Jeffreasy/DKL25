export type TextAlignType = 'left' | 'center' | 'right';
export type FontWeightType = 'normal' | 'bold' | 'semibold';

export interface TextStyling {
  fontSize: string;
  fontWeight: FontWeightType;
  textAlign: TextAlignType;
  color: string;
  lineHeight: string;
  letterSpacing: string;
} 