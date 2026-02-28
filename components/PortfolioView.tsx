
import React, { useState } from 'react';
import { PortfolioData } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, GraduationCap, Code, ExternalLink, 
  Download, Share2, ArrowLeft, Globe, Award, ChevronRight, Calendar
} from 'lucide-react';
import Button from './Button';

interface PortfolioViewProps {
  data: PortfolioData;
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 12 } 
  }
};

const PortfolioView: React.FC<PortfolioViewProps> = ({ data, onBack }) => {
  const [hoveredExp, setHoveredExp] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/portfolio`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pb-20 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Header / Navigation */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-base">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleCopyLink}
              className="flex items-center gap-2 border-white/10 hover:bg-white/5 transition-all text-sm px-5 py-2.5"
            >
              {copied ? (
                <>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" className="hidden sm:flex items-center gap-2 border-white/10 hover:bg-white/5 text-sm px-5 py-2.5">
              <Download className="w-4 h-4" />
              Download CV
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative max-w-[1600px] mx-auto px-6 pt-24 pb-40 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto mb-12 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            {data.photo ? (
              <div className="relative w-full h-full rounded-full overflow-hidden border-[5px] border-white/10 shadow-3xl">
                <img 
                  src={data.photo} 
                  alt={data.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-6xl font-bold text-white shadow-3xl border-[5px] border-white/10">
                {data.name.charAt(0)}
              </div>
            )}
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tighter"
          >
            {data.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl lg:text-4xl text-indigo-400 font-medium mb-10 tracking-wide"
          >
            {data.title}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed font-light"
          >
            {data.summary}
          </motion.p>
        </motion.div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 space-y-48 z-10 relative">
        
        {/* Skills & Infographics */}
        <section>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col xl:flex-row gap-20 items-center"
          >
            <motion.div variants={itemVariants} className="flex-1 w-full">
              <div className="flex items-center gap-5 mb-12">
                <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                  <Code className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Core Expertise</h2>
              </div>
              <div className="h-[550px] w-full bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] border border-white/5 p-8 shadow-3xl">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.skills}>
                    <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }} />
                    <Radar
                      name="Skill Level"
                      dataKey="level"
                      stroke="#818cf8"
                      strokeWidth={3}
                      fill="url(#colorIndigo)"
                      fillOpacity={0.5}
                    />
                    <defs>
                      <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(16px)', padding: '12px', fontSize: '14px' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div variants={containerVariants} className="flex-1 w-full grid grid-cols-1 gap-6">
              {data.skills.map((skill, i) => (
                <motion.div 
                  key={skill.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex items-center justify-between transition-all duration-300 cursor-default shadow-lg"
                >
                  <span className="text-slate-200 font-semibold text-xl">{skill.name}</span>
                  <div className="flex items-center gap-5 w-1/2 justify-end">
                    <div className="w-full max-w-[200px] h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
                      </motion.div>
                    </div>
                    <span className="text-indigo-400 font-mono font-bold w-14 text-right text-lg">{skill.level}%</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Experience Timeline */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="flex items-center gap-5 mb-16">
              <div className="p-4 bg-purple-500/10 rounded-3xl border border-purple-500/20">
                <Briefcase className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Professional Journey</h2>
            </div>
            
            <div className="space-y-10 relative before:absolute before:left-[27px] before:top-5 before:bottom-5 before:w-0.5 before:bg-gradient-to-b before:from-purple-500/50 before:via-slate-800 before:to-transparent">
              {data.experience.map((exp, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredExp(i)}
                  onMouseLeave={() => setHoveredExp(null)}
                  className="relative pl-20"
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-0 top-7 w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${hoveredExp === i ? 'bg-purple-500/20 border-purple-400 scale-110' : 'bg-[#050505] border-slate-700'} border-[2px]`}>
                    <div className={`w-4 h-4 rounded-full transition-colors duration-500 ${hoveredExp === i ? 'bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.8)]' : 'bg-slate-600'}`} />
                  </div>
                  
                  {/* Content Card */}
                  <div className={`bg-white/[0.02] backdrop-blur-2xl p-10 sm:p-12 rounded-[2rem] border transition-all duration-500 ${hoveredExp === i ? 'border-purple-500/30 shadow-[0_20px_50px_-20px_rgba(168,85,247,0.3)] transform -translate-y-1' : 'border-white/5'}`}>
                    <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 gap-5">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                          {exp.role}
                          <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${hoveredExp === i ? 'translate-x-2 text-purple-400' : 'text-slate-600'}`} />
                        </h3>
                        <p className="text-xl text-purple-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 w-fit">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-base text-slate-300 font-medium tracking-wide">
                          {exp.period}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed font-light max-w-5xl">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Projects Grid */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="flex items-center gap-5 mb-14">
              <div className="p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Featured Projects</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {data.projects.map((project, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="bg-white/[0.02] backdrop-blur-2xl p-10 rounded-[2rem] border border-white/5 group hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150" />
                  
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <ExternalLink className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {project.tech.map(t => (
                      <span key={t} className="px-5 py-2 bg-white/5 text-slate-300 rounded-xl text-sm font-medium border border-white/10 group-hover:border-emerald-500/20 transition-colors duration-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Education */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="flex items-center gap-5 mb-14">
              <div className="p-4 bg-orange-500/10 rounded-3xl border border-orange-500/20">
                <GraduationCap className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Education</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {data.education.map((edu, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-[2rem] border border-white/5 flex items-start gap-6 hover:border-orange-500/30 transition-all duration-300 group shadow-xl"
                >
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">{edu.degree}</h3>
                    <p className="text-slate-400 text-lg mb-3 font-light">{edu.school}</p>
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/5 rounded-lg text-sm text-orange-400 font-medium border border-white/5">
                      {edu.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <div className="flex items-center gap-5 mb-14">
                <div className="p-4 bg-yellow-500/10 rounded-3xl border border-yellow-500/20">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Certifications & Training</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {data.certifications.map((cert, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="bg-white/[0.02] backdrop-blur-2xl p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between group cursor-pointer hover:border-yellow-500/40 transition-all duration-500 shadow-2xl"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300 leading-tight">{cert.name}</h3>
                      <p className="text-slate-400 text-base font-light">{cert.issuer}</p>
                    </div>
                    {cert.image && (
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/50">
                        <img 
                          src={cert.image} 
                          alt={cert.name}
                          className="w-full h-full object-contain p-3 transform group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                          <span className="flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm">
                            <ExternalLink className="w-4 h-4" />
                            View Certificate
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="relative max-w-[1800px] mx-auto px-6 mt-48 pt-16 border-t border-white/10 text-center z-10 pb-16">
        {/* Empty footer for spacing */}
      </footer>
    </div>
  );
};

export default PortfolioView;
