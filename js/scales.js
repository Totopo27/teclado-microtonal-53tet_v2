// js/scales.js
// Definición de escalas adaptadas al temperamento 53-TET

// En 53-TET:
// - Coma pitagórica = 1 paso (~23 centavos)
// - Semitono cromático = 4 pasos (~91 centavos)
// - Semitono diatónico = 5 pasos (~113 centavos)
// - Tono = 9 pasos (~204 centavos)
// - Tercera menor = 13 pasos (~294 centavos)
// - Tercera Mayor = 17 pasos (~385 centavos)
// - Cuarta justa = 22 pasos (~498 centavos)
// - Quinta Justa = 31 pasos (~702 centavos)
// - Sexta mayor = 40 pasos (~906 centavos)
// - Séptima mayor = 49 pasos (~1109 centavos)

// El 53-TET es especialmente notable por su precisión:
// - Aproxima la quinta justa con error de solo 0.07 centavos
// - Aproxima la tercera mayor pura con error de 1.4 centavos
// - Un paso representa casi exactamente la coma pitagórica
// - Es el temperamento más preciso para música occidental tradicional

// Mapeo de escalas musicales en 53-TET
const scales = {
  // ========== MODOS GRIEGOS ==========
  // Patrón Mayor: T-T-s-T-T-T-s (9-9-5-9-9-9-4)
  ionian: [0, 9, 18, 22, 31, 40, 49], // Do Mayor (Jónico)
  
  // Dórico: T-s-T-T-T-s-T (9-4-9-9-9-4-9)
  dorian: [0, 9, 13, 22, 31, 40, 44],
  
  // Frigio: s-T-T-T-s-T-T (4-9-9-9-4-9-9)
  phrygian: [0, 4, 13, 22, 31, 35, 44],
  
  // Lidio: T-T-T-s-T-T-s (9-9-9-4-9-9-4)
  lydian: [0, 9, 18, 27, 31, 40, 49],
  
  // Mixolidio: T-T-s-T-T-s-T (9-9-4-9-9-4-9)
  mixolydian: [0, 9, 18, 22, 31, 40, 44],
  
  // Eólico (Menor Natural): T-s-T-T-s-T-T (9-4-9-9-4-9-9)
  aeolian: [0, 9, 13, 22, 31, 35, 44],
  
  // Locrio: s-T-T-s-T-T-T (4-9-9-4-9-9-9)
  locrian: [0, 4, 13, 22, 26, 35, 44],

  // ========== ESCALAS ESPECIALES ==========
  // Cromática: todas las 53 notas del sistema
  chromatic: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52
  ],
  
  // Tonos Enteros: 6 notas separadas por tonos completos (9 pasos)
  // Do-Re-Mi-Fa#-Sol#-La#
  wholeTone: [0, 9, 18, 27, 36, 45],
  
  // Pentatónica Mayor: Do-Re-Mi-Sol-La
  // Intervalos: T+T (9+9) - T (9) - m3+s (9+4) - T (9)
  // Total: 18-9-13-9 desde Do
  pentatonicMajor: [0, 9, 18, 31, 40],
  
  // Pentatónica Menor: La-Do-Re-Mi-Sol (relativo de Do Mayor pentatónico)
  // Desde Do: Do-Mib-Fa-Sol-Sib
  // Intervalos: m3-T-T-m3-T
  pentatonicMinor: [0, 13, 22, 31, 44],
  
  // Blues: Pentatónica menor + tritono (#4/b5)
  // Do-Mib-Fa-Solb-Sol-Sib
  // Añade el tritono (26 pasos) entre Fa y Sol
  blues: [0, 13, 22, 26, 31, 44],
  
  // Armónica Menor: T-s-T-T-s-3A-s (9-4-9-9-4-13-4)
  // Do-Re-Mib-Fa-Sol-Lab-Si-Do
  // La segunda aumentada entre Lab (35) y Si (49) es característica
  harmonicMinor: [0, 9, 13, 22, 31, 35, 49]
};

// Nombres legibles de las escalas para la interfaz
const scaleNames = {
  none: 'Ninguna',
  ionian: 'Jónico (Mayor)',
  dorian: 'Dórico',
  phrygian: 'Frigio',
  lydian: 'Lidio',
  mixolydian: 'Mixolidio',
  aeolian: 'Eólico (Menor)',
  locrian: 'Locrio',
  chromatic: 'Cromática (53 notas)',
  wholeTone: 'Tonos Enteros',
  pentatonicMajor: 'Pentatónica Mayor',
  pentatonicMinor: 'Pentatónica Menor',
  blues: 'Blues',
  harmonicMinor: 'Armónica Menor'
};
