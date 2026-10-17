import React from 'react';
import {
  Home,
  MapPin,
  Sparkles,
  Droplets,
  Wrench,
  Wind,
  Bell,
  Settings,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

// Left rail: brand, home switcher, New AI task, and the task switcher. Artifact
// navigation lives in the Stage tabs, so the rail carries no board shortcuts.
// Collapsible to a 64px icon strip. One DOM tree for both states: the aside
// animates its width while icons stay anchored in place and labels fade, so
// the collapse reads as a smooth fold instead of a re-layout jump. Widths
// animate with a plain CSS transition; the right-justified toggle simply rides
// the moving edge as the container narrows.

export default function Rail({
  open = true,
  onToggle,
  guttersPlanned,
  taskStarted,
  taskStatus,
  booked,
  extraTasks = [],
  activeThread,
  onNewTask,
  onSelectTask,
}) {
  return (
    <aside
      style={{ width: open ? 240 : 64, transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
      className="shrink-0 h-full flex flex-col bg-canvas-soft border-r border-ink-100 overflow-hidden"
    >
      {/* Top row, Grok pattern: logo left, panel toggle right. The toggle
          keeps its vertical position in both states; folded, the brand
          collapses to zero width and the right-justified toggle rides the
          narrowing edge into the icon column. */}
      <div className="shrink-0 h-14 px-3.5 flex items-center border-b border-ink-100">
        <span
          style={{
            maxWidth: open ? 160 : 0,
            opacity: open ? 1 : 0,
            transition: 'max-width 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease-out',
          }}
          className="overflow-hidden flex items-center gap-2.5"
        >
          <Logo />
          <span className="editorial editorial-xs text-[17px] font-semibold leading-none text-ink-900 whitespace-nowrap">
            Homewise
          </span>
        </span>
        <span className="flex-1" />
        <button
          onClick={() => onToggle?.(!open)}
          title={open ? 'Collapse the sidebar' : 'Open the sidebar'}
          className="h-9 w-9 rounded-xl bg-white ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft flex items-center justify-center text-ink-700 hover:text-ink-900 transition-colors shrink-0"
        >
          {open ? <ChevronsLeft size={14} strokeWidth={1.8} /> : <ChevronsRight size={14} strokeWidth={1.8} />}
        </button>
      </div>

      {/* Home */}
      <div className="mt-3 px-3.5">
        <div
          className={`flex items-center gap-2.5 rounded-2xl border transition-all duration-300 ${
            open ? 'bg-white border-ink-100 p-2' : 'bg-transparent border-transparent p-0'
          }`}
        >
          <span
            title="Maple Street · Oakland, CA"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0"
          >
            <Home size={14} strokeWidth={1.8} />
          </span>
          <FadeLabel open={open} className="flex-1 min-w-0">
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[13.5px] font-medium text-ink-900 whitespace-nowrap">Maple Street</span>
              <span className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-500 whitespace-nowrap">
                <MapPin size={12} strokeWidth={2} />
                Oakland, CA
              </span>
            </span>
          </FadeLabel>
        </div>
      </div>

      {/* New AI task */}
      <div className="mt-3 px-3.5">
        <button
          onClick={onNewTask}
          title="New AI task"
          className={`w-full bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark inline-flex items-center justify-center text-[13.5px] font-medium transition-colors overflow-hidden ${
            open ? 'h-10 rounded-2xl gap-1.5 grain-dark' : 'h-9 rounded-xl'
          }`}
        >
          <Sparkles size={14} strokeWidth={2.2} className="shrink-0" />
          <FadeWidth open={open}>
            <span className="pl-1.5 whitespace-nowrap">New AI task</span>
          </FadeWidth>
        </button>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden mt-5 px-3 pb-3">
        <GroupLabel open={open}>Tasks</GroupLabel>
        {taskStarted ? (
          <button
            onClick={() => onSelectTask?.('sink')}
            title={open ? undefined : `Kitchen sink leak · ${taskStatus}`}
            className={`w-full rounded-2xl bg-white ring-1 flex items-start gap-2.5 text-left transition-all duration-300 ${
              activeThread === 'sink' ? 'ring-ink-200' : 'ring-ink-100 hover:ring-ink-200'
            } ${open ? 'p-2.5' : 'p-1'}`}
          >
            <TaskTile icon={Droplets}>
              {!open && !booked && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500 ring-2 ring-white" />
                </span>
              )}
            </TaskTile>
            <FadeLabel open={open} className="flex-1 min-w-0">
              <span className="block leading-tight">
                <span className="block text-[13.5px] font-medium text-ink-900 min-w-0 truncate">
                  Kitchen sink leak
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-500">
                  {!booked && <LiveDot />}
                  <span className="min-w-0 truncate">{taskStatus}</span>
                </span>
              </span>
            </FadeLabel>
          </button>
        ) : (
          open && (
            <div className="rounded-2xl border border-dashed border-ink-200 px-3 py-3 text-[12px] leading-[1.5] text-ink-500">
              No tasks yet. Tell the AI what happened and the first one starts here.
            </div>
          )
        )}
        {extraTasks.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTask?.(t.id)}
            className={`mt-2 w-full rounded-2xl bg-white ring-1 flex items-start gap-2.5 text-left transition-all duration-300 ${
              activeThread === t.id ? 'ring-ink-200' : 'ring-ink-100 hover:ring-ink-200'
            } ${open ? 'p-2.5' : 'p-1'}`}
          >
            <TaskTile icon={Wind} />
            <FadeLabel open={open} className="flex-1 min-w-0">
              <span className="block leading-tight">
                <span className="block text-[13.5px] font-medium text-ink-900 min-w-0 truncate">{t.title}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-500">
                  <LiveDot />
                  <span className="min-w-0 truncate">Scoping the job</span>
                </span>
              </span>
            </FadeLabel>
          </button>
        ))}
        {guttersPlanned && (
          <div
            title={open ? undefined : 'Gutter cleaning · Planned · early September'}
            className={`mt-2 w-full rounded-2xl bg-white ring-1 ring-ink-100 flex items-start gap-2.5 text-left transition-all duration-300 ${
              open ? 'p-2.5' : 'p-1'
            }`}
          >
            <TaskTile icon={Wrench} />
            <FadeLabel open={open} className="flex-1 min-w-0">
              <span className="block leading-tight">
                <span className="block text-[13.5px] font-medium text-ink-900 min-w-0 truncate">Gutter cleaning</span>
                <span className="mt-0.5 block text-[12px] text-ink-500 min-w-0 truncate">Planned · early September</span>
              </span>
            </FadeLabel>
          </div>
        )}
      </div>

      {/* User */}
      <div className="shrink-0 border-t border-ink-100 p-3">
        <div className="flex items-center gap-2">
          <span
            className="h-9 w-9 rounded-xl bg-canvas-deep hairline-inset flex items-center justify-center shrink-0"
            title="Mara Halligan"
          >
            <span className="editorial editorial-xs text-[14px] leading-none text-ink-700">M</span>
          </span>
          <FadeLabel open={open} className="flex-1 min-w-0">
            <span className="block text-[13.5px] font-medium text-ink-900 min-w-0 truncate">Mara Halligan</span>
          </FadeLabel>
          <FadeLabel open={open}>
            <span className="relative h-9 w-9 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-colors cursor-pointer">
              <Bell size={14} strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-ember-300 ring-2 ring-canvas-soft" />
            </span>
          </FadeLabel>
        </div>
        {open && (
          <div className="mt-2 flex items-center gap-1">
            <FooterLink icon={Settings} label="Settings" />
            <FooterLink icon={HelpCircle} label="Help" />
          </div>
        )}
      </div>
    </aside>
  );
}

