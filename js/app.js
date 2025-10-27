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

  // Mapeo QWERTY simplificado para el nuevo layout (32 teclas mapeadas)
  const keyMap = {
    // Fila numérica: primeras 10 notas de octava alta
    '1': '0', '2': '1', '3': '2', '4': '3', '5': '4',
    '6': '5', '7': '6', '8': '7', '9': '8', '0': '9',
    
    // Fila QWERTY: siguientes 12 notas
    'q': '10', 'w': '11', 'e': '12', 'r': '13', 't': '14',
    'y': '15', 'u': '16', 'i': '17', 'o': '18', 'p': '19',
    '[': '20', ']': '21',
    
    // Fila ASDF: siguientes 10 notas
    'a': '22', 's': '23', 'd': '24', 'f': '25', 'g': '26',
    'h': '27', 'j': '28', 'k': '29', 'l': '30', ';': '31'
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
║   LAYOUT HEXAGONAL (32 notas mapeadas de 115 totales)           ║
║                                                                  ║
║  CONTROLES DE OCTAVA:                                            ║
║  ↑ Flecha Arriba   → +8va (subir octava)                        ║
║  ↓ Flecha Abajo    → -8va (bajar octava)                        ║
║  Espacio           → Reset octava a 0                            ║
╠══════════════════════════════════════════════════════════════════╣
║   DISTRIBUCIÓN DE TECLAS MUSICALES:                              ║
║                                                                  ║
║   Fila 1-0:   Notas 0-9 (octava alta)                           ║
║   [1][2][3][4][5][6][7][8][9][0]                                ║
║    C C+ Cn C#- C# Db Db+ Dn- D- D                              ║
║                                                                  ║
║   Fila Q-]:   Notas 10-21                                       ║
║   [Q][W][E][R][T][Y][U][I][O][P][[]]                            ║
║   D+ Dn+ D#- D# Eb Eb+ En E- E E+ E#                            ║
║                                                                  ║
║   Fila A-;:   Notas 22-31                                       ║
║   [A][S][D][F][G][H][J][K][L][;]                                ║
║    F F+ Fn F#- F# Gb Gb+ Gn- G- G                              ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║   TIPS:                                                          ║
║   • Mantén varias teclas presionadas para acordes polifónicos   ║
║   • Usa las flechas mientras tocas para transposición dinámica  ║
║   • El resto de notas se tocan con el ratón/touch               ║
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
⬜ Blanco:  Notas naturales (C, D, E, F, G, A, B)
⬛ Negro:   Sostenidos y bemoles tradicionales (#, b)
🔵 Azul:    Microalteraciones (+, -)
🟢 Verde:   Neutrales (n) - entre natural y alterada
🟣 Púrpura: Microalteraciones extremas (##-, bb+)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total de teclas en el teclado: 115 hexagonales (layout optimizado)
Total de notas únicas: 53 por octava
Teclas mapeadas a QWERTY: 32 de 115

¡Explora las posibilidades microtonales del 53-TET! 🎹✨
  `);
}
