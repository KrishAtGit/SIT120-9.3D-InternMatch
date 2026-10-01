// these are the five matched internships shown on the dashboard and detail views
// in Tasks 5.3D / 6.3D these were hard-coded HTML with one card at a time. 
// they are now stored as data which means the dashboard renders every card and table row with v-for
// and the detail view can show whichever listing the user picked

export const internships = [
  {
    id: 'telstra-data-analyst',
    category: 'data',
    role: 'Junior Data Analyst Intern',
    company: 'Telstra',
    location: 'Melbourne VIC',
    length: '12 weeks',
    pay: '$34/hr',
    closes: '12 Oct 2026',
    posted: '2 days ago',
    match: 88,
    summary:
      'Support the network insights team with weekly reporting on service outages. You will write SQL queries against the incident warehouse and help rebuild three legacy Excel reports.',
    matchedSkills: ['SQL', 'Python', 'Pandas'],
    missingSkills: ['Power BI'],
    gapHint:
      'Power BI is the only skill standing between you and a full match. The free Microsoft Learn Power BI path takes most students under a week.',
    description:
      "Telstra's Network Insights team is looking for a Junior Data Analyst Intern to support weekly reporting on service outages across the fixed-line and mobile network. You will sit with a team of five analysts and help turn raw incident logs into reports that regional operations managers read every Monday morning.",
    responsibilities: [
      'Write and maintain SQL queries against the incident data warehouse.',
      'Rebuild three legacy Excel reports as repeatable, scheduled queries.',
      'Clean and validate incoming outage data before it reaches the weekly report.',
      'Present a short summary of findings to the team at the Monday stand-up.',
    ],
    requirements: [
      'Currently enrolled in an undergraduate or postgraduate IT, Data Science, or related degree.',
      'Comfortable writing SQL joins and aggregate queries.',
      'Some exposure to Python for basic data cleaning (pandas is a bonus, not required).',
      'Work rights in Australia, including student visa holders with standard work hour limits.',
    ],
    eligibility:
      'Open to student visa holders. No permanent residency, security clearance, or prior industry experience is required, which is why InternMatch ranked it first.',
  },
  {
    id: 'atlassian-software-engineering',
    category: 'software',
    role: 'Software Engineering Intern',
    company: 'Atlassian',
    location: 'Melbourne VIC',
    length: '10 weeks',
    pay: '$38/hr',
    closes: '5 Oct 2026',
    posted: '4 days ago',
    match: 81,
    summary:
      'Join a Jira platform squad shipping small front-end features end to end. Mentored code review, two releases a week, and a real ticket in your first fortnight.',
    matchedSkills: ['JavaScript', 'React', 'Git'],
    missingSkills: ['TypeScript', 'Docker'],
    gapHint:
      'TypeScript builds directly on the JavaScript you already know. Converting one of your own React projects to it is the fastest way to close this gap.',
    description:
      "Atlassian's Jira platform team runs small squads that own a feature from design to release. As an intern you will be paired with a senior engineer, pick up production tickets in your second week, and ship code that millions of Jira users see.",
    responsibilities: [
      'Build and test React components for the Jira issue view.',
      'Take part in code review, both giving and receiving feedback.',
      'Write unit tests for every change you ship.',
      'Demo your work to the squad at the end of each fortnightly sprint.',
    ],
    requirements: [
      'Penultimate or final year of a Computer Science, Software Engineering or IT degree.',
      'Solid JavaScript and at least one project built with React.',
      'Comfortable with Git branches and pull requests.',
      'Student visa holders are welcome to apply.',
    ],
    eligibility:
      'Open to student visa holders during semester breaks. No prior industry experience is needed, but a portfolio or GitHub link is strongly recommended.',
  },
  {
    id: 'csiro-machine-learning',
    category: 'data',
    role: 'Machine Learning Intern',
    company: 'CSIRO Data61',
    location: 'Clayton VIC',
    length: '6 months',
    pay: '$32/hr',
    closes: '30 Oct 2026',
    posted: '1 week ago',
    match: 67,
    summary:
      'Assist a research team cleaning satellite imagery datasets and evaluating classification models. Suits a student who enjoys writing careful, reproducible notebooks.',
    matchedSkills: ['Python', 'Pandas'],
    missingSkills: ['PyTorch', 'AWS'],
    gapHint:
      'PyTorch is the bigger gap here. The official 60-minute blitz tutorial is enough to talk about it confidently in an interview.',
    description:
      "CSIRO's Data61 remote sensing group trains models that classify land use from satellite images. You will help prepare the training data, run experiments on the group's cloud cluster, and document results so other researchers can reproduce them.",
    responsibilities: [
      'Clean and label satellite imagery datasets in Python.',
      'Run and compare classification experiments using existing model code.',
      'Keep experiment notebooks tidy, commented and reproducible.',
      'Write a short technical report at the end of the placement.',
    ],
    requirements: [
      'Studying Data Science, Computer Science, Mathematics or a related field.',
      'Confident with Python and pandas.',
      'Some exposure to a deep learning library (PyTorch preferred).',
      'Available three days a week for six months.',
    ],
    eligibility:
      'Open to student visa holders working part-time during semester. Some CSIRO projects need citizenship, but this one does not.',
  },
  {
    id: 'canva-frontend-developer',
    category: 'software',
    role: 'Frontend Developer Intern',
    company: 'Canva',
    location: 'Melbourne VIC (hybrid)',
    length: '12 weeks',
    pay: '$36/hr',
    closes: '19 Oct 2026',
    posted: '5 days ago',
    match: 64,
    summary:
      "Build and test components for the design editor's template browser. Expect close work with a product designer and a lot of attention to responsive behaviour.",
    matchedSkills: ['React', 'JavaScript'],
    missingSkills: ['Figma', 'Jest'],
    gapHint:
      'Both gaps are quick to close: Figma is free for students, and adding Jest tests to an existing project shows the skill directly.',
    description:
      "Canva's template discovery team builds the browser that helps people find a starting design. The intern role focuses on making those components fast, accessible and responsive, from a phone up to a 4K monitor.",
    responsibilities: [
      'Turn Figma designs into React components for the template browser.',
      'Write Jest tests for component behaviour.',
      'Check layouts across phone, tablet and desktop sizes.',
      'Pair with a product designer on small UX improvements.',
    ],
    requirements: [
      'Studying Software Engineering, Computer Science, IT or Design with coding.',
      'Experience building interfaces with React.',
      'An eye for detail in layout, spacing and typography.',
      'Able to work in the Melbourne office two days a week.',
    ],
    eligibility:
      'Open to student visa holders. The hybrid arrangement makes it workable alongside part-time study.',
  },
  {
    id: 'coles-business-intelligence',
    category: 'data',
    role: 'Business Intelligence Intern',
    company: 'Coles Group',
    location: 'Hawthorn East VIC',
    length: '8 weeks',
    pay: '$31/hr',
    closes: '8 Oct 2026',
    posted: '3 days ago',
    match: 52,
    summary:
      'Help the supply chain analytics team turn store-level stock data into dashboards the category managers read every Monday morning.',
    matchedSkills: ['SQL'],
    missingSkills: ['Power BI', 'DAX', 'Tableau'],
    gapHint:
      'Power BI appears in two of your top five matches. Learning it (DAX comes with it) would lift this score the most.',
    description:
      "Coles Group's supply chain analytics team looks after the reports that tell category managers which products are running low across 800+ stores. You will help move those reports from spreadsheets into interactive dashboards.",
    responsibilities: [
      'Query store-level stock data with SQL.',
      'Build Power BI dashboards for category managers.',
      'Write DAX measures for weekly stock-on-hand and waste figures.',
      'Gather feedback from managers and refine the dashboards.',
    ],
    requirements: [
      'Studying Business Analytics, IT, Data Science or Commerce.',
      'Working knowledge of SQL.',
      'Power BI or Tableau experience (either is fine).',
      'Available full-time over the summer break.',
    ],
    eligibility:
      'Open to student visa holders over the summer break, when full-time hours are allowed.',
  },
]

export function findInternship(id) {
  return internships.find((internship) => internship.id === id) ?? null
}

// used for the coloured match badge on cards, the table and the detail page
export function matchLevel(match) {
  if (match >= 75) return 'high'
  if (match >= 60) return 'mid'
  return 'low'
}
