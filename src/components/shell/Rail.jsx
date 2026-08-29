import React from 'react';
import {
  Home,
  MapPin,
  Sparkles,
  Droplets,
  Wrench,
  Wind,
  LayoutGrid,
  CalendarDays,
  Bell,
  Settings,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

// Left rail: brand, the task switcher, and two board shortcuts. Collapsible to
// a 64px icon strip. One DOM tree for both states: the aside animates its
// width while icons stay anchored in place and labels fade, so the collapse
// reads as a smooth fold instead of a re-layout jump. Widths animate with a
// plain CSS transition; the right-justified toggle simply rides the moving
// edge as the container narrows.

export default function Rail({
  open = true,
  onToggle,
  guttersPlanned,
  taskStarted,
  taskStatus,
  booked,
  staged,
  unlocked,
  extraTasks = [],
  activeThread,
  onRestage,
  onNewTask,
  onSelectTask,
}) {
  return (
    <aside
      style={{ width: open ? 240 : 64, transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
      className="shrink-0 h-full flex flex-col bg-white/80 backdrop-blur-md border-r border-ink-100/80 overflow-hidden"
    >
      {/* Top row, Grok pattern: logo left, panel toggle right. The toggle
          keeps its vertical position in both states; folded, the brand
          collapses to zero width and the right-justified toggle rides the
          narrowing edge into the icon column. */}
      <div className="pt-5 px-3.5 flex items-center">
        <span
          style={{
            maxWidth: open ? 160 : 0,
            opacity: open ? 1 : 0,
            transition: 'max-width 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease-out',
          }}
          className="overflow-hidden flex items-center gap-2.5"
        >
          <Logo />
          <span className="editorial text-[17px] leading-none text-ink-900 whitespace-nowrap">Homewise</span>
        </span>
        <span className="flex-1" />
        <button
          onClick={() => onToggle?.(!open)}
          title={open ? 'Collapse the sidebar' : 'Open the sidebar'}
          className="h-9 w-9 rounded-xl bg-white ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft flex items-center justify-center text-ink-700 hover:text-ink-900 transition-colors shrink-0"
        >
          {open ? <ChevronsLeft size={15} strokeWidth={2} /> : <ChevronsRight size={15} strokeWidth={2} />}
        </button>
      </div>

      {/* Home */}
      <div className="mt-3 px-3.5">
        <div
          className={`flex items-center gap-2.5 rounded-2xl border transition-all duration-300 ${
            open ? 'bg-canvas-soft border-ink-100 p-2' : 'bg-transparent border-transparent p-0'
          }`}
        >
          <span
            title="Maple Street · Oakland, CA"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0"
          >
            <Home size={15} strokeWidth={1.8} />
          </span>
          <FadeLabel open={open} className="flex-1 min-w-0">
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[12.5px] font-semibold text-ink-900 whitespace-nowrap">Maple Street</span>
              <span className="flex items-center gap-1 text-[10.5px] text-ink-500 whitespace-nowrap">
                <MapPin size={9} strokeWidth={2} />
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
          className={`w-full rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark inline-flex items-center justify-center text-[12.5px] font-semibold transition-colors overflow-hidden ${
            open ? 'h-10 gap-1.5 grain-dark' : 'h-9'
          }`}
        >
          <Sparkles size={13} strokeWidth={2.2} className="shrink-0" />
          <FadeWidth open={open}>
            <span className="pl-1.5 whitespace-nowrap">New AI task</span>
          </FadeWidth>
        </button>
      </div>

      {/* Board shortcuts */}
      <nav className="mt-5 px-3 space-y-0.5">
        <GroupLabel open={open}>Your board</GroupLabel>
        <RailItem
          open={open}
          icon={LayoutGrid}
          label="Home"
          active={staged === 'home'}
          onClick={() => onRestage('home')}
        />
        <RailItem
          open={open}
          icon={CalendarDays}
          label="Schedule"
          active={staged === 'schedule'}
          disabled={!unlocked.has('schedule')}
          badge={booked ? '1' : null}
          onClick={() => onRestage('schedule')}
        />
      </nav>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden mt-5 px-3 pb-3">
        <GroupLabel open={open}>Tasks</GroupLabel>
        {taskStarted ? (
          <button
            onClick={() => onSelectTask?.('sink')}
            title={open ? undefined : `Kitchen sink leak · ${taskStatus}`}
            className={`w-full rounded-2xl bg-canvas-soft ring-1 flex items-start gap-2.5 text-left transition-all duration-300 ${
              activeThread === 'sink' ? 'ring-ink-200' : 'ring-ink-100 hover:ring-ink-200'
            } ${open ? 'p-2.5' : 'p-1'}`}
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
              <Droplets size={13} strokeWidth={1.8} />
              {!open && !booked && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500 ring-2 ring-white" />
                </span>
              )}
            </span>
            <FadeLabel open={open} className="flex-1 min-w-0">
              <span className="block leading-tight">
                <span className="block text-[12.5px] font-semibold text-ink-900 whitespace-nowrap">
                  Kitchen sink leak
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-ink-500">
                  {!booked && (
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-500" />
                    </span>
                  )}
                  <span className="whitespace-nowrap">{taskStatus}</span>
                </span>
              </span>
            </FadeLabel>
          </button>
        ) : (
          open && (
            <div className="rounded-2xl border border-dashed border-ink-200 px-3 py-3 text-[11.5px] text-ink-500 leading-relaxed">
              No tasks yet. Tell the AI what happened and the first one starts here.
            </div>
          )
        )}
        {extraTasks.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTask?.(t.id)}
            className={`mt-2 w-full rounded-2xl bg-canvas-soft ring-1 flex items-start gap-2.5 text-left transition-all duration-300 ${
              activeThread === t.id ? 'ring-ink-200' : 'ring-ink-100 hover:ring-ink-200'
            } ${open ? 'p-2.5' : 'p-1'}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky2026-50 text-sky2026-700 ring-1 ring-sky2026-100 shrink-0">
              <Wind size={13} strokeWidth={1.8} />
            </span>
            <FadeLabel open={open} className="flex-1 min-w-0">
              <span className="block leading-tight">
                <span className="block text-[12.5px] font-semibold text-ink-900 whitespace-nowrap">{t.title}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-ink-500">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-500" />
                  </span>
                  <span className="whitespace-nowrap">Scoping the job</span>
                </span>
              </span>
            </FadeLabel>
          </button>
        ))}
        {guttersPlanned && (
          <div
            title={open ? undefined : 'Gutter cleaning · Planned · early September'}
            className={`mt-2 w-full rounded-2xl bg-canvas-soft ring-1 ring-ink-100 flex items-start gap-2.5 text-left transition-all duration-300 ${
              open ? 'p-2.5' : 'p-1'
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ember-50 text-ember-500 ring-1 ring-ember-100 shrink-0">
              <Wrench size={13} strokeWidth={1.8} />
            </span>
            <FadeLabel open={open} className="flex-1 min-w-0">
              <span className="block leading-tight">
                <span className="block text-[12.5px] font-semibold text-ink-900 whitespace-nowrap">Gutter cleaning</span>
                <span className="mt-0.5 block text-[10.5px] text-ink-500 whitespace-nowrap">Planned · early September</span>
              </span>
            </FadeLabel>
          </div>
        )}
      </div>

      {/* User */}
      <div className="shrink-0 border-t border-ink-100/80 p-3 bg-gradient-to-t from-canvas-soft/60 to-white">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl ring-1 ring-ink-100 overflow-hidden shrink-0" title="Mara Halligan">
            <span className="h-full w-full bg-gradient-to-br from-sage-200 via-sage-100 to-ember-100 flex items-center justify-center">
              <span className="editorial text-[13px] text-sage-700">M</span>
            </span>
          </span>
          <FadeLabel open={open} className="flex-1 min-w-0">
            <span className="block text-[12.5px] font-semibold text-ink-900 whitespace-nowrap">Mara Halligan</span>
          </FadeLabel>
          <FadeLabel open={open}>
            <span className="relative h-9 w-9 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-colors cursor-pointer">
              <Bell size={14} strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-ember-300 ring-2 ring-white" />
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

function GroupLabel({ open, children }) {
  return (
    <div className="px-2.5 mb-2 flex items-center gap-2 h-[17px]">
      <span className="h-px w-3 bg-ink-200 shrink-0" />
      <FadeLabel open={open} className="text-[10px] uppercase tracking-[0.18em] text-ink-500 font-semibold whitespace-nowrap">
        {children}
      </FadeLabel>
    </div>
  );
}

function RailItem({ open, icon: Icon, label, active, disabled, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={open ? undefined : label}
      className={`group relative w-full flex items-center gap-2.5 rounded-xl px-2.5 h-9 text-[12.5px] transition-colors ${
        active
          ? 'bg-canvas-soft text-ink-900 font-medium ring-1 ring-ink-100'
          : disabled
            ? 'text-ink-300'
            : 'text-ink-700 hover:bg-canvas-soft/70 hover:text-ink-900'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-sage-500" />
      )}
      <Icon
        size={15}
        strokeWidth={1.8}
        className={`shrink-0 ${active ? 'text-sage-600' : disabled ? 'text-ink-300' : 'text-ink-500 group-hover:text-ink-700'}`}
      />
      <FadeLabel open={open} className="flex-1 text-left whitespace-nowrap">
        {label}
      </FadeLabel>
      {badge && (
        <FadeLabel open={open}>
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-semibold tabular-nums bg-sage-100 text-sage-600">
            {badge}
          </span>
        </FadeLabel>
      )}
      {!open && badge && (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-sage-500 ring-2 ring-white" />
      )}
    </button>
  );
}

function FooterLink({ icon: Icon, label }) {
  return (
    <button className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-xl text-[11.5px] text-ink-500 hover:text-ink-900 hover:bg-canvas-soft transition-all">
      <Icon size={12} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
}

function Logo() {
  return (
    <div className="relative h-8 w-8 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 ring-1 ring-sage-700/10 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-canvas-soft">
        <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M6.5 10.5V20h11v-9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ember-300 ring-2 ring-canvas-soft" />
    </div>
  );
}
