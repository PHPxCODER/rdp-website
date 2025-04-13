export interface TeamMember {
    name: string;
    role: string;
    image: string;
    linkedin?: string;
    github?: string;
    soundcloud?: string;
    website?: string;
    discordid?: string;
  }

export const team = [
    {
      name: "Subhadeep Pramanik",
      role: "Founder",
      image: "https://res.cloudinary.com/ddvheihbd/image/upload/f_auto,q_auto/v1/team/phpxcoder",
      linkedin: "https://linkedin.com/in/phpxcoder",
      github: "https://github.com/phpxcoder",
      website: "https://phpxcoder.in",
      discordid: "697757845063729194",
    },
    {
      name: "Dinesh Yerra",
      role: "Co-Founder & CTO",
      image: "https://res.cloudinary.com/ddvheihbd/image/upload/t_dino_1_1/team/dinokage",
      linkedin: "https://linkedin.com/in/dinokage/",
      github: "https://github.com/dinokage",
      website: "https://dinokage.in",
      discordid: "446946428158214164",
    },
    {
      name: "Rahul Kose",
      role: "Co-Founder & Content Manager",
      image: "https://res.cloudinary.com/ddvheihbd/image/upload/ar_1:1,c_crop,g_north_east/team/rgxjapan",
      website: "https://kandabhaja.nl",
      discordid: "978013588172177428",
    },
    {
      name: "Arjun Ghosh",
      role: "CFO & Director",
      image: "https://res.cloudinary.com/ddvheihbd/image/upload/f_auto,q_auto/v1/team/arjun",
      linkedin: "https://www.linkedin.com/in/arjungho/",
      website: "https://agentop.codevizag.com",
      discordid: "852588894977130516",
    },
    {
      name: "Joy Alric Kujur",
      role: "Audio & Acoustic Systems Lead",
      image: "https://res.cloudinary.com/ddvheihbd/image/upload/f_auto,q_auto/v1/team/joyalric",
      linkedin: "https://linkedin.com/in/musicbyilluzon/",
      soundcloud: "https://soundcloud.com/illuzon",
      website: "https://musicbyilluzon.in",
      discordid: "554958590398693388",
    },
  ];

export const teamMemberDetails: Record<string, {
  description: string;
  achievements: string[];
  skills: string[];
}> = {
  "Subhadeep Pramanik": {
    description: "Subhadeep is the founder of RDP Datacenter with over 10 years of experience in cloud infrastructure and systems architecture. His vision is to build scalable, secure, and affordable cloud hosting solutions for businesses of all sizes. He has a deep expertise in network optimization, containerization, and distributed systems.",
    achievements: [
      "Led the development of our proprietary cloud management platform",
      "Designed our core infrastructure architecture that powers thousands of instances",
      "Established strategic partnerships with key technology providers",
      "Pioneered our multi-region deployment strategy for enhanced reliability"
    ],
    skills: [
      "Cloud Architecture", "Kubernetes", "DevOps", "System Design", "Network Security"
    ]
  },
  "Dinesh Yerra": {
    description: "As Co-Founder and CTO, Dinesh leads the technical direction of RDP Datacenter. With a background in distributed systems and cloud-native technologies, he oversees the development of our platform infrastructure. Dinesh is passionate about leveraging cutting-edge technologies to solve complex hosting challenges for our clients.",
    achievements: [
      "Architected our zero-downtime deployment system",
      "Implemented advanced security protocols across our platform",
      "Developed our automated scaling infrastructure",
      "Published research on cloud optimization techniques"
    ],
    skills: [
      "System Architecture", "Go/Rust Programming", "Database Design", "Infrastructure as Code", "Performance Optimization"
    ]
  },
  "Rahul Kose": {
    description: "Rahul manages our content strategy and customer communications as Co-Founder and Content Manager. With a background in technical writing and UX design, he ensures our complex technology is explained clearly to users of all technical levels. His focus is on creating educational resources that help customers maximize their experience with our platform.",
    achievements: [
      "Developed our comprehensive knowledge base and documentation",
      "Created user onboarding flows that increased retention by 42%",
      "Launched our technical blog with over 100,000 monthly readers",
      "Established our content localization strategy for global markets"
    ],
    skills: [
      "Technical Writing", "UX Design", "Content Strategy", "Customer Education", "Information Architecture"
    ]
  },
  "Arjun Ghosh": {
    description: "As CFO and Director, Arjun oversees the financial operations and strategic business planning of RDP Datacenter. With experience in technology investment and financial management, he ensures our growth is sustainable while developing pricing models that deliver maximum value to our customers.",
    achievements: [
      "Secured Series A funding to expand our data center footprint",
      "Developed our tiered pricing strategy that increased profitability by 35%",
      "Led our expansion into emerging markets",
      "Implemented financial systems that support our rapid scaling"
    ],
    skills: [
      "Financial Strategy", "Business Development", "Investment Planning", "Risk Management", "Market Analysis"
    ]
  },
  "Joy Alric Kujur": {
    description: "Joy brings a specialized perspective to our data center team as Audio & Acoustic Systems Lead, applying advanced sound design and engineering expertise to enhance both operational functionality and brand presence. His background in audio engineering, acoustic treatment, and digital sound systems has directly contributed to more efficient environments and a cohesive brand experience across our facilities and platforms.",
    achievements: [
      "Implemented acoustic treatments in key areas to enhance clarity and reduce noise",
      "Built an integrated audio alert system for real-time monitoring and faster responses",
      "Created custom audio branding for demos, tours, and internal content",
      "Designed sound for videos to maintain a consistent brand identity"
    ],
    skills: [
      "Acoustic Design", "Audio Engineering", "Sound Design", "Audio Engineering", "Sound Branding"
    ]
  }
};