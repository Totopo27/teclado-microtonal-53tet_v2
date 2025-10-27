// js/keyboard.js
// Lógica del teclado hexagonal para 53-TET

// Estado de la aplicación
let currentOctave = 0;
let activeKeys = new Map();
let currentScale = 'none';
let combineMode = false;
let combinedScales = new Set();

// Obtener octava real de una tecla basada en su valor
function getRealOctave(value) {
  // Las teclas base van del 172 al 277
  // 172-224 = octava 0 (notas 0-52 de octava central baja)
  // 225-277 = octava 1 (notas 0-52 de octava central alta)
  
  if (value >= 172 && value <= 224) return 0;
  if (value >= 225 && value <= 277) return 1;
  return 0;
}

// Calcular frecuencia con transposición de octava
function getFrequency(value) {
  // Ajustar el valor según la transposición de octava
  const adjustedValue = value + (currentOctave * 53);
  if (adjustedValue >= 0 && adjustedValue < arrayT53.length) {
    return arrayT53[adjustedValue];
  }
  return null;
}

// Generar teclado hexagonal
function generateKeyboard() {
  const container = document.getElementById('keyboard-container');
  container.innerHTML = '';
  
  keyConfigurations.forEach(config => {
    const hexagon = document.createElement('div');
    hexagon.className = 'hexagon';
    hexagon.id = config.id;
    hexagon.style.top = `${config.top}px`;
    hexagon.style.left = `${config.left}px`;
    
    const colorClass = `hexagon-in2-${config.color}`;
    const noteIndex = parseInt(config.text);
    
    hexagon.innerHTML = `
      <div class="hexagon-in1">
        <div class="hexagon-in2 ${colorClass}" data-value="${config.value}" data-name="${config.name}" data-note="${noteIndex}">
          <div class="hexagon-text">${config.text}</div>
        </div>
      </div>
    `;
    
    const innerHex = hexagon.querySelector('.hexagon-in2');
    
    // Eventos de mouse (para desktop)
    innerHex.addEventListener('mousedown', (e) => {
      e.preventDefault();
      playNote(config);
    });
    innerHex.addEventListener('mouseup', (e) => {
      e.preventDefault();
      stopNote(config);
    });
    innerHex.addEventListener('mouseleave', () => {
      if (activeKeys.has(config.id)) stopNote(config);
    });
    
    // Eventos táctiles (para móviles) - SOPORTE MULTI-TOUCH
    innerHex.addEventListener('touchstart', (e) => {
      e.preventDefault();
      playNote(config);
    }, { passive: false });
    
    innerHex.addEventListener('touchend', (e) => {
      e.preventDefault();
      stopNote(config);
    }, { passive: false });
    
    innerHex.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      stopNote(config);
    }, { passive: false });
    
    // Guardar referencia al elemento para acceso directo
    config.element = innerHex;
    
    container.appendChild(hexagon);
  });
  
  // Agregar listener global para manejar toques que salen del área
  document.addEventListener('touchend', handleGlobalTouchEnd);
  document.addEventListener('touchcancel', handleGlobalTouchEnd);
  
  updateScaleDisplay();
}

// Manejar cuando el toque sale completamente de la pantalla
function handleGlobalTouchEnd(e) {
  if (e.touches.length === 0) {
    // Opcional: descomentar si quieres que se detengan todas al levantar todos los dedos
  }
}

// Reproducir nota
function playNote(config) {
  if (activeKeys.has(config.id)) return;
  
  activeKeys.set(config.id, {
    config: config,
    timestamp: Date.now()
  });
  
  const element = document.getElementById(config.id).querySelector('.hexagon-in2');
  element.classList.add('active');
  
  const adjustedValue = config.value + (currentOctave * 53);
  const frequency = getFrequency(config.value);
  const realOctave = getRealOctave(config.value) + currentOctave;
  
  // Enviar a Max/MSP si está disponible
  if (window.max && typeof window.max.outlet === 'function') {
    window.max.outlet(adjustedValue, config.name, "127");
  }
  
  // Actualizar panel de información - ÚLTIMA NOTA (monofonía)
  document.getElementById('current-note').textContent = `${config.name} (${config.text})`;
  document.getElementById('current-freq').textContent = frequency ? frequency.toFixed(2) : '-';
  document.getElementById('current-octave').textContent = realOctave;
  
  // Actualizar monitor de polifonía
  updatePolyphonyDisplay();
}

