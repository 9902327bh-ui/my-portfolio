/**
 * portfolioData.js
 * Single source of truth for all portfolio data: profile, skills, projects, timeline, and contacts.
 */

export const profileData = {
  name: "Bharath M G",
  title: "Undergraduate Software & Hardware Developer",
  tagline: "Building ideas that connect people, hardware, and software.",
  subline: "B.E. Computer Science · 2nd Year · Sri Venkateshwara College of Engineering · CGPA 8.6",
  location: "Bengaluru, India",
  depthMarkers: {
    surface: "SURFACE // 0 m",
    shallows: "SHALLOWS // 10 m",
    reef: "REEF // 30 m",
    deep: "DEEP // 60 m",
    seabed: "SEABED // 100 m",
  },
  focusAreas: [
    "Web Development",
    "App Development",
    "AI/ML",
    "Game Development",
    "IoT"
  ],
  socialLinks: {
    github: "https://github.com/9902327bh-ui",
    linkedin: "https://www.linkedin.com/in/-1229bharath",
    email: "9902327bh@gmail.com",
    phone: "+91 9108942491",
  }
};

export const skillsData = [
  {
    category: "Languages",
    description: "Core programming and markup languages",
    skills: ["C", "Python", "Java", "Dart", "HTML", "CSS"]
  },
  {
    category: "Frameworks & Fullstack",
    description: "Modern app, web & backend ecosystems",
    skills: ["React", "Flutter", "Node.js", "Supabase", "MongoDB"]
  },
  {
    category: "APIs & Dev Tools",
    description: "Integration, version control, and development suite",
    skills: ["Razorpay APIs", "Git/GitHub", "VS Code"]
  }
];

import { projectsData } from "./projects.js";
export { projectsData };

export const timelineData = [
  {
    category: "Education",
    title: "B.E. Computer Science & Engineering",
    institution: "Sri Venkateshwara College of Engineering",
    period: "2nd Year",
    highlight: "CGPA 8.6",
    details: "Foundations in computer science, data structures, algorithms, object-oriented systems, and collaborative software engineering."
  },
  {
    category: "Schooling",
    title: "Secondary & Higher Secondary Education",
    institution: "B M English School",
    period: "Foundational Years",
    highlight: "Academic Excellence",
    details: "Strong foundations in science, mathematics, and analytical problem-solving."
  },
  {
    category: "Competition",
    title: "2nd Runner-Up — National-Level Hackathon",
    institution: "National Hackathon",
    period: "Industrial Cybersecurity Track",
    highlight: "Podium Finish",
    details: "Designed and defended solutions combating industrial vulnerability exploitation and securing industrial operational systems."
  },
  {
    category: "Communication",
    title: "2nd Runner-Up — Intra-College Debate",
    institution: "Sri Venkateshwara College of Engineering",
    period: "College Debate Competition",
    highlight: "Public Speaking Award",
    details: "Recognized for persuasive argumentation, structured logic, and spontaneous analytical debate."
  },
  {
    category: "Certifications",
    title: "Industry & Technical Certifications",
    institution: "Infosys Springboard & Forage",
    period: "Professional Development",
    highlight: "4 Certifications",
    details: "Python Certification from Infosys Springboard, alongside 3 hands-on practical job-simulation certifications completed through Forage."
  }
];
