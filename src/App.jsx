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

// --- UTILITIES ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- 1. REACTIVE BACKGROUND GRID ---
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <motion.div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`radial-gradient(
            600px circle at ${mouseX}px ${mouseY}px,
            rgba(255, 255, 255, 0.03),
            transparent 80%
          )`
        }}
      />
    </div>
  );
};

// --- 2. MACOS DOCK (With Rounded-XL Icons) ---
const DockItem = ({ mouseX, icon: Icon, label, onClick }) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 84, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{ width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="aspect-square rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center relative group transition-colors hover:bg-white/10 cursor-pointer"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: "-50%" }}
            animate={{ opacity: 1, y: -18, x: "-50%" }}
            exit={{ opacity: 0, y: -10, x: "-50%" }}
            className="absolute -top-2 left-1/2 px-2 py-1 bg-[#050505] border border-white/10 rounded-md text-[10px] text-white/70 whitespace-nowrap pointer-events-none z-50"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
      
      <Icon size={20} className="text-white/60 group-hover:text-white transition-colors" />
    </motion.button>
  );
};

const Dock = () => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 px-3 pb-3 rounded-2xl"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {/* Background container */}
      <div className="absolute inset-0 bg-[#050505]/90 border border-white/10 backdrop-blur-xl rounded-2xl -z-10 h-16 w-full bottom-0" />
      
      <DockItem mouseX={mouseX} icon={Home} label="Home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})} />
      <DockItem mouseX={mouseX} icon={User} label="About" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth'})} />
      <DockItem mouseX={mouseX} icon={Briefcase} label="Work" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth'})} />
      <DockItem mouseX={mouseX} icon={Layers} label="Stack" onClick={() => document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth'})} />
      
      <div className="w-px h-8 bg-white/10 mx-1 mb-2" />
      
      <DockItem mouseX={mouseX} icon={Mail} label="Contact" onClick={() => window.location.href = 'mailto:anshulkumararya51@gmail.com'} />
    </div>
  );
};

