// js/app.js
// Inicialización y gestión de eventos para 53-TET

document.addEventListener('DOMContentLoaded', function() {
  // Generar teclado al cargar
  generateKeyboard();
  
  // Controles de octava
  document.getElementById('octave-up').addEventListener('click', () => {
    currentOctave = Math.min(currentOctave + 1, 2);
    document.getElementById('current-octave').textContent = currentOctave;
  });

  document.getElementById('octave-down').addEventListener('click', () => {
    currentOctave = Math.max(currentOctave - 1, -2);
    document.getElementById('current-octave').textContent = currentOctave;
  });

  document.getElementById('reset-octave').addEventListener('click', () => {
    currentOctave = 0;
    document.getElementById('current-octave').textContent = 0;
  });

  // Selector de escala
  document.getElementById('scale-selector').addEventListener('change', (e) => {
    const selectedScale = e.target.value;
    
    if (combineMode) {
      if (selectedScale !== 'none') {
        combinedScales.add(selectedScale);
        updateCombinedScalesList();
        e.target.value = 'none';
      }
    } else {
      currentScale = selectedScale;
      combinedScales.clear();
      updateCombinedScalesList();
    }
    
    updateScaleDisplay();
  });

  // Checkbox de combinación de escalas
  document.getElementById('combine-scales').addEventListener('change', (e) => {
    combineMode = e.target.checked;
    const combinationPanel = document.getElementById('scale-combination');
    
    if (combineMode) {
      combinationPanel.style.display = 'block';
      if (currentScale !== 'none') {
        combinedScales.add(currentScale);
      }
    } else {
      combinationPanel.style.display = 'none';
      if (combinedScales.size > 0) {
        currentScale = Array.from(combinedScales).pop();
        document.getElementById('scale-selector').value = currentScale;
      }
      combinedScales.clear();
    }
    
    updateCombinedScalesList();
    updateScaleDisplay();
  });

  // Botón de limpiar escalas
  document.getElementById('clear-scales').addEventListener('click', () => {
    combinedScales.clear();
    currentScale = 'none';
    document.getElementById('scale-selector').value = 'none';
    updateCombinedScalesList();
    updateScaleDisplay();
  });

  // Mapeo QWERTY para 53 notas (32 teclas mapeadas)
  const keyMap = {
    // Fila numérica: Notas 44b-52b + 0b (10 teclas)
    '1': '44b', '2': '45b', '3': '46b', '4': '47b', '5': '48b',
    '6': '49b', '7': '50b', '8': '51b', '9': '52b', '0': '0b',
    
    // Fila QWERTY: Notas 1b-12b (12 teclas con [ y ])
    'q': '1b', 'w': '2b', 'e': '3b', 'r': '4b', 't': '5b',
    'y': '6b', 'u': '7b', 'i': '8b', 'o': '9b', 'p': '10b',
    '[': '11b', ']': '12b',
    
    // Fila ASDF: Notas 13b-21b (9 teclas)
    'a': '13b', 's': '14b', 'd': '15b', 'f': '16b', 'g': '17b',
    'h': '18b', 'j': '19b', 'k': '20b', 'l': '21b',
    
    // Fila ZXCV: Notas 22m-31m (10 teclas)
    'z': '22m', 'x': '23m', 'c': '24m', 'v': '25m', 'b': '26m',
    'n': '27m', 'm': '28m', ',': '29m', '.': '30m', '/': '31m'
  };

  // Teclas de control
  const controlKeys = {
    'ArrowUp': 'octave-up',
    'ArrowDown': 'octave-down',
    ' ': 'reset-octave'
  };

  const pressedKeys = new Set();

  // Manejo de teclas presionadas
  document.addEventListener('keydown', (e) => {
    // Prevenir comportamiento por defecto de teclas de control
    if (controlKeys[e.key]) {
      e.preventDefault();
    }

    // Manejar teclas de control
    if (controlKeys[e.key] && !pressedKeys.has(e.key)) {
      pressedKeys.add(e.key);
      const buttonId = controlKeys[e.key];
      document.getElementById(buttonId).click();
      
      // Feedback visual
      const button = document.getElementById(buttonId);
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 100);
      return;
    }

    // Manejar teclas de notas musicales
    const key = e.key.toLowerCase();
    if (keyMap[key] && !pressedKeys.has(key)) {
      pressedKeys.add(key);
      const config = keyConfigurations.find(c => c.id === keyMap[key]);
      if (config) {
        playNote(config);
      }
    }
  });

  // Manejo de teclas liberadas
  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    
    // Liberar teclas de control
    if (controlKeys[e.key]) {
      pressedKeys.delete(e.key);
      return;
    }
    
    // Liberar teclas de notas
    if (keyMap[key]) {
      pressedKeys.delete(key);
      const config = keyConfigurations.find(c => c.id === keyMap[key]);
      if (config) {
        stopNote(config);
      }
    }
  });

  // Mostrar ayuda de teclado en consola
  showKeyboardHelp();
});

