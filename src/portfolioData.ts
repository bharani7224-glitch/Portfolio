export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface SkillNode {
  name: string;
  tier?: number; // 1: Apex, 2: Upper Mid, 3: Lower Mid, 4: Base
  proficiency: number;
  category?: string;
}

export interface TimelineEntry {
  type: 'education' | 'work' | 'internship';
  period: string;
  title: string;
  institution: string;
  location: string;
  description: string;
  grade?: string;
}

export interface ProjectEntry {
  id: number;
  title: string;
  shortDesc: string;
  longDesc: string;
  category: 'frontend' | 'fullstack' | 'systems';
  categoryLabel?: string;
  tags: string[];
  features: string[];
  demoUrl?: string;
  githubUrl?: string;
  highlights: string;
  hasShine?: boolean;
}

export interface ServiceEntry {
  title: string;
  description: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: 'Bharani',
    brand: 'Bharani.dev',
    roleTaglines: [
      'Full-Stack .NET Developer',
      'React & ASP.NET Specialist',
      'Clean Architecture Advocate',
      'Problem Solver'
    ],
    statusPill: 'ASP.NET Developer Currently at NavaNala Technologies 10+ Months Experience',
    bioHero: 'I craft premium digital experiences — from pixel-perfect interfaces to robust back-end systems. Passionate about clean architecture and breathtaking UI.',
    bioAbout1: 'I am a Full-Stack .NET Developer based in Tamil Nadu, India, specializing in building scalable web applications with C#, ASP.NET Core, React, and PostgreSQL. I focus on delivering clean, maintainable code backed by solid architecture.',
    bioAbout2: 'My development process is anchored in Clean Architecture, REST API design, and real-world problem solving — from OCR-powered document processing to JWT-secured back-end systems. I enjoy turning complex requirements into reliable software.',
    location: 'Tamil Nadu, India',
    email: 'bharani7224@gmail.com',
    phone: '+91 93606 80467',
    resumeUrl: '/resume.pdf',
    socials: [
      { platform: 'GitHub', url: 'https://github.com/bharani', label: 'GitHub' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/bharani-dharan-d-26624a293', label: 'LinkedIn' },
      { platform: 'Email', url: 'mailto:bharani7224@gmail.com', label: 'Email' }
    ]
  },

  skillsPyramid: [
    // Frontend Development
    { name: 'HTML', tier: 1, proficiency: 75, category: 'Frontend Development' },
    { name: 'CSS', tier: 2, proficiency: 70, category: 'Frontend Development' },
    { name: 'JavaScript', tier: 2, proficiency: 70, category: 'Frontend Development' },
    { name: 'React.js', tier: 2, proficiency: 70, category: 'Frontend Development' },

    // Backend Development
    { name: 'C#', tier: 1, proficiency: 75, category: 'Backend Development' },
    { name: '.NET / ASP.NET Core', tier: 1, proficiency: 80, category: 'Backend Development' },
    { name: 'ASP.NET MVC', tier: 2, proficiency: 70, category: 'Backend Development' },
    { name: 'REST API Development', tier: 1, proficiency: 85, category: 'Backend Development' },
    { name: 'VB.NET', tier: 3, proficiency: 55, category: 'Backend Development' },
    { name: 'Node.js', tier: 4, proficiency: 45, category: 'Backend Development' },

    // Database Development
    { name: 'PostgreSQL', tier: 1, proficiency: 75, category: 'Database Development' },
    { name: 'Oracle Database', tier: 3, proficiency: 60, category: 'Database Development' },
    { name: 'PL/SQL', tier: 3, proficiency: 60, category: 'Database Development' },

    // Architecture, Security & Tools
    { name: 'Clean Architecture', tier: 1, proficiency: 75, category: 'Architecture, Security & Tools' },
    { name: 'JWT Authentication & Role-Based Access Control (RBAC)', tier: 2, proficiency: 70, category: 'Architecture, Security & Tools' },
    { name: 'API Testing', tier: 2, proficiency: 65, category: 'Architecture, Security & Tools' },
    { name: 'Git & IIS Deployment', tier: 3, proficiency: 60, category: 'Architecture, Security & Tools' },

    // Specialized Technical Experience
    { name: 'OCR Integration', tier: 1, proficiency: 75, category: 'Specialized Technical Experience' },
    { name: 'ERP Application Development', tier: 1, proficiency: 75, category: 'Specialized Technical Experience' },
    { name: 'Background Job Processing', tier: 2, proficiency: 70, category: 'Specialized Technical Experience' },
    { name: 'TallyPrime Integration', tier: 2, proficiency: 70, category: 'Specialized Technical Experience' }
  ],

  education: [
    {
      type: 'education' as const,
      period: '2023 – 2026',
      title: 'BCA – Bachelor of Computer Applications',
      institution: 'Erode Arts and Science College',
      location: 'Erode, Tamil Nadu',
      description: 'Completed core courses in web design, databases, software development, and application management. Graduated with a CGPA of 7.36.',
      grade: 'CGPA: 7.36'
    }
  ],

