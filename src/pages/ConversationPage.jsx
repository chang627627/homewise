import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  Send,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Mic,
  ArrowUp,
  CheckCircle2,
  Star,
  Droplets,
  Wind,
  Clock,
  ExternalLink,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import BackBar from '../components/ui/BackBar';
import Pill from '../components/ui/Pill';

// Conversation datasets. each task has its own thread
const conversations = {
  sink: {
    title: 'Kitchen sink leak & drip repair',
    icon: Droplets,
    accent: 'sage',
    statusPill: { tone: 'ember', label: 'Awaiting your approval' },
    confidence: 92,
    started: 'Today · 10:28 AM',
    artifacts: [
      { id: 'scope', label: 'Scope of work', sub: '7 sections · v1', icon: FileText, target: 'scope' },
      { id: 'contractors', label: 'Contractor matches', sub: '3 verified', icon: ShieldCheck, target: 'contractor-compare' },
      { id: 'quotes', label: 'Quote comparison', sub: '2 of 3 in', icon: TrendingUp, target: 'quote-compare' },
    ],
    thread: [
      { type: 'date', label: 'Today · April 23' },
      {
        type: 'user',
        text: 'My bathroom sink is leaking and I need someone this week.',
        time: '10:28 AM',
      },
      {
        type: 'photos',
        photos: [
          { tone: 'sage', label: 'Under the sink', tag: 'Standing water' },
          { tone: 'sky', label: 'Faucet base', tag: 'Slight drip' },
        ],
      },
      {
        type: 'agent',
        text: "I see standing water around the P-trap and a slow drip at the faucet base. . Usually two separate problems. I'll need a couple of details.",
        time: '10:29 AM',
      },
      {
        type: 'agent-urgency',
        text: 'How active is this right now? It changes how fast I push for a contractor.',
        selected: 'Slow leak, this week',
        time: '10:29 AM',
      },
      {
        type: 'user',
        text: 'Slow leak. Sometime this week is fine.',
        time: '10:29 AM',
      },
      {
        type: 'user',
        text: 'Single-handle faucet. Sending the panel photo now.',
        time: '10:31 AM',
      },
      {
        type: 'photos',
        photos: [{ tone: 'ember', label: 'Behind panel', tag: 'Supply line dry' }],
      },
      {
        type: 'agent',
        text: "Perfect, supply line is dry, so this is contained. Drafting a scope now: P-trap replacement plus a single-handle faucet cartridge swap.",
        time: '10:32 AM',
      },
      {
        type: 'artifact',
        kind: 'scope',
        title: 'Scope of work · SOW-2026-0423-001',
        meta: '4 tasks · 3 materials · acceptance criteria · unit-priced add-ons',
        confidence: 92,
        target: 'scope',
        time: '10:33 AM',
      },
      {
        type: 'agent',
        text: "Scope approved. I'll send it to 3 verified plumbers within 5 miles and start the quote window.",
        time: '10:34 AM',
      },
      { type: 'action', icon: ShieldCheck, accent: 'sage', title: 'Checked license records', detail: '3 contractors · all current with state board', time: '10:35 AM' },
      { type: 'action', icon: BadgeCheck, accent: 'sage', title: 'Verified insurance status', detail: '2 of 3 GL + WC current · Quickfix renewal pending', time: '10:36 AM' },
      { type: 'action', icon: TrendingUp, accent: 'sky', title: 'Compared local pricing benchmark', detail: '46 nearby plumbing jobs · last 90 days', time: '10:38 AM' },
      { type: 'action', icon: Send, accent: 'sky', title: 'Outreach sent to 3 contractors', detail: 'Same scope, same form.  5-day window.', time: '10:42 AM' },
      {
        type: 'agent',
        text: "Just received Jason Plumbing's quote. $220, fair price for the scope, available Friday afternoon.",
        time: '11:08 AM',
      },
      {
        type: 'artifact',
        kind: 'quote',
        title: 'Jason Plumbing Co.',
        meta: '4.8 ★ · Friday avail. · License verified',
        price: '$220',
        verdict: 'Fair price',
        target: 'quote-compare',
        time: '11:08 AM',
      },
      {
        type: 'agent',
        text: "Quick side-by-side now that the others are in. Bayline came in at $390 (above market with a $75 service fee), Quickfix at $175 but their quote is missing materials. I'd recommend Jason, or ask Quickfix to clarify.",
        time: '11:10 AM',
      },
      {
        type: 'artifact',
        kind: 'compare',
        title: 'Quote comparison · 2 of 3 received',
        meta: 'Avg 12% under benchmark · 3 deviations flagged',
        target: 'quote-compare',
        time: '11:10 AM',
      },
      {
        type: 'live',
        text: 'Awaiting your approval to book Jason for Friday at 2 PM',
        eta: 'No rush · slow leak',
      },
    ],
  },
  hvac: {
    title: 'HVAC seasonal maintenance',
    icon: Wind,
    accent: 'sky',
    statusPill: { tone: 'ember', label: 'Outreach awaiting your approval' },
    confidence: 76,
    started: '3 days ago',
    artifacts: [
      { id: 'shortlist', label: 'Contractor shortlist', sub: '3 verified HVAC techs', icon: ShieldCheck, target: 'contractor-compare' },
    ],
    thread: [
      { type: 'date', label: '3 days ago · April 20' },
      {
        type: 'agent',
        text: "Quick check-in, your Trane XR16 is due for a seasonal tune-up before summer. I can find a few HVAC techs and prepare outreach. Want me to start?",
        time: '9:14 AM',
      },
      {
        type: 'user',
        text: 'Yes, find some.',
        time: '9:21 AM',
      },
      { type: 'action', icon: ShieldCheck, accent: 'sage', title: 'Shortlisted 3 verified HVAC techs', detail: 'Filtered by Trane experience + seasonal tune-up history', time: '9:25 AM' },
      { type: 'action', icon: TrendingUp, accent: 'sky', title: 'Pulled local pricing benchmark', detail: 'Standard tune-up: $110–$180', time: '9:26 AM' },
      {
        type: 'agent',
        text: "Drafted outreach for the week of May 4. Ready for you to review and send.",
        time: '9:32 AM',
      },
      {
        type: 'artifact',
        kind: 'outreach',
        title: 'Outreach message · drafted',
        meta: 'Sent to 3 techs · awaiting your approval to send',
        target: 'approvals',
        time: '9:32 AM',
      },
      {
        type: 'live',
        text: 'Waiting for you to approve outreach',
        eta: 'No deadline',
      },
    ],
  },
  warranty: {
    title: 'Water heater warranty',
    icon: ShieldCheck,
    accent: 'ember',
    statusPill: { tone: 'sage', label: 'Watching · 92 days to expiration' },
    confidence: 98,
    started: 'Jul 14, 2024 (warranty registered)',
    artifacts: [
      { id: 'warranty', label: 'Warranty record', sub: 'Rheem PROG50 · 6-yr', icon: ShieldCheck, target: 'warranties' },
    ],
    thread: [
      { type: 'date', label: 'Today · April 23' },
      { type: 'action', icon: Calendar, accent: 'ember', title: 'Warranty expiration in 92 days', detail: 'Rheem PROG50 · expires Jul 14, 2026', time: '8:00 AM' },
      {
        type: 'agent',
        text: 'Heads up, your water heater warranty expires in 3 months. Want me to gather 2-3 replacement estimates now so you have leverage if the unit fails near expiration? Replacements are typically $1,400–$2,200 installed in your area.',
        time: '8:01 AM',
      },
      {
        type: 'live',
        text: 'Awaiting your call · I can wait or start gathering estimates',
        eta: '92 days until warranty expires',
      },
    ],
  },
};

