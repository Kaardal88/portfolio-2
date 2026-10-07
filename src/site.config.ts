/** Site-wide settings. Edit these before deploying. */
export const site = {
  name: 'Kim-André Kårdal',
  initials: 'KÅ',
  role: 'Front-end developer & product builder',
  email: '[YOUR EMAIL]',
  github: 'https://github.com/[your-username]',
  linkedin: 'https://www.linkedin.com/in/[your-profile]',
  // The course video presentation doubles as the intro video on the home page.
  introVideoUrl: '#',
  introVideoLength: '1:12',
  available: true,
  // Idea counter on the Lab page. Be honest, that is the joke.
  ideas: { started: 42, shipped: 7 },
};

export const nav = [
  { href: '/', label: 'Work' },
  { href: '/lab/', label: 'Lab' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];
