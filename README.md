# HeroForge RPG — Estado visual con Redux Toolkit en React Native

Taller de Desarrollo Móvil. Mini-juego en el que cada acción despachada reacciona en 4 componentes independientes a la vez, para ver cómo viaja una acción por Redux:

`UI → dispatch(action) → Reducer/Store → State → Selector → re-render`

**Stack:** React Native (Expo), TypeScript, `@reduxjs/toolkit`, `react-redux`.

## Ejecutar

```bash
npm install
npx expo start
```

Abre la app con Expo Go (escaneando el QR) o con un emulador (`a` para Android, `i` para iOS).

## Las 4 zonas (componentes hermanos, sin props entre sí)

| Zona | Componente | Qué hace |
| --- | --- | --- |
| A | `HeroAvatarHUD` | Avatar con aura, clase automática y barras de vida, maná y carga. Solo lee el Store. |
| B | `StatsControlPanel` | Reparte 15 puntos en STR/AGI/INT, presets de build y reseteo. |
| C | `ArmoryGrid` | Equipa/desequipa ítems; alerta de sobrecarga. |
| D | `ReduxLiveInspector` | Combate contra un jefe y consola con las últimas 5 acciones. |

## Estructura

```
src/
├── components/          # UI: no contiene lógica de negocio
│   ├── HeroAvatarHUD.tsx
│   ├── StatsControlPanel.tsx
│   ├── ArmoryGrid.tsx
│   ├── ReduxLiveInspector.tsx
│   └── ProgressBar.tsx
├── store/
│   ├── index.ts         # configureStore + hooks tipados
│   ├── selectors.ts     # estado derivado (createSelector)
│   ├── thunks.ts        # attackBoss: orquesta el combate
│   └── slices/
│       ├── statsSlice.ts      # atributos y vida
│       ├── inventorySlice.ts  # catálogo y equipo
│       ├── actionLogSlice.ts  # log de acciones (extraReducers + addMatcher)
│       └── arenaSlice.ts      # vida del jefe
└── theme.ts
```

## Decisiones de arquitectura

- **Estado derivado, no almacenado:** stats totales, peso, capacidad (`10 + STR total × 2`), sobrecarga, poder de combate y clase del héroe se calculan en `selectors.ts` cruzando `stats` e `inventory`. Ningún slice guarda esos valores.
- **Sobrecarga:** si el peso equipado supera la capacidad, el poder de combate sufre una penalización del 30 % y la velocidad efectiva se reduce a la mitad.
- **Log automático:** `actionLogSlice` captura las acciones de los demás slices con `builder.addMatcher`, por lo que los componentes no registran nada a mano.
- **Immer:** los reducers "mutan" el draft (`push`, `splice`, `Object.assign`); Redux Toolkit produce el estado inmutable por debajo.
- **Cuarto slice (`arenaSlice`):** guarda la vida del jefe para que el combate también sea estado global y quede registrado en el inspector.
- **Sin prop drilling:** las zonas A–D leen y despachan directamente con `useAppSelector` / `useAppDispatch`.
