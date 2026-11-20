export type GalleryCategory = 'all' | 'pool' | 'cabana' | 'brochure';

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: Exclude<GalleryCategory, 'all'>;
  src: string;
  alt: string;
  aspectClass: string;
  objectPosition?: string;
}

export interface VillaSpace {
  id: string;
  index: string;
  name: string;
  summary: string;
  description: string;
  details: string[];
  imageSrc: string;
  imageAlt: string;
  specLabel: string;
}

export interface CelebrationPackage {
  id: 'birthday' | 'anniversary' | 'private-party' | 'special-occasion';
  title: string;
  shortLabel: string;
  tagline: string;
  description: string;
  highlights: string[];
  recommendedSpace: string;
  imageSrc: string;
  imageAlt: string;
}

export const VILLA_INFO = {
  name: 'Vatsya Villa',
  city: 'Indore',
  region: 'Indore, Madhya Pradesh',
  tagline: 'Your Private Stay... for Ultimate Happiness',
  closingLine: 'Make Your Special Moments Unforgettable with Vatsya Villa.',
  summary:
    'Experience luxury, comfort, and joy at our 2 BHK private villa — an enclosed 5,000 sq. ft. sanctuary with a private 17 × 11 ft swimming pool, thatched poolside cabanas, and lush green lawn.',
  checkInTime: '3:00 PM',
  checkOutTime: '12:00 PM (Next Day)',
  totalArea: '5,000 Sq. Ft.',
  poolSize: '17 × 11 Feet',
  configuration: '2 BHK Fully AC',
  videoTourSrc: '/assets/aistudio/VID-20261120-WA0022_932c86f1.mp4',
  brochureSrc: '/assets/aistudio/IMG-20261120-WA0020_dc9ccc05.jpg',
};

export const HERO_SPECS = [
  {
    value: '5,000 Sq. Ft.',
    label: 'Total Property Area',
    detail: 'Fully walled private compound',
  },
  {
    value: '17 × 11 Feet',
    label: 'Private Swimming Pool',
    detail: 'Curved steps & warm night lighting',
  },
  {
    value: '2 BHK Fully AC',
    label: 'Air-Conditioned Villa',
    detail: 'Lounge, bedrooms & equipped kitchen',
  },
  {
    value: '3:00 PM – 12:00 PM',
    label: 'Check-In to Next Day',
    detail: '21-hour exclusive estate stay',
  },
] as const;

export const PROPERTY_HIGHLIGHTS = [
  {
    number: '01',
    title: '2 BHK Fully Air-Conditioned Property',
    detail:
      'Cool, quiet interiors with two comfortable bedrooms, plush royal-blue lounge seating, Smart TV, and botanical wall finishes.',
  },
  {
    number: '02',
    title: 'Private Swimming Pool (17 × 11 Feet)',
    detail:
      'Step down curved submerged steps into crystal-clear turquoise water lined with warm ambient LED deck illumination.',
  },
  {
    number: '03',
    title: 'Total Property Area: 5,000 Sq. Ft.',
    detail:
      'Spacious high-walled private grounds so your family and friends celebrate and unwind without interruption.',
  },
  {
    number: '04',
    title: 'Beautiful Garden Area',
    detail:
      'Manicured green lawn bordered by tropical palms, potted blooms, an outdoor swing, and softly lit perimeter trees.',
  },
  {
    number: '05',
    title: 'Fully Equipped Kitchen Area',
    detail:
      'Practical kitchen setup with refrigerator and essentials ready for home-style meals, midnight snacks, or party catering.',
  },
  {
    number: '06',
    title: 'Comfortable Dining Area',
    detail:
      'Dine indoors or under the thatched palm cabana draped in warm saffron curtains and glowing woven bamboo lanterns.',
  },
  {
    number: '07',
    title: 'All Essential Amenities',
    detail:
      'Poolside party speaker, Smart TV, full air conditioning, outdoor lounge seating, and dedicated hospitality assistance.',
  },
] as const;

