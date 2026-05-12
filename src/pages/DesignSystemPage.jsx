import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Clock,
  Send,
  ShieldCheck,
  Star,
  FileText,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import Card from '../components/ui/Card';
import Confidence from '../components/ui/Confidence';
import Rule from '../components/ui/Rule';
import { pendingAdditions } from '../data/design-pending';

// Visual reference for the Homewise design system.
// Routed via /designsystem in App.jsx. Eats its own dog food · uses the
// actual tokens and components it documents.

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink-900">
      {/* Ambient backdrop (same as the app) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-sage-100 opacity-50 blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-ember-100 opacity-40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-16 space-y-20">
        {/* Page header */}
        <header className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-ink-300" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-medium">
              Hearth · v1 · Homewise Design System
            </span>
          </div>
          <h1 className="editorial text-[36px] md:text-[52px] leading-[1.05] text-ink-900 max-w-3xl">
            Hearth.
            <span className="block text-ink-500">The warmth at the center of every home.</span>
          </h1>
          <p className="max-w-2xl text-[15px] text-ink-500 leading-relaxed">
            Hearth is the design system behind Homewise. A warm-canvas system for a 2026 AI home command center: sans-only, shadowless, with a tri-role color story (trust · caution · info) and a recurring rule-line brand gesture. This page visualizes every token + component in v1.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href="/"
              className="h-10 px-4 rounded-2xl bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all"
            >
              <ArrowRight size={13} strokeWidth={1.8} className="rotate-180" />
              Back to the app
            </a>
            <a
              href="https://github.com/chang627627/homewise/blob/main/DESIGN.md"
              target="_blank"
              rel="noreferrer"
              className="h-10 px-4 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-all"
            >
              <FileText size={13} strokeWidth={1.8} />
              Read DESIGN.md
            </a>
          </div>
        </header>

        {/* Pending review queue · proposals waiting for owner approval */}
        {pendingAdditions.length > 0 && <PendingReviewSection items={pendingAdditions} />}

        {/* 01 Color */}
        <Section num="01" title="Color" sub="A warm canvas, near-black ink, and a tri-role accent story (sage = trust, ember = caution, sky2026 = info).">
          <SubSection label="Canvas tiers · 5-tier surface ladder">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Swatch label="canvas" hex="#F6F4EF" use="Page background" bg="bg-canvas" />
              <Swatch label="canvas-soft" hex="#FAF8F3" use="Sidebar, hover" bg="bg-canvas-soft" />
              <Swatch label="card-white" hex="#FFFFFF/80" use="Content tiles" bg="bg-white/80" />
              <Swatch label="canvas-deep" hex="#EEEAE1" use="Inset wells, totals" bg="bg-canvas-deep" />
              <Swatch label="ink-900" hex="#1A1A17" use="CTAs, inverted" bg="bg-ink-900" textOnDark />
            </div>
          </SubSection>

          <SubSection label="Ink scale · text and structure">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <Swatch label="ink-900" hex="#1A1A17" use="Body, headlines" bg="bg-ink-900" textOnDark />
              <Swatch label="ink-700" hex="#3C3C38" use="Strong body" bg="bg-ink-700" textOnDark />
              <Swatch label="ink-500" hex="#6B6B65" use="Secondary" bg="bg-ink-500" textOnDark />
              <Swatch label="ink-300" hex="#A8A8A1" use="Muted, rules" bg="bg-ink-300" />
              <Swatch label="ink-200" hex="#CFCEC7" use="Subtle hairlines" bg="bg-ink-200" />
              <Swatch label="ink-100" hex="#E7E5DE" use="Soft separations" bg="bg-ink-100" />
            </div>
          </SubSection>

          <SubSection label="Sage · trust accent (AI recommendations, success, completed)">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              <Swatch label="sage-50" hex="#F1F4EF" bg="bg-sage-50" small />
              <Swatch label="sage-100" hex="#E2E8DC" bg="bg-sage-100" small />
              <Swatch label="sage-200" hex="#C6D2BB" bg="bg-sage-200" small />
              <Swatch label="sage-300" hex="#9AAE8C" bg="bg-sage-300" small />
              <Swatch label="sage-400" hex="#738A63" bg="bg-sage-400" textOnDark small />
              <Swatch label="sage-500" hex="#4F6942" bg="bg-sage-500" textOnDark small />
              <Swatch label="sage-600" hex="#3D5333" bg="bg-sage-600" textOnDark small />
              <Swatch label="sage-700" hex="#2F4027" bg="bg-sage-700" textOnDark small />
            </div>
          </SubSection>

          <SubSection label="Ember · caution accent (insurance flags, warnings)">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <Swatch label="ember-50" hex="#FBF3EA" bg="bg-ember-50" small />
              <Swatch label="ember-100" hex="#F5E4CE" bg="bg-ember-100" small />
              <Swatch label="ember-200" hex="#EBC89B" bg="bg-ember-200" small />
              <Swatch label="ember-300" hex="#D9A461" bg="bg-ember-300" small />
              <Swatch label="ember-400" hex="#B98132" bg="bg-ember-400" textOnDark small />
              <Swatch label="ember-500" hex="#8E601E" bg="bg-ember-500" textOnDark small />
            </div>
          </SubSection>

          <SubSection label="Sky2026 · info accent (scheduled, live monitoring)">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              <Swatch label="sky2026-50" hex="#EEF3F5" bg="bg-sky2026-50" small />
              <Swatch label="sky2026-100" hex="#D9E4E9" bg="bg-sky2026-100" small />
              <Swatch label="sky2026-300" hex="#8FAAB3" bg="bg-sky2026-300" small />
              <Swatch label="sky2026-500" hex="#4E6F7A" bg="bg-sky2026-500" textOnDark small />
              <Swatch label="sky2026-700" hex="#2E4850" bg="bg-sky2026-700" textOnDark small />
            </div>
          </SubSection>

          <SubSection label="Semantic aliases · read by role, not hue">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card variant="flat" className="p-4">
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">primary</div>
                <div className="figure mt-1 text-[13px] text-ink-700">ink-900 · CTAs, current step</div>
              </Card>
              <Card variant="flat" className="p-4">
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-sage-600 font-semibold">trust</div>
                <div className="figure mt-1 text-[13px] text-ink-700">sage-500 · AI pick, success</div>
              </Card>
              <Card variant="flat" className="p-4">
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-ember-500 font-semibold">caution</div>
                <div className="figure mt-1 text-[13px] text-ink-700">ember-400 · Flagged, warning</div>
              </Card>
              <Card variant="flat" className="p-4">
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-sky2026-700 font-semibold">info</div>
                <div className="figure mt-1 text-[13px] text-ink-700">sky2026-500 · Scheduled, live</div>
              </Card>
            </div>
          </SubSection>
        </Section>

        {/* 02 Typography */}
        <Section num="02" title="Type" sub="Geist variable axis with a deliberate weight ladder. Display at 500/-0.040em reads editorial-light. Numerics get their own .figure class.">
          <SubSection label="Display headlines (.editorial · 500 weight, -0.040em tracking)">
            <div className="space-y-6">
              <TypeRow role="hero-l" size="36 / 44 / 52 px" use="Empty Overview hero only">
                <div className="editorial text-[36px] md:text-[44px] lg:text-[52px] leading-[1.05] text-ink-900">
                  Your AI is ready.
                </div>
              </TypeRow>
              <TypeRow role="hero-m" size="24 / 30 px" use="Page headers, populated Overview">
                <div className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900">
                  Three quotes, one normalized scope.
                </div>
              </TypeRow>
              <TypeRow role="section-l" size="22 / 26 px" use="Section titles inside pages">
                <div className="editorial text-[22px] md:text-[26px] leading-tight text-ink-900">
                  Kitchen sink: P-trap leak and faucet cartridge replacement.
                </div>
              </TypeRow>
            </div>
          </SubSection>

          <SubSection label="AI narration (.editorial-italic · 400 italic)">
            <TypeRow role="ai-narration" size="16 px" use="AI plain-language callouts. Quiet, conversational.">
              <p className="editorial-italic text-[16px] leading-relaxed text-ink-900 max-w-2xl">
                "Jason is the cheapest that's complete, fair price, full scope, fastest. Bayline includes more but charges a $75 fee + 21% labor premium."
              </p>
            </TypeRow>
          </SubSection>

          <SubSection label="Body + numerics">
            <div className="space-y-6">
              <TypeRow role="title-md" size="15 px · 500" use="Card titles, contractor names">
                <div className="text-[15px] font-medium text-ink-900 tracking-[-0.015em]">Jason Plumbing Co.</div>
              </TypeRow>
              <TypeRow role="body-md" size="14 px · 400" use="Default body">
                <p className="text-[14px] leading-relaxed text-ink-700 max-w-xl">
                  Homewise drafted this scope from your intake conversation and photos. You can edit any section before contractors see it.
                </p>
              </TypeRow>
              <TypeRow role="figure (.figure class)" size="500 + tnum + cv11" use="Numerics · ratings, hours, money">
                <div className="flex items-center gap-5">
                  <span className="figure text-[15px] text-ink-900">4.8</span>
                  <span className="figure text-[14px] text-ink-700">0.75 hr</span>
                  <span className="figure text-[14px] text-ink-700">$220</span>
                  <span className="figure text-[14px] text-sage-600">96%</span>
                </div>
              </TypeRow>
              <TypeRow role="eyebrow" size="11 px · 500 · 0.20em" use="Always paired with the rule-line gesture">
                <Rule width="sm" tone="strong" eyebrow="The eyebrow rule pattern" />
              </TypeRow>
            </div>
          </SubSection>
        </Section>

        {/* 03 Components */}
        <Section num="03" title="Components" sub="The shared primitives in src/components/ui/. Use them · don't hand-roll their classes per page.">
          <SubSection label="Button · 6 variants, 3 sizes">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="sage">Sage</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button variant="primary" icon={Send}>With icon</Button>
                <Button variant="secondary" iconRight={ArrowRight}>Trailing icon</Button>
              </div>
            </div>
          </SubSection>

          <SubSection label="Pill · 6 tones (status + live indicator)">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="neutral">Neutral</Pill>
              <Pill tone="sage" icon={CheckCircle2}>Sage · success</Pill>
              <Pill tone="ember" icon={AlertTriangle}>Ember · caution</Pill>
              <Pill tone="sky" icon={Clock}>Sky · scheduled</Pill>
              <Pill tone="soft">Soft</Pill>
              <Pill tone="sage" live>Live indicator</Pill>
            </div>
          </SubSection>

          <SubSection label="Card · 4 variants">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">default</div>
                <div className="figure mt-2 text-[15px] text-ink-900">bg-white/80</div>
              </Card>
              <Card variant="quiet" className="p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">quiet</div>
                <div className="figure mt-2 text-[15px] text-ink-900">canvas-soft/70</div>
              </Card>
              <Card variant="flat" className="p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">flat</div>
                <div className="figure mt-2 text-[15px] text-ink-900">white solid</div>
              </Card>
              <Card variant="glass" className="p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">glass</div>
                <div className="figure mt-2 text-[15px] text-ink-900">blur + hairline</div>
              </Card>
            </div>
          </SubSection>

          <SubSection label="Confidence · animated bar with threshold color">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
              <Confidence value={96} label="High · ≥85" />
              <Confidence value={72} label="Medium · ≥65" />
              <Confidence value={48} label="Low · <65" />
            </div>
          </SubSection>

          <SubSection label="Rule · the brand gesture · widths & tones">
            <div className="space-y-3">
              <Rule width="xs" eyebrow="xs · w-3 · 12px" />
              <Rule width="sm" eyebrow="sm · w-6 · 24px (default eyebrow pair)" />
              <Rule width="md" eyebrow="md · w-12 · 48px" />
              <Rule width="lg" eyebrow="lg · w-24 · 96px" />
              <Rule width="sm" tone="strong" eyebrow="tone: strong (ink-300)" />
              <Rule width="sm" tone="trust" eyebrow="tone: trust (sage-300)" />
            </div>
          </SubSection>
        </Section>

        {/* 04 Surface depth */}
        <Section num="04" title="Surface depth · 5-tier ladder without shadows" sub="Layered flatness. Every surface lives on exactly one tier. Shadows are banned.">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <SurfaceTile tier="0" name="canvas" bg="bg-canvas" />
            <SurfaceTile tier="1" name="canvas-soft" bg="bg-canvas-soft" />
            <SurfaceTile tier="2" name="card-white" bg="bg-white/80 border border-ink-100/70" />
            <SurfaceTile tier="3" name="canvas-deep" bg="bg-canvas-deep hairline-inset" />
            <SurfaceTile tier="4" name="ink-900" bg="bg-ink-900 hairline-on-dark grain-dark text-canvas-soft" dark />
          </div>

          <SubSection label="Hairlines · the 4 utility classes (no shadows allowed)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <HairlineTile name=".hairline" desc="0.06 inset" cls="hairline bg-white" />
              <HairlineTile name=".hairline-strong" desc="0.10 inset" cls="hairline-strong bg-white" />
              <HairlineTile name=".hairline-inset" desc="Top highlight + inner ring · tier-3 wells" cls="hairline-inset bg-canvas-deep" />
              <HairlineTile name=".hairline-on-dark" desc="Top specular edge · ink-900 surfaces" cls="hairline-on-dark bg-ink-900 text-canvas-soft" dark />
            </div>
          </SubSection>
        </Section>

        {/* 05 Textures */}
        <Section num="05" title="Brand textures" sub="Defined sparingly. Used to anchor empty space and add craft to dark surfaces without crossing into decoration.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-canvas h-44">
              <div className="absolute inset-0 dot-grid opacity-50" />
              <div className="relative h-full p-5 flex flex-col justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-semibold">
                  .dot-grid
                </span>
                <span className="figure text-[13px] text-ink-700">
                  18px radial dots at 0.06 alpha · empty-state anchor
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-ink-900 hairline-on-dark grain-dark h-44">
              <div className="relative h-full p-5 flex flex-col justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-canvas-soft/70 font-semibold">
                  .grain-dark
                </span>
                <span className="figure text-[13px] text-canvas-soft/70">
                  SVG fractal-noise at 4% · machined metal vs. flat paint
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* 06 Iconography */}
        <Section num="06" title="Iconography" sub="lucide-react at strokeWidth={1.8} default. Smaller icons (size 9-13) stay at 2 for legibility · same approach as Apple SF Symbols.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <IconTile size={20} weight={1.8} Icon={Send} label="1.8 · chrome default" />
            <IconTile size={11} weight={2} Icon={CheckCircle2} label="2.0 · small icons (9-13px)" />
            <IconTile size={13} weight={2.2} Icon={Sparkles} label="2.2 · AI brand-chip Sparkles" />
            <IconTile size={11} weight={2.5} Icon={CheckCircle2} label="2.5 · FlowProgress check" />
          </div>
        </Section>

        {/* 07 Voice */}
        <Section num="07" title="Voice" sub="Plain language. Sentence case. No technical claims as trust signals.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <VoiceRow rule="No em dashes in user copy." why="They read as legal/marketing filler. Use periods, commas, colons, or the middle dot (·) instead." />
            <VoiceRow rule="Sentence case for headings." why="Title Case reads SaaS-corporate. Sentence case reads like a calm assistant." />
            <VoiceRow rule="No technical claims as trust signals." why="'End-to-end encrypted' was dropped from sign-up. The real hook is 'No contractor sees your home until you ask.'" />
            <VoiceRow rule="Italics are quote markers in AI narration." why="When the AI speaks plainly, italics carry the conversational voice · not decoration." />
          </div>
        </Section>

        {/* Footer */}
        <footer className="pt-10 border-t border-ink-100/80">
          <Rule width="sm" tone="strong" eyebrow="Hearth · v1 · Homewise Design System" />
          <p className="mt-3 text-[12.5px] text-ink-500 max-w-2xl leading-relaxed">
            Full token spec + component recipes + voice rules live in <a href="https://github.com/chang627627/homewise/blob/main/DESIGN.md" className="text-ink-900 underline underline-offset-2 hover:text-ink-700">DESIGN.md</a>. Drift is caught by <code className="figure text-[12px] bg-canvas-soft px-1.5 py-0.5 rounded-md ring-1 ring-ink-100">npm run design-check</code>. Propose new tokens via <code className="figure text-[12px] bg-canvas-soft px-1.5 py-0.5 rounded-md ring-1 ring-ink-100">src/data/design-pending.js</code>.
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

