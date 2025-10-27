# Teclado Microtonal 53-TET - Layout Hexagonal

Teclado hexagonal optimizado para el sistema de temperamento igual de 53 notas por octava (53-TET / 53-EDO) con disposición horizontal intuitiva.

## Características

- **Disposición hexagonal horizontal** optimizada para visualización de intervalos
- **Sistema 53-TET completo**: 115 teclas hexagonales distribuidas en 2 octavas
  - Octava baja: Notas 0-52 (rangos 172-224)
  - Octava alta: Notas 0-52 (rangos 225-277)
- **5 colores de teclas** para diferenciación microtonal:
  - ⬜ **Blanco**: Notas naturales (C, D, E, F, G, A, B)
  - ⬛ **Negro**: Sostenidos y bemoles tradicionales (#, b)
  - 🔵 **Azul**: Microalteraciones (+, -)
  - 🟢 **Verde**: Neutrales (n) - entre natural y alterada
  - 🟣 **Púrpura**: Microalteraciones extremas (##-, bb+)
- **Visualización de escalas** con resaltado de notas
- **Modo de combinación de escalas** para explorar superposiciones armónicas
- **Controles de transposición** de octava (+8va, -8va, Reset)
- **Monitor de polifonía en tiempo real**: 
  - Visualización de todas las notas activas simultáneamente
  - Contador de voces activas
  - Información de frecuencia y octava por cada nota
  - Chips de colores según la octava
  - Orden cronológico de notas pulsadas
- **Información monofónica**: Muestra la última nota tocada
- **Integración con Max/MSP** mediante `window.max.outlet()`
- **Soporte parcial de teclado QWERTY** (32 teclas mapeadas + controles)

## Estructura del Proyecto

```
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos CSS con soporte responsive
├── js/
│   ├── config.js           # Configuración de teclas y frecuencias
│   ├── scales.js           # Definición de escalas musicales
│   ├── keyboard.js         # Lógica del teclado hexagonal
│   └── app.js              # Inicialización y eventos
├── LICENSE                 # Licencia MIT
└── README.md               # Este archivo
```

## Uso

### Online
Simplemente abre `index.html` en tu navegador web moderno.

### Con Max/MSP
El teclado se integra automáticamente con Max/MSP cuando se ejecuta dentro del entorno Max. 
Los datos MIDI se envían mediante:
```javascript
window.max.outlet(adjustedValue, noteName, velocity);
```

## Escalas incluidas

### Modos Griegos (adaptados a 53-TET)
- **Jónico (Mayor)**: C-D-E-F-G-A-B
- **Dórico**: C-D-Eb-F-G-A-Bb
- **Frigio**: C-Db-Eb-F-G-Ab-Bb
- **Lidio**: C-D-E-F#-G-A-B
- **Mixolidio**: C-D-E-F-G-A-Bb
- **Eólico (Menor)**: C-D-Eb-F-G-Ab-Bb
- **Locrio**: C-Db-Eb-F-Gb-Ab-Bb

### Escalas Especiales
- **Cromática**: Las 53 notas del sistema
- **Tonos Enteros**: 6 notas separadas por tonos enteros
- **Pentatónica Mayor**: 5 notas en modo mayor
- **Pentatónica Menor**: 5 notas en modo menor
- **Blues**: Escala blues de 6 notas
- **Armónica Menor**: Escala armónica menor de 7 notas

## Controles

### Ratón/Touch
- **Clic en tecla**: Reproducir nota
- **Mantener presionado**: Nota sostenida
- **Hover**: Vista previa del color de activación
- **Clic en chip de nota**: Detener nota específica en modo polifonía
- **Soporte multi-touch**: Múltiples notas simultáneas en dispositivos táctiles

### Teclado QWERTY - Mapeo Parcial (32 notas)

```
┌──────────────────────────────────────────────────────────────────
│ Fila 1-0:  1  2  3  4  5  6  7  8  9  0                
│           C  C+ Cn C#- C# Db Db+ Dn- D- D         
│           (0) (1) (2) (3) (4) (5) (6) (7) (8) (9)
├──────────────────────────────────────────────────────────────────
│ Fila Q-]:  Q  W  E  R  T  Y  U  I  O  P  [  ]            
│           D+ Dn+ D#- D# Eb Eb+ En E- E E+ E# F-           
│           (10)(11)(12)(13)(14)(15)(16)(17)(18)(19)(20)(21)
├──────────────────────────────────────────────────────────────────
│ Fila A-;:  A  S  D  F  G  H  J  K  L  ;                  
│           F F+ Fn F#- F# Gb Gb+ Gn- G- G           
│           (22)(23)(24)(25)(26)(27)(28)(29)(30)(31)
└──────────────────────────────────────────────────────────────────
```

#### Controles de octava:
- **↑ Flecha Arriba**: +8va (subir octava)
- **↓ Flecha Abajo**: -8va (bajar octava)  
- **Barra Espaciadora**: Reset octava a 0

### Controles de interfaz
- **+8va / -8va**: Transponer octavas (también con flechas ↑↓)
- **Reset Octava**: Volver a octava base (también con Espacio)
- **Selector de escala**: Elegir escala o modo
- **Combinar escalas**: Activar modo de superposición de escalas
- **Limpiar escalas**: Resetear visualización de escalas

### Atajos útiles
- Mantén presionadas múltiples teclas para tocar acordes
- Usa las flechas mientras tocas para cambiar de octava en tiempo real
- El espacio te permite volver rápidamente a la octava central

## Disposición del teclado

- **Octava baja**: valores 172-224 (53 notas: 0-52)
- **Octava alta**: valores 225-277 (53 notas: 0-52)

**Total**: 115 teclas hexagonales (106 notas únicas)

## Información Técnica

### Sistema 53-TET
- **53 divisiones iguales de la octava** (53-EDO)
- **Intervalo por paso**: ~22.64 centavos
- **Fórmula de frecuencia**: f(n) = 27.5 × 2^(n/53)

### Intervalos principales
- **Quinta justa**: 31 pasos (~701.9¢) - Error: -0.1¢ ⭐ **EXCELENTE**
- **Tercera mayor**: 17 pasos (~384.9¢) - Error: -1.4¢
- **Cuarta justa**: 22 pasos (~498.1¢) - Error: +0.1¢
- **Tono**: 9 pasos (~203.8¢) - Error: -0.2¢
- **Semitono cromático**: 4 pasos (~90.6¢) - Error: +5.2¢
- **Semitono diatónico**: 5 pasos (~113.2¢) - Error: +1.2¢

### Ventajas del 53-TET
✓ **Precisión excepcional** en quintas justas (error: 0.07¢)  
✓ **Excelente aproximación** de terceras mayores (error: 1.4¢)  
✓ **Un paso ≈ coma pitagórica** (23.46¢)  
✓ **Compatible** con notación tradicional occidental  
✓ **Ideal** para música que requiere entonación justa  
✓ **Sistema históricamente significativo** (siglo I a.C.)  

## Compositores y usos del 53-TET

### Históricos
- **Jing Fang** (siglo I a.C.) - Matemático chino que propuso por primera vez la división en 53 partes
- **Nicholas Mercator** (siglo XVII) - Redescubrió el sistema en Europa
- **Isaac Newton** - Propuso un sistema musical basado en 53 divisiones
- **R.H.M. Bosanquet** (1876) - Construyó un armonio generalizado con 53 tonos

### Modernos
- **Adriaan Fokker** - Construyó un órgano de 31 tonos y estudió el 53-TET
- **Joel Mandelbaum** - Compositor estadounidense que utilizó extensivamente el 53-TET
- **Música experimental moderna** - Utilizado por diversos compositores para explorar armonías microtonales con precisión

## Desarrollo y Contribuciones

### Requisitos
- Navegador web moderno con soporte para ES6+
- Para integración Max/MSP: Max 8+

### Características técnicas
- **Responsive design** para desktop, tablet y móvil
- **Soporte multi-touch** nativo
- **API integrada** con Max/MSP
- **Visualización en tiempo real** de polifonía
- **Sistema de escalas modular** fácilmente extensible

## Licencia

MIT License - Ver archivo `LICENSE` para más detalles.

## Créditos

Desarrollado por **LuisAraya** basado en la teoría musical microtonal y el sistema de temperamento 53-TET.

---

**¡Explora las posibilidades microtonales del 53-TET!** 🎹✨

Para más información sobre teoría microtonal y el sistema 53-TET, consulta:
- [Xenharmonic Wiki](https://en.xen.wiki/w/53edo)
- [The Music Theory of Harry Partch](http://www.partch.info/)
- [Microtonal Resources](http://www.huygens-fokker.org/)