export const VILLA_SPACES: VillaSpace[] = [
  {
    id: 'pool-cabanas',
    index: '01',
    name: 'Private Pool & Thatched Cabanas',
    summary: 'The centerpiece of Vatsya Villa — sun-drenched by day, warmly illuminated after dusk.',
    description:
      'Unwind beside our 17 × 11 ft private swimming pool framed by lush banana palms and natural gravel walkways. Two rustic palm-thatched cabanas draped in warm ochre fabric create effortless shade for afternoon lounging and twilight conversations.',
    details: [
      '17 × 11 ft exclusive swimming pool with curved Roman entry steps',
      'Warm golden LED strip edging along the poolside lawn',
      'Handwoven bamboo pendant lanterns for evening ambiance',
      'Shaded cabana lounge sofa & poolside dining table',
    ],
    imageSrc: '/assets/aistudio/IMG-20261120-WA0015_34cc96a6.jpg',
    imageAlt: 'Guests relaxing with feet in the glowing emerald swimming pool at Vatsya Villa beneath the thatched roof',
    specLabel: '17 × 11 Ft. Pool',
  },
  {
    id: 'garden-dining',
    index: '02',
    name: 'Garden Lawn & Open-Air Dining',
    summary: '5,000 sq. ft. of open sky, manicured lawn, and breezy evening gatherings.',
    description:
      'Host relaxed dinners under draped golden canopies overlooking the pool and garden lawn. Perimeter accent lights glow softly through young trees at dusk, creating an intimate resort-like setting right in Indore.',
    details: [
      'Expansive green lawn ideal for evening setups and lawn games',
      'Covered outdoor dining table with direct pool views',
      'Outdoor swing (jhoola) and landscaped potted planters',
      'Private compound walls ensuring total seclusion for your group',
    ],
    imageSrc: '/assets/aistudio/IMG-20261120-WA0017_387815ed.jpg',
    imageAlt: 'Golden-hour view of Vatsya Villa thatched cabana with warm ochre curtains, bamboo lanterns, and dining table by the pool',
    specLabel: '5,000 Sq. Ft. Grounds',
  },
  {
    id: 'veranda-retreat',
    index: '03',
    name: 'Twilight Veranda & Ambient Lounge',
    summary: 'Designed for unhurried nights, music, and unbreakable group conversations.',
    description:
      'When evening settles over Indore, warm wicker pendant lights cast patterned shadows across the draped veranda. Bring out the Bluetooth party speaker, settle into the shaded cabana seating, and let the night unfold at your pace.',
    details: [
      'Wide sheltered veranda with uninterrupted pool & lawn sightlines',
      'Warm atmospheric wicker lantern lighting throughout the cabanas',
      'Dedicated music speaker setup for private gatherings',
      'Seamless indoor-outdoor flow into the air-conditioned living hall',
    ],
    imageSrc: '/assets/aistudio/IMG-20261120-WA0018_c5f28c0c.jpg',
    imageAlt: 'Wide angle view from inside the golden-draped cabana looking across the private swimming pool and garden lawn',
    specLabel: 'Private Evening Lounge',
  },
  {
    id: 'indoor-living',
    index: '04',
    name: '2 BHK Air-Conditioned Interiors & Kitchen',
    summary: 'Step inside from the pool to crisp air conditioning, velvet seating, and restful bedrooms.',
    description:
      'Inside the villa, a spacious air-conditioned living hall welcomes guests with deep royal-blue velvet sofas, wooden center table with ottomans, and a wall-mounted Smart TV. Two serene AC bedrooms and a fully equipped kitchen make overnight stays effortless.',
    details: [
      '2 fully air-conditioned bedrooms with comfortable king-size bedding',
      'Plush royal-blue velvet living room lounge with Smart TV',
      'Fully equipped kitchen with refrigerator and dining essentials',
      'All essential stay amenities curated for families and groups',
    ],
    imageSrc: '/assets/vatsya-pool-steps-wide.jpg',
    imageAlt: 'Upright view of the turquoise swimming pool with curved entry steps leading to the villa entrance and thatched cabana',
    specLabel: '2 BHK Fully AC',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'poolside-moments',
    title: 'Poolside Golden Hour',
    caption: 'Warm LED deck lighting, thatched palm eaves, and clear emerald water ready for relaxed afternoons.',
    category: 'pool',
    src: '/assets/aistudio/IMG-20261120-WA0015_34cc96a6.jpg',
    alt: 'Friends sitting together along the sunlit private swimming pool at Vatsya Villa',
    aspectClass: 'aspect-[4/5]',
    objectPosition: 'object-center',
  },
  {
    id: 'pool-steps-wide',
    title: '17 × 11 Ft. Private Swimming Pool',
    caption: 'Curved corner steps framed by lush banana leaves and tropical palms right outside the villa door.',
    category: 'pool',
    src: '/assets/vatsya-pool-steps-wide.jpg',
    alt: 'Wide daylight view of the 17 by 11 foot turquoise swimming pool with corner steps and thatched cabana',
    aspectClass: 'aspect-[16/10]',
    objectPosition: 'object-center',
  },
  {
    id: 'cabana-dining',
    title: 'Thatched Cabana & Outdoor Dining',
    caption: 'Saffron-draped dining pavilion with handwoven pendant lamps and lounge seating overlooking the water.',
    category: 'cabana',
    src: '/assets/aistudio/IMG-20261120-WA0017_387815ed.jpg',
    alt: 'Thatched palm cabana with saffron drapes, glowing wicker lamps, sofa, and dining set at golden hour',
    aspectClass: 'aspect-[4/5]',
    objectPosition: 'object-center',
  },
  {
    id: 'veranda-perspective',
    title: 'Estate Courtyard View',
    caption: 'Expansive 5,000 sq. ft. walled garden and pool vista from beneath the shaded cabana.',
    category: 'cabana',
    src: '/assets/aistudio/IMG-20261120-WA0018_c5f28c0c.jpg',
    alt: 'Wide view from under the golden cabana canopy showing the pool, gravel deck, and lush perimeter lawn',
    aspectClass: 'aspect-[4/3]',
    objectPosition: 'object-center',
  },
  {
    id: 'twilight-lantern',
    title: 'Evening Lantern Glow',
    caption: 'Handwoven bamboo lighting and softly illuminated garden trees set the mood for night celebrations.',
    category: 'cabana',
    src: '/assets/aistudio/IMG-20261120-WA0016_d045a678.jpg',
    alt: 'Warm woven bamboo lantern glowing above palm fronds and the tranquil turquoise pool at twilight',
    aspectClass: 'aspect-[4/5]',
    objectPosition: 'object-top',
  },
  {
    id: 'official-brochure',
    title: 'Official Vatsya Villa Brochure',
    caption: 'Complete property highlights, celebration services, and check-in/check-out schedule for Indore.',
    category: 'brochure',
    src: '/assets/aistudio/IMG-20261120-WA0020_dc9ccc05.jpg',
    alt: 'Official Vatsya Villa Indore brochure detailing 2 BHK AC villa, 17 by 11 ft pool, 5,000 sq. ft. area, celebration decor, and timings',
    aspectClass: 'aspect-[3/4]',
    objectPosition: 'object-top',
  },
];

