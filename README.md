# AI-enabled Contract Lifecycle Management prototype

High-fidelity, responsive implementation of the 26 supplied Figma frames covering the Business Owner, Contract Manager, and Procurement journeys.

## Implemented flows

- Business Owner: dashboard, request prompt, guided intake, overview, generated and updated drafts, edit mode, submission, and request details.
- Contract Manager: dashboard, request review, collapsed/expanded overview, document attachment, procurement confirmation, sent state, and edit mode.
- Procurement: dashboard, request overview, AI analysis, edit/saved states, missing-information intake, sourcing confirmation, and sent state.

All flows are connected with local state. The unobtrusive selectors at the top-right allow direct access to every Figma screen for review.

## Stack

- React 19
- TypeScript
- Vite
- CSS design tokens and responsive layouts
- Lucide React icons

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Validate

```bash
npm run build
npm test
npm run preview
```

## Notes

- Prototype data and actions use deterministic local state; no backend is required.
- Figma did not define backend responses, persistence, authentication, or API contracts, so those concerns are represented as realistic client-side states.
- The layout supports desktop, tablet, and mobile widths and includes semantic controls, labels, visible focus behavior, keyboard-operable actions, and reduced-motion handling.
