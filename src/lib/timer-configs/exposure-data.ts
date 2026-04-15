/** Reciprocity failure data for long exposure calculations */

export interface FilmStock {
  name: string;
  manufacturer: string;
  /** Reciprocity p-factor: corrected = metered^p */
  p_factor: number;
  /** Max metered time before correction needed (seconds) */
  threshold: number;
  notes?: string;
}

export const FILM_STOCKS: FilmStock[] = [
  // Ilford
  { name: "HP5+ 400", manufacturer: "Ilford", p_factor: 1.31, threshold: 1 },
  { name: "FP4+ 125", manufacturer: "Ilford", p_factor: 1.26, threshold: 1 },
  { name: "Delta 100", manufacturer: "Ilford", p_factor: 1.26, threshold: 1 },
  { name: "Delta 400", manufacturer: "Ilford", p_factor: 1.41, threshold: 1 },
  { name: "Delta 3200", manufacturer: "Ilford", p_factor: 1.33, threshold: 1 },
  { name: "Pan F+ 50", manufacturer: "Ilford", p_factor: 1.33, threshold: 1 },
  { name: "XP2 Super", manufacturer: "Ilford", p_factor: 1.31, threshold: 1 },
  { name: "Ortho Plus", manufacturer: "Ilford", p_factor: 1.26, threshold: 1 },

  // Kodak
  { name: "Tri-X 400", manufacturer: "Kodak", p_factor: 1.54, threshold: 1 },
  { name: "T-Max 100", manufacturer: "Kodak", p_factor: 1.15, threshold: 1 },
  { name: "T-Max 400", manufacturer: "Kodak", p_factor: 1.24, threshold: 1 },
  { name: "T-Max P3200", manufacturer: "Kodak", p_factor: 1.30, threshold: 1 },
  { name: "Portra 160", manufacturer: "Kodak", p_factor: 1.30, threshold: 1, notes: "Color — develop C-41" },
  { name: "Portra 400", manufacturer: "Kodak", p_factor: 1.30, threshold: 1, notes: "Color — develop C-41" },
  { name: "Ektar 100", manufacturer: "Kodak", p_factor: 1.30, threshold: 1, notes: "Color — develop C-41" },
  { name: "Gold 200", manufacturer: "Kodak", p_factor: 1.30, threshold: 1, notes: "Color — develop C-41" },

  // Fujifilm
  { name: "Acros 100 II", manufacturer: "Fujifilm", p_factor: 1.0, threshold: 120, notes: "No correction needed under 120s" },
  { name: "Provia 100F", manufacturer: "Fujifilm", p_factor: 1.35, threshold: 1, notes: "Slide film — develop E-6" },
  { name: "Velvia 50", manufacturer: "Fujifilm", p_factor: 1.40, threshold: 1, notes: "Slide film — develop E-6" },

  // Fomapan
  { name: "Fomapan 100", manufacturer: "Fomapan", p_factor: 1.60, threshold: 1 },
  { name: "Fomapan 200", manufacturer: "Fomapan", p_factor: 1.50, threshold: 1 },
  { name: "Fomapan 400", manufacturer: "Fomapan", p_factor: 1.50, threshold: 1 },

  // Others
  { name: "CineStill 800T", manufacturer: "CineStill", p_factor: 1.30, threshold: 1, notes: "Tungsten balanced" },
  { name: "Rollei RPX 100", manufacturer: "Rollei", p_factor: 1.30, threshold: 1 },
  { name: "Rollei RPX 400", manufacturer: "Rollei", p_factor: 1.30, threshold: 1 },
  { name: "Kentmere 100", manufacturer: "Kentmere", p_factor: 1.30, threshold: 1 },
  { name: "Kentmere 400", manufacturer: "Kentmere", p_factor: 1.30, threshold: 1 },
];

/** Calculate corrected exposure time using reciprocity formula */
export function calculate_reciprocity(metered_seconds: number, film: FilmStock): {
  corrected_seconds: number;
  correction_stops: number;
} {
  if (metered_seconds <= film.threshold) {
    return { corrected_seconds: metered_seconds, correction_stops: 0 };
  }

  const corrected = Math.pow(metered_seconds, film.p_factor);
  const correction_stops = Math.log2(corrected / metered_seconds);

  return {
    corrected_seconds: Math.round(corrected * 10) / 10,
    correction_stops: Math.round(correction_stops * 10) / 10,
  };
}

/** Apply ND filter factor to metered time */
export function apply_nd_filter(metered_seconds: number, filter_stops: number): number {
  return metered_seconds * Math.pow(2, filter_stops);
}

/** Group film stocks by manufacturer */
export function group_by_manufacturer(): Record<string, FilmStock[]> {
  const groups: Record<string, FilmStock[]> = {};
  for (const film of FILM_STOCKS) {
    if (!groups[film.manufacturer]) groups[film.manufacturer] = [];
    groups[film.manufacturer].push(film);
  }
  return groups;
}