export const CELEBRATION_PACKAGES: CelebrationPackage[] = [
  {
    id: 'birthday',
    title: 'Birthday Parties',
    shortLabel: 'Birthday Party',
    tagline: 'Poolside cakes, balloon backdrops, and late-night music under the stars.',
    description:
      'Turn another year into a full-day celebration. Our team arranges custom birthday backdrops, poolside fairy lights, cabana table styling, and open-air lounge zones across the 5,000 sq. ft. grounds.',
    highlights: [
      'Custom birthday backdrop & balloon styling under the main cabana',
      'Poolside cake table with warm lantern & LED lighting',
      'Music speaker setup & spacious lawn for group games',
      'Overnight 2 BHK AC stay for close friends and family',
    ],
    recommendedSpace: 'Poolside Cabana & Garden Lawn',
    imageSrc: '/assets/aistudio/IMG-20261120-WA0015_34cc96a6.jpg',
    imageAlt: 'Poolside gathering space at Vatsya Villa ideal for birthday celebrations',
  },
  {
    id: 'anniversary',
    title: 'Anniversary Celebrations',
    shortLabel: 'Anniversary',
    tagline: 'Candlelit poolside dining, floral accents, and complete privacy.',
    description:
      'Celebrate milestones in a serene, private setting away from crowded restaurants. Enjoy bespoke floral and warm-light decoration around the draped cabana, intimate dinner seating by the pool, and a tranquil overnight stay.',
    highlights: [
      'Romantic cabana drapery with warm ambient lantern & candle styling',
      'Dedicated poolside dinner table arrangement for couples or family',
      'Custom floral & anniversary message decoration on request',
      'Uninterrupted 21-hour private villa access (3:00 PM – 12:00 PM)',
    ],
    recommendedSpace: 'Draped Cabana & Twilight Pool Deck',
    imageSrc: '/assets/aistudio/IMG-20261120-WA0016_d045a678.jpg',
    imageAlt: 'Warm twilight lantern lighting overlooking the serene swimming pool for anniversary dinners',
  },
  {
    id: 'private-party',
    title: 'Private Parties',
    shortLabel: 'Private Party',
    tagline: 'Reunions, bachelor or bachelorette nights, and weekend getaways.',
    description:
      'With high compound walls, a 17 × 11 ft pool, indoor royal-blue velvet lounge, and outdoor cabanas, Vatsya Villa is built for effortless private parties where your group owns the entire space.',
    highlights: [
      'Exclusive 5,000 sq. ft. private compound with zero outside guests',
      'Pool deck + indoor AC living room with Smart TV & speaker',
      'Fully equipped kitchen ready for catering or group cooking',
      'Themed party lighting and custom celebration decoration available',
    ],
    recommendedSpace: 'Full 5,000 Sq. Ft. Estate & Pool Deck',
    imageSrc: '/assets/aistudio/IMG-20261120-WA0017_387815ed.jpg',
    imageAlt: 'Outdoor dining and lounge cabana overlooking the pool for private group parties',
  },
  {
    id: 'special-occasion',
    title: 'Special Occasions',
    shortLabel: 'Special Occasion',
    tagline: 'Proposals, bridal showers, baby showers, and intimate family milestones.',
    description:
      'Every milestone deserves a thoughtful backdrop. Tell us the occasion and preferred color palette, and we will coordinate custom floral, lighting, and seating decor across the garden and pool deck before your 3:00 PM arrival.',
    highlights: [
      'Tailored decor themes for proposals, showers, and family milestones',
      'Pre-arrival decoration setup ready by your 3:00 PM check-in',
      'Scenic golden-hour and evening photo corners across the villa',
      'Comfortable AC indoor rooms for elders and young children',
    ],
    recommendedSpace: 'Garden Lawn, Cabana & Indoor Lounge',
    imageSrc: '/assets/aistudio/IMG-20261120-WA0018_c5f28c0c.jpg',
    imageAlt: 'Wide courtyard and garden view at Vatsya Villa ready for custom celebration decor',
  },
];

export const VIDEO_CHAPTERS = [
  { time: '0:00', label: 'Private Pool & Courtyard' },
  { time: '0:04', label: 'Thatched Cabanas & Bamboo Lamps' },
  { time: '0:15', label: '5,000 Sq. Ft. Garden Lawn' },
  { time: '0:27', label: 'Royal Blue AC Living Lounge & Bedroom' },
] as const;
