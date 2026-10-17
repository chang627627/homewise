import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import IconButton from '../v2/IconButton';
import Tooltip from '../v2/Tooltip';
import { StatusGlyph } from '../v2/Status';
import useMediaQuery, { usePrefersReducedMotion } from '../v2/useMediaQuery';
import useScrolled from '../v2/useScrolled';
import { dur, ease, enter, fade, prefersReducedMotion } from '../v2/motion';
import { DEFAULT_BOOKING, DEFAULT_URGENCY, GATES, GUTTERS_PLAN, JOB, PLAN, describeBooking } from '../../data/demo';
import Composer from './thread/Composer';
import { ActivityRail, AgentProse, DayMarker, FinishLine, PhaseHeader, PlanList, Receipt, ReceiptGroup, UserMessage } from './thread/lines';
import {
  AC_KICKOFFS,
  GROUPS,
  PHASES,
  PROGRESS_MARKS,
  SCRIPTS,
  SINK_KICKOFFS,
  WAIT,
  flagFor,
  initialStep,
  resolve,
} from './thread/script';

// One conversation per task. The script plays on timers and parks on gates:
// kickoff, upload, urgency, plan and ladder resolve here through the composer
// dock; the board gates (approve-scope, approve-outreach, approve-jason,
// close-out) wait on props.gates. Inactive threads stay mounted and hidden,
// so their timers keep running.

const RENDERED = new Set(['marker', 'agent', 'user', 'receipt', 'finish']);
const SIDE = { marker: 'neutral', finish: 'neutral', user: 'user', agent: 'agent', receipt: 'agent', group: 'agent' };
const LINES = new Set(['receipt', 'group']);
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25';

