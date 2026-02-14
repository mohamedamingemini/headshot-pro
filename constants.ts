
import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Grey',
    name_ar: 'رمادي للشركات',
    description: 'Classic professional look with a neutral grey backdrop.',
    description_ar: 'مظهر احترافي كلاسيكي مع خلفية رمادية محايدة.',
    promptModifier: 'Professional corporate headshot, neutral grey studio background, business attire, soft studio lighting, confident expression',
    thumbnail: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    name_ar: 'الجناح التنفيذي',
    description: 'Authoritative look with a blurred office or bookshelf background.',
    description_ar: 'مظهر سلطوي مع خلفية مكتب مموهة أو رف كتب.',
    promptModifier: 'Executive professional headshot, blurred boardroom or bookshelf background, high-end business suit, authoritative yet approachable lighting',
    thumbnail: 'https://picsum.photos/id/1073/200/200'
  },
  {
    id: 'tech-office',
    name: 'Modern Tech',
    name_ar: 'تقني حديث',
    description: 'Casual yet professional vibe in a modern open office.',
    description_ar: 'طابع عفوي واحترافي في مكتب مفتوح حديث.',
    promptModifier: 'Modern tech company headshot, blurred open office background with glass and plants, smart casual attire, bright natural lighting',
    thumbnail: 'https://picsum.photos/id/4/200/200'
  },
  {
    id: 'medical',
    name: 'Medical/Health',
    name_ar: 'طبي/صحي',
    description: 'Clean, trustworthy look with bright clinical lighting.',
    description_ar: 'مظهر نظيف وجدير بالثقة مع إضاءة سريرية ساطعة.',
    promptModifier: 'Medical professional headshot, doctor or healthcare, clean white clinical background, white coat or scrubs, soft bright trust-inspiring lighting',
    thumbnail: 'https://picsum.photos/id/1060/200/200'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    name_ar: 'عقارات',
    description: 'Inviting and polished with a luxury interior background.',
    description_ar: 'جذاب ومصقول مع خلفية داخلية فاخرة.',
    promptModifier: 'Real estate agent headshot, blurred luxury home interior background, sharp suit, warm inviting smile, bright airy lighting',
    thumbnail: 'https://picsum.photos/id/1029/200/200'
  },
  {
    id: 'outdoor',
    name: 'Natural Outdoor',
    name_ar: 'طبيعي خارجي',
    description: 'Warm, approachable look with natural sunlight.',
    description_ar: 'مظهر دافئ وودود مع ضوء الشمس الطبيعي.',
    promptModifier: 'Outdoor professional headshot, bokeh park or city background, golden hour lighting, approachable and warm expression',
    thumbnail: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: 'academic',
    name: 'Academic',
    name_ar: 'أكاديمي',
    description: 'Intellectual vibe with library or university backdrop.',
    description_ar: 'طابع فكري مع خلفية مكتبة أو جامعة.',
    promptModifier: 'Academic professor headshot, library background with books out of focus, tweed jacket or smart attire, warm intellectual lighting',
    thumbnail: 'https://picsum.photos/id/24/200/200'
  },
  {
    id: 'studio-dark',
    name: 'Studio Dark',
    name_ar: 'ستوديو داكن',
    description: 'Dramatic and sophisticated with a dark background.',
    description_ar: 'درامي ومتطور مع خلفية داكنة.',
    promptModifier: 'High-end studio headshot, black or dark textured background, dramatic rim lighting, elegant business attire',
    thumbnail: 'https://picsum.photos/id/65/200/200'
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    name_ar: 'ستوديو إبداعي',
    description: 'Vibrant and artistic for creative professionals.',
    description_ar: 'نابض بالحياة وفني للمبدعين المحترفين.',
    promptModifier: 'Creative professional headshot, colorful artistic background, stylish attire, expressive lighting',
    thumbnail: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: 'minimalist',
    name: 'Clean Minimalist',
    name_ar: 'بسيط ونظيف',
    description: 'Pure white background, high-key lighting.',
    description_ar: 'خلفية بيضاء نقية، إضاءة ساطعة.',
    promptModifier: 'Minimalist professional headshot, pure white background, high-key lighting, clean and sharp focus',
    thumbnail: 'https://picsum.photos/id/103/200/200'
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    name_ar: 'فيلم عتيق',
    description: 'Nostalgic film grain texture with warm tones.',
    description_ar: 'ملمس محبب للفيلم بالحنين مع نغمات دافئة.',
    promptModifier: 'Vintage film photography headshot, warm kodak portra color palette, grain texture, nostalgic atmosphere, classic attire',
    thumbnail: 'https://picsum.photos/id/435/200/200'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    name_ar: 'سايبر بانك نيون',
    description: 'Futuristic look with neon lighting accents.',
    description_ar: 'مظهر مستقبلي مع إضاءة نيون.',
    promptModifier: 'Futuristic cyberpunk headshot, neon blue and pink lighting, dark futuristic background, sharp focus, high contrast',
    thumbnail: 'https://picsum.photos/id/532/200/200'
  },
  {
    id: 'soft-portrait',
    name: 'Soft Portrait',
    name_ar: 'بورتريه ناعم',
    description: 'Dreamy, ethereal look with soft focus.',
    description_ar: 'مظهر حالم وأثيري مع تركيز ناعم.',
    promptModifier: 'Soft focus portrait headshot, ethereal lighting, dreamy pastel background, gentle expression, diffused light',
    thumbnail: 'https://picsum.photos/id/342/200/200'
  }
];
