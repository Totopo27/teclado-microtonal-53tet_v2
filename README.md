# Teclado Microtonal 53-TET

Teclado hexagonal optimizado para el sistema de temperamento igual de 53 notas por octava (53-TET / 53-EDO) con disposición horizontal.

## Características

- **Disposición hexagonal horizontal** optimizada para visualización de intervalos
- **Sistema 53-TET completo**: 115 teclas hexagonales distribuidas en 2 octavas
  - Octava baja: Notas 0-52 (rangos 172-224)
  - Octava alta: Notas 0-52 (rangos 225-277)
- **5 colores de teclas** para diferenciación microtonal:
  - **Blanco**: Notas naturales (C, D, E, F, G, A, B)
  - **Negro**: Sostenidos y bemoles tradicionales (#, b)
  - **Azul**: Microalteraciones (+, -)
  - **Verde**: Neutrales (n) - entre natural y alterada
  - **Púrpura**: Microalteraciones extremas (##-, bb+)
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

## Uso

### Online
Abre `index.html` en tu navegador web.

## Escalas incluidas (trabajo en proceso)
 
### Modos Griegos (adaptados a 53-TET)
- **Jónico (Mayor)**: C-D-E-F-G-A-B
- **Dórico**: C-D-Eb-F-G-A-Bb
- **Frigio**: C-Db-Eb-F-G-Ab-Bb
- **Lidio**: C-D-E-F#-G-A-B
- **Mixolidio**: C-D-E-F-G-A-Bb
- **Eólico (Menor)**: C-D-Eb-F-G-Ab-Bb
- **Locrio**: C-Db-Eb-F-Gb-Ab-Bb

### Escalas Especiales (trabajo en proceso)
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
- **Octava alta**: valores 225-277 (54 notas: 0-52-0)

**Total**: 116 teclas hexagonales (107 notas únicas)

## Información Técnica

### Sistema 53-TET
- **53 divisiones iguales de la octava** (53-EDO)
- **Intervalo por paso**: ~22.64 centavos
- **Fórmula de frecuencia**: f(n) = 27.5 × 2^(n/53)

### Intervalos principales
- **Quinta justa**: 31 pasos (~701.9¢) - Error: -0.1¢ 
- **Tercera mayor**: 17 pasos (~384.9¢) - Error: -1.4¢
- **Cuarta justa**: 22 pasos (~498.1¢) - Error: +0.1¢
- **Tono**: 9 pasos (~203.8¢) - Error: -0.2¢
- **Semitono cromático**: 4 pasos (~90.6¢) - Error: +5.2¢
- **Semitono diatónico**: 5 pasos (~113.2¢) - Error: +1.2¢