export default function Thread({
  variant = 'sink',
  active = true,
  open = true,
  onToggle,
  compact = false,
  focus = false,
  gates,
  booking = null,
  urgency = null,
  recommended = null,
  progress,
  staged = null,
  onEffect,
  onRestage,
}) {
  const script = SCRIPTS[variant] || SCRIPTS.fresh;
  const kickoffs = variant === 'sink' ? SINK_KICKOFFS : AC_KICKOFFS;
  const [bootStep] = useState(() => initialStep(script));
  const [step, setStep] = useState(bootStep);
  const [kickoff, setKickoff] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [urgencyChoice, setUrgencyChoice] = useState(null);
  const [planApproved, setPlanApproved] = useState(false);
  const [ladderChoice, setLadderChoice] = useState(null);
  const [groupOpen, setGroupOpen] = useState({});
  const [phaseOpen, setPhaseOpen] = useState({});
  const [notes, setNotes] = useState([]); // typed outside the kickoff: { text, at: script index }
  const [onScreen, setOnScreen] = useState(true);
  const [scrolled, onScrolled] = useScrolled();
  const narrow = useMediaQuery('(max-width: 1279px)');
  const reduced = usePrefersReducedMotion();
  const uid = useId();

  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const pinned = useRef(true);
  const lastTop = useRef(0);
  const fired = useRef(new Set());
  const uploadTimer = useRef(0);
  const emit = useRef(onEffect);
  emit.current = onEffect;

  const g = gates || {};
  const kicked = variant === 'gutters' || kickoff !== null;
  const u = urgency || urgencyChoice || DEFAULT_URGENCY;
  // Booking copy follows the booked column; before the book gate there is none.
  const bookedAs = variant === 'gutters' || g[GATES.book] ? (describeBooking(booking) ? booking : DEFAULT_BOOKING) : null;
  const ctx = {
    urgency: u,
    urgencyChoice,
    b: bookedAs ? describeBooking(bookedAs) : null,
    booking: bookedAs,
    kickoff,
    ladderChoice,
    recommended,
  };
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  const cleared = (id) => {
    switch (id) {
      case 'kickoff':
        return kickoff !== null;
      case 'upload':
        return uploaded;
      case 'urgency':
        return urgencyChoice !== null;
      case 'plan':
        return planApproved;
      case 'ladder':
        return ladderChoice !== null;
      default:
        return !!g[id];
    }
  };
  const current = script[step];
  const parked = current?.type === 'gate' && !cleared(current.id) ? current : null;

  // Script engine: wait, then reveal; gates block; effects fire once. Keyed on
  // the step and its gate only (ctx comes from a ref), so a shell re-render
  // never restarts a pause in progress.
  useEffect(() => {
    if (!current || parked) return undefined;
    const c = ctxRef.current;
    const next = () => setStep((s) => (s === step ? s + 1 : s));
    if ((current.when && !current.when(c)) || current.type === 'gate' || current.type === 'status' || current.type === 'phase') {
      next();
      return undefined;
    }
    if (current.type === 'effect') {
      if (!fired.current.has(step)) {
        fired.current.add(step);
        emit.current?.(resolve(current.effect, c));
      }
      next();
      return undefined;
    }
    const t = setTimeout(next, resolve(current.wait, c) ?? WAIT[current.type] ?? 650);
    return () => clearTimeout(t);
  }, [step, parked]);

  useEffect(() => () => clearTimeout(uploadTimer.current), []);

  // What has played so far, and the latest status-row entry.
  const shown = Math.min(step, script.length);
  const visible = [];
  const phaseStarts = [];
  let status = null;
  let phaseId = null;
  for (let i = 0; i < shown; i += 1) {
    const e = script[i];
    if (e.when && !e.when(ctx)) continue;
    if (e.type === 'status') status = { state: e.state, text: resolve(e.text, ctx), meta: resolve(e.meta, ctx), target: e.target };
    else if (e.type === 'phase') {
      phaseId = e.id;
      phaseStarts.push({ id: e.id, i });
    } else if (RENDERED.has(e.type)) visible.push({ e, i, phase: phaseId });
  }
  const phaseAt = (i) => {
    let id = null;
    phaseStarts.forEach((p) => {
      if (p.i <= i) id = p.id;
    });
    return id;
  };
  const reached = (mark) => {
    const i = script.findIndex((e) => e.mark === mark);
    return i !== -1 && i < shown;
  };
  const photosRead = visible.some(({ e }) => e.readsPhotos);

  const planSteps = PLAN.map((s) => ({ ...s, done: reached(s.mark), current: false }));
  const currentStep = planApproved ? planSteps.findIndex((s) => !s.done) : -1;
  if (currentStep !== -1) planSteps[currentStep].current = true;
  const localProgress = PROGRESS_MARKS.filter(reached).length / PROGRESS_MARKS.length;
  const prog = variant === 'sink' ? (progress ?? localProgress) : 0;

  // The status the rest of the shell sees (Rail tooltip, Stage header in focus
  // mode), sent only once the shell knows the task exists. A dock waiting on
  // Mara reads as needs-you.
  const startAt = script.findIndex((e) => e.starts);
  const started = startAt === -1 || startAt < shown;
  const strip = !started
    ? null
    : parked?.dock && !parked.dock.keepStatus
      ? { state: 'needs-you', text: parked.dock.status, meta: null }
      : status
        ? { state: status.state, text: status.text, meta: status.state === 'needs-you' ? null : status.meta || null }
        : null;
  const stripKey = strip ? `${strip.state}|${strip.text}|${strip.meta ?? ''}` : '';
  useEffect(() => {
    if (strip) emit.current?.({ type: 'strip', state: strip.state, text: strip.text, meta: strip.meta });
  }, [stripKey]);

  // The live arc is the app's one loop: never while this pane is off screen
  // (hidden, collapsed to 0 by focus mode, or clipped by a parent).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.intersectionRatio > 0), { threshold: [0, 0.01] });
    io.observe(el);
    return () => io.disconnect();
  }, [compact]);

  const W = narrow ? 360 : 400;
  const wasCompact = useRef(compact);
  const modeSwitched = wasCompact.current !== compact;
  useEffect(() => {
    wasCompact.current = compact;
  }, [compact]);
  const showFull = compact || (open && !focus);
  const showStrip = !compact && !open && !focus;
  const live = onScreen && active && !focus;

  // Follow new lines; stay pinned to the bottom while the composer resizes,
  // unless Mara has scrolled up to read.
  const onScroll = (e) => {
    onScrolled(e);
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 8) pinned.current = true;
    else if (el.scrollTop < lastTop.current - 1) pinned.current = false;
    lastTop.current = el.scrollTop;
  };
  // Crossing 1024 moves the Thread's host node to another slot, which resets
  // its scroll, so a mode change re-follows like a reopen.
  const followKey = `${active}|${showFull}|${compact}`;
  const lastFollow = useRef('');
  useEffect(() => {
    const el = scrollRef.current;
    const reopened = lastFollow.current !== followKey;
    lastFollow.current = followKey;
    if (!el || !active || !showFull || (!reopened && !pinned.current)) return;
    pinned.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: reopened || prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [visible.length, notes.length, followKey]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      if (pinned.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(el);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [compact]);

  const answer = (option) => {
    if (!parked) return;
    if (parked.id === 'kickoff') setKickoff(option.value);
    else if (parked.id === 'urgency') setUrgencyChoice(option.value);
    else if (parked.id === 'ladder') setLadderChoice(option.value);
    else if (parked.id === 'plan') {
      if (option.value === 'start') setPlanApproved(true);
      else inputRef.current?.focus();
    }
  };

  const upload = () => {
    if (uploading || uploaded) return;
    setUploading(true);
    uploadTimer.current = setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1200);
  };

  // A typed first message starts the task in Mara's own words. Anything typed
  // later stays in the thread as her turn; only a dock answer moves the script.
  const send = (text) => {
    pinned.current = true;
    if (parked?.id === 'kickoff') setKickoff({ label: text, message: text, railTitle: kickoffs[0].railTitle });
    else setNotes((prev) => [...prev, { text, at: shown }]);
  };

  const title = variant === 'gutters'
    ? GUTTERS_PLAN.title
    : !kicked ? 'New task' : variant === 'sink' ? JOB.name : kickoff.railTitle;

  // Fold consecutive receipts of one group, place typed notes where they were
  // sent, then group items into turns.
  const items = [];
  let lastKey = null;
  let ni = 0;
  const notesBefore = (i) => {
    for (; ni < notes.length && notes[ni].at <= i; ni += 1) {
      items.push({ kind: 'user', key: `n${ni}`, first: notes[ni].at, phase: phaseAt(notes[ni].at), e: { type: 'user', text: notes[ni].text } });
    }
  };
  visible.forEach(({ e, i, phase: ph }) => {
    notesBefore(i);
    const prev = items[items.length - 1];
    if (e.type === 'receipt' && e.group) {
      if (prev?.kind === 'group' && prev.group === e.group) prev.members.push({ e, i });
      else items.push({ kind: 'group', key: `g${i}`, group: e.group, first: i, phase: ph, members: [{ e, i }] });
    } else {
      items.push({ kind: e.type, key: `e${i}`, first: i, phase: ph, e });
    }
    lastKey = items[items.length - 1].key;
  });
  notesBefore(Infinity);
  // Items fold into phases (sink only), then into turns within each phase.
  const sections = [];
  items.forEach((it) => {
    const last = sections[sections.length - 1];
    if (last && last.id === it.phase) last.items.push(it);
    else sections.push({ id: it.phase, key: it.key, items: [it] });
  });
  const toTurns = (list) => {
    const turns = [];
    list.forEach((it) => {
      const side = SIDE[it.kind];
      const last = turns[turns.length - 1];
      if (last && side !== 'neutral' && last.side === side) last.items.push(it);
      else turns.push({ side, key: it.key, items: [it] });
    });
    return turns;
  };
  const phased = sections.length > 1 && sections.every((sec) => sec.id && PHASES[sec.id]);

  const receiptProps = (e) => ({
    head: resolve(e.head, ctx),
    result: resolve(e.result, ctx),
    time: resolve(e.time, ctx),
    target: resolve(e.target, ctx),
    onRestage,
  });

  const renderItem = (it) => {
    if (it.kind === 'marker') return <DayMarker text={resolve(it.e.text, ctx)} />;
    if (it.kind === 'finish') return <FinishLine text={resolve(it.e.text, ctx)} />;
    if (it.kind === 'user') return <UserMessage text={resolve(it.e.text, ctx)} photos={it.e.photos} photosRead={photosRead} />;
    if (it.kind === 'receipt') return <Receipt {...receiptProps(it.e)} />;
    if (it.kind === 'agent') {
      return (
        <>
          <AgentProse text={resolve(it.e.text, ctx)} />
          {it.e.plan && <PlanList show={!planApproved} />}
        </>
      );
    }
    const def = GROUPS[it.group];
    const isOpen = it.key in groupOpen ? groupOpen[it.key] : it.key === lastKey;
    return (
      <ReceiptGroup
        id={`${uid}${it.key}`}
        head={def.head}
        meta={def.meta(it.members, ctx)}
        target={def.target || null}
        open={isOpen}
        onToggle={() => setGroupOpen((o) => ({ ...o, [it.key]: !isOpen }))}
        flags={it.members.flatMap(({ e }) => (e.flags || []).map(flagFor))}
        onRestage={onRestage}
      >
        {it.members.map(({ e, i }) => (
          <motion.div key={i} {...enter} initial={i < bootStep ? false : enter.initial}>
            <Receipt {...receiptProps(e)} nested />
          </motion.div>
        ))}
      </ReceiptGroup>
    );
  };

  // Within a turn, consecutive receipts and groups share one activity rail;
  // prose and bubbles keep their own rhythm around it.
  const renderTurns = (turns) => turns.map((turn) => {
    const runs = [];
    turn.items.forEach((it) => {
      const isLine = LINES.has(it.kind);
      const last = runs[runs.length - 1];
      if (last && isLine && last.lines) last.items.push(it);
      else runs.push({ lines: isLine, key: it.key, items: [it] });
    });
    const gap = turn.side === 'user' ? 'mt-2' : 'mt-3';
    return (
      <div key={turn.key}>
        {runs.map((run, r) => {
          const body = run.items.map((it, n) => (
            <motion.div
              key={it.key}
              {...enter}
              initial={it.first < bootStep ? false : enter.initial}
              className={n === 0 ? '' : run.lines ? 'mt-0.5' : gap}
            >
              {renderItem(it)}
            </motion.div>
          ));
          const cls = r === 0 ? '' : gap;
          return run.lines
            ? <ActivityRail key={run.key} className={cls}>{body}</ActivityRail>
            : <div key={run.key} className={cls}>{body}</div>;
        })}
      </div>
    );
  });

  const renderSections = () => sections.map((sec, k) => {
    const def = PHASES[sec.id];
    const latest = k === sections.length - 1;
    const isOpen = sec.id in phaseOpen ? phaseOpen[sec.id] : latest;
    const state = latest ? strip?.state || 'working' : 'done';
    return (
      <section key={sec.id} aria-labelledby={`${uid}${sec.id}`} className={k === 0 ? 'pb-3' : 'border-t border-line py-3'}>
        <PhaseHeader
          id={`${uid}${sec.id}`}
          bodyId={`${uid}${sec.id}-body`}
          title={def.title}
          summary={resolve(def.summary, ctx)}
          time={resolve(def.time, ctx)}
          state={state}
          progress={prog}
          open={isOpen}
          onToggle={() => setPhaseOpen((o) => ({ ...o, [sec.id]: !isOpen }))}
        >
          <div className="space-y-6 pb-2 pt-3">{renderTurns(toTurns(sec.items))}</div>
        </PhaseHeader>
      </section>
    );
  });

  // A new conversation opens like a new chat: the day marker, the greeting
  // and the composer sit together in the middle of the pane (auto margins,
  // so a short pane still scrolls the log and never hides the composer). On
  // kickoff both halves take their docked places in one 300ms layout move.
  // layoutDependency limits measuring to that one change, so pane toggles,
  // hidden threads and the 1024 host move never animate.
  const empty = !kicked;
  const settle = reduced
    ? {}
    : { layout: 'position', layoutDependency: empty, transition: { layout: { duration: dur.slow, ease } } };

  // layoutScroll: a short pane can scroll the centered log, and the move is
  // measured net of that scroll.
  const list = (
    <motion.div
      ref={scrollRef}
      layoutScroll
      onScroll={onScroll}
      className={`min-h-0 overflow-y-auto px-5 pb-6 ${empty ? 'mt-auto' : 'flex-1'}`}
    >
      <motion.div
        ref={contentRef}
        {...settle}
        role="log"
        aria-label={title}
        className={`${phased ? '' : 'space-y-6'} ${compact ? 'mx-auto max-w-[640px]' : ''}`}
      >
        {phased ? renderSections() : renderTurns(toTurns(items))}
      </motion.div>
    </motion.div>
  );

  const composer = (
    <Composer
      dock={parked?.dock || null}
      dockKey={parked?.id || ''}
      onAnswer={answer}
      onUpload={upload}
      uploading={uploading}
      status={status}
      live={live && showFull}
      progress={prog}
      planApproved={planApproved}
      planSteps={planSteps}
      staged={staged}
      onRestage={onRestage}
      inputRef={inputRef}
      onSend={send}
    />
  );

  // One element tree for both layouts, so crossing 1024 never remounts the
  // list or the composer (draft, open plan, observers).
  return (
    <motion.section
      ref={rootRef}
      aria-label="Conversation"
      initial={false}
      animate={{ width: compact ? '100%' : focus ? 0 : open ? W : 56 }}
      transition={compact || modeSwitched ? { duration: 0 } : { duration: dur.slow, ease }}
      className={`relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden ${compact ? '' : 'bg-canvas-v2'} ${
        active ? '' : 'hidden'
      }`}
    >
      <motion.div
        aria-hidden={showFull ? undefined : true}
        initial={false}
        animate={showFull ? { opacity: 1, visibility: 'visible' } : { opacity: 0, transitionEnd: { visibility: 'hidden' } }}
        transition={{ duration: dur.fast, ease }}
        className={compact ? 'flex min-h-0 w-full flex-1 flex-col' : 'absolute inset-y-0 left-0 flex flex-col'}
        style={compact ? undefined : { width: W }}
      >
        {!compact && (
          <div
            className={`flex h-14 shrink-0 items-center gap-2 border-b px-5 transition-colors duration-150 ${
              scrolled ? 'border-line' : 'border-transparent'
            }`}
          >
            <h2 className="min-w-0 flex-1 truncate text-ui font-medium text-ink-900">{title}</h2>
            <IconButton icon={ChevronsLeft} label="Collapse conversation" onClick={() => onToggle?.(false)} className="-mr-2" />
          </div>
        )}
        {/* Empty: the group centers a little above the middle (pb-16 balances the header). */}
        <div className={empty ? 'flex min-h-0 flex-1 flex-col pb-16' : 'flex min-h-0 flex-1 flex-col'}>
          {list}
          <motion.div
            {...settle}
            className={['shrink-0', empty && 'mb-auto', compact && 'mx-auto w-full max-w-[680px]'].filter(Boolean).join(' ')}
          >
            {composer}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {showStrip && (
          <motion.div key="strip" {...fade} className="absolute inset-y-0 left-0 flex w-14 flex-col items-center">
            <div className="flex h-14 w-full shrink-0 items-center justify-center">
              <IconButton icon={ChevronsRight} label="Open conversation" side="right" onClick={() => onToggle?.(true)} />
            </div>
            {strip && (
              <Tooltip label={strip.text} side="right">
                <button
                  type="button"
                  aria-label={`Open conversation: ${strip.text}`}
                  onClick={() => onToggle?.(true)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-shade-1 ${FOCUS}`}
                >
                  <StatusGlyph state={strip.state} live={live && strip.state === 'working'} progress={prog} />
                </button>
              </Tooltip>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
