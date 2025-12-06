import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Card } from './components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderGit2, 
  FileText, 
  Save, 
  Upload, 
  Download, 
  Sparkles,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Zap,
  Cpu,
  Terminal,
  Award,
  Globe,
  Heart,
  ExternalLink,
  Star
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

interface Education {
  id: string;
  college: string;
  degree: string;
  year: string;
  gpa: string;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  type: 'technical' | 'soft';
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  liveLink: string;
  githubLink: string;
}

interface Achievement {
  id: string;
  title: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  languages: Language[];
  interests: string;
  showInterests: boolean;
}

const initialData: ResumeData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe'
  },
  summary: 'Passionate Computer Science graduate with strong problem-solving skills and experience in full-stack development. Seeking opportunities to contribute to innovative projects.',
  education: [{
    id: '1',
    college: 'University of California, Berkeley',
    degree: 'Bachelor of Science in Computer Science',
    year: '2020 - 2024',
    gpa: '3.8'
  }],
  experience: [{
    id: '1',
    role: 'Software Engineering Intern',
    company: 'Tech Corp',
    duration: 'Jun 2023 - Aug 2023',
    description: 'Developed RESTful APIs using Node.js and Express. Collaborated with cross-functional teams to deliver features.'
  }],
  skills: [
    { id: '1', name: 'JavaScript', level: 'Advanced', type: 'technical' },
    { id: '2', name: 'React', level: 'Advanced', type: 'technical' },
    { id: '3', name: 'Node.js', level: 'Intermediate', type: 'technical' },
    { id: '4', name: 'Team Leadership', level: 'Intermediate', type: 'soft' },
    { id: '5', name: 'Communication', level: 'Advanced', type: 'soft' }
  ],
  projects: [{
    id: '1',
    title: 'E-commerce Platform',
    description: 'Built a full-stack e-commerce application with user authentication, product management, and payment integration.',
    technologies: 'React, Node.js, MongoDB, Stripe',
    liveLink: 'https://example-ecommerce.com',
    githubLink: 'https://github.com/johndoe/ecommerce'
  }],
  achievements: [
    { id: '1', title: 'Winner of 2023 University Hackathon - Best Innovation Award' },
    { id: '2', title: 'AWS Certified Solutions Architect - Associate' }
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
    { id: '2', name: 'Spanish', proficiency: 'Intermediate' }
  ],
  interests: 'Open Source Development, Machine Learning, Competitive Programming, Chess',
  showInterests: true
};

