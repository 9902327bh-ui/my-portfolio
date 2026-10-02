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

export const projectsData = [
  {
    id: "speed-shield",
    title: "Speed Shield",
    subtitle: "Smart speed limiting for two-wheelers, controlled from your phone",
    description: "An IoT system that lets a rider set and lock a maximum bike speed straight from a smartphone. A microcontroller module on the bike receives the limit wirelessly and enforces it, helping parents and owners promote safer riding.",
    tech: ["IoT", "ESP32", "Web development"],
    depth: "REEF // 25 m",
    orbColor: "#48d1cc", // Medium turquoise
    keyFeatures: [
      "Remote speed threshold configuration and lock directly from mobile phone",
      "Wireless command relay to bike-mounted ESP32 microcontroller unit",
      "Real-time speed regulation and electronic throttle enforcement",
      "Parental and owner oversight to prevent reckless overspeeding"
    ],
    github: "https://github.com/9902327bh-ui"
  },
  {
    id: "digital-umpire",
    title: "Digital Umpire",
    subtitle: "Score tracking and video review in one app",
    description: "A simple cross-platform sports officiating app that records match scores live and captures video clips so decisions can be reviewed and refereed fairly.",
    tech: ["Dart", "Flutter"],
    depth: "REEF // 32 m",
    orbColor: "#64b5f6", // Soft sky blue
    keyFeatures: [
      "Live scorekeeping and game event logging in real time",
      "Embedded video clip recording synchronized with contentious match moments",
      "Frame-by-frame clip replay for impartial umpire verification",
      "Seamless cross-platform Flutter experience for mobile and tablet"
    ],
    github: "https://github.com/9902327bh-ui"
  },
  {
    id: "arena-hub",
    title: "ArenaHub",
    subtitle: "Book sports arenas and equipment in one place",
    description: "A booking platform where players can discover and reserve sports arenas and rent equipment from a single interface.",
    tech: ["React", "Node.js", "HTML", "Supabase"],
    depth: "REEF // 40 m",
    orbColor: "#4dd0e1", // Calm cyan
    keyFeatures: [
      "Comprehensive sports arena search with slot filtering",
      "Integrated sports equipment and gear rental module",
      "Unified reservation management and instant booking confirmations",
      "Real-time schedule synchronization powered by Supabase"
    ],
    github: "https://github.com/9902327bh-ui"
  },
  {
    id: "maint-x",
    title: "Maint-X",
    subtitle: "Task approval system for safer industrial maintenance",
    description: "A platform where specific maintenance tasks are approved and assigned to authorized technicians only, reducing the risk of accidental or malicious tampering with industrial machines.",
    tech: ["Python", "Supabase", "React", "Node.js"],
    depth: "REEF // 48 m",
    orbColor: "#38b2ac", // Seafoam teal
    keyFeatures: [
      "Strict role-based authorization for critical machinery workflows",
      "Digital maintenance task requests and verified manager sign-offs",
      "Active prevention against accidental and malicious machine tampering",
      "Comprehensive digital audit logs for regulatory and plant safety standards"
    ],
    github: "https://github.com/9902327bh-ui"
  }
];

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
