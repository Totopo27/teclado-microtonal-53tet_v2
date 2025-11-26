/**
 * Microtonal WebSocket Client
 * Módulo para conectar teclados microtonales web con Max MSP via WebSocket-OSC
 * Integra con los teclados existentes (19-TET, 31-TET, 41-TET, 53-TET)
 */

class MicrotonalWebSocketClient {
    constructor(options = {}) {
        this.wsUrl = options.wsUrl || 'ws://localhost:8080';
        this.tetSystem = options.tetSystem || '31-TET';
        this.autoReconnect = options.autoReconnect !== false;
        this.reconnectDelay = options.reconnectDelay || 3000;

        this.ws = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 10;

        // Callbacks
        this.onConnected = options.onConnected || (() => { });
        this.onDisconnected = options.onDisconnected || (() => { });
        this.onError = options.onError || console.error;
        this.onMessage = options.onMessage || (() => { });

        this.init();
    }

    init() {
        this.connect();
    }

    connect() {
        try {
            console.log(`[+] Conectando a ${this.wsUrl}...`);
            this.ws = new WebSocket(this.wsUrl);

            this.ws.onopen = (event) => {
                console.log('✅ Conectado al puente OSC');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.onConnected(event);
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.onMessage(message);
                } catch (error) {
                    console.error('❌ Error parseando mensaje:', error);
                }
            };

            this.ws.onclose = (event) => {
                console.log('[-] Conexión cerrada:', event.code, event.reason);
                this.isConnected = false;
                this.onDisconnected(event);

                // Auto-reconexión
                if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`[>>] Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts}) en ${this.reconnectDelay}ms...`);
                    setTimeout(() => this.connect(), this.reconnectDelay);
                }
            };

            this.ws.onerror = (error) => {
                console.error('❌ Error WebSocket:', error);
                this.onError(error);
            };

        } catch (error) {
            console.error('❌ Error creando WebSocket:', error);
            this.onError(error);
        }
    }

    disconnect() {
        this.autoReconnect = false;
        if (this.ws) {
            this.ws.close();
        }
    }

    send(message) {
        if (this.isConnected && this.ws) {
            try {
                this.ws.send(JSON.stringify(message));
                return true;
            } catch (error) {
                console.error('❌ Error enviando mensaje:', error);
                return false;
            }
        } else {
            console.warn('⚠️  No conectado. Mensaje no enviado:', message.type);
            return false;
        }
    }

    // Métodos específicos para eventos microtonales

    sendNoteOn(noteId, frequency, velocity = 127, noteName = '', octave = 0) {
        return this.send({
            type: 'note_on',
            noteId: noteId,
            frequency: frequency,
            velocity: velocity,
            noteName: noteName,
            octave: octave,
            tetSystem: this.tetSystem,
            timestamp: Date.now()
        });
    }

    sendNoteOff(noteId, frequency, noteName = '') {
        return this.send({
            type: 'note_off',
            noteId: noteId,
            frequency: frequency,
            velocity: 0, // Velocity siempre 0 en note_off
            noteName: noteName,
            tetSystem: this.tetSystem,
            timestamp: Date.now()
        });
    }

    sendFrequencyData(frequency, noteName, tetPosition, octave = 0) {
        return this.send({
            type: 'frequency_data',
            frequency: frequency,
            noteName: noteName,
            tetPosition: tetPosition,
            octave: octave,
            tetSystem: this.tetSystem,
            timestamp: Date.now()
        });
    }

    sendPolyphonyUpdate(activeNotes) {
        const frequencies = activeNotes.map(note => note.frequency);
        const noteIds = activeNotes.map(note => note.id);

        return this.send({
            type: 'polyphony_update',
            activeNotesCount: activeNotes.length,
            activeFrequencies: frequencies,
            activeNoteIds: noteIds,
            activeNotes: activeNotes,
            tetSystem: this.tetSystem,
            timestamp: Date.now()
        });
    }

    sendScaleChange(scaleName, scaleNotes = []) {
        return this.send({
            type: 'scale_change',
            scaleName: scaleName,
            scaleNotes: scaleNotes,
            scaleLength: scaleNotes.length,
            tetSystem: this.tetSystem,
            timestamp: Date.now()
        });
    }

    sendOctaveChange(octaveShift) {
        return this.send({
            type: 'octave_change',
            octaveShift: octaveShift,
            tetSystem: this.tetSystem,
            timestamp: Date.now()
        });
    }

    sendCustomMessage(oscAddress, args) {
        return this.send({
            type: 'custom',
            oscAddress: oscAddress,
            args: args,
            tetSystem: this.tetSystem,
            timestamp: Date.now()
        });
    }
}

