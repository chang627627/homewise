import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mail,
  Wind,
  Droplet,
  TreePine,
  Flame,
  Wrench,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import googleLogo from '../assets/google.svg';
import appleLogo from '../assets/apple.svg';

const HOME_TYPES = [
  { id: 'house', label: 'House' },
  { id: 'townhouse', label: 'Townhouse' },
  { id: 'condo', label: 'Condo' },
  { id: 'apartment', label: 'Apartment' },
  { id: 'other', label: 'Other' },
];

const YEAR_BUCKETS = [
  { id: 'pre-1980', label: 'Before 1980' },
  { id: '1980-2000', label: '1980–2000' },
  { id: '2000-2015', label: '2000–2015' },
  { id: 'after-2015', label: 'After 2015' },
  { id: 'unknown', label: 'Not sure' },
];

const OUTDOOR = [
  { id: 'yard', label: 'Yard', icon: TreePine },
  { id: 'irrigation', label: 'Irrigation', icon: Droplet },
  { id: 'pool', label: 'Pool', icon: Droplet },
  { id: 'trees', label: 'Mature trees', icon: TreePine },
  { id: 'none', label: 'None' },
];

const SYSTEMS = [
  { id: 'central-hvac', label: 'Central HVAC', icon: Wind },
  { id: 'gas-furnace', label: 'Gas furnace', icon: Flame },
  { id: 'electric-heat', label: 'Electric heating', icon: Wind },
  { id: 'water-heater', label: 'Water heater', icon: Droplet },
  { id: 'fireplace', label: 'Fireplace', icon: Flame },
  { id: 'septic', label: 'Septic', icon: Droplet },
];

function buildMaintenance(profile) {
  const labelOf = (id) => {
    const s = SYSTEMS.find((x) => x.id === id);
    if (s) return s.label;
    const o = OUTDOOR.find((x) => x.id === id);
    if (o) return o.label;
    return id;
  };
  const items = [];
  if (profile.systems.has('central-hvac') || profile.systems.has('gas-furnace')) {
    const triggers = ['central-hvac', 'gas-furnace'].filter((id) => profile.systems.has(id));
    items.push({
      id: 'hvac',
      icon: Wind,
      accent: 'sage',
      title: 'HVAC service',
      cadence: 'Every spring · before peak season',
      detail: 'Filter swap + coil clean. Catches small issues before they become emergency call-outs.',
      source: `From ${triggers.map(labelOf).join(' + ')}`,
    });
  }
  if (profile.systems.has('water-heater')) {
    items.push({
      id: 'water-heater',
      icon: Droplet,
      accent: 'sky',
      title: 'Water heater check',
      cadence: 'Every 6 months',
      detail: 'Anode rod inspection + sediment flush. Adds years to the unit.',
      source: 'From Water heater',
    });
  }
  if (profile.outdoor.has('yard') || profile.outdoor.has('trees')) {
    const triggers = ['yard', 'trees'].filter((id) => profile.outdoor.has(id));
    items.push({
      id: 'gutters',
      icon: Wrench,
      accent: 'ember',
      title: 'Gutter cleaning',
      cadence: 'Every fall · before leaves drop',
      detail: 'Prevents ice dams, foundation seepage, and cascading roof damage.',
      source: `From ${triggers.map(labelOf).join(' + ')}`,
    });
  }
  if (profile.outdoor.has('irrigation')) {
    items.push({
      id: 'sprinkler',
      icon: Droplet,
      accent: 'sky',
      title: 'Sprinkler tune-up',
      cadence: 'Every spring',
      detail: 'Replace damaged heads, adjust coverage zones, check timer.',
      source: 'From Irrigation',
    });
  }
  if (profile.systems.has('septic')) {
    items.push({
      id: 'septic',
      icon: Wrench,
      accent: 'ember',
      title: 'Septic pump-out',
      cadence: 'Every 3 years',
      detail: 'Avoid backups by sticking to the pumping schedule.',
      source: 'From Septic',
    });
  }
  if (profile.systems.has('fireplace')) {
    items.push({
      id: 'fireplace',
      icon: Flame,
      accent: 'ember',
      title: 'Chimney inspection',
      cadence: 'Annually · before fall',
      detail: 'Creosote buildup is the #1 cause of chimney fires.',
      source: 'From Fireplace',
    });
  }
  // baseline universal item
  items.push({
    id: 'smoke',
    icon: Bell,
    accent: 'sage',
    title: 'Smoke + CO detector test',
    cadence: 'Every 6 months',
    detail: 'Press to test, swap batteries, replace units after 10 years.',
    source: 'Standard for every home',
  });
  return items.slice(0, 5);
}

