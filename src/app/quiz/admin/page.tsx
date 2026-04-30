import { createAdminClient } from "@/lib/supabase";
import { QUESTIONS, LEVELS } from "@/lib/quiz-data";

const BG = "#0f0f0f";
const CARD = "#161616";
const BORDER = "#262626";
const ACCENT = "#c8f04d";
const MUTED = "#777777";
const MUTED_LT = "#aaaaaa";

interface ResultRow {
  id: string;
  score: number;
  level: number;
  level_title: string;
  created_at: string;
}

interface AnswerRow {
  result_id: string;
  question_number: number;
  answer_index: number;
}

async function getData(): Promise<{ results: ResultRow[]; answers: AnswerRow[] }> {
  const admin = createAdminClient();

  const [{ data: results, error: rErr }, { data: answers, error: aErr }] =
    await Promise.all([
      admin.from("results").select("*").order("created_at", { ascending: false }),
      admin.from("answers").select("result_id, question_number, answer_index"),
    ]);

  if (rErr) throw new Error(rErr.message);
  if (aErr) throw new Error(aErr.message);

  return { results: results ?? [], answers: answers ?? [] };
}

const MAX_SCORE = QUESTIONS.length * 3;

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      style={{
        backgroundColor: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "20px 24px",
      }}
    >
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 8, fontFamily: "var(--font-dm-mono)", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 700, color: ACCENT, fontFamily: "var(--font-dm-mono)" }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 11, color: MUTED, marginTop: 4, fontFamily: "var(--font-dm-mono)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default async function AdminPage() {
  let results: ResultRow[] = [];
  let answers: AnswerRow[] = [];
  let fetchError: string | null = null;

  try {
    ({ results, answers } = await getData());
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load data";
  }

  // ── Aggregate stats ──────────────────────────────────────────────────────
  const totalTakers = results.length;
  const avgScore =
    totalTakers > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalTakers)
      : 0;
  const highScore = totalTakers > 0 ? Math.max(...results.map((r) => r.score)) : 0;

  // Level distribution
  const levelCounts = LEVELS.map((l, i) => ({
    ...l,
    count: results.filter((r) => r.level === i).length,
  }));
  const topLevel = levelCounts.reduce((a, b) => (b.count > a.count ? b : a), levelCounts[0]);

  // ── Per-question answer distribution ────────────────────────────────────
  const LABELS = ["A", "B", "C", "D"];
  const questionStats = QUESTIONS.map((q, i) => {
    const qNum = i + 1;
    const qAnswers = answers.filter((a) => a.question_number === qNum);
    const total = qAnswers.length;
    const options = q.opts.map((text, idx) => {
      const count = qAnswers.filter((a) => a.answer_index === idx).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { label: LABELS[idx], text, count, pct };
    });
    return { qNum, text: q.text, total, options };
  });

  return (
    <main style={{ backgroundColor: BG, color: "#fff", minHeight: "100vh", fontFamily: "var(--font-dm-sans)" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              AI Maturity Test for HR · Admin
            </h1>
          </div>
          <a
            href="/quiz"
            style={{ fontSize: 13, color: MUTED_LT, textDecoration: "none", fontFamily: "var(--font-dm-mono)" }}
          >
            ← Back to quiz
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 40 }}>
        {fetchError && (
          <div style={{ backgroundColor: "#1a0a0a", border: "1px solid #5c1a1a", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#f87171" }}>
            <strong>Error loading data:</strong> {fetchError}
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <StatCard label="Total attempts" value={totalTakers} />
          <StatCard label="Avg score" value={`${avgScore} / ${MAX_SCORE}`} />
          <StatCard label="High score" value={`${highScore} / ${MAX_SCORE}`} />
          <StatCard
            label="Most common level"
            value={totalTakers > 0 ? topLevel.emoji : "—"}
            sub={totalTakers > 0 ? `${topLevel.title} (${topLevel.count})` : undefined}
          />
        </div>

        {/* Level distribution */}
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: MUTED_LT, marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}>
            Level Distribution
          </h2>
          <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            {levelCounts.map((l, i) => {
              const pct = totalTakers > 0 ? Math.round((l.count / totalTakers) * 100) : 0;
              return (
                <div
                  key={i}
                  style={{
                    padding: "14px 20px",
                    borderBottom: i < levelCounts.length - 1 ? `1px solid ${BORDER}` : undefined,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{l.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#fff" }}>{l.title}</span>
                      <span style={{ fontSize: 12, color: ACCENT, fontFamily: "var(--font-dm-mono)", flexShrink: 0, marginLeft: 12 }}>
                        {l.count} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: 3, backgroundColor: BORDER, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, backgroundColor: ACCENT, borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Per-question answer distribution */}
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: MUTED_LT, marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}>
            Answer Distribution
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {questionStats.map((q) => (
              <div
                key={q.qNum}
                style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px" }}
              >
                {/* Question heading */}
                <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.5, marginBottom: 14 }}>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: MUTED, marginRight: 8 }}>
                    Q{q.qNum}
                  </span>
                  {q.text}
                </p>

                {/* Option rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt) => (
                    <div key={opt.label} style={{ display: "grid", gridTemplateColumns: "16px 1fr 80px 60px", alignItems: "center", gap: 10 }}>
                      {/* Label */}
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: MUTED, textAlign: "right" }}>
                        {opt.label}
                      </span>
                      {/* Bar track */}
                      <div style={{ height: 6, backgroundColor: BORDER, borderRadius: 99, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${opt.pct}%`,
                            backgroundColor: ACCENT,
                            borderRadius: 99,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      {/* Option text */}
                      <span style={{ fontSize: 11, color: MUTED_LT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {opt.text}
                      </span>
                      {/* Count + pct */}
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: opt.pct > 0 ? "#fff" : MUTED, textAlign: "right", whiteSpace: "nowrap" }}>
                        {q.total > 0 ? `${opt.count} (${opt.pct}%)` : "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {q.total > 0 && (
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: MUTED, marginTop: 12 }}>
                    {q.total} response{q.total !== 1 ? "s" : ""}
                  </p>
                )}
                {q.total === 0 && (
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: MUTED, marginTop: 4 }}>
                    No data yet
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recent results */}
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: MUTED_LT, marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}>
            Recent Attempts
          </h2>
          {results.length === 0 ? (
            <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "40px 20px", textAlign: "center", color: MUTED, fontSize: 13, fontFamily: "var(--font-dm-mono)" }}>
              No quiz attempts yet.
            </div>
          ) : (
            <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["Score", "Level", "Date"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 20px",
                            textAlign: "left",
                            fontSize: 11,
                            fontFamily: "var(--font-dm-mono)",
                            color: MUTED,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr
                        key={r.id}
                        style={{ borderBottom: i < results.length - 1 ? `1px solid ${BORDER}` : undefined }}
                      >
                        <td style={{ padding: "12px 20px", fontFamily: "var(--font-dm-mono)", color: ACCENT, fontWeight: 500 }}>
                          {r.score} / {MAX_SCORE}
                        </td>
                        <td style={{ padding: "12px 20px", color: "#fff" }}>
                          <span style={{ marginRight: 8 }}>{LEVELS[r.level]?.emoji}</span>
                          {r.level_title}
                        </td>
                        <td style={{ padding: "12px 20px", color: MUTED, fontFamily: "var(--font-dm-mono)", fontSize: 12 }}>
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
