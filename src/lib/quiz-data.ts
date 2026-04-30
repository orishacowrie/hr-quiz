export interface Question {
  text: string;
  opts: string[];
  scores: number[];
  hint: string;
}

export interface Level {
  min: number;
  max: number;
  emoji: string;
  status: string;
  title: string;
  desc: string;
  superpower: string;
  next: string;
  share: string;
}

export const QUESTIONS: Question[] = [
  {
    text: "How often do you use AI tools at work?",
    opts: ["Every day, it's part of my workflow", "A few times a week", "Tried it a couple of times", "I watched a webinar about it once"],
    scores: [3, 2, 1, 0],
    hint: "Daily use compounds fast — even 20 minutes a day changes how you think about work.",
  },
  {
    text: "Do you have a paid AI subscription?",
    opts: ["Yes, more than one", "Yes, one", "Planning to get one", "The free version works… mostly"],
    scores: [3, 2, 1, 0],
    hint: "The free tier runs out at exactly the wrong moment.",
  },
  {
    text: "When you write a prompt, you usually:",
    opts: ["Use RCJF — role, context, job, format", "Write a detailed request", "Type a question like you would Google it", "Write 'make this better' when the result doesn't look right"],
    scores: [3, 2, 1, 0],
    hint: "Role + Context + Job + Format — the basic formula for a prompt that actually works.",
  },
  {
    text: "What is a context window?",
    opts: ["How much text the AI can process in one session", "The chat history", "Some kind of technical setting", "The window where you type"],
    scores: [3, 2, 1, 0],
    hint: "When the limit runs out — the AI forgets the beginning of the conversation.",
  },
  {
    text: "Have you ever set up custom instructions or a system prompt in your AI?",
    opts: ["Yes, I have several different setups", "Yes, once", "I didn't know that was possible", "I just open the chat and start typing"],
    scores: [3, 2, 1, 0],
    hint: "Set it up once — write less in every request.",
  },
  {
    text: "Do you have a GitHub account?",
    opts: ["Yes, and there's actually something in there", "Yes, but it's empty", "I signed up once and never went back", "Isn't that where developers live?"],
    scores: [3, 2, 1, 0],
    hint: "Great for storing scripts, bots, and 'what I built yesterday'.",
  },
  {
    text: "Have you heard of AI building tools like Cursor, Lovable, or similar?",
    opts: ["Yes, I use one of them", "Yes, I've tried it", "I've seen the name somewhere", "Sounds like a sports brand"],
    scores: [3, 2, 1, 0],
    hint: "These tools let you build apps and automations by describing what you want in plain language.",
  },
  {
    text: "Have you ever built anything with AI — a bot, an automation, a workflow?",
    opts: ["Yes, and it's actually running somewhere", "Yes, a small experiment", "I have a list of things I want to build", "Does a really good prompt count?"],
    scores: [3, 2, 1, 0],
    hint: "Your first working automation changes how you see AI forever.",
  },
  {
    text: "Do you know what Railway, Vercel, or Render are?",
    opts: ["Yes, I host things there", "I've watched tutorials about it", "I know the names", "Sounds like something from logistics"],
    scores: [3, 2, 1, 0],
    hint: "These platforms keep your automations running while you and your laptop are resting.",
  },
  {
    text: "Do you know what an API key is?",
    opts: ["Yes, I've used one", "I've seen it mentioned in tutorials", "I know it's important but haven't needed it yet", "Sounds like a password for something"],
    scores: [3, 2, 1, 0],
    hint: "The first step to connecting AI to real workflows.",
  },
];

export const LEVELS: Level[] = [
  {
    min: 0, max: 7,
    emoji: "🪷",
    status: "AI Explorer",
    title: "The AI Humanist",
    desc: "You are the soul of the organization. While everyone else is arguing with chatbots, you are the one actually resolving team conflicts and managing turnover with human intuition that no algorithm can replicate. You use AI sparingly and thoughtfully, ensuring the Human in Human Resources stays front and center.",
    superpower: "High Emotional Intelligence (EQ).",
    next: "You're just 2–3 prompts away from your next level. Keep that human touch — it's the only thing AI can't copy!",
    share: "You believe the best HR tech is the one that serves people, not replaces them.",
  },
  {
    min: 8, max: 14,
    emoji: "☕",
    status: "Innovation Curator",
    title: "The AI Strategist",
    desc: "You're in the Strategic Research phase. Your 'AI stuff' folder is basically a goldmine of future efficiency. You don't jump on every hype train immediately because you're a curator of quality. You are the sleeper agent for innovation — waiting for the perfect moment to deploy a tool that actually works.",
    superpower: "Strategic patience and a sharp eye for trends.",
    next: "Open that folder! One successful automation will turn you from a researcher into an office legend.",
    share: "You're building a long-term AI vision while everyone else is just playing with toys.",
  },
  {
    min: 15, max: 20,
    emoji: "🧩",
    status: "The Human-AI Translator",
    title: "The AI Prompt Architect",
    desc: "You speak both Human and Machine fluently. You've mastered the RCJF rule and probably have a favorite custom instruction that makes your AI sound like a witty assistant. You are the bridge between your team's needs and the power of the models. You're officially one webhook away from total office domination.",
    superpower: "Precision communication and clarity of thought.",
    next: "Connect one of your prompts to a real workflow — try a simple automation!",
    share: "Your colleagues already come to you asking: 'How do I make the bot do this?'",
  },
  {
    min: 21, max: 26,
    emoji: "🤖",
    status: "Tech-Forward HR Leader",
    title: "The AI Automation Ninja",
    desc: "You came for the productivity, but you stayed for the magic. You've built things that actually work, and now you're the go-to person for fixing broken processes. You're the one saving the company dozens of hours a week, and you've stopped pushing back because you're too busy scaling.",
    superpower: "Turning chaos into scalable, automated workflows.",
    next: "Start a Pilot AI Group — you're already doing the work of a Chief AI Officer.",
    share: "You've automated the boring stuff so you can finally focus on high-level strategy.",
  },
  {
    min: 27, max: 30,
    emoji: "🚀",
    status: "HR Architect (2030 Edition)",
    title: "The AI Visionary Engineer",
    desc: "Let's be honest: are you even still in HR, or are you a secret developer? You're deploying scripts, managing API keys, and probably teaching the IT department a thing or two. You aren't just using AI — you are redefining what People Operations looks like in the age of intelligence.",
    superpower: "Engineering the future of work.",
    next: "Launch that side project or internal tool. The industry is still catching up to where you were yesterday.",
    share: "You have more AI subscriptions than streaming services.",
  },
];

export function getLevel(score: number): { level: Level; index: number } {
  const index = LEVELS.findIndex((l) => score >= l.min && score <= l.max);
  return { level: LEVELS[index ?? 0], index: index ?? 0 };
}
