// ====================================================================
// KudosBoard — Themes, Color Swatches, Stickers & Inspiration Prompts
// ====================================================================

export const THEMES = {
  corkboard: {
    id: 'corkboard',
    name: 'Classic Corkboard',
    subtitle: 'Warm pinboard with pushpins & handwritten notes',
    fontFamily: "'Caveat', cursive",
    fontHeading: "'Caveat', cursive",
    bgClass: 'bg-[#b88351]',
    bgPattern: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 100%), 
                radial-gradient(rgba(0,0,0,0.15) 15%, transparent 16%) 0 0, 
                radial-gradient(rgba(0,0,0,0.15) 15%, transparent 16%) 8px 8px`,
    bgSize: 'auto, 16px 16px',
    headerBadge: '📌 Corkboard Wall',
    cardClass: 'shadow-md border-amber-900/10 rounded-sm transition-transform duration-200',
    headerThemeClass: 'bg-amber-950/80 text-amber-50 backdrop-blur-md border-b border-amber-800/40',
    pushpin: true,
    accentColor: '#c99663',
    primaryButton: 'bg-amber-800 hover:bg-amber-900 text-white'
  },
  birthday: {
    id: 'birthday',
    name: 'Birthday Bash',
    subtitle: 'Pastel confetti gradient, rounded cards & balloons',
    fontFamily: "'Fredoka', sans-serif",
    fontHeading: "'Fredoka', sans-serif",
    bgClass: 'bg-gradient-to-br from-[#fff1f5] via-[#fef9c3] to-[#e0f2fe]',
    bgPattern: 'radial-gradient(circle, rgba(236,72,153,0.06) 10%, transparent 11%), radial-gradient(circle, rgba(59,130,246,0.06) 10%, transparent 11%) 16px 16px',
    bgSize: '32px 32px',
    headerBadge: '🎂 Birthday Party',
    cardClass: 'shadow-lg border-2 border-white/80 rounded-[22px] hover:-translate-y-1 transition-all duration-300',
    headerThemeClass: 'bg-white/80 text-pink-950 backdrop-blur-md border-b border-pink-200 shadow-sm',
    pushpin: false,
    accentColor: '#f43f5e',
    primaryButton: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200'
  },
  milestone: {
    id: 'milestone',
    name: 'Work Milestone',
    subtitle: 'Deep midnight navy with prestige gold accents',
    fontFamily: "'Playfair Display', serif",
    fontHeading: "'Playfair Display', serif",
    bgClass: 'bg-[#0b1120]',
    bgPattern: 'radial-gradient(ellipse at top, #1e293b 0%, #0b1120 70%)',
    headerBadge: '🏆 Milestone Gala',
    cardClass: 'shadow-xl border border-amber-400/30 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-amber-400/60',
    headerThemeClass: 'bg-slate-900/90 text-amber-100 backdrop-blur-md border-b border-amber-500/20 shadow-2xl',
    pushpin: false,
    accentColor: '#fbbf24',
    primaryButton: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold'
  },
  farewell: {
    id: 'farewell',
    name: 'Farewell & Good Luck',
    subtitle: 'Sunset amber peach tones with warm heartfelt style',
    fontFamily: "'Lora', serif",
    fontHeading: "'Lora', serif",
    bgClass: 'bg-gradient-to-br from-[#ffedd5] via-[#fef2f2] to-[#fecdd3]',
    bgPattern: 'radial-gradient(circle, rgba(249,115,22,0.05) 1px, transparent 1px)',
    bgSize: '20px 20px',
    headerBadge: '🌅 Farewell & Cheers',
    cardClass: 'shadow-md border border-orange-200/80 rounded-xl transition-all duration-200 hover:shadow-lg',
    headerThemeClass: 'bg-orange-950/80 text-orange-50 backdrop-blur-md border-b border-orange-700/30 shadow-md',
    pushpin: false,
    accentColor: '#ea580c',
    primaryButton: 'bg-orange-600 hover:bg-orange-700 text-white'
  },
  classroom: {
    id: 'classroom',
    name: 'Classroom / Teacher',
    subtitle: 'Chalkboard green with subtle grid lines & notebook cards',
    fontFamily: "'Patrick Hand', cursive",
    fontHeading: "'Patrick Hand', cursive",
    bgClass: 'bg-[#183327]',
    bgPattern: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
    bgSize: '24px 24px',
    headerBadge: '🍎 Classroom Wall',
    cardClass: 'shadow-lg border-t-4 border-t-rose-400 border-x border-b border-stone-200 rounded-md transition-all duration-200',
    headerThemeClass: 'bg-[#0f2119]/90 text-emerald-100 backdrop-blur-md border-b border-emerald-600/30 shadow-xl',
    pushpin: false,
    accentColor: '#10b981',
    primaryButton: 'bg-emerald-600 hover:bg-emerald-700 text-white'
  }
};

export const NOTE_COLORS = {
  lemon: {
    id: 'lemon',
    name: 'Lemon Cream',
    hex: '#fef9c3',
    border: '#fef08a',
    text: '#713f12',
    pin: '#eab308'
  },
  blush: {
    id: 'blush',
    name: 'Blush Rose',
    hex: '#ffe4e6',
    border: '#fecdd3',
    text: '#881337',
    pin: '#f43f5e'
  },
  sky: {
    id: 'sky',
    name: 'Sky Blue',
    hex: '#e0f2fe',
    border: '#bae6fd',
    text: '#0c4a6e',
    pin: '#0ea5e9'
  },
  mint: {
    id: 'mint',
    name: 'Fresh Mint',
    hex: '#dcfce7',
    border: '#bbf7d0',
    text: '#14532d',
    pin: '#22c55e'
  },
  lavender: {
    id: 'lavender',
    name: 'Soft Lavender',
    hex: '#f3e8ff',
    border: '#e9d5ff',
    text: '#581c87',
    pin: '#a855f7'
  },
  peach: {
    id: 'peach',
    name: 'Warm Peach',
    hex: '#ffedd5',
    border: '#fed7aa',
    text: '#7c2d12',
    pin: '#f97316'
  }
};

export const ACCENT_EMOJIS = ['🎉', '⭐', '💖', '🚀', '🏆', '🎂', '🎓', '🌟', '🍀', '🔥'];

export const ALLOWED_REACTIONS = ['❤️', '🎉', '👏', '😂', '🙌', '🔥'];

export const STICKERS = [
  { id: 'popper', name: 'Party Popper', emoji: '🎉', anim: 'animate-bounce' },
  { id: 'cake', name: 'Birthday Cake', emoji: '🎂', anim: 'animate-pulse' },
  { id: 'trophy', name: 'Champion Trophy', emoji: '🏆', anim: 'animate-bounce' },
  { id: 'rocket', name: 'Rocket Launch', emoji: '🚀', anim: 'animate-pulse' },
  { id: 'heart', name: 'Sparkling Heart', emoji: '💖', anim: 'animate-ping' },
  { id: 'star', name: 'Shining Star', emoji: '⭐', anim: 'animate-spin' },
  { id: 'applause', name: 'High Five / Claps', emoji: '👏', anim: 'animate-bounce' },
  { id: 'fire', name: 'On Fire!', emoji: '🔥', anim: 'animate-pulse' },
  { id: 'sparkles', name: 'Magic Sparkles', emoji: '✨', anim: 'animate-pulse' },
  { id: 'graduate', name: 'Graduation Cap', emoji: '🎓', anim: 'animate-bounce' }
];

export const INSPIRATION_PROMPTS = [
  "You've been such an incredible teammate and friend. Thank you for always bringing positive energy!",
  "Happy Birthday! May this year bring you endless laughter, joy, and grand adventures! 🎂",
  "Huge congratulations on reaching this monumental milestone! Your hard work and dedication truly inspire us all.",
  "We are going to miss you so much! Best of luck on your exciting new journey. Keep in touch!",
  "Thank you for being such an extraordinary mentor and teacher. You truly made a difference in my life.",
  "Working with you has been an absolute blast. Thank you for making every project smoother and brighter!",
  "Your leadership, calm under pressure, and brilliant solutions saved the day more times than we can count. Bravo! 👏",
  "To the one who always kept morale high and shared the best jokes—thank you for being you!",
  "Wishing you tremendous success, good health, and abundant happiness in all that comes next! 🚀",
  "You poured your heart and soul into this, and it shows. So incredibly proud of what you've achieved!"
];