const accentMap = {
  sage: 'bg-sage-50 text-sage-600 ring-sage-100',
  sky: 'bg-sky2026-50 text-sky2026-700 ring-sky2026-100',
  ember: 'bg-ember-50 text-ember-500 ring-ember-100',
};

const photoTone = {
  sage: 'from-sage-200 to-sage-300',
  sky: 'from-sky2026-100 to-sky2026-300',
  ember: 'from-ember-100 to-ember-200',
};

export default function ConversationPage({ onNavigate, conversationId = 'sink', decisionHandled = false }) {
  let c = conversations[conversationId] || conversations.sink;

  // Once the user has approved Jason on the Quote Compare page, append the
  // booking-confirmation tail of the conversation and update the status.
  if (conversationId === 'sink' && decisionHandled) {
    const baseThread = c.thread.filter((m) => m.type !== 'live');
    c = {
      ...c,
      statusPill: { tone: 'sage', label: 'Confirmed · Friday 2 PM' },
      artifacts: c.artifacts.map((a) =>
        a.id === 'quotes' ? { ...a, sub: 'Approved · Jason booked' } : a
      ),
      thread: [
        ...baseThread,
        {
          type: 'action',
          icon: CheckCircle2,
          accent: 'sage',
          title: 'You approved Jason · Friday 2 PM',
          detail: 'Confirmed via Quote comparison',
          time: '11:14 AM',
        },
        {
          type: 'action',
          icon: CheckCircle2,
          accent: 'sage',
          title: 'Booking confirmed with Jason Plumbing Co.',
          detail: 'Friday, April 25 · 2:00–4:00 PM window',
          time: '11:14 AM',
        },
        {
          type: 'action',
          icon: Calendar,
          accent: 'sage',
          title: 'Added to your calendar',
          detail: 'Reminder set for 30 min before arrival',
          time: '11:14 AM',
        },
        {
          type: 'agent',
          text: "Booked. Jason will text you 30 minutes before he arrives Friday at 2 PM. I'll check in once it's done, and if anything changes, I'll re-engage Bayline as backup.",
          time: '11:15 AM',
        },
        {
          type: 'live',
          text: 'Confirmed · Friday April 25, 2:00 PM',
          eta: '2 days away',
        },
      ],
    };
  }

  const Icon = c.icon;

  return (
    <div className="space-y-7">
      <BackBar
        onBack={() => onNavigate?.('tasks')}
        label="Back to active tasks"
        context={`Conversation · ${c.started}`}
      />

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 shrink-0 ${accentMap[c.accent]}`}
          >
            <Icon size={18} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-semibold">
                Conversation
              </span>
              <Pill tone={c.statusPill.tone}>{c.statusPill.label}</Pill>
            </div>
            <h1 className="editorial text-[22px] md:text-[28px] leading-[1.04] text-ink-900 tracking-tight">
              {c.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversation thread */}
        <article className="lg:col-span-8 rounded-3xl bg-white border border-ink-100/80 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-ink-100/80 bg-gradient-to-b from-canvas-soft/40 to-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
              </span>
              <span className="text-[12px] font-semibold text-ink-900">
                Live thread
              </span>
              <span className="text-[11px] text-ink-500">· {c.thread.length} messages</span>
            </div>
            <button className="text-[11.5px] text-ink-500 hover:text-ink-900 transition-colors">
              Export thread →
            </button>
          </div>

          <div className="px-6 py-6 space-y-5 bg-gradient-to-b from-white to-canvas-soft/20 max-h-[680px] overflow-y-auto">
            {c.thread.map((m, i) => {
              if (m.type === 'date') return <DateDivider key={i} m={m} />;
              if (m.type === 'user') return <UserMessage key={i} m={m} />;
              if (m.type === 'photos') return <PhotoStrip key={i} m={m} />;
              if (m.type === 'agent') return <AgentMessage key={i} m={m} />;
              if (m.type === 'agent-urgency') return <UrgencyShown key={i} m={m} />;
              if (m.type === 'action') return <ActionItem key={i} m={m} />;
              if (m.type === 'artifact')
                return <ArtifactCard key={i} m={m} onNavigate={onNavigate} />;
              if (m.type === 'live') return <LiveIndicator key={i} m={m} />;
              return null;
            })}
          </div>

          {/* Reply input */}
          <div className="border-t border-ink-100/80 px-4 py-3 bg-gradient-to-t from-canvas-soft/40 to-white flex items-center gap-2">
            <button className="h-10 w-10 rounded-2xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0">
              <Paperclip size={14} strokeWidth={1.9} />
            </button>
            <button className="h-10 w-10 rounded-2xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0">
              <Mic size={14} strokeWidth={1.9} />
            </button>
            <input
              type="text"
              placeholder="Reply to Homewise about this job…"
              className="flex-1 h-10 px-3.5 rounded-2xl bg-canvas-soft border border-ink-100 placeholder:text-ink-400 text-[13px] focus:outline-none focus:border-ink-300 min-w-0"
            />
            <button className="group h-10 px-3 rounded-2xl bg-ink-900 text-canvas-soft hover:bg-ink-700 transition-all inline-flex items-center gap-1.5 text-[12.5px] font-semibold shrink-0">
              Send
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-canvas-soft/15 group-hover:bg-canvas-soft/25 transition-colors">
                <ArrowUp size={11} strokeWidth={2.4} />
              </span>
            </button>
          </div>
        </article>

        {/* Side rail */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Task summary */}
          <div className="rounded-3xl bg-white border border-ink-100/80 p-5">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-3">
              Task summary
            </div>
            <div className="space-y-2.5 text-[12.5px]">
              <SummaryRow label="Started" value={c.started} />
              <SummaryRow label="Status" value={c.statusPill.label} />
              <SummaryRow
                label="AI confidence"
                value={`${c.confidence}% · ${c.confidence >= 85 ? 'High' : c.confidence >= 65 ? 'Medium' : 'Low'}`}
              />
            </div>
          </div>

          {/* Linked artifacts */}
          <div className="rounded-3xl bg-white border border-ink-100/80 p-5">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-3">
              Generated artifacts
            </div>
            <div className="space-y-1.5">
              {c.artifacts.map((a) => {
                const AIcon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => onNavigate?.(a.target)}
                    className="group w-full flex items-center gap-2.5 rounded-xl bg-canvas-soft border border-ink-100 hover:border-ink-200 px-3 py-2.5 text-left transition-all"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-ink-700 ring-1 ring-ink-100 shrink-0">
                      <AIcon size={13} strokeWidth={1.9} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold text-ink-900 truncate">
                        {a.label}
                      </div>
                      <div className="text-[11px] text-ink-500 truncate">
                        {a.sub}
                      </div>
                    </div>
                    <ExternalLink
                      size={12}
                      className="text-ink-400 group-hover:text-ink-700 transition-colors shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl bg-white border border-ink-100/80 p-5">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-3">
              Suggested next
            </div>
            <div className="space-y-1.5">
              {(decisionHandled
                ? [
                    'Reschedule the visit',
                    'Message Jason a question',
                    'Have AI re-engage Bayline as backup',
                    'Pause this conversation',
                  ]
                : [
                    'Approve Jason for Friday 2 PM',
                    'Ask Quickfix to clarify materials',
                    'Have Homewise negotiate on price',
                    'Pause this conversation',
                  ]
              ).map((q) => (
                <button
                  key={q}
                  className="w-full text-left rounded-xl bg-canvas-soft border border-ink-100 px-3 py-2 text-[12px] text-ink-700 hover:border-ink-200 hover:bg-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DateDivider({ m }) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft border border-ink-100 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
        {m.label}
      </span>
    </div>
  );
}

function UserMessage({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2.5 justify-end"
    >
      <div className="max-w-[78%] rounded-3xl rounded-tr-md bg-ink-900 text-canvas-soft px-4 py-3">
        <p className="text-[13.5px] leading-relaxed">{m.text}</p>
        <div className="mt-1 flex items-center justify-end">
          <span className="text-[10.5px] tabular-nums text-canvas-soft/60">
            {m.time}
          </span>
        </div>
      </div>
      <div className="shrink-0 mt-0.5 h-8 w-8 rounded-2xl ring-1 ring-ink-100 overflow-hidden bg-gradient-to-br from-sage-200 via-sage-100 to-ember-100 flex items-center justify-center">
        <span className="editorial text-[14px] text-sage-700">M</span>
      </div>
    </motion.div>
  );
}

function PhotoStrip({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex gap-2 justify-end"
    >
      {m.photos.map((p, i) => (
        <div
          key={i}
          className="relative w-32 h-24 rounded-2xl overflow-hidden ring-1 ring-ink-100"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${photoTone[p.tone]}`} />
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute top-1.5 left-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-1.5 py-0.5 text-[9.5px] font-semibold text-ink-700 ring-1 ring-ink-100">
              <ImageIcon size={9} strokeWidth={2.2} />
              {p.label}
            </span>
          </div>
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-ink-900/80 backdrop-blur px-1.5 py-0.5 text-[9.5px] font-semibold text-canvas-soft">
              <Sparkles size={9} className="text-sage-200" strokeWidth={2.2} />
              AI: {p.tag}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function AgentMessage({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-start gap-2.5"
    >
      <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
        <Sparkles size={13} strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0 max-w-[80%]">
        <div className="rounded-3xl rounded-tl-md bg-white border border-ink-100 px-4 py-3">
          <p className="text-[13.5px] leading-relaxed text-ink-900">{m.text}</p>
          <div className="mt-1 flex items-center justify-end">
            <span className="text-[10.5px] tabular-nums text-ink-400">{m.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UrgencyShown({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-start gap-2.5"
    >
      <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
        <Sparkles size={13} strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0 max-w-[80%]">
        <div className="rounded-3xl rounded-tl-md bg-white border border-ink-100 px-4 py-3">
          <p className="text-[13.5px] leading-relaxed text-ink-900 mb-2">{m.text}</p>
          <div className="inline-flex items-center gap-2 rounded-xl bg-sage-500 text-white px-2.5 py-1.5">
            <Clock size={11} strokeWidth={2.2} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">
              {m.selected}
            </span>
            <CheckCircle2 size={11} strokeWidth={2.2} />
          </div>
          <div className="mt-1.5 flex items-center justify-end">
            <span className="text-[10.5px] tabular-nums text-ink-400">{m.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActionItem({ m }) {
  const Icon = m.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2.5"
    >
      <span
        className={`shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl ring-1 ${accentMap[m.accent]} bg-white`}
      >
        <Icon size={13} strokeWidth={1.9} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12.5px] font-medium text-ink-900">{m.title}</span>
          <span className="text-[10.5px] tabular-nums text-ink-400 shrink-0">
            {m.time}
          </span>
        </div>
        <div className="text-[11.5px] text-ink-500 mt-0.5">{m.detail}</div>
      </div>
    </motion.div>
  );
}

function ArtifactCard({ m, onNavigate }) {
  // 3 visual variants: scope, quote, compare, outreach
  const accents = {
    scope: 'from-sage-50 to-white border-sage-100',
    quote: 'from-sky2026-50 to-white border-sky2026-100',
    compare: 'from-ember-50 to-white border-ember-100',
    outreach: 'from-canvas-soft to-white border-ink-100',
  };
  const icons = {
    scope: FileText,
    quote: Star,
    compare: TrendingUp,
    outreach: Send,
  };
  const Icon = icons[m.kind] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-2.5"
    >
      <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
        <Sparkles size={13} strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0 max-w-[88%]">
        <button
          onClick={() => onNavigate?.(m.target)}
          className={`group w-full rounded-3xl rounded-tl-md bg-gradient-to-br ${accents[m.kind]} border hover: transition-all overflow-hidden text-left`}
        >
          <div className="px-4 py-3.5 flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-ink-700 ring-1 ring-ink-100 shrink-0">
              <Icon size={15} strokeWidth={1.9} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  Generated by Homewise
                </span>
                <span className="text-[10.5px] tabular-nums text-ink-400">
                  {m.time}
                </span>
              </div>
              <div className="text-[14px] font-semibold text-ink-900 tracking-[-0.005em] mt-0.5">
                {m.title}
              </div>
              <div className="text-[12px] text-ink-500 mt-0.5">{m.meta}</div>
              {m.price && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="editorial text-[20px] leading-none text-ink-900 tabular-nums">
                    {m.price}
                  </span>
                  {m.verdict && (
                    <Pill tone="sage">{m.verdict}</Pill>
                  )}
                </div>
              )}
              {m.confidence && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 ring-1 ring-ink-100 px-2 py-0.5 text-[10.5px] font-semibold">
                  <Sparkles size={10} className="text-sage-500" />
                  AI confidence · {m.confidence}%
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-ink-100 bg-white/60 px-4 py-2 flex items-center justify-between">
            <span className="text-[11.5px] text-ink-500">Click to open full view</span>
            <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-ink-700 group-hover:text-ink-900 transition-colors">
              Open <ExternalLink size={11} />
            </span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

function LiveIndicator({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-2.5 rounded-2xl bg-canvas-soft border border-dashed border-ink-200 px-3.5 py-3 mt-2"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
      </span>
      <div className="flex-1 text-[12.5px] text-ink-700">{m.text}</div>
      <span className="text-[10.5px] text-ink-500 shrink-0">{m.eta}</span>
    </motion.div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-ink-500 text-[11.5px] uppercase tracking-[0.12em] font-semibold">
        {label}
      </span>
      <span className="text-ink-900 font-medium text-right">{value}</span>
    </div>
  );
}