// --- 3. PROJECT PREVIEW HOVER (UNCHANGED) ---
const ProjectList = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - 150); 
    mouseY.set(clientY - 100);
  };

  const projects = [
    { id: 1, title: "Login & Registration System (MERN)", category: "MongoDB / Express / React / Node", color: "from-blue-500 to-cyan-500" },
    { id: 2, title: "Search Filter App", category: "React / Tailwind", color: "from-purple-500 to-pink-500" },
    { id: 3, title: "To-Do Web App", category: "JavaScript / HTML / CSS", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div 
      className="relative py-12" 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredProject(null)}
    >
      <motion.div
        style={{ x, y, opacity: hoveredProject ? 1 : 0, scale: hoveredProject ? 1 : 0.8 }}
        className="pointer-events-none fixed top-0 left-0 z-40 w-[300px] h-[200px] rounded-xl overflow-hidden shadow-2xl transition-opacity duration-200"
      >
        <AnimatePresence mode='wait'>
          {hoveredProject && (
            <motion.div
              key={hoveredProject}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "w-full h-full bg-gradient-to-br flex items-center justify-center",
                projects.find(p => p.id === hoveredProject)?.color
              )}
            >
              <span className="text-white/20 font-bold text-4xl uppercase tracking-widest">Preview</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="space-y-0">
        {projects.map((project) => (
          <div
            key={project.id}
            onMouseEnter={() => setHoveredProject(project.id)}
            className="group relative flex items-center justify-between py-12 px-6 border-t border-white/10 cursor-pointer transition-colors hover:bg-white/[0.02]"
          >
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white transition-transform duration-300 group-hover:translate-x-2">
                {project.title}
              </h3>
            </div>
            <div className="flex items-center gap-8">
              <span className="font-mono text-sm text-white/40 group-hover:text-white/70 transition-colors">
                {project.category}
              </span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                 <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-white/10" />
      </div>
    </div>
  );
};

// --- 4. BENTO GRID ---
const BentoItem = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={cn(
      "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors",
      className
    )}
  >
    {children}
  </motion.div>
);

// --- MAIN ---
export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-sans pb-32">
      <BackgroundGrid />
      <Dock />

      {/* HEADER */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Terminal size={20} className="text-white/60" />
             </div>
             <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/50 font-mono">
               v2.4.0 — Portfolio
             </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mix-blend-difference">
            Anshul Kumar Arya
          </h1>

          <p className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed">
            Web Developer skilled in <span className="text-white">MERN, React.js, Tailwind, REST APIs</span>  
            with strong problem-solving and clean UI development experience.
          </p>
          
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => window.location.href = 'mailto:anshulkumararya51@gmail.com'}
              className="cursor-pointer px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors"
            >
               Contact Me
            </button>
            <a 
              href="https://github.com/anshul051"
              target="_blank"
              className="cursor-pointer px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
            >
               GitHub
            </a>
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 space-y-32">
        
        {/* ABOUT */}
        <section id="about">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-2 h-2 rounded-full bg-white/20" />
             <h2 className="text-sm font-mono text-white/50 uppercase tracking-widest">About & Stack</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[500px]">
            <BentoItem className="md:col-span-2 md:row-span-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                   <User size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Developer Who Builds What People Use</h3>
                <p className="text-white/50 leading-relaxed">
                  B.Tech student at MAIT specializing in full-stack development.  
                  Experienced in MERN, REST APIs, reusable UI components, and modern responsive design.  
                  Strong foundation in C++, JavaScript, and problem solving.
                </p>
              </div>
              <div className="mt-8 flex gap-2 flex-wrap">
                 {[
                   'C++', 'JavaScript', 'React.js', 'Node.js', 
                   'Express.js', 'MongoDB', 'MySQL', 'Tailwind CSS',
                   'Git', 'REST APIs', 'DSA'
                 ].map(tag => (
                   <span key={tag} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/40">
                     {tag}
                   </span>
                 ))}
              </div>
            </BentoItem>

            <BentoItem className="bg-gradient-to-br from-white/[0.05] to-transparent">
              <div className="h-full flex flex-col justify-center items-center text-center">
                 <span className="text-5xl font-bold mb-2">3+</span>
                 <span className="text-sm text-white/40">Years Experience</span>
              </div>
            </BentoItem>
            
            <BentoItem className="md:col-span-1">
               <div className="h-full flex flex-col justify-between">
                  <Globe className="text-white/30" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-sm font-bold">Open to Work</span>
                    </div>
                    <span className="text-xs text-white/40">Remote / India</span>
                  </div>
               </div>
            </BentoItem>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="work">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-2 h-2 rounded-full bg-white/20" />
             <h2 className="text-sm font-mono text-white/50 uppercase tracking-widest">Selected Works</h2>
          </div>
          <ProjectList />
        </section>

        {/* EXPERIENCE */}
        <section id="stack" className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div>
             <div className="flex items-center gap-4 mb-8">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <h2 className="text-sm font-mono text-white/50 uppercase tracking-widest">Experience</h2>
             </div>
             <div className="space-y-8 border-l border-white/10 pl-8 ml-3">
               
               <div className="relative">
                 <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full border border-white/20 bg-[#050505]" />
                 <h3 className="text-lg font-bold">CodSoft</h3>
                 <p className="text-white/50 mb-1">Web Developer Intern</p>
                 <p className="text-xs font-mono text-white/30">Jul 2024 – Aug 2024</p>
                 <ul className="list-disc ml-4 mt-2 text-white/40 text-sm">
                   <li>Built and deployed responsive web pages.</li>
                   <li>Debugged and optimized front-end components.</li>
                   <li>Developed a full resume-builder tool.</li>
                 </ul>
               </div>

             </div>
           </div>

           <div>
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
                 <h3 className="text-xl font-bold mb-6">Let's Connect</h3>
                 <p className="text-white/50 mb-8">
                    Open to internships, freelance work, and full-time opportunities.
                 </p>
                 <a href="mailto:anshulkumararya51@gmail.com" className="cursor-pointer inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-white/70 hover:border-white/70 transition-colors">
                    anshulkumararya51@gmail.com <ArrowUpRight size={16} />
                 </a>
                 <div className="flex gap-4 mt-8">
                    <a href="https://github.com/anshul051" target="_blank">
                      <Github className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <a href="https://linkedin.com/in/anshulkumararya" target="_blank">
                      <Linkedin className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <Cpu className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                 </div>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}
