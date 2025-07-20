export interface SocialPost {
  id: string;
  username: string;
  handle: string;
  platform: 'twitter' | 'instagram' | 'facebook' | 'tiktok';
  content: string;
  hashtags: string[];
  timestamp: string;
  likes: number;
  shares: number;
  verified: boolean;
  profileImage: string;
}

export const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    username: 'Marvel Studios',
    handle: '@MarvelStudios',
    platform: 'twitter',
    content: 'The multiverse is expanding! Get ready for the next chapter in the MCU. 🚀',
    hashtags: ['#MCU', '#Marvel', '#Multiverse'],
    timestamp: '2025-07-21T10:30:00Z',
    likes: 45230,
    shares: 12450,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '2',
    username: 'BBC World',
    handle: '@BBCWorld',
    platform: 'twitter',
    content: 'Breaking: Scientists discover new method for sustainable energy production that could revolutionize the industry.',
    hashtags: ['#NewsToday', '#Science', '#SustainableEnergy'],
    timestamp: '2025-07-21T09:15:00Z',
    likes: 23500,
    shares: 8900,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '3',
    username: 'Warner Bros',
    handle: '@warnerbros',
    platform: 'instagram',
    content: 'Behind the scenes of our latest blockbuster! The magic happens here ✨',
    hashtags: ['#BarbieMovie', '#BehindTheScenes', '#MovieMagic'],
    timestamp: '2025-07-21T08:45:00Z',
    likes: 78900,
    shares: 15600,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '4',
    username: 'TechCrunch',
    handle: '@TechCrunch',
    platform: 'twitter',
    content: 'AI breakthrough: New model achieves human-level performance in creative writing tasks.',
    hashtags: ['#AI', '#Technology', '#NewsToday'],
    timestamp: '2025-07-21T07:20:00Z',
    likes: 34200,
    shares: 9800,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '5',
    username: 'Netflix',
    handle: '@netflix',
    platform: 'instagram',
    content: 'Your weekend binge-watch list is here! What are you watching first? 🍿',
    hashtags: ['#Netflix', '#MovieNight', '#BingeWatch'],
    timestamp: '2025-07-21T06:00:00Z',
    likes: 92300,
    shares: 23400,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '6',
    username: 'Disney',
    handle: '@Disney',
    platform: 'facebook',
    content: 'Magic is in the air! Experience the wonder of Disney like never before. ✨🏰',
    hashtags: ['#Disney', '#Magic', '#MovieMagic'],
    timestamp: '2025-07-21T05:30:00Z',
    likes: 156700,
    shares: 34500,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '7',
    username: 'CNN Breaking',
    handle: '@CNNBrk',
    platform: 'twitter',
    content: 'BREAKING: International climate summit reaches historic agreement on emission reductions.',
    hashtags: ['#NewsToday', '#Climate', '#BreakingNews'],
    timestamp: '2025-07-21T04:15:00Z',
    likes: 67800,
    shares: 28900,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '8',
    username: 'Sony Pictures',
    handle: '@SonyPictures',
    platform: 'instagram',
    content: 'The future of cinema is here. Get ready for an unforgettable experience! 🎬',
    hashtags: ['#SonyPictures', '#Cinema', '#BarbieMovie'],
    timestamp: '2025-07-21T03:45:00Z',
    likes: 43200,
    shares: 11200,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '9',
    username: 'The Verge',
    handle: '@verge',
    platform: 'twitter',
    content: 'The latest smartphone features that will change how we interact with technology.',
    hashtags: ['#Technology', '#Smartphones', '#Innovation'],
    timestamp: '2025-07-21T02:30:00Z',
    likes: 29100,
    shares: 7300,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  },
  {
    id: '10',
    username: 'Universal Pictures',
    handle: '@UniversalPics',
    platform: 'tiktok',
    content: 'When the plot twist hits different 😱 Which movie surprised you the most?',
    hashtags: ['#Movies', '#PlotTwist', '#MovieMagic'],
    timestamp: '2025-07-21T01:15:00Z',
    likes: 234500,
    shares: 45600,
    verified: true,
    profileImage: '/placeholder-movie.svg'
  }
];

export const popularHashtags = [
  '#NewsToday',
  '#BarbieMovie', 
  '#MovieMagic',
  '#MCU',
  '#Technology',
  '#AI',
  '#Climate',
  '#Disney',
  '#Netflix',
  '#Innovation'
];

export const featuredProfiles = [
  '@MarvelStudios',
  '@BBCWorld',
  '@warnerbros',
  '@netflix',
  '@Disney',
  '@CNNBrk',
  '@SonyPictures',
  '@verge',
  '@UniversalPics',
  '@TechCrunch'
];
