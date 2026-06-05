import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ChevronDown,
  MapPin,
  LayoutGrid,
  CalendarDays,
  Settings,
  HelpCircle,
  Bell,
  Plus,
  Sparkles,
} from 'lucide-react';

const homes = [
  { id: 1, label: 'Maple Street', sub: 'Oakland, CA' },
  { id: 2, label: 'Lake House', sub: 'Tahoe, CA' },
];

const buildPrimaryNav = (hasStartedFirstTask) => [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: CalendarDays,
    badge: hasStartedFirstTask ? '1' : null,
    tone: 'sage',
  },
];

const badgeTone = {
  ember: 'bg-ember-100 text-ember-500',
  sage: 'bg-sage-100 text-sage-600',
};

export default function Sidebar({
  activePage = 'overview',
  onNavigate,
  hasStartedFirstTask = false,
}) {
  const [open, setOpen] = useState(false);
  const [home, setHome] = useState(homes[0]);
  const primaryNav = buildPrimaryNav(hasStartedFirstTask);

  return (
    <aside className="flex h-full flex-col bg-white/80 backdrop-blur-md border-r border-ink-100/80 overflow-hidden">
      {/* Brand + home */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5 px-1.5">
          <Logo />
          <span className="editorial text-[17px] leading-none text-ink-900">
            Homewise
          </span>
          <span className="flex-1 h-px bg-ink-200/70 ml-1" />
        </div>

        <div className="relative mt-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="group w-full flex items-center gap-2.5 rounded-2xl bg-canvas-soft border border-ink-100 p-2 hover:border-ink-200 transition-all"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
              <Home size={15} strokeWidth={1.8} />
            </span>
            <span className="flex-1 min-w-0 flex flex-col items-start leading-tight">
              <span className="text-[12.5px] font-semibold text-ink-900 truncate w-full text-left">
                {home.label}
              </span>
              <span className="flex items-center gap-1 text-[10.5px] text-ink-500">
                <MapPin size={9} strokeWidth={2} />
                {home.sub}
              </span>
            </span>
            <ChevronDown
              size={14}
              className={`text-ink-500 transition-transform shrink-0 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-2xl border border-ink-100 bg-white p-1.5"
              >
                <div className="px-2.5 pt-1 pb-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-500">
                  Your homes
                </div>
                {homes.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setHome(h);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors ${
                      home.id === h.id
                        ? 'bg-sage-50 ring-1 ring-sage-100'
                        : 'hover:bg-canvas'
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-canvas text-ink-700 ring-1 ring-ink-100">
                      <Home size={12} strokeWidth={1.8} />
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[12px] font-medium text-ink-900">
                        {h.label}
                      </span>
                      <span className="text-[10.5px] text-ink-500">{h.sub}</span>
                    </div>
                  </button>
                ))}
                <div className="border-t border-ink-100 mt-1 pt-1">
                  <button className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[12px] text-ink-700 hover:bg-canvas">
                    <Plus size={12} /> Add a home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New task CTA */}
        <button
          onClick={() => onNavigate?.('intake')}
          className="group mt-3 w-full h-10 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-all"
        >
          <Sparkles size={13} strokeWidth={2.2} />
          New AI task
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <NavGroup
          label="Workspace"
          items={primaryNav}
          activePage={activePage}
          onNavigate={onNavigate}
        />
      </nav>

      {/* Footer / user */}
      <div className="shrink-0 border-t border-ink-100/80 p-3 bg-gradient-to-t from-canvas-soft/60 to-white">
        <div className="flex items-center gap-2">
          <button className="relative h-9 w-9 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 overflow-hidden transition-all shrink-0">
            <div className="h-full w-full bg-gradient-to-br from-sage-200 via-sage-100 to-ember-100 flex items-center justify-center">
              <span className="editorial text-[13px] text-sage-700">M</span>
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold text-ink-900 truncate">
              Mara Halligan
            </div>
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

function NavGroup({ label, items, activePage, onNavigate }) {
  return (
    <div>
      <div className="px-2.5 mb-2 flex items-center gap-2">
        <span className="h-px w-3 bg-ink-200" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500 font-semibold">
          {label}
        </span>
      </div>
      <div className="space-y-0.5">
        {items.map((it) => (
          <NavItem
            key={it.id}
            item={it}
            active={activePage === it.id}
            onClick={() => onNavigate?.(it.id)}
          />
        ))}
      </div>
    </div>
  );
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center gap-2.5 rounded-xl px-2.5 h-9 text-[12.5px] transition-all ${
        active
          ? 'bg-canvas-soft text-ink-900 font-medium ring-1 ring-ink-100'
          : 'text-ink-700 hover:bg-canvas-soft/70 hover:text-ink-900'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-sage-500" />
      )}
      <Icon
        size={15}
        strokeWidth={1.8}
        className={active ? 'text-sage-600' : 'text-ink-500 group-hover:text-ink-700'}
      />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span
          className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-semibold tabular-nums ${badgeTone[item.tone] || 'bg-ink-100 text-ink-700'}`}
        >
          {item.badge}
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
    <div className="relative h-8 w-8 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 ring-1 ring-sage-700/10 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-canvas-soft">
        <path
          d="M4 11.5 12 4l8 7.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M6.5 10.5V20h11v-9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ember-300 ring-2 ring-canvas-soft" />
    </div>
  );
}
