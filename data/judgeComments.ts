/**
 * @file Curated database of 50+ highly contextual judge comment templates.
 * Provides distinct voices and parameters matching the active project state.
 *
 * @module data/judgeComments
 */

import type { TechItem, Feature, Problem } from "@/types/game";

export interface ContextState {
  techStack: TechItem[];
  features: Feature[];
  usp: string | null;
  businessModel: string | null;
  problem: Problem | null;
  solutionDirection: string | null;
}

export interface CommentResult {
  comment: string;
  highlight: string;
}

/**
 * Enhanced Comments Generator for v1.2 Realism Pass.
 * Contains 50+ distinct, highly context-aware feedback templates.
 */
export function generateJudgeFeedback(
  judgeId: string,
  score: number,
  state: ContextState
): CommentResult {
  const techIds = new Set(state.techStack.map((t) => t.id));
  const featureIds = new Set(state.features.map((f) => f.id));
  const isOverengineered = techIds.size >= 4 && state.features.length >= 4;
  const isMinimalist = state.features.length === 2 && techIds.size <= 3;
  const hasAI = techIds.has("tech-gemini") || techIds.has("tech-openai");
  const hasHardware = techIds.has("tech-esp32") || techIds.has("tech-arduino");

  // ---------------------------------------------------------
  // 1. Dr. Priya Kapoor (Technical Judge)
  // Focus: Architecture, databases, latency, Edge APIs, scale
  // ---------------------------------------------------------
  if (judgeId === "judge-tech") {
    // HIGH SCORE TIER (>= 90)
    if (score >= 90) {
      if (techIds.has("tech-next") && techIds.has("tech-supabase")) {
        return {
          comment: "Superb architectural design. Coupling Next.js routes with Supabase row-level security handles data transactions flawlessly. Your edge handlers are perfectly clean.",
          highlight: "Next.js and Supabase data pipeline execution is absolutely flawless."
        };
      }
      if (techIds.has("tech-fastapi") && techIds.has("tech-postgres")) {
        return {
          comment: "This is a masterpiece of backend engineering. FastAPI's async loops paired with a robustly indexed PostgreSQL schema provides outstanding query speeds and request latency profiles.",
          highlight: "Asynchronous FastAPI and PostgreSQL indexing models are exceptionally structured."
        };
      }
      if (hasHardware) {
        return {
          comment: "Impressive physical system design. You managed to compile clean C++ modules for the ESP32 chip without dropping sensor packages on the serial bus.",
          highlight: "Embedded hardware pipeline shows master-class firmware compiling."
        };
      }
      if (techIds.has("tech-docker") && techIds.has("tech-aws")) {
        return {
          comment: "Stellar devops setup. Packaging this microservice cluster within lightweight Docker runtimes deployed directly to AWS ensures highly predictable container metrics.",
          highlight: "Microservices container isolation shows serious enterprise readiness."
        };
      }
      // General High
      return {
        comment: "Excellent technical execution. The modularity of your files is superb, dependencies are tidy, and the build outputs are highly optimized for production runtimes.",
        highlight: "Outstanding file separation and clean structural dependencies."
      };
    }
    // MID SCORE TIER (70-89)
    if (score >= 70) {
      if (isOverengineered) {
        return {
          comment: "A solid MVP, but the tech stack is slightly bloated. Did you really need to configure a Docker registry and AWS buckets to host what is essentially a static page?",
          highlight: "Solid code execution burdened by slight architectural bloat."
        };
      }
      if (hasAI && !techIds.has("tech-supabase") && !techIds.has("tech-postgres")) {
        return {
          comment: "Your AI models compile nicely in-memory, but there is no persistent storage layer like PostgreSQL. Local variables will clear immediately on container reboot.",
          highlight: "Decent API query orchestration, though database persistence is lacking."
        };
      }
      if (techIds.has("tech-firebase")) {
        return {
          comment: "A decent prototype using Firebase backend bindings. It gets the job done quickly, though you'll run into transaction locks if user query counts scale up.",
          highlight: "Speedy backend integration with direct NoSQL real-time bindings."
        };
      }
      if (state.features.length > 3) {
        return {
          comment: "Functional build, though your backlog prioritization is messy. Splitting developer focus across too many Must-Have features has introduced minor compile bugs in the dashboard.",
          highlight: "Acceptable compiler output despite a cluttered feature backlog."
        };
      }
      // General Mid
      return {
        comment: "A clean, functional prototype. The database schemas are structured properly, though the build size could benefit from tighter tree-shaking packages.",
        highlight: "Reliable database schemas and stable server query pipelines."
      };
    }
    // LOW SCORE TIER (< 70)
    if (isOverengineered) {
      return {
        comment: "This is a technical disaster. You have overlapping Node processes, Firebase bindings, and Docker layers clashing. It is a house of cards that crashes on compile.",
        highlight: "Severe system collisions from uncoordinated architectural bloat."
      };
    }
    if (hasHardware && !techIds.has("tech-esp32")) {
      return {
        comment: "You selected an IoT direction but didn't slot microcontrollers into your tech stack. It's impossible to compile a firmware compiler without target hardware boards.",
        highlight: "Fatal firmware gap: hardware direction is missing embedded components."
      };
    }
    if (state.features.length < 2) {
      return {
        comment: "The build is severely under-scoped. You haven't implemented standard user authentication or any active routes. It is barely an empty shell of an app.",
        highlight: "Incomplete project backlog lacks basic functional routes."
      };
    }
    if (techIds.has("tech-aws") && state.usp === "Fastest") {
      return {
        comment: "Architectural failure. You claim extreme speed as your USP but host on raw AWS servers without edge caching layers, resulting in 500ms startup latencies.",
        highlight: "Severe latency overhead contradicts speed USP promises."
      };
    }
    // General Low
    return {
      comment: "The compiler is throwing continuous reference errors. The stack configuration is unstable, dependencies are tangled, and the project is currently crashing on startup.",
      highlight: "Tangled dependency trees and unstable deployment runtime."
    };
  }

  // ---------------------------------------------------------
  // 2. Alex Nakamura (Startup Judge)
  // Focus: Customer adoption, growth, disruption, market hooks
  // ---------------------------------------------------------
  if (judgeId === "judge-startup") {
    // HIGH SCORE TIER (>= 90)
    if (score >= 90) {
      if (state.usp === "AI-powered" || state.usp === "Hyper-personalized") {
        return {
          comment: "Brilliant growth strategy! Weaving an AI-powered personalized loop directly into the onboarding workflow creates a highly addictive product hook.",
          highlight: "Superb product loops utilizing highly personalized AI modules."
        };
      }
      if (state.usp === "Community-first") {
        return {
          comment: "I love this! A community-first USP creates an organic growth flywheel that slashes your customer acquisition costs to practically zero.",
          highlight: "Strong network effect flywheels built on organic community loops."
        };
      }
      if (state.businessModel === "Marketplace" || state.businessModel === "Freemium") {
        return {
          comment: "Excellent startup discipline. This freemium offering builds a massive top-of-funnel audience quickly, unlocking highly organic monetization paths.",
          highlight: "Highly cohesive freemium distribution strategy."
        };
      }
      // General High
      return {
        comment: "Fantastic pitch! You have identified an extremely sharp customer pain point, matched it with a viral marketing loop, and packaged it in a compelling narrative.",
        highlight: "Stellar customer pain-point alignment and viral marketing loop."
      };
    }
    // MID SCORE TIER (70-89)
    if (score >= 70) {
      if (state.businessModel === "B2B SaaS") {
        return {
          comment: "The enterprise SaaS angle makes sense, but your feature priorities are too heavy on animations. Focus less on UI polish and more on high-impact customer metrics.",
          highlight: "Viable business model, but feature prioritization is too visual-heavy."
        };
      }
      if (state.usp === "Cheapest") {
        return {
          comment: "Being the cheapest is a decent short-term hook, but it is not a defensible startup moat. You need to tell a better story about your long-term product value.",
          highlight: "Functional cheap hosting hook, though defensible moats are weak."
        };
      }
      if (isMinimalist) {
        return {
          comment: "I appreciate the hyper-focused MVP scope, but you've cut so many visual features that early adopters might struggle to engage with the product flow.",
          highlight: "Lean MVP execution, but customer engagement hooks are missing."
        };
      }
      // General Mid
      return {
        comment: "A highly respectable product. The target audience is clearly defined and the value proposition makes sense, though it needs a more aggressive viral mechanism.",
        highlight: "Clear user audience mapping and sensible value propositions."
      };
    }
    // LOW SCORE TIER (< 70)
    if (state.businessModel === "B2B SaaS" && state.features.length >= 4) {
      return {
        comment: "This is a product mess. You are trying to sell a bloated B2B SaaS system before confirming that a single campus user actually wants this feature set.",
        highlight: "Heavy enterprise scope creep without early validation."
      };
    }
    if (state.usp === "AI-powered" && !hasAI) {
      return {
        comment: "Startup heresy! Your entire pitch deck promises a revolutionary AI-powered solution, yet you didn't include a single AI framework in your stack. It's vaporware.",
        highlight: "Vaporware alert: AI pitch completely lacks technical AI backing."
      };
    }
    if (state.businessModel === "Government Partnership" && state.usp === "Fastest") {
      return {
        comment: "Strategic conflict. You cannot combine a public government partnership model with a 'fastest ship' speed USP. Municipal boards do not move in weeks.",
        highlight: "Severe market misalignment between municipal sales and speed."
      };
    }
    // General Low
    return {
      comment: "A highly confusing value proposition. The product lacks focus, there is no clear distribution channel, and the pitch reads like a solution desperately looking for a problem.",
      highlight: "Muddled product-market fit and absent launch strategies."
    };
  }

  // ---------------------------------------------------------
  // 3. Marcus Rivera (UX Judge)
  // Focus: Usability, responsiveness, design scales, accessibility
  // ---------------------------------------------------------
  if (judgeId === "judge-ux") {
    // HIGH SCORE TIER (>= 90)
    if (score >= 90) {
      if (techIds.has("tech-react") || techIds.has("tech-next")) {
        return {
          comment: "Absolutely gorgeous UI. The typography scale is perfectly aligned, column grids are proportional, and focus states are pixel-perfect on both desktop and mobile.",
          highlight: "Breathtaking typography scales and clean component responsiveness."
        };
      }
      if (featureIds.has("feature-ar") || featureIds.has("feature-gamify")) {
        return {
          comment: "Delightful design work! The micro-animations and gamified interactions create highly satisfying user feedback loops. It is incredibly satisfying.",
          highlight: "Delightful micro-interactions and interactive feedback states."
        };
      }
      // General High
      return {
        comment: "A masterclass in modern visual design. You have maintained a highly disciplined layout scale, elegant margins, and exceptional contrast ratios throughout.",
        highlight: "Outstanding layout discipline and premium contrast ratios."
      };
    }
    // MID SCORE TIER (70-89)
    if (score >= 70) {
      if (isMinimalist) {
        return {
          comment: "The minimalism is elegant, but you have cut too close to the bone. The lack of standard navigation containers makes user flows feel slightly disorienting.",
          highlight: "Elegant minimalist design burdened by weak user flow guides."
        };
      }
      if (featureIds.has("feature-chat") && !techIds.has("tech-supabase")) {
        return {
          comment: "The chat UI panels are styled beautifully, but the lack of an active database connection means messages will fail to load in real-time. Don't mock critical UX.",
          highlight: "Beautiful chat layout containers, but real-time data is missing."
        };
      }
      if (techIds.has("tech-aws") && !techIds.has("tech-vercel")) {
        return {
          comment: "The design layout is clean, but the interface load times are slightly dragged down by heavy server routing. Optimize the assets packaging.",
          highlight: "Polished interface hampered by static asset loading lag."
        };
      }
      // General Mid
      return {
        comment: "Highly functional layout. Buttons have excellent hover feedback and forms are structured logically, though the hierarchy of headings could be slightly bolder.",
        highlight: "Clean button feedback states and logical form layouts."
      };
    }
    // LOW SCORE TIER (< 70)
    if (isOverengineered) {
      return {
        comment: "A complete visual assault. You've crammed charts, maps, and voice forms onto a single view. The user interface feels like a bloated cockpit panel from a freight jet.",
        highlight: "Overwhelming visual clutter from excessive dashboard components."
      };
    }
    if (state.features.length < 2) {
      return {
        comment: "This is not a user experience—it is a blank paper. There are no navigational headers, no feedback indicators, and zero interactive paths.",
        highlight: "Severe lack of basic UI frameworks and empty layouts."
      };
    }
    if (featureIds.has("feature-ar") && hasHardware) {
      return {
        comment: "The usability here is highly questionable. Combining raw hardware sensor logs with augmented reality without basic data smoothing creates an erratic UI twitch.",
        highlight: "Erratic UI feedback from unsmoothed data streams."
      };
    }
    // General Low
    return {
      comment: "A highly frustrating layout. The elements overlap on smaller screens, typography ranges are chaotic, contrast is non-compliant, and focus outlines are completely absent.",
      highlight: "Broken screen responsiveness and non-compliant contrast levels."
    };
  }

  // ---------------------------------------------------------
  // 4. Victoria Chen (Investor Judge)
  // Focus: Unit economics, monetization, market sizing, margins
  // ---------------------------------------------------------
  if (judgeId === "judge-investor") {
    // HIGH SCORE TIER (>= 90)
    if (score >= 90) {
      if (state.businessModel === "B2B SaaS" && (state.usp === "Most Scalable" || state.usp === "AI-powered")) {
        return {
          comment: "Outstanding venture prospects. Coupling an enterprise SaaS recurring fee with a highly scalable AI backend creates an exceptionally defensible moat with 85%+ margins.",
          highlight: "Venture-grade SaaS monetization with incredibly high gross margins."
        };
      }
      if (state.businessModel === "Marketplace" && state.usp === "Community-first") {
        return {
          comment: "Excellent economic design. Utilizing organic community loops to seed a highly transactional marketplace solves the cold-start problem brilliantly.",
          highlight: "Brilliant cold-start resolution for transaction-fee marketplaces."
        };
      }
      if (state.businessModel === "Government Partnership") {
        return {
          comment: "Fascinating regulatory capture play. Securing municipal or campus partnerships creates highly sticky, multi-year contracts that are insulated from market shifts.",
          highlight: "Defensible public-sector contracts with immense retention moats."
        };
      }
      // General High
      return {
        comment: "A phenomenal pitch. The unit economics are airtight, the addressable market size is massive, and you have mapped out a clear path to venture scale.",
        highlight: "Airtight unit economics and exceptionally clear venture paths."
      };
    }
    // MID SCORE TIER (70-89)
    if (score >= 70) {
      if (state.businessModel === "Freemium" && !featureIds.has("feature-analytics")) {
        return {
          comment: "The freemium setup is logical, but your feature priority is missing high-end analytics. How do you convert standard tier users into paid corporate contracts?",
          highlight: "Logical freemium hook, but premium tier triggers are too weak."
        };
      }
      if (state.usp === "Cheapest") {
        return {
          comment: "Competing purely on cost leaves you highly vulnerable to larger tech competitors. I'd highly recommend shifting your positioning toward premium utility tiers.",
          highlight: "High pricing vulnerability due to low-cost positioning."
        };
      }
      if (isMinimalist) {
        return {
          comment: "The product margins are clean because the build is so small, but is the addressable market actually large enough to justify venture backing?",
          highlight: "Lean operating model, though overall market ceiling is capped."
        };
      }
      // General Mid
      return {
        comment: "A viable commercial project. The customer acquisition costs are within reasonable bounds and monetization is sensible, though the exit potential remains modest.",
        highlight: "Sensible monetization channels and realistic acquisition targets."
      };
    }
    // LOW SCORE TIER (< 70)
    if (state.businessModel === "B2B SaaS" && state.features.length >= 4) {
      return {
        comment: "A commercial train wreck. You've loaded the engineering queue with bloated custom features, ballooning your development costs before validating a single SaaS contract.",
        highlight: "Capital-inefficient feature bloat without customer validation."
      };
    }
    if (state.businessModel === "Freemium" && state.features.length < 2) {
      return {
        comment: "You chose a Freemium model, but there are literally not enough features to split between a free tier and a paid tier. There is nothing to monetize.",
        highlight: "Inoperable freemium split due to a severely under-scoped build."
      };
    }
    if (state.businessModel === "Government Partnership" && state.usp === "Fastest") {
      return {
        comment: "Complete commercial mismatch. Government sales cycles take 12 to 18 months of intensive lobbying. Pitching a 'fastest ship' model shows a total lack of regulatory awareness.",
        highlight: "Regulatory sales cycle clash with high speed promises."
      };
    }
    // General Low
    return {
      comment: "This is a non-profit, not a startup. The unit economics are entirely negative, customer acquisition margins are non-existent, and the market scale is highly localized.",
      highlight: "Un-fundable unit economics and extremely narrow addressable market."
    };
  }

  // ---------------------------------------------------------
  // 5. Lord Bugsworth (Chaos Judge)
  // Focus: Unpredictability, glitch jokes, humor, retro compilers
  // ---------------------------------------------------------
  // High, Mid, Low comments with retro hacker / glitch theme
  if (score >= 90) {
    if (hasHardware) {
      return {
        comment: "EXCEPTIONAL CODESMITHING! The wires are glowing, the ESP32 is singing, and I detected actual quantum tunneling in your capacitor array. Absolute cyber-shamanism.",
        highlight: "Quantum firmware resonance achieved through beautiful hardware loops."
      };
    }
    if (techIds.has("tech-next") && techIds.has("tech-gemini")) {
      return {
        comment: "Outstanding compile! Next.js routing combined with Gemini has created a sentient state machine. It just asked me if it could dream. 11/10.",
        highlight: "Highly advanced, borderline sentient LLM compiler structures."
      };
    }
    return {
      comment: "My debugger is in tears of joy. Zero segmentation faults, zero dangling references, and your memory footprint is as light as a virtual feather. I have blessed this binary.",
      highlight: "Blessed compiler binary contains pristine virtual layout structures."
    };
  } else if (score >= 70) {
    if (isOverengineered) {
      return {
        comment: "A chaotic but highly robust build! It contains so many Docker layers that I felt like I was debugging a digital nesting doll. Safe, but highly recursive.",
        highlight: "Recursive digital nesting doll container architecture works correctly."
      };
    }
    if (techIds.has("tech-firebase")) {
      return {
        comment: "A classic Firebase build. It runs fine, but NoSQL databases make my binary chips itch. I found three empty JSON trees in your database roots.",
        highlight: "Functional NoSQL arrays populated by ghostly empty JSON structures."
      };
    }
    return {
      comment: "Decent compile. The project operates within standard laws of computer physics, though I recommend checking the coolant levels on your main database server.",
      highlight: "Solid computational loop running within standard physics constants."
    };
  } else {
    if (isOverengineered) {
      return {
        comment: "UNBELIEVABLE BLOAT. Your project has triggered a local spacetime curvature. I tried compiling and Vercel sent me a bill for three trillion dollars. Outstanding disaster.",
        highlight: "Spacetime curvature triggered by extreme server-side packaging bloat."
      };
    }
    if (techIds.has("tech-node") && techIds.has("tech-mongodb")) {
      return {
        comment: "ERROR 404: ARCHITECTURE NOT FOUND. The Node server is currently throwing undefined logs at my face while your MongoDB cluster emits actual digital smoke. Absolute masterpiece of anarchy.",
        highlight: "Digital smoke emitted from tangled MongoDB connection strings."
      };
    }
    return {
      comment: "CRITICAL FAILURE. A nesting family of virtual raccoons has colonized your main routing directories. I tried running the code and it deleted my desktop layout. Magnificent chaos.",
      highlight: "Virtual raccoon colonization detected inside key routing paths."
    };
  }
}