/**
 * Función de utilidad para integrar fácilmente con teclados existentes
 * Detecta automáticamente el sistema TET desde el título de la página
 */
function createMicrotonalOSCBridge(options = {}) {
    // Detectar sistema TET automáticamente
    let tetSystem = options.tetSystem;
    if (!tetSystem) {
        const title = document.title;
        const tetMatch = title.match(/(\d+)-TET/);
        tetSystem = tetMatch ? `${tetMatch[1]}-TET` : '31-TET';
    }

    console.log(`[>] Iniciando puente OSC para ${tetSystem}`);

    return new MicrotonalWebSocketClient({
        ...options,
        tetSystem: tetSystem,
        onConnected: (event) => {
            console.log('✅ Teclado conectado a Max MSP');
            // Mostrar indicador de conexión en la UI
            showConnectionStatus(true);
            if (options.onConnected) options.onConnected(event);
        },
        onDisconnected: (event) => {
            console.log('❌ Teclado desconectado de Max MSP');
            showConnectionStatus(false);
            if (options.onDisconnected) options.onDisconnected(event);
        },
        onError: (error) => {
            console.error('❌ Error en puente OSC:', error);
            showConnectionStatus(false, 'Error de conexión');
            if (options.onError) options.onError(error);
        }
    });
}

/**
 * Mostrar estado de conexión en la UI
 */
function showConnectionStatus(connected, message = '') {
    // Buscar o crear elemento de estado
    let statusElement = document.getElementById('osc-connection-status');

    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'osc-connection-status';
        statusElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(statusElement);
    }

    if (connected) {
        statusElement.textContent = '[OK] Max MSP Conectado';
        statusElement.style.backgroundColor = '#2ecc71';
        statusElement.style.color = 'white';
    } else {
        statusElement.textContent = message || '[XX] Max MSP Desconectado';
        statusElement.style.backgroundColor = '#e74c3c';
        statusElement.style.color = 'white';
    }
}

/**
 * Función para integrar con los teclados existentes
 * Modifica las funciones de nota existentes para enviar datos via OSC
 */
