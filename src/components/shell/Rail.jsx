import React from 'react';
import {
  Home,
  MapPin,
  Sparkles,
  Droplets,
  LayoutGrid,
  CalendarDays,
  Bell,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

// Left rail: brand, the task switcher, and two board shortcuts. In the v2
// shell the rail replaces v1's page nav; "Conversations" dissolves into the
// task list here, and Overview/Schedule are artifacts staged on the board.
// Collapsible to a 64px icon strip; the expand control is the same bordered
// panel-toggle button the thread strip uses, so the affordance reads once
// and applies everywhere.
export default function Rail({
  open = true,
  onToggle,
  taskStarted,
  taskStatus,
  booked,
  staged,
  unlocked,
  onRestage,
  onOpenThread,
}) {
  if (!open) {
    return (
      <aside className="w-16 shrink-0 h-full flex flex-col items-center py-4 gap-3 bg-white/80 backdrop-blur-md border-r border-ink-100/80">
        <Logo />
        <button
          onClick={() => onToggle?.(true)}
          title="Open the sidebar"
          className="h-9 w-9 rounded-xl bg-white ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft flex items-center justify-center text-ink-700 hover:text-ink-900 transition-all shrink-0"
        >
          <PanelLeftOpen size={15} strokeWidth={2} />
        </button>
        <button
          onClick={onOpenThread}
          title="New AI task"
          className="h-9 w-9 rounded-xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark flex items-center justify-center transition-all shrink-0"
        >
          <Sparkles size={14} strokeWidth={2.2} />
        </button>

        <span className="h-px w-6 bg-ink-100 shrink-0" />

        <IconNavButton
          icon={LayoutGrid}
          title="Home"
          active={staged === 'home'}
          onClick={() => onRestage('home')}
        />
        <IconNavButton
          icon={CalendarDays}
          title="Schedule"
          active={staged === 'schedule'}
          disabled={!unlocked.has('schedule')}
          dot={booked}
          onClick={() => onRestage('schedule')}
        />

        {taskStarted && (
          <>
            <span className="h-px w-6 bg-ink-100 shrink-0" />
            <button
              onClick={onOpenThread}
              title={`Kitchen sink leak · ${taskStatus}`}
              className="relative h-9 w-9 rounded-xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 hover:ring-sage-200 flex items-center justify-center transition-all shrink-0"
            >
              <Droplets size={14} strokeWidth={1.8} />
              {!booked && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500 ring-2 ring-white" />
                </span>
              )}
            </button>
          </>
        )}

        <div className="flex-1" />

        <span className="h-9 w-9 rounded-xl ring-1 ring-ink-100 overflow-hidden shrink-0">
          <span className="h-full w-full bg-gradient-to-br from-sage-200 via-sage-100 to-ember-100 flex items-center justify-center">
            <span className="editorial text-[13px] text-sage-700">M</span>
          </span>
        </span>
      </aside>
    );
  }

  return (
    <aside className="w-[240px] shrink-0 h-full flex flex-col bg-white/80 backdrop-blur-md border-r border-ink-100/80">
      {/* Brand + home */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5 px-1.5">
          <Logo />
          <span className="editorial text-[17px] leading-none text-ink-900">Homewise</span>
          <span className="flex-1" />
          <button
            onClick={() => onToggle?.(false)}
            title="Collapse the sidebar"
            className="h-7 w-7 rounded-lg ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0"
          >
            <PanelLeftClose size={13} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 w-full flex items-center gap-2.5 rounded-2xl bg-canvas-soft border border-ink-100 p-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
            <Home size={15} strokeWidth={1.8} />
          </span>
          <span className="flex-1 min-w-0 flex flex-col items-start leading-tight">
            <span className="text-[12.5px] font-semibold text-ink-900 truncate w-full text-left">
              Maple Street
            </span>
            <span className="flex items-center gap-1 text-[10.5px] text-ink-500">
              <MapPin size={9} strokeWidth={2} />
              Oakland, CA
            </span>
          </span>
        </div>

        <button
          onClick={onOpenThread}
          className="group mt-3 w-full h-10 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-all"
        >
          <Sparkles size={13} strokeWidth={2.2} />
          New AI task
        </button>
      </div>

      {/* Board shortcuts */}
      <nav className="px-3 space-y-0.5">
        <GroupLabel>Your board</GroupLabel>
        <RailItem
          icon={LayoutGrid}
          label="Home"
          active={staged === 'home'}
          onClick={() => onRestage('home')}
        />
        <RailItem
          icon={CalendarDays}
          label="Schedule"
          active={staged === 'schedule'}
          disabled={!unlocked.has('schedule')}
          badge={booked ? '1' : null}
          onClick={() => onRestage('schedule')}
        />
      </nav>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto px-3 pt-5 pb-3">
        <GroupLabel>Tasks</GroupLabel>
        {taskStarted ? (
          <button
            onClick={onOpenThread}
            className="w-full rounded-2xl bg-canvas-soft ring-1 ring-ink-100 hover:ring-ink-200 p-2.5 flex items-start gap-2.5 text-left transition-all"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
              <Droplets size={13} strokeWidth={1.8} />
            </span>
            <span className="flex-1 min-w-0 leading-tight">
              <span className="block text-[12.5px] font-semibold text-ink-900 truncate">
                Kitchen sink leak
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-ink-500">
                {!booked && (
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-500" />
                  </span>
                )}
                <span className="truncate">{taskStatus}</span>
              </span>
            </span>
          </button>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink-200 px-3 py-3 text-[11.5px] text-ink-500 leading-relaxed">
            No tasks yet. Tell the AI what happened and the first one starts here.
          </div>
        )}
      </div>

      {/* User */}
      <div className="shrink-0 border-t border-ink-100/80 p-3 bg-gradient-to-t from-canvas-soft/60 to-white">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl ring-1 ring-ink-100 overflow-hidden shrink-0">
            <span className="h-full w-full bg-gradient-to-br from-sage-200 via-sage-100 to-ember-100 flex items-center justify-center">
              <span className="editorial text-[13px] text-sage-700">M</span>
            </span>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold text-ink-900 truncate">Mara Halligan</div>
          </div>
          <button className="relative h-9 w-9 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all">
            <Bell size={14} strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-ember-300 ring-2 ring-white" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <FooterLink icon={Settings} label="Settings" />
          <FooterLink icon={HelpCircle} label="Help" />
        </div>
      </div>
    </aside>
  );
}

function IconNavButton({ icon: Icon, title, active, disabled, dot, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`relative h-9 w-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
        active
          ? 'bg-canvas-soft text-sage-600 ring-1 ring-ink-100'
          : disabled
            ? 'text-ink-300'
            : 'text-ink-500 hover:text-ink-900 hover:bg-canvas-soft/70'
      }`}
    >
      <Icon size={15} strokeWidth={1.8} />
      {dot && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-sage-500 ring-2 ring-white" />}
    </button>
  );
}

function GroupLabel({ children }) {
  return (
    <div className="px-2.5 mb-2 flex items-center gap-2">
      <span className="h-px w-3 bg-ink-200" />
      <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500 font-semibold">
        {children}
      </span>
    </div>
  );
}

function RailItem({ icon: Icon, label, active, disabled, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full flex items-center gap-2.5 rounded-xl px-2.5 h-9 text-[12.5px] transition-all ${
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
        className={active ? 'text-sage-600' : disabled ? 'text-ink-300' : 'text-ink-500 group-hover:text-ink-700'}
      />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-semibold tabular-nums bg-sage-100 text-sage-600">
          {badge}
        </span>
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
