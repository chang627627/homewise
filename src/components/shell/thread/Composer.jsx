import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ChevronDown, Mic, Paperclip } from 'lucide-react';
import Button from '../../v2/Button';
import IconButton from '../../v2/IconButton';
import Kbd from '../../v2/Kbd';
import Tooltip from '../../v2/Tooltip';
import { StatusGlyph } from '../../v2/Status';
import { dur, ease, fold } from '../../v2/motion';

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25';
const LINK = `rounded-md text-meta font-medium text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline ${FOCUS}`;
const MAX_INPUT = 120;

// Region A swaps its content in place; the outer height follows the content
// so the dock, the status row and the expanded plan never stack.
function AutoHeight({ children }) {
  const inner = useRef(null);
  const [height, setHeight] = useState('auto');
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return undefined;
    setHeight(el.offsetHeight);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div initial={false} animate={{ height }} transition={fold} className="overflow-hidden">
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}

// Plain meta text, or "Open" when the decision waits on a view that is not
// on screen.
function StatusMeta({ status, staged, onRestage, label, className = 'shrink-0' }) {
  if (status.state === 'needs-you' && status.target) {
    if (staged === status.target) {
      return label ? <span className={`${className} truncate text-meta text-ink-500`}>{label}</span> : null;
    }
    return (
      <button type="button" onClick={() => onRestage?.(status.target)} className={`${className} truncate ${LINK}`}>
        {label || 'Open'}
      </button>
    );
  }
  const text = label || status.meta;
  return text ? <span className={`${className} truncate text-meta tabular-nums text-ink-500`}>{text}</span> : null;
}

function StatusRow({ status, live, progress, staged, onRestage, planApproved, onPlan }) {
  return (
    <div className="relative flex h-10 items-center gap-2 px-3">
      <StatusGlyph state={status.state} live={live && status.state === 'working'} progress={progress} />
      <span className="min-w-0 flex-1 truncate text-ui font-medium text-ink-900">{status.text}</span>
      <StatusMeta status={status} staged={staged} onRestage={onRestage} />
      {planApproved && (
        <IconButton size="sm" icon={ChevronDown} label="Show plan" side="top" onClick={onPlan} data-plan-toggle="" className="-mr-1.5" />
      )}
    </div>
  );
}