const TYPE_LABELS = {
  color: 'Color',
  type: 'Type',
  component: 'Component',
  pattern: 'Pattern',
  hairline: 'Hairline',
  texture: 'Texture',
  other: 'Other',
};

function PendingReviewSection({ items }) {
  return (
    <section className="rounded-3xl bg-canvas-deep/40 hairline-inset px-6 lg:px-8 py-7 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Pill tone="sage" live>Awaiting your approval</Pill>
        <div className="flex items-center gap-2">
          <span className="h-px w-3 bg-ink-300" />
          <span className="figure text-[11px] uppercase tracking-[0.18em] text-ink-700 font-semibold">
            Pending review · {items.length}
          </span>
        </div>
      </div>
      <p className="text-[13px] text-ink-500 leading-relaxed max-w-2xl">
        Proposals from contributors land here first. Review each one, then move it into DESIGN.md + the relevant section of this page to approve. Remove from <code className="figure text-[11.5px] bg-white/70 px-1.5 py-0.5 rounded-md ring-1 ring-ink-100">src/data/design-pending.js</code> to clear the queue.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <PendingCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function PendingCard({ item }) {
  return (
    <Card variant="flat" className="p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Pill tone="neutral">{TYPE_LABELS[item.type] || item.type}</Pill>
        <span className="figure text-[10.5px] text-ink-400">
          {item.proposedDate} · {item.proposedBy}
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-[14px] font-medium text-ink-900 tracking-[-0.010em]">
          {item.name}
        </div>
        <p className="text-[12.5px] text-ink-500 leading-relaxed">
          {item.description}
        </p>
      </div>
      {item.preview && <PendingPreview preview={item.preview} />}
    </Card>
  );
}

function PendingPreview({ preview }) {
  if (preview.kind === 'swatch') {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-canvas-soft/60 ring-1 ring-ink-100 p-2">
        <span
          className="h-10 w-10 rounded-lg ring-1 ring-ink-100"
          style={{ backgroundColor: preview.bg }}
        />
        {preview.hex && (
          <span className="figure text-[11.5px] text-ink-700">{preview.hex}</span>
        )}
      </div>
    );
  }
  if (preview.kind === 'text') {
    return (
      <div className="rounded-xl bg-canvas-soft/60 ring-1 ring-ink-100 p-3">
        <div className="text-[14px] text-ink-900">{preview.text}</div>
      </div>
    );
  }
  if (preview.kind === 'component' && preview.cls) {
    return (
      <div className="rounded-xl bg-canvas-soft/60 ring-1 ring-ink-100 p-3">
        <div className={preview.cls}>{preview.text || 'Preview'}</div>
      </div>
    );
  }
  return null;
}

function Section({ num, title, sub, children }) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] tabular-nums text-ink-400 font-bold">{num}</span>
          <span className="h-px w-4 bg-ink-200" />
          <h2 className="editorial text-[22px] md:text-[26px] leading-tight text-ink-900">
            {title}
          </h2>
        </div>
        {sub && (
          <p className="ml-7 max-w-2xl text-[13.5px] text-ink-500 leading-relaxed">
            {sub}
          </p>
        )}
      </div>
      <div className="ml-7 space-y-8">{children}</div>
    </section>
  );
}

