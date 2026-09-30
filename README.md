# BodyLens — Cult PDF.js POC

Proof of concept for extracting measurement data from Cult Smart Scale Pro
PDF reports entirely in the browser using PDF.js.

## Goal

Validate whether the Cult Smart Scale Pro PDF can be parsed client-side
without requiring a Python/backend service.

## What this POC validates

- PDF can be loaded in the browser
- Text can be extracted using PDF.js
- Text item coordinates can be extracted
- X/Y positioning can be used to understand the report layout
- Segmental measurements can potentially be mapped using coordinates
- No PDF data is uploaded to a server

## Tech Stack

- React
- TypeScript
- Vite
- PDF.js (`pdfjs-dist`)

## Status

POC — successful initial extraction test.

### Next step

Build a deterministic Cult Smart Scale Pro parser and automated tests
against real report fixtures.
