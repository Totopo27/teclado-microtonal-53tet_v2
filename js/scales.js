// js/scales.js
// Definición de escalas musicales para 19-TET

// Escalas musicales (modos griegos adaptados a 19-TET)
// En 19-TET: 1 octava = 19 pasos, intervalos aproximados: T=3, t=3, s=2
const scales = {
  none: [],
  ionian: [0, 3, 6, 8, 11, 14, 17],        // Do Re Mi Fa Sol La Si (T T s T T T s)
  dorian: [0, 3, 5, 8, 11, 14, 16],        // Do Re Mib Fa Sol La Sib (T s T T T s T)
  phrygian: [0, 2, 5, 8, 11, 13, 16],      // Do Reb Mib Fa Sol Lab Sib (s T T T s T T)
  lydian: [0, 3, 6, 9, 11, 14, 17],        // Do Re Mi Fa# Sol La Si (T T T s T T s)
  mixolydian: [0, 3, 6, 8, 11, 14, 16],    // Do Re Mi Fa Sol La Sib (T T s T T s T)
  aeolian: [0, 3, 5, 8, 11, 13, 16],       // Do Re Mib Fa Sol Lab Sib (T s T T s T T)
  locrian: [0, 2, 5, 8, 10, 13, 16]        // Do Reb Mib Fa Solb Lab Sib (s T T s T T T)
};

// Nombres de escalas en español para la interfaz
const scaleNames = {
  none: 'Ninguna',
  ionian: 'Jónico (Mayor)',
  dorian: 'Dórico',
  phrygian: 'Frigio',
  lydian: 'Lidio',
  mixolydian: 'Mixolidio',
  aeolian: 'Eólico (Menor)',
  locrian: 'Locrio'
};
