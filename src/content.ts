/**
 * Everything the site says lives here. Edit freely; components only lay it out.
 */

export const person = {
  name: 'Nicole “Nic” Lee',
  shortName: 'Nic Lee',
  email: 'nhlee@mit.edu',
  linkedin: 'https://www.linkedin.com/in/nicolehuimeilee/',
  cv: './Nic_Lee_CV.pdf',
  place: 'Cambridge, MA',
  lat: '42.3601° N',
  lon: '71.0942° W',
};

/** Short facts under the name: schools and lab. */
export const facts = [
  { label: 'MIT', value: 'S.M. Aeronautics and Astronautics\nS.M. Technology and Policy' },
  { label: 'Caltech', value: 'B.S. Mechanical Engineering and Business, Economics, and Management' },
  { label: 'Lab', value: 'Human Systems Lab, MIT\nCambridge, MA' },
];

/** Biography. One string per paragraph; add more paragraphs as needed. */
export const biography = [
  'Nicole “Nic” Lee is a graduate student at MIT pursuing dual S.M. degrees in Aeronautics and Astronautics and Technology and Policy. She conducts research in the Human Systems Lab, where her work focuses on technologies for human performance and spaceflight, including “making exercise wearable” and developing other engineering solutions for extreme environments.',
  'She is also an NSF Graduate Research Fellow, MIT Schwarzman College of Computing AI SERC Scholar, Brooke Owens Fellow, Matthew Isakowitz Commercial Space Scholar, and ASCENT Fellow, and holds a B.S. in Mechanical Engineering and Business, Economics, and Management from Caltech.',
];

/**
 * Publications, newest first. Add `href` (a DOI or link) when you have one,
 * or put a PDF in public/ and use './file-name.pdf'.
 */
export type Publication = { year: string; title: string; venue: string; href?: string };
export const publications: Publication[] = [
  { year: '2027', title: 'Electromechanical Modeling of Wearable NMES Electrodes in a Gravity-Loading Countermeasure Suit', venue: 'IEEE Aerospace Conference · Accepted' },
  { year: '2026', title: 'Feasibility of a Wearable Neuromuscular Electrical Stimulation System as an Adjunct Exercise Countermeasure for Long-Duration Human Spaceflight', venue: 'International Conference on Environmental Systems', href: 'https://hdl.handle.net/2346/108983' },
  { year: '2025', title: 'Connecting the World', venue: 'Space Capital Publications', href: 'https://www.spacecapital.com/publications/connecting-the-world' },
  { year: '2024', title: 'Development of Machine Learning Tools for Aerospace Design: Wind Tunnel Investigations on a Speed Bump Model', venue: 'AIAA SciTech Forum', href: 'https://arc.aiaa.org/doi/10.2514/6.2023-0540.c1' },
  { year: '2023', title: 'Reservoir Compaction Poroelastic Model', venue: 'Caltech Geomechanics and Mitigation of Geohazards', href: 'https://gmg.caltech.edu/research/funded-research' },
];

/** News, newest first. `href` is optional. */
export type NewsItem = { date: string; text: string; href?: string };
export const news: NewsItem[] = [
  { date: 'Sept 2026', text: 'Named an MIT Schwarzman College of Computing AI SERC Scholar' },
];
