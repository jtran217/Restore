/**
 * Design system showcase — Warm Daylight (docs/design.md v2.0)
 * Cream, terracotta gold, moss green, burnt sienna, dusk violet.
 */
function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary p-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Page title */}
        <header>
          <h1
            className="font-medium text-text-primary"
            style={{ fontFamily: "'Lora', serif", fontSize: "22px" }}
          >
            Flow — Design system
          </h1>
          <p className="text-text-secondary mt-1" style={{ fontSize: "15px" }}>
            Warm Daylight palette — Clearhead token set. Reference for all screens.
          </p>
        </header>

        {/* 1. Color palette */}
        <section className="space-y-4">
          <SectionTitle>Color palette</SectionTitle>
          <div className="bg-bg-secondary border border-border rounded-[16px] p-6 space-y-5">
            <div>
              <Label>Brand / Primary</Label>
              <div className="flex gap-3 mt-2 flex-wrap">
                <Swatch color="#FAEEDA" label="Primary surface" border />
                <Swatch color="#FAC775" label="Primary light" />
                <Swatch color="#BA7517" label="Primary" />
              </div>
            </div>
            <div>
              <Label>States</Label>
              <div className="flex gap-3 mt-2 flex-wrap">
                <Swatch color="#EAF3DE" label="Calm surface" border />
                <Swatch color="#639922" label="Calm" />
                <Swatch color="#FAECE7" label="Alert surface" border />
                <Swatch color="#D85A30" label="Alert" />
                <Swatch color="#EEEDFE" label="Focus surface" border />
                <Swatch color="#534AB7" label="Focus" />
              </div>
            </div>
            <div>
              <Label>Neutrals</Label>
              <div className="flex gap-3 mt-2 flex-wrap">
                <Swatch color="#FAEEDA" label="BG (cream)" border />
                <Swatch color="#F1EFE8" label="BG secondary" border />
                <Swatch color="#B4B2A9" label="Border" border />
                <Swatch color="#5F5E5A" label="Text secondary" />
                <Swatch color="#2C2C2A" label="Text primary" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Typography */}
        <section className="space-y-4">
          <SectionTitle>Typography</SectionTitle>
          <div className="bg-bg-secondary border border-border rounded-[16px] p-6 space-y-6">
            <div>
              <Label>Lora — Display / Hero</Label>
              <p
                className="text-text-primary mt-1 tabular-nums"
                style={{ fontFamily: "'Lora', serif", fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
              >
                72
              </p>
              <p className="text-text-tertiary mt-1" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Hero HR number
              </p>
            </div>
            <div>
              <Label>JetBrains Mono — Data / Timer</Label>
              <p
                className="text-text-secondary mt-1 tabular-nums"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "28px" }}
              >
                24:36
              </p>
            </div>
            <div>
              <Label>DM Sans — UI / Body</Label>
              <p className="mt-1" style={{ fontSize: "22px", fontWeight: 500 }}>Screen title (22px)</p>
              <p className="text-text-secondary mt-1" style={{ fontSize: "15px" }}>Body text — default copy at 15px. Readable, friendly, warm.</p>
              <p className="text-text-tertiary mt-1" style={{ fontSize: "13px" }}>Caption text — timestamps, labels, hints (13px).</p>
              <p className="text-text-tertiary mt-1" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Label caps — 11px, wide tracking</p>
            </div>
          </div>
        </section>

        {/* 3. Buttons */}
        <section className="space-y-4">
          <SectionTitle>Buttons</SectionTitle>
          <div className="bg-bg-secondary border border-border rounded-[16px] p-6 flex flex-wrap gap-4 items-center">
            {/* Primary */}
            <button
              type="button"
              className="bg-primary text-white font-medium px-6 py-3 rounded-[10px] transition-[background,transform] hover:opacity-90 active:scale-[0.98]"
              style={{ fontSize: "15px" }}
            >
              Start session
            </button>
            {/* Ghost */}
            <button
              type="button"
              className="border border-border bg-transparent text-text-secondary font-medium px-6 py-3 rounded-[10px] transition-colors hover:border-[#9B9991] hover:text-text-primary"
              style={{ fontSize: "15px" }}
            >
              Save to journal
            </button>
            {/* Signal */}
            <button
              type="button"
              className="border border-alert bg-transparent text-alert font-medium px-6 py-2.5 rounded-full text-sm uppercase transition-colors hover:bg-alert-surface"
              style={{ fontSize: "13px", letterSpacing: "0.06em" }}
            >
              I'm overwhelmed
            </button>
          </div>
        </section>

        {/* 4. Badges & state indicators */}
        <section className="space-y-4">
          <SectionTitle>Badges & state indicators</SectionTitle>
          <div className="bg-bg-secondary border border-border rounded-[16px] p-6 space-y-5">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="badge--calm badge">Grounded</span>
              <span className="badge--nudge badge">Nudge</span>
              <span className="badge--alert badge">Overload detected</span>
              <span className="badge--focus badge">Breathing reset</span>
            </div>
            {/* Strain scores */}
            <div className="flex gap-8 items-baseline">
              <div>
                <p className="strain-score strain-score--low">12</p>
                <p className="text-text-tertiary mt-0.5" style={{ fontSize: "11px" }}>Low</p>
              </div>
              <div>
                <p className="strain-score strain-score--moderate">46</p>
                <p className="text-text-tertiary mt-0.5" style={{ fontSize: "11px" }}>Moderate</p>
              </div>
              <div>
                <p className="strain-score strain-score--high">71</p>
                <p className="text-text-tertiary mt-0.5" style={{ fontSize: "11px" }}>High</p>
              </div>
              <div>
                <p className="strain-score strain-score--critical">89</p>
                <p className="text-text-tertiary mt-0.5" style={{ fontSize: "11px" }}>Critical</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Notification cards */}
        <section className="space-y-4">
          <SectionTitle>State notification cards</SectionTitle>
          <div className="space-y-3">
            {/* Overload */}
            <div className="card--alert card rounded-[10px]" style={{ borderRadius: "10px" }}>
              <span className="badge--alert badge">Overload detected</span>
              <p className="text-alert font-medium mt-2" style={{ fontSize: "15px" }}>Your brain needs a reset</p>
              <p style={{ color: "#993C1D", fontSize: "13px", marginTop: "4px" }}>HR elevated · 90 min no break</p>
            </div>
            {/* Calm */}
            <div className="card--calm card rounded-[10px]" style={{ borderRadius: "10px" }}>
              <span className="badge--calm badge">Grounded</span>
              <p className="text-calm font-medium mt-2" style={{ fontSize: "15px" }}>You're doing well</p>
              <p style={{ color: "#3B6D11", fontSize: "13px", marginTop: "4px" }}>Heart rate calm · 38 min focused</p>
            </div>
          </div>
        </section>

        {/* 6. Screen mocks */}
        <section className="space-y-4">
          <SectionTitle>Screen mocks</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">

            {/* Home */}
            <div className="bg-bg-secondary border border-border rounded-[16px] p-6">
              <Label>Home (summary)</Label>
              <div className="flex items-start justify-between gap-4 mt-4 mb-5">
                <div>
                  <p className="text-text-tertiary mb-1" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Current HR</p>
                  <p
                    className="text-text-primary tabular-nums"
                    style={{ fontFamily: "'Lora', serif", fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
                  >
                    72
                    <span
                      className="text-text-tertiary ml-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", letterSpacing: "0.06em" }}
                    >
                      bpm
                    </span>
                  </p>
                </div>
                <span className="badge--calm badge mt-1">Grounded</span>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-text-tertiary mb-3" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Session</p>
                <button
                  type="button"
                  className="w-full bg-primary text-white font-medium py-3 rounded-[10px] hover:opacity-90 transition-opacity"
                  style={{ fontSize: "15px" }}
                >
                  Start session
                </button>
                <button
                  type="button"
                  className="w-full mt-2 border border-alert text-alert font-medium py-2 rounded-full text-sm uppercase hover:bg-alert-surface transition-colors"
                  style={{ fontSize: "12px", letterSpacing: "0.06em" }}
                >
                  I'm overwhelmed
                </button>
              </div>
            </div>

            {/* Intervention */}
            <div className="bg-focus-surface border border-border rounded-[16px] p-6">
              <Label>Intervention — breathing reset</Label>
              <p
                className="text-focus mt-4 mb-1"
                style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "22px", lineHeight: 1.3 }}
              >
                Let's reset together.
              </p>
              <p className="text-text-secondary mb-5" style={{ fontSize: "14px" }}>
                Inhale for 4 seconds...
              </p>
              {/* Breathing circle */}
              <div className="flex justify-center mb-5">
                <div
                  className="rounded-full border-2 border-focus"
                  style={{ width: "80px", height: "80px", opacity: 0.7 }}
                />
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full bg-focus text-white font-medium py-3 rounded-[10px] hover:opacity-90 transition-opacity"
                  style={{ fontSize: "15px" }}
                >
                  That helped
                </button>
                <button
                  type="button"
                  className="w-full border border-border text-text-secondary font-medium py-3 rounded-[10px] hover:border-[#9B9991] hover:text-text-primary transition-colors"
                  style={{ fontSize: "15px" }}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Focus mode mock */}
        <section className="space-y-4">
          <SectionTitle>Focus mode</SectionTitle>
          <div className="bg-bg border border-border rounded-[16px] flex flex-col items-center justify-center min-h-[200px] relative">
            <div className="absolute top-4 right-4">
              <span className="pulse-dot pulse-dot--calm" />
            </div>
            <p
              className="text-text-secondary tabular-nums"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "28px" }}
            >
              24:36
            </p>
            <p className="text-text-tertiary mt-2" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Session time</p>
            <button
              type="button"
              className="absolute bottom-4 text-text-tertiary hover:text-text-secondary transition-colors"
              style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              End session
            </button>
          </div>
        </section>

        <footer className="pt-8 border-t border-border text-text-tertiary" style={{ fontSize: "13px" }}>
          Flow design system v2.0 — Warm Daylight — 2026 Cursor Hackathon
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-text-primary font-medium" style={{ fontSize: "18px" }}>
      {children}
    </h2>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-tertiary" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function Swatch({ color, label, border }: { color: string; label: string; border?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-10 h-10 rounded-[6px]"
        style={{
          backgroundColor: color,
          border: border ? "1px solid #B4B2A9" : undefined,
        }}
      />
      <span className="text-text-tertiary" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
        {label}
      </span>
    </div>
  );
}

export default App;
