export interface Question {
  id: string;
  text: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Under the FMLA, eligible employees are entitled to how many weeks of unpaid, job-protected leave per year?",
    options: ["6 weeks", "10 weeks", "12 weeks", "16 weeks"],
    correct: "12 weeks",
    explanation:
      "The Family and Medical Leave Act (FMLA) grants eligible employees up to 12 weeks of unpaid, job-protected leave per 12-month period.",
  },
  {
    id: "q2",
    text: "Which of the following is NOT a protected class under Title VII of the Civil Rights Act of 1964?",
    options: ["Race", "Religion", "Age", "National origin"],
    correct: "Age",
    explanation:
      "Age is protected under the Age Discrimination in Employment Act (ADEA), not Title VII. Title VII covers race, color, religion, sex, and national origin.",
  },
  {
    id: "q3",
    text: "What form must employers complete to verify an employee's eligibility to work in the United States?",
    options: ["W-4", "I-9", "W-2", "1099"],
    correct: "I-9",
    explanation:
      "Form I-9 (Employment Eligibility Verification) must be completed within 3 business days of a new hire's first day of work.",
  },
  {
    id: "q4",
    text: "Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay at what rate for hours worked over 40 in a workweek?",
    options: [
      "1.25× their regular rate",
      "1.5× their regular rate",
      "2× their regular rate",
      "1.75× their regular rate",
    ],
    correct: "1.5× their regular rate",
    explanation:
      "The FLSA requires that non-exempt employees receive overtime pay of at least 1.5 times their regular rate of pay for hours worked beyond 40 in a workweek.",
  },
  {
    id: "q5",
    text: "Which of the following best describes 'at-will employment'?",
    options: [
      "An employee can only be terminated for cause",
      "Either party can end the employment relationship at any time for any lawful reason",
      "An employer must give 30 days notice before termination",
      "Employment is guaranteed for the duration of the signed contract",
    ],
    correct:
      "Either party can end the employment relationship at any time for any lawful reason",
    explanation:
      "At-will employment means either the employer or employee may end the relationship at any time, with or without cause, as long as the reason isn't illegal (e.g., discrimination or retaliation).",
  },
  {
    id: "q6",
    text: "What is the primary purpose of a PIP (Performance Improvement Plan)?",
    options: [
      "To document grounds for termination",
      "To outline clear performance expectations and support an employee in meeting them",
      "To reduce an employee's compensation",
      "To transfer an employee to a different department",
    ],
    correct:
      "To outline clear performance expectations and support an employee in meeting them",
    explanation:
      "A PIP is a structured tool designed to help underperforming employees understand expectations and receive support to improve — though it may also document a history of issues.",
  },
  {
    id: "q7",
    text: "Which federal agency enforces workplace anti-discrimination laws?",
    options: ["OSHA", "NLRB", "EEOC", "DOL"],
    correct: "EEOC",
    explanation:
      "The Equal Employment Opportunity Commission (EEOC) enforces federal laws prohibiting employment discrimination. OSHA covers safety, NLRB covers labor relations, and DOL covers wages and benefits.",
  },
  {
    id: "q8",
    text: "What does 'reasonable accommodation' mean in the context of the ADA?",
    options: [
      "Providing any modification an employee requests",
      "A modification or adjustment that enables a qualified person with a disability to perform essential job functions, without undue hardship",
      "Reducing an employee's workload permanently",
      "Reassigning all essential job functions to another employee",
    ],
    correct:
      "A modification or adjustment that enables a qualified person with a disability to perform essential job functions, without undue hardship",
    explanation:
      "The Americans with Disabilities Act requires employers to provide reasonable accommodations — changes to the work environment or job duties — unless doing so would cause significant difficulty or expense (undue hardship).",
  },
  {
    id: "q9",
    text: "Which of the following is an example of quid pro quo harassment?",
    options: [
      "A manager regularly tells offensive jokes in team meetings",
      "A supervisor conditions a promotion on an employee accepting romantic advances",
      "Coworkers exclude a colleague from lunch gatherings",
      "An employee receives unfair performance ratings",
    ],
    correct:
      "A supervisor conditions a promotion on an employee accepting romantic advances",
    explanation:
      "Quid pro quo ('this for that') harassment occurs when a tangible job benefit or detriment is tied to submission to unwelcome sexual conduct.",
  },
  {
    id: "q10",
    text: "Under COBRA, how long can a qualifying employee typically continue group health coverage after leaving a job?",
    options: ["6 months", "12 months", "18 months", "36 months"],
    correct: "18 months",
    explanation:
      "COBRA generally allows qualified individuals to continue group health plan coverage for up to 18 months after job loss or reduction in hours. Certain qualifying events (e.g., disability) can extend coverage to 29 or 36 months.",
  },
];

export const PASS_THRESHOLD = 70; // percentage
