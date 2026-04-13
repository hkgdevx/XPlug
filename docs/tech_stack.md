# Tech Stack

The core engine is built defensively with no external dependencies:

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript 
- **Test Runner:** Jest (`ts-jest`) 
- **Delivery Format:** CommonJS & standard declarations (TypeScript config `ES2022`).
- **Typings:** Heavy usage of native TypeScript features with no explicit schema validators (e.g. `zod` or `joi`) in the core engine to keep it ultra-lightweight. Future validation is strictly host-provided unless configured.