function SubSection({ label, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-px w-3 bg-ink-200" />
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Swatch({ label, hex, use, bg, textOnDark = false, small = false }) {
  return (
    <div className="rounded-2xl bg-white border border-ink-100/70 overflow-hidden">
      <div className={`${bg} ${small ? 'h-14' : 'h-20'} flex items-end p-2.5 ${textOnDark ? 'text-canvas-soft' : 'text-ink-900'}`}>
        {small ? null : (
          <span className="figure text-[10.5px] opacity-70">{hex}</span>
        )}
      </div>
      <div className="p-2.5">
        <div className="text-[11.5px] font-medium text-ink-900 tracking-tight truncate">{label}</div>
        {small ? (
          <div className="figure text-[10px] text-ink-500 mt-0.5">{hex}</div>
        ) : (
          use && <div className="text-[10.5px] text-ink-500 mt-0.5 truncate">{use}</div>
        )}
      </div>
    </div>
  );
}

function TypeRow({ role, size, use, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
      <div className="md:col-span-3 space-y-0.5">
        <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
          {role}
        </div>
        <div className="figure text-[11px] text-ink-400">{size}</div>
        {use && <div className="text-[11px] text-ink-500 mt-1 leading-snug">{use}</div>}
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}

function SurfaceTile({ tier, name, bg, dark = false }) {
  return (
    <div className={`rounded-2xl ${bg} h-28 p-3.5 flex flex-col justify-between`}>
      <span className={`text-[10.5px] uppercase tracking-[0.18em] font-semibold ${dark ? 'text-canvas-soft/70' : 'text-ink-500'}`}>
        Tier {tier}
      </span>
      <span className={`figure text-[12.5px] ${dark ? 'text-canvas-soft' : 'text-ink-900'}`}>
        {name}
      </span>
    </div>
  );
}

function HairlineTile({ name, desc, cls, dark = false }) {
  return (
    <div className={`rounded-2xl ${cls} p-3.5 h-28 flex flex-col justify-between`}>
      <span className={`figure text-[12px] ${dark ? 'text-canvas-soft' : 'text-ink-900'}`}>
        {name}
      </span>
      <span className={`text-[11px] leading-snug ${dark ? 'text-canvas-soft/70' : 'text-ink-500'}`}>
        {desc}
      </span>
    </div>
  );
}

function IconTile({ size, weight, Icon, label }) {
  return (
    <div className="rounded-2xl bg-white border border-ink-100/70 p-4 flex flex-col items-center gap-2.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-canvas-soft text-ink-900 ring-1 ring-ink-100">
        <Icon size={size} strokeWidth={weight} />
      </div>
      <div className="text-[10.5px] text-ink-500 text-center leading-snug">{label}</div>
    </div>
  );
}

function VoiceRow({ rule, why }) {
  return (
    <div className="rounded-2xl bg-white border border-ink-100/70 p-4">
      <div className="text-[13px] font-medium text-ink-900 tracking-[-0.010em]">{rule}</div>
      <div className="text-[12.5px] text-ink-500 mt-1.5 leading-relaxed">{why}</div>
    </div>
  );
}

