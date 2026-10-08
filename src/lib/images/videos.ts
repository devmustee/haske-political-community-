export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId?: string;
  url?: string;
  thumbnail: string;
  duration?: string;
  date: string;
  category: "awards" | "leadership" | "humanitarian" | "sports";
  source: string;
}

export interface PressItem {
  title: string;
  outlet: string;
  date: string;
  url: string;
  snippet: string;
}

export const VIDEO_LIBRARY: VideoItem[] = [
  {
    id: "aha-accra-2026",
    title: "African Heritage Awards 2026: Distinguished African Humanitarian Award",
    description:
      "Abdulrahman Bashir Haske honored at the African Heritage Awards gala in Accra, Ghana, recognizing human-centered interventions via the AB Haske Foundation.",
    thumbnail: "/images/abdulrahman/awards/aha-ghana-haske-receiving-award.jpg",
    duration: "Documentary",
    date: "April 2026",
    category: "awards",
    source: "African Heritage Awards / Media Archive",
  },
  {
    id: "yola-declaration-2026",
    title: "2027 Adamawa Gubernatorial Declaration: Ribadu Square, Yola",
    description:
      "Formal declaration address delivered before assembled community leaders, youth coalitions, and citizens at Mahmud Ribadu Square, Yola.",
    thumbnail: "/images/abdulrahman/politics/haske-declaration-podium-yola.jpeg",
    duration: "Civic Address",
    date: "April 2026",
    category: "leadership",
    source: "Adamawa Civic Press / Premium Times",
  },
  {
    id: "haske-foundation-ramadan-2026",
    title: "AB Haske Foundation: Statewide Food & Grain Distribution",
    description:
      "Documenting large-scale palliative distribution and humanitarian support provided to vulnerable families across all 21 local governments of Adamawa State.",
    thumbnail: "/images/abdulrahman/foundation/ab-haske-foundation-ramadan-relief.png",
    duration: "Field Report",
    date: "February 2026",
    category: "humanitarian",
    source: "Pioneer News / Foundation Field Media",
  },
  {
    id: "yola-polo-tournament-2026",
    title: "Yola International Polo Tournament: Lamido Musdafa Ground",
    description:
      "Match highlights and executive remarks by Yola Polo Club President and Haske & Williams patron Abdulrahman Bashir Haske.",
    thumbnail: "/images/abdulrahman/polo/yola-polo-tournament-matchplay.webp",
    duration: "Tournament Feature",
    date: "August 2026",
    category: "sports",
    source: "The Nation / Equestrian Sports Digest",
  },
];

export const PRESS_COVERAGE: PressItem[] = [
  {
    title: "Abdulrahman Haske, Adesina, Walson-Jack, Others Bag African Heritage Awards",
    outlet: "BusinessDay Nigeria",
    date: "April 14, 2026",
    url: "https://businessday.ng/life/article/abdulrahman-haske-adesina-walson-jack-others-bag-african-heritage-awards/",
    snippet:
      "Adamawa philanthropist and business leader honored with the Distinguished African Humanitarian Award in Accra, Ghana.",
  },
  {
    title: "Yola Agog As Abdulrahman Haske Declares for Adamawa Governorship Race",
    outlet: "Premium Times",
    date: "April 26, 2026",
    url: "https://www.premiumtimesng.com/promoted/874756-yola-agog-as-abdulrahman-haske-finally-declares-for-adamawa-governorship-race.html",
    snippet:
      "Massive turnout as thousands gather at Mahmud Ribadu Square for official declaration anchored on economic self-reliance.",
  },
  {
    title: "Haske Pledges Exciting 2026 Yola International Polo Tournament",
    outlet: "The Nation Newspaper",
    date: "August 21, 2026",
    url: "https://thenationonlineng.net/haske-pledges-exciting-2026-yola-international-polo-tournament/",
    snippet:
      "Yola Polo Club President highlights regional sports development, equestrian tradition, and cultural unity in Adamawa.",
  },
  {
    title: "Major Upset In Adamawa Politics As Haske Emerges APM Guber Candidate",
    outlet: "The Whistler Newspaper",
    date: "September 2026",
    url: "https://thewhistler.ng/major-upset-in-adamawa-politics-as-haske-emerges-apm-guber-candidate/",
    snippet:
      "Dynamic young entrepreneur emerges as Allied Peoples Movement standard-bearer ahead of 2027 gubernatorial contest.",
  },
];

export function getPublishedVideos(): VideoItem[] {
  return VIDEO_LIBRARY;
}
