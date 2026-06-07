import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import OverviewPage from './pages/OverviewPage';
import TasksPage from './pages/TasksPage';
import SchedulePage from './pages/SchedulePage';
import IntakePage from './pages/IntakePage';
import ScopePage from './pages/ScopePage';
import ContractorComparePage from './pages/ContractorComparePage';
import QuoteTrackingPage from './pages/QuoteTrackingPage';
import QuoteComparePage from './pages/QuoteComparePage';
import ConversationPage from './pages/ConversationPage';
import OnboardingPage from './pages/OnboardingPage';
import CompletionPage from './pages/CompletionPage';
import DesignSystemPage from './pages/DesignSystemPage';
import BidFormPage from './pages/BidFormPage';

const pageMap = {
  overview: OverviewPage,
  tasks: TasksPage,
  schedule: SchedulePage,
  // Focused flow pages (not in sidebar nav, accessed via CTAs)
  intake: IntakePage,
  scope: ScopePage,
  'contractor-compare': ContractorComparePage,
  'quote-tracking': QuoteTrackingPage,
  'quote-compare': QuoteComparePage,
  conversation: ConversationPage,
  completion: CompletionPage,
};

// Pages that hide the footer (so the chat input pins to the viewport bottom without page scroll competing)
const fullViewportPages = new Set(['intake', 'conversation']);

export default function App() {
  const [page, setPage] = useState('overview');
  const [intakeKey, setIntakeKey] = useState(0);
  const [conversationId, setConversationId] = useState('sink');
  const [decisionHandled, setDecisionHandled] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState(null);
  const [hasStartedFirstTask, setHasStartedFirstTask] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [jobCompleted, setJobCompleted] = useState(false);
  const [recommended, setRecommended] = useState(null);
  const [photosShared, setPhotosShared] = useState(false);
  const Page = pageMap[page] || OverviewPage;

  // URL-based escape hatches for pages that bypass the app shell.
  // SPA rewrites in vercel.json serve index.html for any path, so we
  // detect the path here and short-circuit before onboarding + sidebar.
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/designsystem') return <DesignSystemPage />;
    // /bidform is the contractor-facing magic-link bid submission flow.
    // No login, no sidebar — the homeowner app doesn't apply here.
    if (path === '/bidform' || path.startsWith('/bid/')) return <BidFormPage />;
  }

  if (!hasOnboarded) {
    return <OnboardingPage onComplete={(items) => { setHasOnboarded(true); setMaintenanceItems(items || []); }} />;
  }

  const handleNavigate = (id, opts = {}) => {
    // Allow navigating with extra context, e.g. { conversationId: 'hvac' }
    if (typeof id === 'object' && id !== null) {
      opts = id;
      id = opts.page;
    }
    if (!pageMap[id]) return;
    if (id === 'intake') setIntakeKey(k => k + 1);
    if (opts.conversationId) setConversationId(opts.conversationId);
    // Reaching scope means the AI has produced something tangible — populate the dashboard
    if (id === 'scope') setHasStartedFirstTask(true);
    // "Not now" exit from Scope: roll the dashboard back to its empty state.
    // The user hasn't approved anything yet, so there's no active task to keep around.
    if (opts.resetTask) setHasStartedFirstTask(false);
    // The user explicitly approved a contractor (sent via opts.decisionHandled)
    if (opts.decisionHandled) setDecisionHandled(true);
    if (opts.scheduledSlot) setScheduledSlot(opts.scheduledSlot);
    if (opts.jobCompleted) setJobCompleted(true);
    if (opts.recommended) setRecommended(opts.recommended);
    if (opts.photosShared !== undefined) setPhotosShared(opts.photosShared);
    setPage(id);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        document.scrollingElement?.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
  };


  return (
    <div className="min-h-screen bg-canvas text-ink-900 selection:bg-sage-200/40">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-sage-100 opacity-50 blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-ember-100 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-sky2026-100 opacity-30 blur-3xl" />
      </div>

      <div className="flex min-h-screen">
        {/* LEFT. sidebar */}
        <div className="hidden lg:block w-[244px] shrink-0 sticky top-0 h-screen self-start">
          <Sidebar
            activePage={page}
            onNavigate={handleNavigate}
            hasStartedFirstTask={hasStartedFirstTask}
            jobCompleted={jobCompleted}
          />
        </div>

        {/* MAIN. content */}
        <main
          id="main-scroll"
          className="flex-1 min-w-0 px-6 lg:px-10 xl:px-14 py-8 lg:py-10 max-w-[1400px] mx-auto flex flex-col"
        >
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={page === 'intake' ? `intake-${intakeKey}` : page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Page
                  onNavigate={handleNavigate}
                  conversationId={conversationId}
                  decisionHandled={decisionHandled}
                  scheduledSlot={scheduledSlot}
                  jobCompleted={jobCompleted}
                  recommended={recommended}
                  photosShared={photosShared}
                  hasStartedFirstTask={hasStartedFirstTask}
                  maintenanceItems={maintenanceItems}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {!fullViewportPages.has(page) && (
            <footer className="mt-16 pt-8 border-t border-ink-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2 text-[12px] text-ink-500">
                  <span className="editorial text-[15px] text-ink-700 leading-none">
                    Homewise
                  </span>
                  <span className="text-ink-300">·</span>
                  <span>Your AI home command center</span>
                </div>
                <div className="flex items-center gap-5 text-[12px] text-ink-500">
                  <a className="hover:text-ink-900 transition-colors" href="#">
                    Privacy
                  </a>
                  <a className="hover:text-ink-900 transition-colors" href="#">
                    Trust &amp; safety
                  </a>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-500" />
                    </span>
                    All systems normal
                  </span>
                </div>
              </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