// Opacity-only fade: the aside's overflow-hidden clips the label as the rail
// narrows, so the icon column never shifts. Used wherever the icon is
// left-anchored.
function FadeLabel({ open, children, className = '' }) {
  return (
    <span
      className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${className}`}
    >
      {children}
    </span>
  );
}

// Width-collapsing fade: for centered content (the New AI task button) where a
// hidden label would push the icon off-center.
function FadeWidth({ open, children }) {
  return (
    <span
      style={{
        maxWidth: open ? 140 : 0,
        opacity: open ? 1 : 0,
        transition: 'max-width 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease-out',
      }}
      className="overflow-hidden whitespace-nowrap inline-flex items-center"
    >
      {children}
    </span>
  );
}

// Eyebrow role with the rail's w-3 rule. The rule stays visible when folded.
function GroupLabel({ open, children }) {
  return (
    <div className="px-2.5 mb-2 flex items-center gap-2 h-[17px]">
      <span className="h-px w-3 bg-ink-300 shrink-0" />
      <FadeLabel open={open} className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500 whitespace-nowrap">
        {children}
      </FadeLabel>
    </div>
  );
}

// Task icon tiles are non-semantic, so they stay neutral.
function TaskTile({ icon: Icon, children }) {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0">
      <Icon size={14} strokeWidth={1.8} />
      {children}
    </span>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-500" />
    </span>
  );
}

function FooterLink({ icon: Icon, label }) {
  return (
    <button className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-xl text-[12px] text-ink-500 hover:text-ink-900 hover:bg-white transition-all">
      <Icon size={12} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

function Logo() {
  return (
    <div className="relative h-8 w-8 rounded-xl bg-sage-600 ring-1 ring-sage-700/10 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-canvas-soft">
        <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M6.5 10.5V20h11v-9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ember-300 ring-2 ring-canvas-soft" />
    </div>
  );
}
