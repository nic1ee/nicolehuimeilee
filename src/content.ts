/**
 * All copy and data in one place. Edit here; components only lay it out.
 * Items marked REVIEW are interpretations Nic should confirm.
 */

export const person = {
  name: 'Nic Lee',
  fullName: 'Nicole “Nic” Lee',
  email: 'nhlee@mit.edu',
  linkedin: 'https://linkedin.com/in/nicolehuimeilee',
  cv: './Nic_Lee_CV.pdf',
  place: 'Cambridge, MA',
  lat: '42.3601° N',
  lon: '71.0942° W',
};

export const chaptersList = [
  { id: 'hero', label: 'Opening' },
  { id: 'mission', label: 'Mission' },
  { id: 'ta01', label: 'NMES' },
  { id: 'flight', label: 'Parabolic' },
  { id: 'orbit', label: 'Policy' },
  { id: 'index', label: 'Index' },
  { id: 'trajectory', label: 'Trajectory' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'contact', label: 'Contact' },
] as const;

export const mission =
  'People are about to live, work and move for months in places the human body was never designed for.';

export type ArchiveItem = {
  n: string;
  title: string;
  where: string;
  year: string;
  kind: string;
  note: string;
  image: string; // placeholder label: what photo belongs here
  href?: string;
};

export const archive: ArchiveItem[] = [
  { n: '01', title: 'Wearable NMES countermeasure', where: 'MIT Human Systems Lab', year: '2025–', kind: 'Hardware · human subjects', note: 'Electrical muscle stimulation as a supplemental exercise countermeasure for microgravity.', image: 'NMES electrode test — macro 4:5', href: '#ta01' },
  { n: '02', title: 'Skinsuit × NMES, toward flight', where: 'MIT Human Systems Lab', year: '2025–', kind: 'Spacesuit systems', note: 'Integrating stimulation into the Gravity Loading Countermeasure Skinsuit.', image: 'Skinsuit detail — portrait 3:4', href: '#flight' },
  { n: '03', title: 'After the Station', where: 'Aerospace CSPS', year: '2026–', kind: 'Space policy', note: 'A framework for evaluating the ISS-to-commercial LEO transition.', image: 'Policy framework diagram — 4:3', href: '#orbit' },
  { n: '04', title: 'Wearable ultrasound', where: 'MIT Media Lab · HEALS', year: '2025–', kind: 'Wearable sensing', note: 'A wearable ultrasound device funded through a HEALS grant.', image: 'Ultrasound prototype — 4:3' },
  { n: '05', title: 'Cardiovascular flow in elastic vessels', where: 'Caltech GALCIT', year: '2023–25', kind: 'Computational fluids', note: 'Lattice Boltzmann and immersed-boundary models of pulsatile flow for extreme environments.', image: 'Flow simulation still — 16:9' },
  { n: '06', title: 'Physics-informed nets for wind-tunnel data', where: 'Caltech · AIAA', year: '2022', kind: 'Publication, 2024', note: 'Physics-informed machine learning to predict complex flow fields from sparse data.', image: 'Flow-field reconstruction — 16:9' },
  { n: '07', title: 'Connecting the World', where: 'Space Capital', year: '2024', kind: 'Publication, 2025', note: 'Market analysis of direct-to-cell satellite communications.', image: 'Report cover — 4:5' },
  { n: '08', title: 'Solid-motor grain regression', where: 'The Aerospace Corporation', year: '2023', kind: 'Propulsion', note: 'Tools for grain regression and ballistic analysis from static-fire tests.', image: 'Static fire / grain cross-section — 16:9' },
  { n: '09', title: 'Reservoir compaction model', where: 'Quest CCS · Caltech GMG', year: '2022', kind: 'Publication, 2023', note: 'Poroelastic modelling of reservoir compaction at a carbon-storage site.', image: 'Geomechanical model render — 16:9' },
];

/**
 * Flight plan. x is order along the route (0..1); band is the flight level.
 * Bands: 0 = Human, 1 = Machine, 2 = Market & policy.
 * `carry` is the note on the leg INTO this waypoint. REVIEW: these are interpretations.
 */
export type Waypoint = {
  id: string;
  org: string;
  role: string;
  year: string;
  coord: string;
  band: 0 | 1 | 2;
  carry?: string;
};

export const flightPlan: Waypoint[] = [
  { id: 'UAZ', org: 'Univ. of Arizona', role: 'Neural-network research intern', year: '2020', coord: '32.23N 110.95W', band: 1 },
  { id: 'BOE', org: 'Boeing', role: 'Fluid mechanics engineer', year: '2022', coord: 'REMOTE', band: 1, carry: 'neural nets → flow fields' },
  { id: 'GMG', org: 'Caltech', role: 'Planetary surface modelling', year: '2022', coord: '34.14N 118.13W', band: 1, carry: 'simulation → planetary surfaces' },
  { id: 'QCS', org: 'Quest CCS', role: 'Design engineer', year: '2022', coord: '53.7N 113.2W', band: 1, carry: 'models → real reservoirs' },
  { id: 'AERO', org: 'The Aerospace Corp.', role: 'Propulsion intern', year: '2023', coord: '33.92N 118.42W', band: 1, carry: 'structures → propulsion' },
  { id: 'GAL', org: 'Caltech GALCIT', role: 'Cardiovascular flow research', year: '2023–25', coord: '34.14N 118.13W', band: 0, carry: 'fluids → the body' },
  { id: 'SPCP', org: 'Space Capital', role: 'Venture capital intern', year: '2024', coord: '40.74N 73.99W', band: 2, carry: 'engineering → markets' },
  { id: 'HSL', org: 'MIT Human Systems Lab', role: 'SM/PhD researcher', year: '2025–', coord: '42.36N 71.09W', band: 0, carry: 'industry → the human in orbit' },
  { id: 'CSPS', org: 'Aerospace CSPS', role: 'Space policy research fellow', year: '2026–', coord: '38.90N 77.04W', band: 2, carry: 'hardware → the rules around it' },
];

export const bands = ['Human', 'Machine', 'Market & policy'] as const;

export const recognition = [
  'NSF Graduate Research Fellowship',
  'Brooke Owens Fellowship',
  'Matthew Isakowitz Commercial Space Scholarship',
  'ASCENT Fellowship',
  'Payload Pioneers 30 Under 30', // REVIEW: from Nic's brief, not yet on the CV
];

export const roles = [
  'President, Graduate Association of Aeronautics & Astronautics',
  'President, MIT Space Industry Club',
];

export const scholarships = [
  'Beckman Political Award',
  'Aerospace Corporation Iron Intern',
  'Kiyo and Eiko Tomiyasu SURF Scholar',
  'Los Angeles Philanthropic Foundation Scholarship',
  'LeRoy and Anita Nelson Scholarship',
];
