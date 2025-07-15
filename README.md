# Metadata Mapper

This repository contains a small full-stack example for experimenting with metadata mapping. The project is split into two directories:

- `metadata-mapper` – React front end built with Vite.
- `metadata-mapper-server` – Node/Express API that validates and applies mapping rules.

## Running the server

1. Install dependencies:
   ```bash
   cd metadata-mapper-server
   npm install
   ```
2. Start the server using `ts-node-dev` or `ts-node`:
   ```bash
   npx ts-node-dev src/index.ts
   ```
   The server listens on the port defined by the `PORT` environment variable (defaults to `3001`).

## Running the client

The React application located in `metadata-mapper` is the main UI for the project.

1. Install dependencies:
   ```bash
   cd metadata-mapper
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

The app expects the API URL in the optional `VITE_API_URL` environment variable. If not provided, it defaults to `http://localhost:3001/api`.

## Environment variables

- `PORT` – port for the Express API (default `3001`).
- `VITE_API_URL` – base URL for API requests from the React app (default `http://localhost:3001/api`).
