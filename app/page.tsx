"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Zap,
  Clock,
  Trophy,
  Rocket,
  ChevronRight,
  Code2,
  Sparkles,
  Users,
  ArrowRight,
  Shield,
  HelpCircle,
  Calendar,
  Flame,
  Layout,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";
import { getDailyChallenge } from "@/lib/dailyChallenge";
import { playMutedClick, playSubtleHover } from "@/lib/sound";

/** Stagger animation container variant */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Fade-up animation for children */
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function LandingPage() {
  const router = useRouter();
  const setGameMode = useGameStore((s) => s.setGameMode);
  const initializeDailyChallenge = useGameStore((s) => s.initializeDailyChallenge);
  const stats = useGameStore((s) => s.stats);

  const [timeLeft, setTimeLeft] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [dailyData, setDailyData] = useState<any>(null);

  useEffect(() => {
    // Generate daily challenge metadata once client-side
    setDailyData(getDailyChallenge());

    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // 12:00 AM next day
      
      const diffMs = midnight.getTime() - now.getTime();
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchMode = (mode: 'classic' | 'daily' | 'speedrun' | 'chaos' | 'hardcore') => {
    playMutedClick();
    if (mode === 'daily') {
      initializeDailyChallenge();
    } else {
      setGameMode(mode);
      useGameStore.getState().resetGame();
      useGameStore.getState().setGameMode(mode);
      // Let difficulty stage handle classic/speedrun/chaos/hardcore setups
    }
    router.push("/game");
  };

  const modeDescriptions = {
    classic: "The baseline 10-minute hackathon simulator experience. Align stacks, priority backlogs, and pitch to impressive juries.",
    daily: "Seeded competitive daily challenge. Locked problem requirements, locked jury panel, and a locked modifier active for everyone.",
    speedrun: "Strict 3-minute global timer limit. Decision delays are penalized, requiring extreme developer execution pacing.",
    chaos: "Unstable compiler sandbox. Unpredictable team and technical chaos events occur with an elevated 35% probability.",
    hardcore: "No advisor mentor consulting allowed. Stricter judging score multipliers and increased penalty distributions."
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background text-foreground font-mono text-xs">
      <div className="absolute inset-0 grid-pattern pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/80 bg-white/50 backdrop-blur-xs select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-sm tracking-tight text-neutral-900">
            THE HACKATHON <span className="text-neutral-500 font-normal">SIMULATOR</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              playMutedClick();
              setShowStats(!showStats);
            }}
            onMouseEnter={playSubtleHover}
            className="text-[10px] h-8 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none"
          >
            📊 {showStats ? "HIDE_STATS.TXT" : "VIEW_STATS.TXT"}
          </Button>
          <span className="hidden sm:inline text-[10px] text-muted-foreground font-mono">
            v1.2.0//PAPER_TERMINAL
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-6 py-12 max-w-5xl mx-auto w-full space-y-12">
        
        {/* Visual Stats Drawer overlay */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full bg-white border border-neutral-300 rounded-lg p-5 shadow-sm text-left grid grid-cols-2 md:grid-cols-6 gap-4 select-none relative overflow-hidden"
            >
              <div className="absolute top-1 right-2 font-mono text-[9px] text-neutral-300 font-bold select-none">HISTORICAL_LOG.DB</div>
              <div className="border-r border-border/60 pr-2">
                <span className="text-neutral-400 block text-[9px] uppercase">TOTAL_RUNS:</span>
                <span className="text-lg font-black text-neutral-900">{stats?.totalRuns || 0}</span>
              </div>
              <div className="border-r border-border/60 pr-2">
                <span className="text-neutral-400 block text-[9px] uppercase">HIGH_SCORE:</span>
                <span className="text-lg font-black text-neutral-900">{(stats?.bestScore ? stats.bestScore / 2 : 0).toFixed(1)} <span className="text-[10px] font-normal text-neutral-400">/50</span></span>
              </div>
              <div className="border-r border-border/60 pr-2">
                <span className="text-neutral-400 block text-[9px] uppercase">AVG_SCORE:</span>
                <span className="text-lg font-black text-neutral-900">{(stats?.averageScore ? stats.averageScore / 2 : 0).toFixed(1)} <span className="text-[10px] font-normal text-neutral-400">/50</span></span>
              </div>
              <div className="border-r border-border/60 pr-2">
                <span className="text-neutral-400 block text-[9px] uppercase">CHAOS_SURVIVAL:</span>
                <span className="text-lg font-black text-neutral-900">{stats?.chaosSurvivalRate || 0}%</span>
              </div>
              <div className="border-r border-border/60 pr-2">
                <span className="text-neutral-400 block text-[9px] uppercase">WIN_RATE (&gt;=35pts):</span>
                <span className="text-lg font-black text-neutral-900">{stats?.judgeWinRate || 0}%</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px] uppercase">FAVORITE_STACK:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stats?.favoriteStack && stats.favoriteStack.length > 0 ? (
                    stats.favoriteStack.map((tech) => (
                      <span key={tech} className="bg-neutral-100 border border-neutral-300 rounded px-1 text-[8px] uppercase text-neutral-700 font-bold">
                        {tech.replace("tech-", "")}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-400 italic text-[9px]">[NO_DATA]</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono bg-neutral-100 border border-neutral-200 text-neutral-600 uppercase select-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              UPGRADE V1.2 ACTIVATED: DAILY_CHALLENGES & MODIFIERS
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-neutral-900 uppercase leading-none"
          >
            BUILD. SHIP. <span className="text-neutral-500 font-light">SURVIVE.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed max-w-md mx-auto"
          >
            Compile high-fidelity prototypes under strict timed constraints, navigate sudden chaos events, and impress tough judge panels.
          </motion.p>
        </motion.div>

        {/* Daily Challenge Highlight Card */}
        {dailyData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full bg-stone-50 border-2 border-neutral-900 rounded-lg p-6 shadow-sm text-left grid grid-cols-1 md:grid-cols-4 gap-6 select-none relative overflow-hidden"
          >
            {/* Seed background metadata */}
            <div className="absolute top-1 right-2 font-mono text-[8px] text-neutral-300 font-bold select-none">
              SEED_DB: {dailyData.seed}
            </div>

            {/* Left Side Locked Meta */}
            <div className="md:col-span-3 space-y-4 font-mono">
              <div className="flex items-center gap-2 border-b border-dashed border-border/80 pb-2">
                <Calendar className="w-4 h-4 text-neutral-700" />
                <span className="font-bold text-xs uppercase text-neutral-900">TODAY'S SEEDED CHALLENGE</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-900 text-white font-bold ml-auto flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  RESETS IN {timeLeft}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-[10px]">
                <div>
                  <span className="text-neutral-400">PROBLEM:</span>{" "}
                  <span className="text-neutral-900 font-bold uppercase truncate block">
                    {dailyData.problem.title}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">DIFFICULTY:</span>{" "}
                  <span className="text-neutral-900 font-bold uppercase block">
                    {dailyData.difficulty}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">TARGET JUDGE:</span>{" "}
                  <span className="text-neutral-900 font-bold uppercase block">
                    {dailyData.judge.avatar} {dailyData.judge.name}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">ACTIVE MODIFIER:</span>{" "}
                  <span className="text-neutral-900 font-bold uppercase block text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded w-fit text-[9px]">
                    ⚠️ {dailyData.modifier.name}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-neutral-500 font-sans font-light border-t border-dashed border-border/80 pt-2 leading-relaxed">
                Locked run: Problem statement, difficulty timers, and target judge are predetermined. Scoring adapts dynamically to the modifier: <span className="italic text-neutral-700 font-mono font-bold">"{dailyData.modifier.description}"</span>
              </p>
            </div>

            {/* Right Side Action Button */}
            <div className="flex items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-border/80 pt-4 md:pt-0 md:pl-6">
              <Button
                onClick={() => handleLaunchMode('daily')}
                onMouseEnter={playSubtleHover}
                className="w-full md:w-auto h-12 px-6 bg-neutral-900 text-white hover:bg-neutral-800 font-bold tracking-wider rounded border border-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                <Rocket className="w-4 h-4 animate-bounce" />
                PLAY_CHALLENGE.EXE
              </Button>
            </div>
          </motion.div>
        )}

        {/* Play Modes Grid */}
        <div className="w-full space-y-4">
          <h2 className="text-left font-bold text-sm uppercase text-neutral-400 border-b border-border/85 pb-2 select-none">
            AVAILABLE_PLAY_MODES:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Classic Card */}
            <div className="p-5 bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.015)] text-left flex flex-col justify-between hover:border-neutral-900 transition-all select-none">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 rounded bg-neutral-100 text-neutral-700 border border-neutral-200"><Layout className="w-4 h-4" /></span>
                  <h3 className="font-bold text-neutral-900 uppercase">CLASSIC_FLOW.SH</h3>
                </div>
                <p className="text-[10px] text-neutral-600 font-sans font-light leading-relaxed mb-4">
                  {modeDescriptions.classic}
                </p>
              </div>
              <Button
                onClick={() => handleLaunchMode('classic')}
                onMouseEnter={playSubtleHover}
                className="w-full font-mono text-[10px] border border-neutral-900 h-8 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none cursor-pointer"
              >
                LAUNCH_CLASSIC &gt;
              </Button>
            </div>

            {/* Speed Run Card */}
            <div className="p-5 bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.015)] text-left flex flex-col justify-between hover:border-neutral-900 transition-all select-none">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 rounded bg-neutral-100 text-neutral-700 border border-neutral-200"><Clock className="w-4 h-4" /></span>
                  <h3 className="font-bold text-neutral-900 uppercase">SPEED_RUN.EXE</h3>
                </div>
                <p className="text-[10px] text-neutral-600 font-sans font-light leading-relaxed mb-4">
                  {modeDescriptions.speedrun}
                </p>
              </div>
              <Button
                onClick={() => handleLaunchMode('speedrun')}
                onMouseEnter={playSubtleHover}
                className="w-full font-mono text-[10px] border border-neutral-900 h-8 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none cursor-pointer"
              >
                LAUNCH_SPEEDRUN &gt;
              </Button>
            </div>

            {/* Chaos Mode Card */}
            <div className="p-5 bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.015)] text-left flex flex-col justify-between hover:border-neutral-900 transition-all select-none">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 rounded bg-neutral-100 text-neutral-700 border border-neutral-200"><Flame className="w-4 h-4" /></span>
                  <h3 className="font-bold text-neutral-900 uppercase">CHAOS_MODE.BAT</h3>
                </div>
                <p className="text-[10px] text-neutral-600 font-sans font-light leading-relaxed mb-4">
                  {modeDescriptions.chaos}
                </p>
              </div>
              <Button
                onClick={() => handleLaunchMode('chaos')}
                onMouseEnter={playSubtleHover}
                className="w-full font-mono text-[10px] border border-neutral-900 h-8 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none cursor-pointer"
              >
                LAUNCH_CHAOS &gt;
              </Button>
            </div>

            {/* Hardcore Mode Card */}
            <div className="p-5 bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.015)] text-left flex flex-col justify-between hover:border-neutral-900 transition-all select-none">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 rounded bg-neutral-100 text-neutral-700 border border-neutral-200"><Shield className="w-4 h-4" /></span>
                  <h3 className="font-bold text-neutral-900 uppercase">HARDCORE_PROFILES.SH</h3>
                </div>
                <p className="text-[10px] text-neutral-600 font-sans font-light leading-relaxed mb-4">
                  {modeDescriptions.hardcore}
                </p>
              </div>
              <Button
                onClick={() => handleLaunchMode('hardcore')}
                onMouseEnter={playSubtleHover}
                className="w-full font-mono text-[10px] border border-neutral-900 h-8 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none cursor-pointer"
              >
                LAUNCH_HARDCORE &gt;
              </Button>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-[10px] text-muted-foreground border-t border-border/80 select-none">
        <div className="flex items-center justify-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-400 animate-pulse" />
          <span>
            THE HACKATHON SIMULATOR v1.2.0 — PAPER TERMINAL STYLING SYSTEM
          </span>
        </div>
      </footer>
    </div>
  );
}