type Section = 'personal' | 'summary' | 'education' | 'experience' | 'skills' | 'projects' | 'achievements' | 'languages' | 'interests';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
        toast.success('Resume loaded from storage');
      } catch (e) {
        console.error('Failed to load resume data', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    toast.success('Resume saved successfully!');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      setResumeData(JSON.parse(saved));
      toast.success('Resume loaded successfully!');
    } else {
      toast.error('No saved resume found');
    }
  };

  const handleDownloadPDF = async () => {
    setIsPdfGenerating(true);
    toast.info('Generating PDF...');
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const element = document.getElementById('resume-preview');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      
      pdf.save(fileName);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleAIGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockResponses: Record<string, string> = {
        'summary': 'Dynamic and results-oriented software engineer with 3+ years of experience in designing and implementing scalable web applications. Proficient in modern JavaScript frameworks and cloud technologies. Demonstrated ability to lead cross-functional teams and deliver high-quality solutions.',
        'default': 'Innovative professional with strong technical skills and a passion for solving complex problems. Proven track record of delivering impactful solutions and collaborating effectively with diverse teams.'
      };
      
      const prompt = aiPrompt.toLowerCase();
      let response = mockResponses.default;
      
      if (prompt.includes('summary') || prompt.includes('professional')) {
        response = mockResponses.summary;
      }
      
      setAiResponse(response);
      setIsGenerating(false);
      toast.success('AI response generated!');
    }, 1500);
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), college: '', degree: '', year: '', gpa: '' };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    setResumeData({ ...resumeData, education: resumeData.education.filter(e => e.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), role: '', company: '', duration: '', description: '' };
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    setResumeData({ ...resumeData, experience: resumeData.experience.filter(e => e.id !== id) });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  // Skill handlers
  const addSkill = (type: 'technical' | 'soft') => {
    const newSkill: Skill = { id: Date.now().toString(), name: '', level: 'Beginner', type };
    setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    setResumeData({ ...resumeData, skills: resumeData.skills.filter(s => s.id !== id) });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  // Project handlers
  const addProject = () => {
    const newProject: Project = { id: Date.now().toString(), title: '', description: '', technologies: '', liveLink: '', githubLink: '' };
    setResumeData({ ...resumeData, projects: [...resumeData.projects, newProject] });
  };

  const removeProject = (id: string) => {
    setResumeData({ ...resumeData, projects: resumeData.projects.filter(p => p.id !== id) });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  // Achievement handlers
  const addAchievement = () => {
    const newAchievement: Achievement = { id: Date.now().toString(), title: '' };
    setResumeData({ ...resumeData, achievements: [...resumeData.achievements, newAchievement] });
  };

  const removeAchievement = (id: string) => {
    setResumeData({ ...resumeData, achievements: resumeData.achievements.filter(a => a.id !== id) });
  };

  const updateAchievement = (id: string, value: string) => {
    setResumeData({
      ...resumeData,
      achievements: resumeData.achievements.map(a => a.id === id ? { ...a, title: value } : a)
    });
  };

  // Language handlers
  const addLanguage = () => {
    const newLanguage: Language = { id: Date.now().toString(), name: '', proficiency: 'Basic' };
    setResumeData({ ...resumeData, languages: [...resumeData.languages, newLanguage] });
  };

  const removeLanguage = (id: string) => {
    setResumeData({ ...resumeData, languages: resumeData.languages.filter(l => l.id !== id) });
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.map(l => l.id === id ? { ...l, [field]: value } : l)
    });
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case 'Beginner': return '25%';
      case 'Intermediate': return '50%';
      case 'Advanced': return '75%';
      case 'Expert': return '100%';
      default: return '0%';
    }
  };

  const navItems = [
    { id: 'personal' as Section, label: 'Personal Info', icon: User, color: 'cyan' },
    { id: 'summary' as Section, label: 'Summary', icon: FileText, color: 'purple' },
    { id: 'education' as Section, label: 'Education', icon: GraduationCap, color: 'pink' },
    { id: 'experience' as Section, label: 'Experience', icon: Briefcase, color: 'green' },
    { id: 'skills' as Section, label: 'Skills', icon: Code, color: 'cyan' },
    { id: 'projects' as Section, label: 'Projects', icon: FolderGit2, color: 'purple' },
    { id: 'achievements' as Section, label: 'Achievements', icon: Award, color: 'pink' },
    { id: 'languages' as Section, label: 'Languages', icon: Globe, color: 'green' },
    { id: 'interests' as Section, label: 'Interests', icon: Heart, color: 'cyan' }
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Scan Lines Effect */}
      <div className="absolute inset-0 scan-lines pointer-events-none"></div>
      
      <Toaster position="top-right" />
      
      {/* Cyberpunk Sidebar */}
      <div className="w-80 bg-black/90 border-r border-cyan-500/30 p-6 flex flex-col relative z-10 box-glow-cyan overflow-y-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 border-glow-cyan rounded-lg bg-black/50 pulse-glow">
              <Cpu className="w-7 h-7 text-neon-cyan glow-cyan" />
            </div>
            <div>
              <h1 className="text-2xl text-neon-cyan glow-cyan uppercase tracking-wider">AI RESUME</h1>
              <div className="flex items-center gap-1 text-neon-purple text-xs mt-0.5">
                <Terminal className="w-3 h-3" />
                <span className="glow-purple">v2.0.77</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                activeSection === item.id
                  ? `border-glow-${item.color} bg-${item.color === 'cyan' ? 'cyan' : item.color === 'purple' ? 'purple' : item.color === 'pink' ? 'pink' : 'green'}-500/10`
                  : 'border border-white/10 hover:border-white/30 bg-black/30'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-all duration-300 ${
                activeSection === item.id 
                  ? `text-neon-${item.color} glow-${item.color}` 
                  : 'text-gray-400 group-hover:text-white'
              }`} />
              <span className={`uppercase tracking-wide text-sm transition-all duration-300 ${
                activeSection === item.id 
                  ? `text-neon-${item.color} glow-${item.color}` 
                  : 'text-gray-400 group-hover:text-white'
              }`}>{item.label}</span>
              {activeSection === item.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <Button 
            onClick={handleSave}
            className="w-full bg-black border-glow-green text-neon-green hover-glow-green transition-all duration-300 uppercase tracking-wide"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Data
          </Button>
          
          <Button 
            onClick={handleLoad}
            className="w-full bg-black border-glow-cyan text-neon-cyan hover-glow-cyan transition-all duration-300 uppercase tracking-wide"
          >
            <Upload className="w-4 h-4 mr-2" />
            Load Data
          </Button>
          
          <Button 
            onClick={handleDownloadPDF}
            disabled={isPdfGenerating}
            className="w-full bg-black border-glow-purple text-neon-purple hover-glow-purple transition-all duration-300 uppercase tracking-wide disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {isPdfGenerating ? 'Processing...' : 'Export PDF'}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-glow-pink text-neon-pink hover-glow-pink transition-all duration-300 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI Engine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-black border-glow-purple">
              <DialogHeader>
                <DialogTitle className="text-neon-purple glow-purple uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Content Generator
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div>
                  <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide">Input Prompt:</label>
                  <Textarea
                    placeholder="e.g., Write a professional summary for a Computer Science student with internship experience..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-32 bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                
                <Button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt}
                  className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-glow-purple text-neon-purple hover-glow-purple uppercase tracking-wide"
                >
                  {isGenerating ? (
                    <>
                      <Cpu className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>

                {aiResponse && (
                  <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <label className="text-sm mb-2 block text-green-400 uppercase tracking-wide">AI Output:</label>
                    <div className="p-4 bg-black/70 border-glow-green rounded-lg">
                      <p className="text-sm text-gray-300 leading-relaxed">{aiResponse}</p>
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponse);
                        toast.success('Copied to clipboard!');
                      }}
                      className="mt-3 w-full bg-black border-glow-green text-neon-green hover-glow-green uppercase tracking-wide"
                    >
                      Copy Output
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Form Section */}
        <div className="w-1/2 p-8 overflow-y-auto">
          <div className="glass-dark p-8 rounded-xl border-glow-cyan">
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-cyan-500/30">
                  <User className="w-6 h-6 text-neon-cyan glow-cyan" />
                  <h2 className="text-2xl text-neon-cyan glow-cyan uppercase tracking-wider">Personal Data</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                      <Terminal className="w-3 h-3" />
                      Full Name
                    </label>
                    <Input
                      value={resumeData.personalInfo.name}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                      })}
                      placeholder="John Doe"
                      className="bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                      })}
                      placeholder="john@example.com"
                      className="bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      Phone
                    </label>
                    <Input
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                      })}
                      placeholder="+1 (555) 123-4567"
                      className="bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Location
                    </label>
                    <Input
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                      })}
                      placeholder="San Francisco, CA"
                      className="bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                      <Linkedin className="w-3 h-3" />
                      LinkedIn
                    </label>
                    <Input
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                      })}
                      placeholder="linkedin.com/in/johndoe"
                      className="bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                      <Github className="w-3 h-3" />
                      GitHub
                    </label>
                    <Input
                      value={resumeData.personalInfo.github}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                      })}
                      placeholder="github.com/johndoe"
                      className="bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'summary' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-purple-500/30">
                  <FileText className="w-6 h-6 text-neon-purple glow-purple" />
                  <h2 className="text-2xl text-neon-purple glow-purple uppercase tracking-wider">Summary</h2>
                </div>
                <div>
                  <label className="text-sm mb-2 block text-purple-400 uppercase tracking-wide">Professional Summary</label>
                  <Textarea
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    placeholder="Write a brief professional summary..."
                    className="min-h-48 bg-black/50 border-purple-500/50 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-600"
                  />
                  <div className="mt-4 p-3 bg-purple-500/10 border-glow-purple rounded-lg">
                    <p className="text-xs text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Use the AI Engine to generate compelling content
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-pink-500/30">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-neon-pink glow-pink" />
                    <h2 className="text-2xl text-neon-pink glow-pink uppercase tracking-wider">Education</h2>
                  </div>
                  <Button 
                    onClick={addEducation} 
                    size="sm"
                    className="bg-black border-glow-pink text-neon-pink hover-glow-pink uppercase tracking-wide"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="p-5 bg-black/50 border-glow-pink rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs px-3 py-1 bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded uppercase tracking-wider">EDU #{index + 1}</span>
                      {resumeData.education.length > 1 && (
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs mb-1.5 block text-pink-400 uppercase tracking-wide">College/University</label>
                        <Input
                          value={edu.college}
                          onChange={(e) => updateEducation(edu.id, 'college', e.target.value)}
                          placeholder="University name"
                          className="bg-black/70 border-pink-500/50 text-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-pink-400 uppercase tracking-wide">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor of Science in Computer Science"
                          className="bg-black/70 border-pink-500/50 text-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs mb-1.5 block text-pink-400 uppercase tracking-wide">Year</label>
                          <Input
                            value={edu.year}
                            onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                            placeholder="2020 - 2024"
                            className="bg-black/70 border-pink-500/50 text-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 placeholder:text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-pink-400 uppercase tracking-wide">GPA</label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            placeholder="3.8"
                            className="bg-black/70 border-pink-500/50 text-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 placeholder:text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-green-500/30">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-neon-green glow-green" />
                    <h2 className="text-2xl text-neon-green glow-green uppercase tracking-wider">Experience</h2>
                  </div>
                  <Button 
                    onClick={addExperience} 
                    size="sm"
                    className="bg-black border-glow-green text-neon-green hover-glow-green uppercase tracking-wide"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-5 bg-black/50 border-glow-green rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded uppercase tracking-wider">EXP #{index + 1}</span>
                      {resumeData.experience.length > 1 && (
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs mb-1.5 block text-green-400 uppercase tracking-wide">Job Title/Role</label>
                        <Input
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          placeholder="Software Engineer"
                          className="bg-black/70 border-green-500/50 text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-green-400 uppercase tracking-wide">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Tech Corp"
                          className="bg-black/70 border-green-500/50 text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-green-400 uppercase tracking-wide">Duration</label>
                        <Input
                          value={exp.duration}
                          onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                          placeholder="Jun 2023 - Aug 2023"
                          className="bg-black/70 border-green-500/50 text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-green-400 uppercase tracking-wide">Description</label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          className="min-h-24 bg-black/70 border-green-500/50 text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-cyan-500/30">
                  <Code className="w-6 h-6 text-neon-cyan glow-cyan" />
                  <h2 className="text-2xl text-neon-cyan glow-cyan uppercase tracking-wider">Skills</h2>
                </div>

                {/* Technical Skills */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg text-cyan-300 uppercase tracking-wide">Technical Skills</h3>
                    <Button 
                      onClick={() => addSkill('technical')} 
                      size="sm"
                      className="bg-black border-glow-cyan text-neon-cyan hover-glow-cyan uppercase tracking-wide"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {resumeData.skills.filter(s => s.type === 'technical').map((skill, index) => (
                    <div key={skill.id} className="p-4 bg-black/50 border border-cyan-500/50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">TECH #{index + 1}</span>
                        <Button
                          onClick={() => removeSkill(skill.id)}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs mb-1.5 block text-cyan-400 uppercase">Skill Name</label>
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            placeholder="JavaScript"
                            className="bg-black/70 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-cyan-400 uppercase">Level</label>
                          <select
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                            className="w-full bg-black/70 border border-cyan-500/50 text-gray-300 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Soft Skills */}
                <div className="space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg text-purple-300 uppercase tracking-wide">Soft Skills</h3>
                    <Button 
                      onClick={() => addSkill('soft')} 
                      size="sm"
                      className="bg-black border-glow-purple text-neon-purple hover-glow-purple uppercase tracking-wide"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {resumeData.skills.filter(s => s.type === 'soft').map((skill, index) => (
                    <div key={skill.id} className="p-4 bg-black/50 border border-purple-500/50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">SOFT #{index + 1}</span>
                        <Button
                          onClick={() => removeSkill(skill.id)}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs mb-1.5 block text-purple-400 uppercase">Skill Name</label>
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            placeholder="Leadership"
                            className="bg-black/70 border-purple-500/50 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-purple-400 uppercase">Level</label>
                          <select
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                            className="w-full bg-black/70 border border-purple-500/50 text-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <FolderGit2 className="w-6 h-6 text-neon-purple glow-purple" />
                    <h2 className="text-2xl text-neon-purple glow-purple uppercase tracking-wider">Projects</h2>
                  </div>
                  <Button 
                    onClick={addProject} 
                    size="sm"
                    className="bg-black border-glow-purple text-neon-purple hover-glow-purple uppercase tracking-wide"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {resumeData.projects.map((project, index) => (
                  <div key={project.id} className="p-5 bg-black/50 border-glow-purple rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded uppercase tracking-wider">PRJ #{index + 1}</span>
                      {resumeData.projects.length > 1 && (
                        <Button
                          onClick={() => removeProject(project.id)}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs mb-1.5 block text-purple-400 uppercase tracking-wide">Project Title</label>
                        <Input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="My Awesome Project"
                          className="bg-black/70 border-purple-500/50 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-purple-400 uppercase tracking-wide">Description</label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          placeholder="Describe what you built and its impact..."
                          className="min-h-24 bg-black/70 border-purple-500/50 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-purple-400 uppercase tracking-wide">Technologies Used</label>
                        <Input
                          value={project.technologies}
                          onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                          placeholder="React, Node.js, MongoDB"
                          className="bg-black/70 border-purple-500/50 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs mb-1.5 block text-purple-400 uppercase tracking-wide flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            Live Demo Link
                          </label>
                          <Input
                            value={project.liveLink}
                            onChange={(e) => updateProject(project.id, 'liveLink', e.target.value)}
                            placeholder="https://demo.com"
                            className="bg-black/70 border-purple-500/50 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-purple-400 uppercase tracking-wide flex items-center gap-1">
                            <Github className="w-3 h-3" />
                            GitHub Repository
                          </label>
                          <Input
                            value={project.githubLink}
                            onChange={(e) => updateProject(project.id, 'githubLink', e.target.value)}
                            placeholder="https://github.com/..."
                            className="bg-black/70 border-purple-500/50 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'achievements' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-pink-500/30">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-neon-pink glow-pink" />
                    <h2 className="text-2xl text-neon-pink glow-pink uppercase tracking-wider">Achievements</h2>
                  </div>
                  <Button 
                    onClick={addAchievement} 
                    size="sm"
                    className="bg-black border-glow-pink text-neon-pink hover-glow-pink uppercase tracking-wide"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {resumeData.achievements.map((achievement, index) => (
                  <div key={achievement.id} className="p-4 bg-black/50 border-glow-pink rounded-lg">
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <Input
                          value={achievement.title}
                          onChange={(e) => updateAchievement(achievement.id, e.target.value)}
                          placeholder="e.g., Winner of 2023 Hackathon - Best Innovation Award"
                          className="bg-black/70 border-pink-500/50 text-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 placeholder:text-gray-600"
                        />
                      </div>
                      {resumeData.achievements.length > 1 && (
                        <Button
                          onClick={() => removeAchievement(achievement.id)}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'languages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-green-500/30">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-neon-green glow-green" />
                    <h2 className="text-2xl text-neon-green glow-green uppercase tracking-wider">Languages</h2>
                  </div>
                  <Button 
                    onClick={addLanguage} 
                    size="sm"
                    className="bg-black border-glow-green text-neon-green hover-glow-green uppercase tracking-wide"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {resumeData.languages.map((language, index) => (
                  <div key={language.id} className="p-4 bg-black/50 border-glow-green rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">LANG #{index + 1}</span>
                      {resumeData.languages.length > 1 && (
                        <Button
                          onClick={() => removeLanguage(language.id)}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs mb-1.5 block text-green-400 uppercase">Language</label>
                        <Input
                          value={language.name}
                          onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                          placeholder="English"
                          className="bg-black/70 border-green-500/50 text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-green-400 uppercase">Proficiency</label>
                        <select
                          value={language.proficiency}
                          onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                          className="w-full bg-black/70 border border-green-500/50 text-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native">Native</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'interests' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-cyan-500/30">
                  <Heart className="w-6 h-6 text-neon-cyan glow-cyan" />
                  <h2 className="text-2xl text-neon-cyan glow-cyan uppercase tracking-wider">Interests</h2>
                </div>
                <div>
                  <label className="text-sm mb-2 block text-cyan-400 uppercase tracking-wide">Personal & Professional Interests</label>
                  <Textarea
                    value={resumeData.interests}
                    onChange={(e) => setResumeData({ ...resumeData, interests: e.target.value })}
                    placeholder="e.g., Machine Learning, Open Source Development, Chess, Photography..."
                    className="min-h-32 bg-black/50 border-cyan-500/50 text-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                  />
                  <div className="mt-4 p-3 bg-cyan-500/10 border-glow-cyan rounded-lg flex items-center justify-between">
                    <p className="text-xs text-cyan-400">💡 Show this section in resume preview</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={resumeData.showInterests}
                        onChange={(e) => setResumeData({ ...resumeData, showInterests: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-1/2 bg-black/50 p-8 overflow-y-auto border-l border-cyan-500/20">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 box-glow-pink"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 box-glow-green"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 box-glow-cyan pulse-glow"></div>
              </div>
              <span className="text-xs text-cyan-400 uppercase tracking-wider">Live Preview</span>
            </div>
          </div>
          <div id="resume-preview" className="max-w-3xl mx-auto bg-white p-12 rounded-xl shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
              <h1 className="text-4xl mb-3 text-gray-900">{resumeData.personalInfo.name || 'Your Name'}</h1>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                {resumeData.personalInfo.email && (
                  <a 
                    href={`mailto:${resumeData.personalInfo.email}`}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer group"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Send email to ${resumeData.personalInfo.email}`}
                    title={`Email: ${resumeData.personalInfo.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="underline-offset-2 group-hover:underline">{resumeData.personalInfo.email}</span>
                  </a>
                )}
                {resumeData.personalInfo.phone && resumeData.personalInfo.email && <span>•</span>}
                {resumeData.personalInfo.phone && (
                  <a 
                    href={`tel:${resumeData.personalInfo.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer group"
                    aria-label={`Call ${resumeData.personalInfo.phone}`}
                    title={`Call: ${resumeData.personalInfo.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="underline-offset-2 group-hover:underline">{resumeData.personalInfo.phone}</span>
                  </a>
                )}
                {resumeData.personalInfo.location && (resumeData.personalInfo.email || resumeData.personalInfo.phone) && <span>•</span>}
                {resumeData.personalInfo.location && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resumeData.personalInfo.location)}`}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer group"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${resumeData.personalInfo.location} on Google Maps`}
                    title={`Location: ${resumeData.personalInfo.location}`}
                  >
                    <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="underline-offset-2 group-hover:underline">{resumeData.personalInfo.location}</span>
                  </a>
                )}
              </div>
              {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
                <div className="flex flex-wrap justify-center gap-3 text-sm text-blue-600 mt-2">
                  {resumeData.personalInfo.linkedin && (
                    <a 
                      href={resumeData.personalInfo.linkedin.startsWith('http') 
                        ? resumeData.personalInfo.linkedin 
                        : `https://${resumeData.personalInfo.linkedin}`}
                      className="flex items-center gap-1 hover:text-blue-800 transition-colors cursor-pointer group"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit LinkedIn profile"
                      title={`LinkedIn: ${resumeData.personalInfo.linkedin}`}
                    >
                      <Linkedin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span className="underline-offset-2 group-hover:underline">{resumeData.personalInfo.linkedin}</span>
                    </a>
                  )}
                  {resumeData.personalInfo.github && resumeData.personalInfo.linkedin && <span>•</span>}
                  {resumeData.personalInfo.github && (
                    <a 
                      href={resumeData.personalInfo.github.startsWith('http') 
                        ? resumeData.personalInfo.github 
                        : `https://${resumeData.personalInfo.github}`}
                      className="flex items-center gap-1 hover:text-blue-800 transition-colors cursor-pointer group"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit GitHub profile"
                      title={`GitHub: ${resumeData.personalInfo.github}`}
                    >
                      <Github className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span className="underline-offset-2 group-hover:underline">{resumeData.personalInfo.github}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Professional Summary</h2>
                <p className="text-gray-700 text-sm leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && resumeData.education.some(e => e.college || e.degree) && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Education</h2>
                {resumeData.education.map((edu) => (
                  (edu.college || edu.degree) && (
                    <div key={edu.id} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-base text-gray-900">{edu.college || 'College Name'}</h3>
                          <p className="text-sm text-gray-600">{edu.degree || 'Degree'}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-gray-600">{edu.year}</p>
                          {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && resumeData.experience.some(e => e.role || e.company) && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Work Experience</h2>
                {resumeData.experience.map((exp) => (
                  (exp.role || exp.company) && (
                    <div key={exp.id} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-base text-gray-900">{exp.role || 'Job Title'}</h3>
                          <p className="text-sm text-gray-600">{exp.company || 'Company'}</p>
                        </div>
                        <p className="text-sm text-gray-600">{exp.duration}</p>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Skills</h2>
                
                {/* Technical Skills */}
                {resumeData.skills.filter(s => s.type === 'technical' && s.name.trim()).length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm text-gray-700 mb-2">Technical Skills</h3>
                    <div className="space-y-2">
                      {resumeData.skills.filter(s => s.type === 'technical' && s.name.trim()).map((skill) => (
                        <div key={skill.id} className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 min-w-[120px]">{skill.name}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-300"
                              style={{ width: getSkillLevelWidth(skill.level) }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 min-w-[80px]">{skill.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Soft Skills */}
                {resumeData.skills.filter(s => s.type === 'soft' && s.name.trim()).length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-700 mb-2">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.filter(s => s.type === 'soft' && s.name.trim()).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-sm border border-gray-300"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && resumeData.projects.some(p => p.title || p.description) && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Projects</h2>
                {resumeData.projects.map((project) => (
                  (project.title || project.description) && (
                    <div key={project.id} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-base text-gray-900">{project.title || 'Project Title'}</h3>
                        <div className="flex gap-2">
                          {project.liveLink && (
                            <a
                              href={project.liveLink.startsWith('http') ? project.liveLink : `https://${project.liveLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs group"
                              aria-label="View live demo"
                              title="View live demo"
                            >
                              <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                              <span className="underline-offset-2 group-hover:underline">Live</span>
                            </a>
                          )}
                          {project.githubLink && (
                            <a
                              href={project.githubLink.startsWith('http') ? project.githubLink : `https://${project.githubLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs group"
                              aria-label="View GitHub repository"
                              title="View GitHub repository"
                            >
                              <Github className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                              <span className="underline-offset-2 group-hover:underline">Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-700 mb-1 leading-relaxed">{project.description}</p>
                      )}
                      {project.technologies && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Technologies:</span> {project.technologies}
                        </p>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Achievements */}
            {resumeData.achievements.length > 0 && resumeData.achievements.some(a => a.title.trim()) && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Achievements & Certifications</h2>
                <ul className="space-y-2">
                  {resumeData.achievements.map((achievement) => (
                    achievement.title.trim() && (
                      <li key={achievement.id} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{achievement.title}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {resumeData.languages.length > 0 && resumeData.languages.some(l => l.name.trim()) && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Languages</h2>
                <div className="flex flex-wrap gap-4">
                  {resumeData.languages.map((language) => (
                    language.name.trim() && (
                      <div key={language.id} className="text-sm">
                        <span className="text-gray-900">{language.name}</span>
                        <span className="text-gray-500"> - {language.proficiency}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {resumeData.showInterests && resumeData.interests.trim() && (
              <div className="mb-8">
                <h2 className="text-xl mb-3 pb-2 border-b-2 border-gray-300 text-gray-800">Interests</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{resumeData.interests}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