// Detener nota
function stopNote(config) {
  if (!activeKeys.has(config.id)) return;
  
  activeKeys.delete(config.id);
  const element = document.getElementById(config.id).querySelector('.hexagon-in2');
  element.classList.remove('active');
  
  const adjustedValue = config.value + (currentOctave * 53);
  
  if (window.max && typeof window.max.outlet === 'function') {
    window.max.outlet(adjustedValue, config.name, "0");
  }
  
  // Actualizar monitor de polifonía
  updatePolyphonyDisplay();
}

// Actualizar display de polifonía
function updatePolyphonyDisplay() {
  const container = document.getElementById('active-notes-container');
  const counter = document.getElementById('poly-count');
  
  // Actualizar contador
  counter.textContent = activeKeys.size;
  
  // Limpiar contenedor
  container.innerHTML = '';
  
  // Si no hay notas activas
  if (activeKeys.size === 0) {
    container.innerHTML = '<span class="no-notes-message">No hay notas activas</span>';
    return;
  }
  
  // Convertir Map a Array y ordenar por timestamp (orden de pulsación)
  const activeNotesArray = Array.from(activeKeys.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp);
  
  // Crear chip para cada nota activa
  activeNotesArray.forEach(([keyId, data]) => {
    const config = data.config;
    const frequency = getFrequency(config.value);
    const realOctave = getRealOctave(config.value) + currentOctave;
    
    const chip = document.createElement('div');
    chip.className = 'note-chip';
    chip.setAttribute('data-octave', realOctave);
    chip.setAttribute('data-key', keyId);
    
    chip.innerHTML = `
      <span class="note-name">${config.name}</span>
      <span class="note-freq">${frequency ? frequency.toFixed(1) : '-'} Hz</span>
      <span class="note-octave">Oct ${realOctave}</span>
    `;
    
    // Animación de salida al hacer clic
    chip.addEventListener('click', () => {
      stopNote(config);
    });
    
    container.appendChild(chip);
  });
}

// Actualizar visualización de escala
function updateScaleDisplay() {
  // PASO 1: LIMPIAR ABSOLUTAMENTE TODO
  keyConfigurations.forEach(config => {
    if (config.element) {
      config.element.classList.remove('scale-highlight');
    }
  });

  // PASO 2: Determinar qué notas iluminar
  let allScaleNotes = new Set();
  
  if (combineMode && combinedScales.size > 0) {
    // Modo combinación: unir todas las escalas seleccionadas
    combinedScales.forEach(scaleName => {
      const scaleNotes = scales[scaleName] || [];
      scaleNotes.forEach(note => {
        allScaleNotes.add(note);
      });
    });
  } else if (currentScale !== 'none') {
    // Modo normal: solo la escala actual
    const scaleNotes = scales[currentScale] || [];
    scaleNotes.forEach(note => allScaleNotes.add(note));
  }
  
  // Convertir Set a Array ordenado
  const notesToHighlight = Array.from(allScaleNotes).sort((a, b) => a - b);
  
  // PASO 3: Aplicar el resaltado solo a las notas correspondientes
  if (notesToHighlight.length > 0) {
    keyConfigurations.forEach(config => {
      const noteIndex = parseInt(config.text);
      
      if (notesToHighlight.includes(noteIndex)) {
        if (config.element) {
          config.element.classList.add('scale-highlight');
        }
      }
    });
  }
}

// Actualizar lista de escalas combinadas
function updateCombinedScalesList() {
  const listContainer = document.getElementById('combined-scales-list');
  listContainer.innerHTML = '';
  
  if (combinedScales.size === 0) {
    listContainer.innerHTML = '<span style="color: #95a5a6;">No hay escalas combinadas</span>';
    return;
  }
  
  combinedScales.forEach(scaleName => {
    const tag = document.createElement('div');
    tag.className = 'scale-tag';
    tag.innerHTML = `
      ${scaleNames[scaleName] || scaleName}
      <span class="remove-scale" data-scale="${scaleName}">✕</span>
    `;
    
    tag.querySelector('.remove-scale').addEventListener('click', (e) => {
      e.stopPropagation();
      combinedScales.delete(scaleName);
      updateCombinedScalesList();
      updateScaleDisplay();
    });
    
    listContainer.appendChild(tag);
  });
}