function integrateMicrotonalKeyboard() {
    const bridge = createMicrotonalOSCBridge();

    // Variables para rastrear estado
    let currentOctaveShift = 0;
    let currentScale = 'none';
    let activeNotes = new Map(); // Map para rastrear notas activas

    // Override de funciones existentes del teclado
    const originalPlayNote = window.playNote;
    const originalStopNote = window.stopNote;
    const originalTransposeOctave = window.transposeOctave;
    const originalApplyScale = window.applyScale;

    // Intercepción de playNote
    if (originalPlayNote) {
        window.playNote = function (...args) {
            let frequency, noteId, noteName, velocity = 127;

            // Detectar firma: (config) vs (frequency, noteId, noteName, velocity)
            if (typeof args[0] === 'object' && args[0] !== null && args[0].value !== undefined) {
                // Firma: playNote(config) usada en los proyectos
                const config = args[0];
                noteId = config.value;
                noteName = config.name;

                // Calcular frecuencia usando la función global del proyecto si existe
                if (typeof window.getFrequency === 'function') {
                    frequency = window.getFrequency(config.value);
                } else {
                    frequency = 440; // Fallback
                }

                // Sincronizar octava con la global del proyecto
                if (typeof window.currentOctave !== 'undefined') {
                    currentOctaveShift = window.currentOctave;
                }
            } else {
                // Firma legacy/directa: playNote(frequency, noteId, noteName, velocity)
                [frequency, noteId, noteName, velocity] = args;
                if (velocity === undefined) velocity = 127;
            }

            // Enviar a Max MSP
            bridge.sendNoteOn(noteId, frequency, velocity, noteName, currentOctaveShift);

            // Rastrear nota activa
            activeNotes.set(noteId, {
                id: noteId,
                frequency: frequency,
                noteName: noteName,
                velocity: velocity,
                startTime: Date.now()
            });

            // Actualizar polifonía
            bridge.sendPolyphonyUpdate(Array.from(activeNotes.values()));

            // Llamar función original con los argumentos originales
            return originalPlayNote.apply(this, args);
        };
    }

    // Intercepción de stopNote
    if (originalStopNote) {
        window.stopNote = function (...args) {
            let frequency, noteId, noteName;

            // Detectar firma
            if (typeof args[0] === 'object' && args[0] !== null && args[0].value !== undefined) {
                // Firma: stopNote(config)
                const config = args[0];
                noteId = config.value;
                noteName = config.name;

                if (typeof window.getFrequency === 'function') {
                    frequency = window.getFrequency(config.value);
                }
            } else {
                // Firma legacy: stopNote(frequency, noteId, noteName)
                [frequency, noteId, noteName] = args;
            }

            // Enviar a Max MSP con velocity 0
            bridge.sendNoteOff(noteId, frequency, noteName);

            // Remover de notas activas
            activeNotes.delete(noteId);

            // Actualizar polifonía
            bridge.sendPolyphonyUpdate(Array.from(activeNotes.values()));

            // Llamar función original
            return originalStopNote.apply(this, args);
        };
    }

    // Intercepción de cambios de octava
    if (originalTransposeOctave) {
        window.transposeOctave = function (direction) {
            const result = originalTransposeOctave.call(this, direction);

            // Intentar leer la octava global actualizada
            if (typeof window.currentOctave !== 'undefined') {
                currentOctaveShift = window.currentOctave;
            } else {
                // Fallback a tracking local
                if (direction === 'up') currentOctaveShift++;
                else if (direction === 'down') currentOctaveShift--;
                else if (direction === 'reset') currentOctaveShift = 0;
            }

            bridge.sendOctaveChange(currentOctaveShift);

            return result;
        };
    }

    // Intercepción de cambios de escala
    if (originalApplyScale) {
        window.applyScale = function (scaleName, scaleData) {
            const result = originalApplyScale.call(this, scaleName, scaleData);

            currentScale = scaleName;
            bridge.sendScaleChange(scaleName, scaleData || []);

            return result;
        };
    }

    // Listeners para controles UI
    document.addEventListener('DOMContentLoaded', () => {
        // Detectar cambios en selector de escala
        const scaleSelector = document.getElementById('scale-selector');
        if (scaleSelector) {
            scaleSelector.addEventListener('change', (e) => {
                currentScale = e.target.value;
                bridge.sendScaleChange(currentScale);
            });
        }

        // Detectar cambios de octava con botones
        // Nota: Agregamos listeners adicionales a los botones existentes
        // para asegurar que se capturen los clics incluso si no se usa transposeOctave
        const octaveUp = document.getElementById('octave-up');
        const octaveDown = document.getElementById('octave-down');
        const octaveReset = document.getElementById('reset-octave');

        if (octaveUp) {
            octaveUp.addEventListener('click', () => {
                setTimeout(() => {
                    if (typeof window.currentOctave !== 'undefined') {
                        currentOctaveShift = window.currentOctave;
                    } else {
                        currentOctaveShift++;
                    }
                    bridge.sendOctaveChange(currentOctaveShift);
                }, 10);
            });
        }

        if (octaveDown) {
            octaveDown.addEventListener('click', () => {
                setTimeout(() => {
                    if (typeof window.currentOctave !== 'undefined') {
                        currentOctaveShift = window.currentOctave;
                    } else {
                        currentOctaveShift--;
                    }
                    bridge.sendOctaveChange(currentOctaveShift);
                }, 10);
            });
        }

        if (octaveReset) {
            octaveReset.addEventListener('click', () => {
                setTimeout(() => {
                    currentOctaveShift = 0;
                    bridge.sendOctaveChange(currentOctaveShift);
                }, 10);
            });
        }
    });

    return bridge;
}

// Export para uso en navegador
window.MicrotonalWebSocketClient = MicrotonalWebSocketClient;
window.createMicrotonalOSCBridge = createMicrotonalOSCBridge;
window.integrateMicrotonalKeyboard = integrateMicrotonalKeyboard;

// Auto-inicialización si se detecta un teclado microtonal
document.addEventListener('DOMContentLoaded', () => {
    if (document.title.includes('-TET') && typeof window.playNote === 'function') {
        console.log('[>] Teclado microtonal detectado, iniciando integración OSC...');
        integrateMicrotonalKeyboard();
    }
});
