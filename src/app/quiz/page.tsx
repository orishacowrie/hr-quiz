"use client";

import { useState } from "react";
import { QUESTIONS, LEVELS, getLevel } from "@/lib/quiz-data";

// ── Brand tokens ────────────────────────────────────────────────────────────
const BG = "#0f0f0f";
const CARD = "#161616";
const BORDER = "#262626";
const ACCENT = "#c8f04d";
const TEAL = "#4ddbaf";
const PURPLE = "#8b5cf6";
const MUTED = "#777777";
const MUTED_LT = "#aaaaaa";

// ── Types ────────────────────────────────────────────────────────────────────
interface ShuffledOpt {
  opt: string;
  score: number;
  originalIndex: number;
}

interface QuizAnswer {
  question_number: number;
  answer_index: number;
  answer_score: number;
}

type Stage = "intro" | "quiz" | "submitting" | "results";

// ── Helpers ──────────────────────────────────────────────────────────────────
function buildShuffled(): ShuffledOpt[][] {
  return QUESTIONS.map((q) => {
    const paired = q.opts.map((opt, i) => ({
      opt,
      score: q.scores[i],
      originalIndex: i,
    }));
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paired[i], paired[j]] = [paired[j], paired[i]];
    }
    return paired;
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<ShuffledOpt | null>(null);
  const [collectedAnswers, setCollectedAnswers] = useState<QuizAnswer[]>([]);
  const [shuffled, setShuffled] = useState<ShuffledOpt[][]>(buildShuffled);
  const [finalScore, setFinalScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalQ = QUESTIONS.length;
  const progress = ((currentQ + 1) / totalQ) * 100;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleStart() {
    setStage("quiz");
  }

  function handleNext() {
    if (!selected) return;

    const answer: QuizAnswer = {
      question_number: currentQ + 1,
      answer_index: selected.originalIndex,
      answer_score: selected.score,
    };
    const newAnswers = [...collectedAnswers, answer];

    if (currentQ === totalQ - 1) {
      const score = newAnswers.reduce((s, a) => s + a.answer_score, 0);
      const { index } = getLevel(score);
      setFinalScore(score);
      setLevelIndex(index);
      setCollectedAnswers(newAnswers);
      submitResults(newAnswers, score, index);
    } else {
      setCollectedAnswers(newAnswers);
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setHoveredIdx(null);
    }
  }

  async function submitResults(answers: QuizAnswer[], score: number, lvlIdx: number) {
    setStage("submitting");
    try {
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          level: lvlIdx,
          level_title: LEVELS[lvlIdx].title,
          answers,
        }),
      });
    } catch {
      // silent — still show results
    }
    setStage("results");
  }

  function shareText(lvlIdx: number) {
    const level = LEVELS[lvlIdx];
    return (
      `I just took the HR AI Maturity Test.\n\n` +
      `My level: ${level.emoji} ${level.title}\n\n` +
      `Curious about your AI level? → lenabond.com/quiz`
    );
  }

  function handleShare() {
    navigator.clipboard.writeText(shareText(levelIndex)).catch(() => {});
    window.open(
      "https://www.linkedin.com/sharing/share-offsite/?url=https://lenabond.com/quiz",
      "_blank",
    );
  }

  function handleRetake() {
    setShuffled(buildShuffled());
    setStage("intro");
    setCurrentQ(0);
    setSelected(null);
    setCollectedAnswers([]);
    setFinalScore(0);
    setLevelIndex(0);
    setHoveredIdx(null);
  }

  // ── Render: Intro ─────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <main
        style={{ backgroundColor: BG, color: "#fff", minHeight: "100vh" }}
        className="flex items-center justify-center px-5 py-16 font-sans"
      >
        <div style={{ maxWidth: 560, width: "100%" }}>
          {/* Author bio — subtle, top */}
          <p style={{ fontSize: 12, color: MUTED, marginBottom: 36, fontFamily: "var(--font-dm-mono)" }}>
            by{" "}
            <a
              href="https://www.linkedin.com/in/elenabondareva/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: MUTED_LT, textDecoration: "none" }}
            >
              Lena Bondareva
            </a>
            {" "}— bringing AI into HR while keeping it human
          </p>

          {/* Tag */}
          <p
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: ACCENT,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            HR × AI
          </p>

          {/* Title */}
          <h1
            style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}
          >
            AI Maturity Test
            <br />
            <span style={{ color: ACCENT }}>for HR</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 15,
              color: MUTED_LT,
              marginBottom: 48,
            }}
          >
            How deep are you in AI?
          </p>

          {/* Meta row */}
          <p
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 12,
              color: MUTED,
              marginBottom: 48,
              letterSpacing: "0.05em",
            }}
          >
            10 questions · ~3 min · anonymous
          </p>

          {/* Start button */}
          <button
            onClick={handleStart}
            style={{
              backgroundColor: ACCENT,
              color: BG,
              border: "none",
              borderRadius: 10,
              padding: "14px 36px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-dm-sans)",
              width: "100%",
              letterSpacing: "0.01em",
            }}
          >
            Take the test →
          </button>
        </div>
      </main>
    );
  }

  // ── Render: Submitting ────────────────────────────────────────────────────
  if (stage === "submitting") {
    return (
      <main
        style={{ backgroundColor: BG, minHeight: "100vh" }}
        className="flex items-center justify-center font-sans"
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: `3px solid ${BORDER}`,
              borderTopColor: ACCENT,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: MUTED_LT, fontFamily: "var(--font-dm-mono)", fontSize: 13 }}>
            Saving your results…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  // ── Render: Results ───────────────────────────────────────────────────────
  if (stage === "results") {
    const level = LEVELS[levelIndex];
    const maxScore = QUESTIONS.length * 3;

    return (
      <main
        style={{ backgroundColor: BG, color: "#fff", minHeight: "100vh" }}
        className="flex items-center justify-center px-5 py-16 font-sans"
      >
        <div style={{ maxWidth: 560, width: "100%" }}>
          {/* Emoji + score */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>{level.emoji}</div>
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 36,
                fontWeight: 500,
                color: ACCENT,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              {finalScore}
              <span style={{ fontSize: 18, color: MUTED, fontWeight: 400 }}> / {maxScore}</span>
            </p>
            {/* Status badge */}
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-dm-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: TEAL,
                border: `1px solid ${TEAL}`,
                borderRadius: 999,
                padding: "4px 14px",
                marginTop: 12,
              }}
            >
              {level.status}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              fontWeight: 700,
              marginBottom: 20,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {level.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 15,
              color: MUTED_LT,
              lineHeight: 1.75,
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            {level.desc}
          </p>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: 28 }} />

          {/* Superpower */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: 8,
              }}
            >
              Your superpower
            </p>
            <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.6 }}>{level.superpower}</p>
          </div>

          {/* Next move */}
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: 8,
              }}
            >
              Your next move
            </p>
            <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.6 }}>{level.next}</p>
          </div>

          {/* Share */}
          <div style={{ marginBottom: 12 }}>
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 12,
                color: ACCENT,
                marginBottom: 12,
                lineHeight: 1.5,
              }}
            >
              ✓ Your result is ready to paste — just click Share, then Cmd+V in LinkedIn
            </p>
            <button
              onClick={handleShare}
              style={{
                backgroundColor: ACCENT,
                color: BG,
                border: "none",
                borderRadius: 10,
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans)",
                letterSpacing: "0.01em",
                width: "100%",
              }}
            >
              Share on LinkedIn →
            </button>
          </div>

          {/* Retake */}
          <button
            onClick={handleRetake}
            style={{
              backgroundColor: "transparent",
              color: MUTED,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "11px 24px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "var(--font-dm-sans)",
              width: "100%",
              marginBottom: 48,
            }}
          >
            Retake quiz
          </button>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: 36 }} />

          {/* Contact block */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
              If your HR team needs an AI upgrade — let&apos;s talk.
            </p>
            <p style={{ fontSize: 14, color: MUTED_LT, marginBottom: 24 }}>
              I&apos;m open to opportunities.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://www.linkedin.com/in/elenabondareva/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontFamily: "var(--font-dm-mono)",
                  color: TEAL,
                  textDecoration: "none",
                  letterSpacing: "0.03em",
                }}
              >
                LinkedIn
              </a>
              <a
                href="mailto:elenawbond@gmail.com"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontFamily: "var(--font-dm-mono)",
                  color: TEAL,
                  textDecoration: "none",
                  letterSpacing: "0.03em",
                }}
              >
                elenawbond@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Render: Quiz ──────────────────────────────────────────────────────────
  const question = QUESTIONS[currentQ];
  const opts = shuffled[currentQ];

  return (
    <main
      style={{ backgroundColor: BG, color: "#fff", minHeight: "100vh" }}
      className="flex items-center justify-center px-5 py-12 font-sans"
    >
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Progress header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 12,
                color: MUTED,
                letterSpacing: "0.06em",
              }}
            >
              Q{currentQ + 1} / {totalQ}
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 12,
                color: MUTED,
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 2,
              backgroundColor: BORDER,
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: ACCENT,
                borderRadius: 99,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Question */}
        <h2
          style={{
            fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
            fontWeight: 600,
            lineHeight: 1.45,
            marginBottom: 28,
            color: "#fff",
          }}
        >
          {question.text}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {opts.map((opt, idx) => {
            const isSelected = selected?.originalIndex === opt.originalIndex;
            const isHovered = hoveredIdx === idx && !isSelected;
            return (
              <button
                key={opt.originalIndex}
                onClick={() => setSelected(opt)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  backgroundColor: isSelected ? PURPLE : isHovered ? "#1e1e1e" : CARD,
                  color: "#fff",
                  border: `1px solid ${isSelected ? PURPLE : BORDER}`,
                  borderRadius: 10,
                  padding: "14px 18px",
                  fontSize: 14,
                  fontWeight: isSelected ? 500 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  lineHeight: 1.5,
                  fontFamily: "var(--font-dm-sans)",
                  transition: "background-color 0.15s, border-color 0.15s",
                }}
              >
                {opt.opt}
              </button>
            );
          })}
        </div>

        {/* Next / Submit */}
        <button
          onClick={handleNext}
          disabled={!selected}
          style={{
            backgroundColor: selected ? ACCENT : BORDER,
            color: selected ? BG : MUTED,
            border: "none",
            borderRadius: 10,
            padding: "13px 24px",
            fontSize: 14,
            fontWeight: 700,
            cursor: selected ? "pointer" : "not-allowed",
            fontFamily: "var(--font-dm-sans)",
            width: "100%",
            transition: "background-color 0.2s, color 0.2s",
            letterSpacing: "0.01em",
          }}
        >
          {currentQ === totalQ - 1 ? "See my result →" : "Next →"}
        </button>
      </div>
    </main>
  );
}
