import React, { useRef, useState, useEffect } from 'react';
import { 
  motion, 
  useSpring, 
  useTransform, 
  useMotionValue, 
  useMotionTemplate,
  AnimatePresence 
} from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowUpRight, 
  Terminal, 
  Cpu, 
  Globe,
  Home,
  User,
  Briefcase,
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* -------------------  BACKGROUND ------------------- */
const BackgroundGrid = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:24px_24px]" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: useMotionTemplate`radial-gradient(
            500px circle at ${mouseX}px ${mouseY}px,
            rgba(255,255,255,0.04),
            transparent 80%
          )`
        }}
      />
    </div>
  );
};

/* -------------------  DOCK ------------------- */
const DockItem = ({ mouseX, icon: Icon, label, onClick }) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [38, 80, 38]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{ width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="aspect-square rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center relative group hover:bg-white/10 transition"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: "-50%" }}
            animate={{ opacity: 1, y: -18, x: "-50%" }}
            exit={{ opacity: 0, y: -10, x: "-50%" }}
            className="absolute -top-2 left-1/2 px-2 py-1 bg-[#050505] border border-white/10 rounded-md text-[10px] text-white/70 pointer-events-none"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
      <Icon size={20} className="text-white/60 group-hover:text-white" />
    </motion.button>
  );
};

const Dock = () => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 px-3 pb-3 rounded-2xl"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <div className="absolute inset-0 bg-[#050505]/90 border border-white/10 backdrop-blur-xl rounded-2xl h-14 w-full -z-10" />

      <DockItem mouseX={mouseX} icon={Home} label="Home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})} />
      <DockItem mouseX={mouseX} icon={User} label="About" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth'})} />
      <DockItem mouseX={mouseX} icon={Briefcase} label="Work" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth'})} />
      <DockItem mouseX={mouseX} icon={Layers} label="Stack" onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth'})} />
      
      <div className="w-px h-8 bg-white/10 mx-1 mb-2" />
      <DockItem mouseX={mouseX} icon={Mail} label="Email" onClick={() => window.location.href = 'mailto:anshulkumararya51@gmail.com'} />
    </div>
  );
};

/* -------------------  MAIN APP ------------------- */
export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      <BackgroundGrid />
      <Dock />

      {/* HEADER */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0)" }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Terminal size={20} className="text-white/60" />
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/50">
              Portfolio
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tight">
            Anshul Kumar Arya
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">
            Web Developer specializing in modern JavaScript stacks.  
            Experienced in MERN, React, Tailwind, and backend APIs.  
            Focused on clean UI, performance, and scalable logic.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => window.location.href = 'mailto:anshulkumararya51@gmail.com'}
              className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200"
            >
              Contact Me
            </button>
            <a 
              href="https://github.com/anshul051"
              target="_blank"
              className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 space-y-32">

        {/* ABOUT */}
        <section id="about">
          <h2 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-6">
            About
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-6 rounded-xl border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-bold mb-3">Who I Am</h3>
              <p className="text-white/50 leading-relaxed">
                B.Tech student in Electrical & Electronics Engineering at MAIT.  
                Passionate about full-stack development with hands-on experience in MERN, REST APIs, MongoDB, responsive UIs, and reusable component systems.
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  "C++", "JavaScript", "React.js", "Node.js", 
                  "Express.js", "MongoDB", "MySQL", "Tailwind CSS",
                  "Git", "REST APIs"
                ].map(s => (
                  <span key={s} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/40">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">3+</span>
              <span className="text-sm text-white/40 mt-2">Years Coding</span>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="work">
          <h2 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-8">
            Projects
          </h2>

          <div className="space-y-8">
            {[
              {
                title: "Login & Registration System (MERN)",
                tech: "MongoDB • Express.js • React • Node.js",
                desc: "Secure JWT auth, hashed passwords, and protected routes."
              },
              {
                title: "Search Filter App",
                tech: "React.js • Tailwind CSS",
                desc: "Optimized client-side search with clean responsive UI."
              },
              {
                title: "To-Do Web App",
                tech: "JavaScript • HTML • CSS",
                desc: "CRUD task manager with basic session handling."
              }
            ].map((p, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition">
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="text-white/40 text-sm mt-1">{p.tech}</p>
                <p className="text-white/50 mt-3">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <h2 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-8">
            Experience
          </h2>

          <div className="space-y-6 border-l border-white/10 pl-6">
            <div className="relative">
              <div className="absolute -left-3 top-1 w-2 h-2 rounded-full bg-white/50" />
              <h3 className="text-lg font-bold">CodSoft — Web Developer Intern</h3>
              <p className="text-white/50">Jul 2024 – Aug 2024 (Remote)</p>
              <ul className="list-disc ml-5 text-white/40 mt-2 text-sm">
                <li>Built and deployed responsive web pages.</li>
                <li>Optimized components for performance.</li>
                <li>Developed a resume-builder with reusable UI.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section>
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold mb-6">Let's Connect</h3>
            <p className="text-white/50 mb-6">
              Open to internships and freelance projects.
            </p>

            <a 
              href="mailto:anshulkumararya51@gmail.com"
              className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-white/70 hover:border-white/70"
            >
              anshulkumararya51@gmail.com <ArrowUpRight size={16} />
            </a>

            <div className="flex gap-4 mt-8">
              <a href="https://github.com/anshul051" target="_blank">
                <Github className="text-white/40 hover:text-white" />
              </a>
              <a href="https://linkedin.com/in/anshulkumararya" target="_blank">
                <Linkedin className="text-white/40 hover:text-white" />
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
