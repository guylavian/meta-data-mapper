# Metadata Mapper

Metadata Mapper is a small full-stack project for experimenting with mapping JSON metadata. It includes a **React** client built with **Vite** and a **Node.js** server written in **TypeScript** using **Express**. The client parses metadata, validates mapping rules and applies them through API calls to the server.

## Project structure

- `metadata-mapper` – React/Vite client
- `metadata-mapper-server` – Node.js/Express server

## Setup

Both the client and server are independent Node projects and should be installed separately.

### React client

```bash
cd metadata-mapper
npm install
```

Create a `.env` file in this directory to configure the API endpoint. The variable `VITE_API_URL` should point to the server's base API URL:

```env
VITE_API_URL=http://localhost:3001/api
```

### Node server

```bash
cd metadata-mapper-server
npm install
```

The server reads the `PORT` environment variable (defaults to `3001`).

## Development

Run the server and client in separate terminals.

```bash
# In metadata-mapper-server
npm run dev

# In metadata-mapper
npm run dev
```

The React app will proxy requests to `VITE_API_URL`.

## Production build

### Server

Compile the TypeScript sources then start the compiled server:

```bash
cd metadata-mapper-server
npx tsc
npm start
```

### Client

Build the static assets and optionally preview them with Vite:

```bash
cd metadata-mapper
npm run build
npm run preview  # to serve dist locally
```

Deploy the contents of the `dist` folder along with the running server.