// Función para mostrar ayuda de teclado en consola
function showKeyboardHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║          CONTROLES DE TECLADO QWERTY - 53-TET                    ║
╠══════════════════════════════════════════════════════════════════╣
║   OCTAVA PARCIAL (32 notas mapeadas de 75 totales)              ║
║                                                                  ║
║  CONTROLES DE OCTAVA:                                            ║
║  ↑ Flecha Arriba   → +8va (subir octava)                        ║
║  ↓ Flecha Abajo    → -8va (bajar octava)                        ║
║  Espacio           → Reset octava a 0                            ║
╠══════════════════════════════════════════════════════════════════╣
║   DISTRIBUCIÓN DE TECLAS MUSICALES:                              ║
║                                                                  ║
║   Fila 1-0:   Notas 44-52 (octava anterior) + nota 0            ║
║   [1][2][3][4][5][6][7][8][9][0]                                ║
║   44 45 46 47 48 49 50 51 52  0                                 ║
║                                                                  ║
║   Fila Q-]:   Notas 1-12 (octava baja)                          ║
║   [Q][W][E][R][T][Y][U][I][O][P][[]]                            ║
║    1  2  3  4  5  6  7  8  9 10 11 12                           ║
║                                                                  ║
║   Fila A-L:   Notas 13-21 (octava baja)                         ║
║   [A][S][D][F][G][H][J][K][L]                                   ║
║   13 14 15 16 17 18 19 20 21                                    ║
║                                                                  ║
║   Fila Z-/:   Notas 22-31 (octava media)                        ║
║   [Z][X][C][V][B][N][M][,][.][/]                                ║
║   22 23 24 25 26 27 28 29 30 31                                 ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║   TIPS:                                                          ║
║   • Mantén varias teclas presionadas para acordes polifónicos   ║
║   • Usa las flechas mientras tocas para transposición dinámica  ║
║   • El resto de notas (32-52m y 0-22a) se tocan con el ratón   ║
║   • Presiona F12 para ver esta ayuda en la consola del navegador║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    INFORMACIÓN TÉCNICA 53-TET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sistema: 53 divisiones iguales de la octava (53-TET / 53-EDO)
Intervalo por paso: ~22.64 centavos
Fórmula de frecuencia: f(n) = 27.5 × 2^(n/53)

Intervalos principales:
─────────────────────
• Semitono cromático:  4 pasos  (~90.6¢)  - Error: +5.2¢
• Semitono diatónico:  5 pasos  (~113.2¢) - Error: +1.2¢
• Tono:                9 pasos  (~203.8¢) - Error: -0.2¢
• Tercera menor:      13 pasos  (~294.3¢) - Error: -10.0¢
• Tercera mayor:      17 pasos  (~384.9¢) - Error: -1.4¢
• Cuarta justa:       22 pasos  (~498.1¢) - Error: +0.1¢
• Tritono:            26 pasos  (~588.7¢) - Error: -11.3¢
• Quinta justa:       31 pasos  (~701.9¢) - Error: -0.1¢  ★ EXCELENTE
• Sexta menor:        35 pasos  (~792.5¢) - Error: +7.6¢
• Sexta mayor:        40 pasos  (~905.7¢) - Error: +1.7¢
• Séptima menor:      44 pasos  (~996.2¢) - Error: -7.8¢
• Séptima mayor:      49 pasos (~1109.4¢) - Error: -2.6¢

Ventajas del 53-TET:
──────────────────
✓ Precisión excepcional en quintas justas (error: 0.07¢)
✓ Excelente aproximación de terceras mayores (error: 1.4¢)
✓ Un paso ≈ coma pitagórica (23.46¢)
✓ Compatible con notación tradicional occidental
✓ Ideal para música que requiere entonación justa
✓ Sistema históricamente significativo (siglo I a.C.)

Compositores y teóricos:
─────────────────────
• Jing Fang (siglo I a.C.) - Primera propuesta conocida
• Nicholas Mercator (siglo XVII) - Redescubrimiento en Europa
• Isaac Newton - Propuso sistema basado en 53 divisiones
• R.H.M. Bosanquet (1876) - Construyó armonio de 53 tonos
• Adriaan Fokker - Estudió y promovió el 53-TET
• Joel Mandelbaum - Compositor que usó extensivamente 53-TET

Colores de teclas:
────────────────
🟦 Blanco: Notas naturales (Do, Re, Mi, Fa, Sol, La, Si)
⬛ Gris:   Sostenidos y bemoles tradicionales (#, b)
🟦 Azul:   Microalteraciones (+, -)
🟩 Verde:  Neutrales (n) - entre natural y alterada

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total de teclas en el teclado: 75 hexagonales
Total de notas únicas: 85 (con solapamientos entre octavas)
Teclas mapeadas a QWERTY: 32 de 75

¡Explora las posibilidades microtonales del 53-TET! 🎹✨
  `);
}