function ExpandedPlan({ steps, status, live, progress, staged, onRestage, onPlan }) {
  return (
    <div className="relative px-3 py-1.5">
      <ol className="pr-8">
        {steps.map((s) => (
          <li key={s.id} className={`flex gap-2.5 ${s.current ? 'min-h-7 items-start py-1' : 'h-7 items-center'}`}>
            <span className="flex h-5 shrink-0 items-center">
              <StatusGlyph
                state={s.done ? 'done' : s.current ? status.state : 'idle'}
                live={s.current && live && status.state === 'working'}
                progress={progress}
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className={`truncate text-ui ${s.done ? 'text-ink-500' : 'text-ink-900'}`}>{s.label}</div>
              {s.current && (
                <div className="flex min-w-0">
                  <StatusMeta status={status} staged={staged} onRestage={onRestage} label={status.text} className="min-w-0" />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      <IconButton
        size="sm"
        icon={ChevronDown}
        label="Hide plan"
        side="top"
        onClick={onPlan}
        data-plan-toggle=""
        className="absolute right-1.5 top-1.5 [&_svg]:rotate-180"
      />
    </div>
  );
}

function ChoiceDock({ dock, highlight, setHighlight, showKeys, onAnswer }) {
  return (
    <div role="listbox" aria-label={dock.label} className="p-1.5">
      {dock.options.map((o, i) => (
        <button
          key={o.label}
          type="button"
          role="option"
          aria-selected={i === highlight}
          data-default={i === dock.initial ? '' : undefined}
          onPointerEnter={() => setHighlight(i)}
          onClick={() => onAnswer(o)}
          className={`flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-left text-ui font-medium text-ink-900 aria-selected:bg-shade-2 ${FOCUS} focus-visible:ring-inset`}
        >
          {showKeys && <Kbd>{i + 1}</Kbd>}
          <span className="min-w-0 flex-1 truncate">{o.label}</span>
          {o.meta && <span className="shrink-0 text-meta text-ink-500">{o.meta}</span>}
        </button>
      ))}
    </div>
  );
}

function UploadDock({ dock, uploading, onUpload }) {
  return (
    <div className="flex items-end gap-3 p-3">
      <ol className="min-w-0 flex-1 space-y-2">
        {dock.items.map((it) => (
          <li key={it.label}>
            <div className="text-ui font-medium text-ink-900">{it.label}</div>
            <div className="text-meta text-ink-500">{it.sub}</div>
          </li>
        ))}
      </ol>
      <Button size="sm" onClick={onUpload} disabled={uploading}>
        {uploading ? dock.busy : dock.action}
      </Button>
    </div>
  );
}

export default function Composer({
  dock,
  dockKey,
  onAnswer,
  onUpload,
  uploading,
  status,
  live,
  progress,
  planApproved,
  planSteps,
  staged,
  onRestage,
  inputRef,
  onSend,
}) {
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const options = dock?.kind === 'choice' ? dock.options : null;
  const regionRef = useRef(null);
  const toggledByKey = useRef(false);

  // The highlight belongs to one dock; a new dock starts on its own default.
  const initial = dock?.initial ?? 0;
  const [hl, setHl] = useState({ key: dockKey, index: initial });
  const highlight = hl.key === dockKey ? hl.index : initial;
  const setHighlight = (next) =>
    setHl((prev) => {
      const current = prev.key === dockKey ? prev.index : initial;
      return { key: dockKey, index: typeof next === 'function' ? next(current) : next };
    });

  const region = dock
    ? dock.kind
    : planOpen && planApproved && status ? 'plan'
      : status ? 'status' : null;

  // Keyboard users keep their place when the plan opens or closes.
  useEffect(() => {
    if (!toggledByKey.current) return;
    toggledByKey.current = false;
    regionRef.current?.querySelector('[data-plan-toggle]')?.focus();
  }, [planOpen]);

  const togglePlan = (e) => {
    toggledByKey.current = e?.detail === 0;
    setPlanOpen((v) => !v);
  };

  const showKeys = !!options && focused && draft === '';

  const resize = (el) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT)}px`;
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    if (inputRef.current) inputRef.current.style.height = '';
    onSend?.(text);
  };

  const onKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (options && draft === '' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const n = options.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => (h + 1) % n);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => (h - 1 + n) % n);
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onAnswer(options[Math.min(highlight, n - 1)]);
        return;
      }
      if (/^[1-9]$/.test(e.key) && Number(e.key) <= n) {
        e.preventDefault();
        onAnswer(options[Number(e.key) - 1]);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const hasText = draft.trim().length > 0;
  const showProgress = planApproved && (region === 'status' || region === 'plan');

  return (
    <div className="mx-3 mb-3 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line">
      {region && (
        <AutoHeight>
          <div ref={regionRef}>
            {region === 'choice' && (
              <ChoiceDock dock={dock} highlight={highlight} setHighlight={setHighlight} showKeys={showKeys} onAnswer={onAnswer} />
            )}
            {region === 'upload' && <UploadDock dock={dock} uploading={uploading} onUpload={onUpload} />}
            {region === 'status' && (
              <StatusRow
                status={status}
                live={live}
                progress={progress}
                staged={staged}
                onRestage={onRestage}
                planApproved={planApproved}
                onPlan={togglePlan}
              />
            )}
            {region === 'plan' && (
              <ExpandedPlan
                steps={planSteps}
                status={status}
                live={live}
                progress={progress}
                staged={staged}
                onRestage={onRestage}
                onPlan={togglePlan}
              />
            )}
          </div>
        </AutoHeight>
      )}
      <div className={`relative flex items-center gap-1 p-1.5 ${region ? 'border-t border-line' : ''}`}>
        {showProgress && (
          <motion.span
            aria-hidden="true"
            className="absolute -top-px left-0 h-0.5 bg-sage-500"
            initial={false}
            animate={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
            transition={{ duration: dur.slow, ease }}
          />
        )}
        <IconButton size="sm" icon={Paperclip} label="Attach" side="top" />
        <textarea
          ref={inputRef}
          rows={1}
          value={draft}
          placeholder="Reply to Homewise"
          aria-label="Reply to Homewise"
          onChange={(e) => {
            setDraft(e.target.value);
            resize(e.target);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="min-h-7 flex-1 resize-none bg-transparent px-1.5 py-1 text-ui text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />
        <IconButton size="sm" icon={Mic} label="Dictate" side="top" />
        <Tooltip label="Send" side="top">
          <button
            type="button"
            aria-label="Send"
            disabled={!hasText}
            onClick={send}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${FOCUS} ${
              hasText ? 'bg-ink-900 text-white hover:bg-ink-700' : 'text-ink-300'
            }`}
          >
            <ArrowUp size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
