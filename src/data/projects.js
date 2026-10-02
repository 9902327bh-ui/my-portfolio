/**
 * data/projects.js
 * Dedicated projects data with individual GitHub repositories and fallbacks.
 */

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
    // Links directly to individual project repo; falls back to profile if empty
    github: "https://github.com/9902327bh-ui/automated-speed-regulating-device"
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
    github: "https://github.com/9902327bh-ui/cricket-umpire-app"
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
    github: "https://github.com/9902327bh-ui/a-demo-rental-app"
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
    github: "https://github.com/9902327bh-ui/maintx"
  }
];

export default projectsData;
