export interface Player {
  nickname: string;
  avatar: string;
  pin: string;
  joinTime: number;
  isAdmin: boolean;
  score?: number;
}

export interface QuizQuestion {
  section: string;
  sectionEmoji: string;
  question: string;
  answers: string[];
  timeLimit: number;
}

export interface QuizResult {
  label: string;
  emoji: string;
  description: string;
  solutions: string[];
}

export const AVATARS = [
  '😎', '🤓', '😃', '🥳', '🤠', '🥸', '😺', '🐶',
  '🦁', '🐼', '🦊', '🐯', '🦄', '🐸', '🐙', '🦖',
  '👽', '🤖', '👻', '🎃', '🌟', '⚡', '🔥', '💎',
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Section A — Daily Screen Habits
  {
    section: "Daily Screen Habits",
    sectionEmoji: "📱",
    question: "How many hours do you spend on your phone each day?",
    answers: ["Less than 2 hours", "2–4 hours", "4–6 hours", "More than 6 hours"],
    timeLimit: 15,
  },
  {
    section: "Daily Screen Habits",
    sectionEmoji: "📱",
    question: "Do you check your phone immediately after waking up?",
    answers: ["Never", "Sometimes", "Often", "Always"],
    timeLimit: 15,
  },
  {
    section: "Daily Screen Habits",
    sectionEmoji: "📱",
    question: "How often do you open social media without a clear reason?",
    answers: ["Rarely", "Sometimes", "Often", "Very often"],
    timeLimit: 15,
  },
  // Section B — Attention & Studying
  {
    section: "Attention & Studying",
    sectionEmoji: "📚",
    question: "Can you focus on studying for 20–30 minutes without checking your phone?",
    answers: ["Easily", "With some effort", "It is difficult", "I cannot do it"],
    timeLimit: 15,
  },
  {
    section: "Attention & Studying",
    sectionEmoji: "📚",
    question: "While studying, how often do you feel the urge to check your phone or switch tasks?",
    answers: ["Almost never", "Sometimes", "Often", "Very often"],
    timeLimit: 15,
  },
  {
    section: "Attention & Studying",
    sectionEmoji: "📚",
    question: "Do you multitask (study + scrolling + messages) at the same time?",
    answers: ["Never", "Occasionally", "Frequently", "Constantly"],
    timeLimit: 15,
  },
  // Section C — Content Consumption Style
  {
    section: "Content Consumption Style",
    sectionEmoji: "🎬",
    question: "What type of content do you mostly consume?",
    answers: ["Long-form / educational", "A balance of long and short", "Mostly short videos (Reels, Shorts...)", "Only fast, short entertainment"],
    timeLimit: 15,
  },
  {
    section: "Content Consumption Style",
    sectionEmoji: "🎬",
    question: "Do long videos or lectures feel \"too boring\" for you?",
    answers: ["Not at all", "Sometimes", "Often", "Almost always"],
    timeLimit: 15,
  },
  // Section D — Impact on Lifestyle
  {
    section: "Impact on Lifestyle",
    sectionEmoji: "😴",
    question: "Do you use your phone late at night before sleeping?",
    answers: ["Never", "Occasionally", "Most nights", "Every night"],
    timeLimit: 15,
  },
  {
    section: "Impact on Lifestyle",
    sectionEmoji: "😴",
    question: "After long scrolling sessions, how do you usually feel?",
    answers: ["Energized or neutral", "Slightly tired", "Mentally drained", "Very unfocused or unmotivated"],
    timeLimit: 15,
  },
  {
    section: "Impact on Lifestyle",
    sectionEmoji: "😴",
    question: "Have digital habits replaced activities like reading or face-to-face interaction?",
    answers: ["Not at all", "A little", "Yes, noticeably", "Yes, significantly"],
    timeLimit: 15,
  },
];

export function getQuizResult(score: number): QuizResult {
  if (score <= 8) {
    return {
      label: "Healthy Digital Use",
      emoji: "✅",
      description: "Your habits support concentration and effective learning. You are using technology without letting it control your attention.",
      solutions: [
        "Keep your current routine.",
        "Maintain balanced activities (study, social life, rest).",
        "Continue scheduling focused study time without distractions.",
      ],
    };
  } else if (score <= 16) {
    return {
      label: "Mild Brain Rot Risk",
      emoji: "⚠️",
      description: "Some digital habits are starting to affect your focus, but the impact is still reversible.",
      solutions: [
        "Set small boundaries (e.g., no phone during study sessions).",
        "Use a 25-minute focus block + 5-minute break.",
        "Disable non-essential notifications while studying.",
        "Replace some scrolling time with reading or offline activities.",
      ],
    };
  } else if (score <= 24) {
    return {
      label: "Moderate Impact",
      emoji: "⚠️",
      description: "Attention fragmentation is likely reducing learning efficiency and memory retention. You may rely too much on fast digital stimulation.",
      solutions: [
        "Create phone-free study periods (leave phone on desk or in bag).",
        "Limit short-form content to a fixed time per day.",
        "Practice \"single-tasking\" (do one task at a time).",
        "Rebuild attention gradually with longer reading or problem-solving sessions.",
      ],
    };
  } else {
    return {
      label: "High Brain Rot Exposure",
      emoji: "🚨",
      description: "Digital overstimulation is strongly affecting concentration, motivation, and possibly sleep patterns. Your brain may be conditioned to constant stimulation.",
      solutions: [
        "Introduce daily digital detox periods (start with 30–60 min).",
        "Avoid screens 1 hour before sleep.",
        "Use apps/tools to track and reduce screen time.",
        "Replace fast content with slower activities (studying, walking, discussion, hobbies).",
        "Study in environments with minimal digital distractions.",
      ],
    };
  }
}

export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatPin(pin: string): string {
  return pin.replace(/(\d{3})(\d{3})/, '$1 $2');
}
