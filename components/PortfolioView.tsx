
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

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pb-20 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Header / Navigation */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-white/10 hover:bg-white/5">
              <Download className="w-4 h-4" />
              Download CV
            </Button>
            <Button size="sm" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative max-w-7xl mx-auto px-4 pt-24 pb-32 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="relative w-48 h-48 mx-auto mb-10 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            {data.photo ? (
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                <img 
                  src={data.photo} 
                  alt={data.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-2xl border-4 border-white/10">
                {data.name.charAt(0)}
              </div>
            )}
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight"
          >
            {data.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl text-indigo-400 font-medium mb-10 tracking-wide"
          >
            {data.title}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed font-light"
          >
            {data.summary}
          </motion.p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-40 z-10 relative">
        
        {/* Skills & Infographics */}
        <section>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="flex-1 w-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <Code className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">Core Expertise</h2>
              </div>
              <div className="h-[450px] w-full bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 p-6 shadow-2xl">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.skills}>
                    <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} />
                    <Radar
                      name="Skill Level"
                      dataKey="level"
                      stroke="#818cf8"
                      strokeWidth={2}
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
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div variants={containerVariants} className="flex-1 w-full grid grid-cols-1 gap-5">
              {data.skills.map((skill, i) => (
                <motion.div 
                  key={skill.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="bg-white/[0.02] backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center justify-between transition-all duration-300 cursor-default"
                >
                  <span className="text-slate-200 font-semibold text-lg">{skill.name}</span>
                  <div className="flex items-center gap-4 w-1/2 justify-end">
                    <div className="w-full max-w-[160px] h-2.5 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
                      </motion.div>
                    </div>
                    <span className="text-indigo-400 font-mono font-bold w-10 text-right">{skill.level}%</span>
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
            <div className="flex items-center gap-4 mb-16">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                <Briefcase className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Professional Journey</h2>
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-purple-500/50 before:via-slate-800 before:to-transparent">
              {data.experience.map((exp, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredExp(i)}
                  onMouseLeave={() => setHoveredExp(null)}
                  className="relative pl-16"
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-0 top-6 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${hoveredExp === i ? 'bg-purple-500/20 border-purple-400 scale-110' : 'bg-[#050505] border-slate-700'} border-2`}>
                    <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${hoveredExp === i ? 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]' : 'bg-slate-600'}`} />
                  </div>
                  
                  {/* Content Card */}
                  <div className={`bg-white/[0.02] backdrop-blur-xl p-8 sm:p-10 rounded-3xl border transition-all duration-500 ${hoveredExp === i ? 'border-purple-500/30 shadow-[0_10px_30px_-15px_rgba(168,85,247,0.2)] transform -translate-y-1' : 'border-white/5'}`}>
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                          {exp.role}
                          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${hoveredExp === i ? 'translate-x-1 text-purple-400' : 'text-slate-600'}`} />
                        </h3>
                        <p className="text-xl text-purple-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 w-fit">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300 font-medium tracking-wide">
                          {exp.period}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed font-light">
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
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Featured Projects</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((project, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="bg-white/[0.02] backdrop-blur-xl p-10 rounded-3xl border border-white/5 group hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150" />
                  
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {project.tech.map(t => (
                      <span key={t} className="px-4 py-1.5 bg-white/5 text-slate-300 rounded-xl text-sm font-medium border border-white/10 group-hover:border-emerald-500/20 transition-colors duration-300">
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
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                <GraduationCap className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Education</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.education.map((edu, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl border border-white/5 flex items-start gap-6 hover:border-orange-500/30 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">{edu.degree}</h3>
                    <p className="text-slate-400 text-lg mb-3 font-light">{edu.school}</p>
                    <span className="inline-flex items-center px-3 py-1 bg-white/5 rounded-lg text-sm text-orange-400 font-medium border border-white/5">
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
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">Certifications & Training</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.certifications.map((cert, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex flex-col justify-between group cursor-pointer hover:border-yellow-500/40 transition-all duration-500 shadow-xl"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300 leading-tight">{cert.name}</h3>
                      <p className="text-slate-400 font-light">{cert.issuer}</p>
                    </div>
                    {cert.image && (
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/50">
                        <img 
                          src={cert.image} 
                          alt={cert.name}
                          className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                          <span className="flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
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
      <footer className="relative max-w-7xl mx-auto px-4 mt-40 pt-16 border-t border-white/10 text-center z-10">
        <p className="text-slate-500 mb-8 font-light">
          © {new Date().getFullYear()} {data.name}. All rights reserved.
        </p>
        <div className="flex justify-center gap-8">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">Privacy</Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">Terms</Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">Contact</Button>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioView;