  experience: [
    {
      type: 'work' as const,
      period: 'Jan 2026 – Present',
      title: 'Software Developer (10 Mos Completed)',
      institution: 'NavaNala Technologies Private Limited',
      location: 'Perundurai, Tamil Nadu',
      description: 'Developing dynamic web applications with clean frontend architectures, optimizing logic routines, and collaborating on full-stack features.'
    },
    {
      type: 'internship' as const,
      period: 'Jul 2025 – Dec 2025',
      title: 'MernStack Developer Intern',
      institution: 'BlackStone Infomatics',
      location: 'Coimbatore, Tamil Nadu',
      description: 'Collaborated in developing modern web applications using React.js, Node.js, Express.js, and MongoDB. Assisted in building responsive user interfaces, developing RESTful APIs, managing database operations, and working closely with the development team to deliver scalable full-stack solutions.'
    }
  ],

  projects: [
    {
      id: 1,
      title: 'Transport Management System',
      shortDesc: 'A comprehensive logistics management hub tracking routes, fleet maintenance schedules, driver dispatch states, and fuel performance logs.',
      longDesc: 'Designed to streamline transport business operations, this platform coordinates fleet dispatches, automates trip planning, logs fuel reports, and schedules maintenance notifications. It features dashboard metrics and printable invoice summaries.',
      category: 'fullstack' as const,
      tags: ['C#', 'ASP.NET Web API', 'React.js', 'Tailwind CSS', 'PostgreSQL'],
      features: [
        'Real-time fleet route configurations and trip assignment flows.',
        'Driver shift scheduling with workload validation logs.',
        'Log maintenance audits tracking repairs, expenditures, and parts replacement cycles.',
        'Interactive analytics dashboard displaying fuel efficiency indices and invoice graphs.'
      ],
      demoUrl: 'https://demo.bharani.dev/transport-system',
      githubUrl: 'https://github.com/bharani/transport-management-system',
      highlights: 'Logistics & Fleet Analytics',
      hasShine: true
    },
    {
      id: 2,
      title: 'Ledze Plus ERP',
      shortDesc: 'An enterprise ERP application designed to streamline purchase and sales operations through approval-based workflows, quotation management, order processing, and invoice management.',
      longDesc: 'An enterprise ERP application designed to streamline purchase and sales operations through approval-based workflows, quotation management, order processing, and invoice management. Integrates department authorization hierarchies, quotation life cycles, and reliable REST API data operations with PostgreSQL.',
      category: 'fullstack' as const,
      categoryLabel: 'Enterprise Resource Planning (ERP)',
      tags: ['React.js', 'ASP.NET Core Web API', 'C#', 'Entity Framework Core', 'PostgreSQL'],
      features: [
        'Purchase requisition and department approval workflows.',
        'Request for Quotation (RFQ) and vendor quotation management.',
        'Purchase order, goods receipt, purchase invoice, and purchase return workflows.',
        'Sales enquiry, costing, customer quotation, and sales order workflows.',
        'Invoice processing and dispatch approval workflows.',
        'REST API integration and database-driven business operations.'
      ],
      highlights: 'Enterprise ERP',
      hasShine: true
    },
    {
      id: 3,
      title: 'LedzeePlus OCR – InvoiceFlow',
      shortDesc: 'An invoice automation solution that processes PDF and image-based invoices, extracts structured invoice information through an OCR service, and tracks processing status and audit history.',
      longDesc: 'An invoice automation solution that processes PDF and image-based invoices, extracts structured invoice information through an OCR service, and tracks processing status and audit history. Built with multi-file validation, asynchronous background queues, OCR parsing, and tenant-aware access control.',
      category: 'systems' as const,
      categoryLabel: 'Intelligent Invoice Processing / OCR Automation',
      tags: ['React.js', 'ASP.NET Core Web API', 'C#', 'PostgreSQL', 'Background Services', 'OCR API', 'JWT Authentication'],
      features: [
        'Multi-file PDF and image uploads.',
        'File validation, duplicate detection, and antivirus scanning.',
        'Background queue processing with concurrent job execution.',
        'OCR integration for invoice headers, line items, and totals.',
        'PostgreSQL persistence for documents and extracted invoice data.',
        'Retry handling, queue recovery, and processing status tracking.',
        'Authentication, tenant-aware access control, and audit logging.',
        'Frontend integration with batch status APIs.'
      ],
      highlights: 'OCR & Invoice Automation',
      hasShine: true
    }
  ],

  services: [
    {
      title: '.NET Backend Development',
      description: 'Building robust ASP.NET Core Web APIs with C#, Entity Framework Core, JWT authentication, and Clean Architecture principles.'
    },
    {
      title: 'Database & Data Layer',
      description: 'Designing efficient PostgreSQL schemas, writing optimized queries, and integrating ORM layers with Entity Framework Core.'
    },
    {
      title: 'Frontend & Integration',
      description: 'Crafting interactive React UIs with clean HTML/CSS, consuming REST APIs, and implementing end-to-end full-stack solutions.'
    }
  ]
};