export default function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    homeType: '',
    yearBuilt: '',
    address: '',
    zip: '',
    outdoor: new Set(),
    systems: new Set(),
  });

  const toggle = (key, id) => {
    setProfile((p) => {
      const next = new Set(p[key]);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...p, [key]: next };
    });
  };

  // Outdoor is multi-select with one mutually-exclusive option ("None").
  // Picking "None" clears the other selections; picking any other option
  // removes "None" from the set.
  const toggleOutdoor = (id) => {
    setProfile((p) => {
      const next = new Set(p.outdoor);
      if (id === 'none') {
        if (next.has('none')) {
          next.delete('none');
        } else {
          next.clear();
          next.add('none');
        }
      } else {
        next.delete('none');
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return { ...p, outdoor: next };
    });
  };

  const items = buildMaintenance(profile);

  return (
    <div className="min-h-screen bg-canvas text-ink-900 selection:bg-sage-200/40 relative">
      {/* Ambient backdrop, matching main app */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-sage-100 opacity-50 blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-ember-100 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-sky2026-100 opacity-30 blur-3xl" />
      </div>

      <header className="px-6 lg:px-10 py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
            <Home size={14} strokeWidth={1.8} />
          </span>
          <span className="editorial text-[17px] tracking-tight text-ink-900">Homewise</span>
        </div>
      </header>

      <main className="px-6 lg:px-10 pb-16">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <SignupScreen key="signup" onContinue={() => setStep(1)} />
          )}
          {step === 1 && (
            <ProfileScreen
              key="profile"
              profile={profile}
              setProfile={setProfile}
              toggle={toggle}
              toggleOutdoor={toggleOutdoor}
              onBack={() => setStep(0)}
              onContinue={() => onComplete(items)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function BackLink({ onClick, label = 'Back' }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 h-8 pl-1.5 pr-3 -ml-1.5 rounded-xl text-[12px] text-ink-500 hover:text-ink-900 hover:bg-canvas-soft transition-all"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-ink-100 group-hover:border-ink-200 transition-colors">
        <ArrowLeft size={12} strokeWidth={2} />
      </span>
      {label}
    </button>
  );
}

function SignupScreen({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto pt-12 lg:pt-20"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="h-px w-6 bg-sage-300" />
        <span className="text-[11px] uppercase tracking-[0.22em] text-sage-600 font-semibold">
          Get started
        </span>
      </div>

      <h1 className="editorial text-[36px] md:text-[44px] leading-[1.05] text-ink-900 tracking-tight">
        Start with your home.
        <span className="block text-ink-500">Take it from there.</span>
      </h1>

      <p className="mt-3 text-[13.5px] text-ink-500 leading-relaxed">
        Two minutes. Then your home's watchlist, ready when you are.
      </p>

      <div className="mt-10 space-y-2">
        <button
          onClick={onContinue}
          className="w-full h-12 rounded-2xl bg-white border border-ink-200 hover:border-ink-300 text-ink-900 inline-flex items-center justify-center gap-2.5 text-[13.5px] font-semibold transition-all"
        >
          <img src={googleLogo} alt="" className="h-4 w-4" />
          Continue with Google
        </button>
        <button
          onClick={onContinue}
          className="w-full h-12 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center justify-center gap-2.5 text-[13.5px] font-semibold transition-all"
        >
          <img src={appleLogo} alt="" className="h-[15px] w-[15px] invert" />
          Continue with Apple
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="flex-1 h-px bg-ink-100" />
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-ink-400 font-semibold">
          or
        </span>
        <span className="flex-1 h-px bg-ink-100" />
      </div>

      <button
        onClick={onContinue}
        className="w-full h-12 rounded-2xl bg-white border border-ink-200 hover:border-ink-300 text-ink-700 hover:text-ink-900 inline-flex items-center justify-center gap-2.5 text-[13.5px] font-medium transition-all"
      >
        <Mail size={14} strokeWidth={1.8} />
        Continue with email
      </button>

      <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-ink-500">
        <ShieldCheck size={12} className="text-sage-500" strokeWidth={2} />
        No contractor sees your home until you ask
      </div>
      <p className="mt-2 text-[11px] text-ink-400 text-center leading-relaxed">
        By continuing you agree to Homewise's terms and privacy policy.
      </p>
    </motion.div>
  );
}

function ProfileScreen({ profile, setProfile, toggle, toggleOutdoor, onBack, onContinue }) {
  // All 5 questions required. Q04 Outdoor uses the "None" chip as the
  // explicit "no outdoor features" affordance (per the toggleOutdoor
  // logic in the parent), so the gate is satisfied either by a real
  // selection (yard/pool/trees/etc.) or by picking "None".
  //
  // Q03 address: must look like a street address — has a digit, a letter,
  // a space, and is at least 5 chars.
  const addrTrimmed = profile.address.trim();
  const addressValid =
    addrTrimmed.length >= 5 &&
    /\d/.test(addrTrimmed) &&
    /[a-zA-Z]/.test(addrTrimmed) &&
    addrTrimmed.includes(' ');
  const addressWarning = addrTrimmed.length > 0 && !addressValid;

  const canContinue =
    profile.homeType !== '' &&
    profile.yearBuilt !== '' &&
    addressValid &&
    profile.zip.length === 5 &&
    profile.outdoor.size > 0 &&
    profile.systems.size > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto pt-6 lg:pt-10 space-y-10"
    >
      <BackLink onClick={onBack} label="Back" />
      <header>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
            <Sparkles size={13} strokeWidth={2.2} />
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-sage-600 font-semibold">
            Quick setup · about a minute
          </span>
        </div>
        <h1 className="editorial text-[28px] md:text-[34px] leading-[1.05] text-ink-900 tracking-tight">
          Five questions, then we plan.
        </h1>
        <p className="mt-3 text-[14px] text-ink-500 max-w-xl leading-relaxed">
          Each is skippable. Your answers build the watchlist on your home page.
        </p>
      </header>

      <Question num="01" label="Home type">
        <ChipRow>
          {HOME_TYPES.map((o) => (
            <Chip
              key={o.id}
              selected={profile.homeType === o.id}
              onClick={() => setProfile((p) => ({ ...p, homeType: o.id }))}
            >
              {o.label}
            </Chip>
          ))}
        </ChipRow>
      </Question>

      <Question num="02" label="Year built">
        <ChipRow>
          {YEAR_BUCKETS.map((o) => (
            <Chip
              key={o.id}
              selected={profile.yearBuilt === o.id}
              onClick={() => setProfile((p) => ({ ...p, yearBuilt: o.id }))}
            >
              {o.label}
            </Chip>
          ))}
        </ChipRow>
      </Question>

      <Question num="03" label="Where you live" sub="For matching local contractors">
        <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            value={profile.address}
            onChange={(e) =>
              setProfile((p) => ({ ...p, address: e.target.value }))
            }
            placeholder="123 Maple St, Oakland, CA"
            autoComplete="street-address"
            className="flex-1 h-10 px-3.5 rounded-2xl bg-canvas-soft border border-ink-100 placeholder:text-ink-400 text-[13px] focus:outline-none focus:border-ink-300"
          />
          <input
            type="text"
            value={profile.zip}
            onChange={(e) =>
              setProfile((p) => ({
                ...p,
                zip: e.target.value.replace(/\D/g, '').slice(0, 5),
              }))
            }
            placeholder="94609"
            inputMode="numeric"
            autoComplete="postal-code"
            className="w-full sm:w-28 h-10 px-3.5 rounded-2xl bg-canvas-soft border border-ink-100 placeholder:text-ink-400 text-[13px] tabular-nums focus:outline-none focus:border-ink-300"
          />
        </div>
        {addressWarning && (
          <p className="mt-1.5 text-[11px] text-ember-500">
            Please type a valid street address.
          </p>
        )}
      </Question>

      <Question num="04" label="Outdoor features" sub="Multi-select">
        <ChipRow>
          {OUTDOOR.map((o) => {
            const on = profile.outdoor.has(o.id);
            const Icon = o.icon;
            return (
              <Chip key={o.id} selected={on} onClick={() => toggleOutdoor(o.id)}>
                {Icon && (
                  <Icon
                    size={11}
                    strokeWidth={2}
                    className={on ? 'opacity-90' : 'text-ink-400'}
                  />
                )}
                {o.label}
              </Chip>
            );
          })}
        </ChipRow>
      </Question>

      <Question num="05" label="Major systems" sub="Multi-select">
        <ChipRow>
          {SYSTEMS.map((o) => {
            const on = profile.systems.has(o.id);
            const Icon = o.icon;
            return (
              <Chip key={o.id} selected={on} onClick={() => toggle('systems', o.id)}>
                {Icon && (
                  <Icon
                    size={11}
                    strokeWidth={2}
                    className={on ? 'opacity-90' : 'text-ink-400'}
                  />
                )}
                {o.label}
              </Chip>
            );
          })}
        </ChipRow>
      </Question>

      <div className="pt-2 flex items-center gap-3">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="group h-12 pl-5 pr-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-2.5 text-[13.5px] font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue to your home
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft/15 group-hover:bg-canvas-soft/25 transition-colors">
            <ArrowRight size={14} strokeWidth={2.2} />
          </span>
        </button>
      </div>
    </motion.div>
  );
}

function Question({ num, label, sub, children }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-3 flex-wrap">
        <span className="text-[11px] tabular-nums text-ink-400 font-bold">{num}</span>
        <span className="h-px w-4 bg-ink-200" />
        <h3 className="text-[13px] font-medium text-ink-900 tracking-[-0.010em]">{label}</h3>
        {sub && <span className="text-[11px] text-ink-500">{sub}</span>}
      </div>
      <div className="ml-7">{children}</div>
    </section>
  );
}

function ChipRow({ children }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all whitespace-nowrap ${
        selected
          ? 'bg-ink-900 text-canvas-soft'
          : 'bg-white border border-ink-200 hover:border-ink-300 text-ink-700 hover:text-ink-900'
      }`}
    >
      {children}
    </button>
  );
}
