# Map Link Frontend

React frontend for Map Link, a road reporting and live map application.

The app supports:
- Browser cookie authentication
- Live nearby users and reports on a Leaflet map
- Road report creation and deletion
- User settings for incoming messages and map visibility
- Direct conversations and message threads
- Demo/test workflows with multiple browser sessions

## Requirements

- Node.js
- npm
- Running Map Link backend at `http://localhost:8000`

## Quick Start

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173/
```

Run on a specific port:

```bash
npm run dev -- --port 5174
```

## Environment

The frontend reads the backend URL from:

```env
VITE_API_URL=http://localhost:8000
```

If this variable is not set, the app defaults to:

```text
http://localhost:8000
```

Create a local `.env` file if you need another backend address:

```bash
printf 'VITE_API_URL=http://localhost:8000\n' > .env
```

The location websocket URL is derived automatically:

```text
http://localhost:8000 -> ws://localhost:8000/api/v1/location/ws
```

## Backend Requirements

The backend must be running with:
- PostgreSQL
- Redis
- Alembic migrations applied
- CORS allowing the frontend origin

Backend setup summary:

```bash
cd /home/letu/PycharmProjects/map-link-back
docker compose up -d
uv run alembic upgrade head
uv run fastapi dev app/main.py
```

## Authentication

The app uses backend HttpOnly cookies.

Login/register endpoints return the user object and set:
- `access_token`
- `refresh_token`

Axios is configured with:

```js
withCredentials: true
```

This means browser requests automatically include auth cookies.

## Main Routes

```text
/                         Live map
/login                    Login
/register                 Register
/profile                  Profile, vehicle icon, user settings
/messages                 Conversation list
/messages/:conversationId Message thread
```

## Features

### Map

The map page:
- gets the browser's current location
- opens `/api/v1/location/ws`
- sends `{ lat, lng }`
- receives nearby users and reports
- refreshes map data every 5 seconds
- sends location again when the user moves at least 5 meters

Nearby user data includes:

```json
{
  "user_id": "...",
  "lat": 32.0856,
  "lng": 34.7821,
  "allow_incoming_messages": true,
  "hide_me": false
}
```

### Reports

Users can create road reports from the map.

Supported report types:

```text
POLICE
FLOODING
ROAD_DANGER
TRAFFIC_JAM
MISSING_SIGN
CAR_ACCIDENT
CONSTRUCTION
SPEED_CAMERA
```

Users can delete only their own reports. The backend enforces ownership.

### User Settings

Profile page settings:

- `Incoming messages`
  - enabled: nearby users can start a conversation
  - disabled: map message button is disabled for other users

- `Hide me on map`
  - enabled: backend does not publish this user to nearby users
  - disabled: user appears to nearby users while websocket is active

The current user still sees their own local marker even when hidden.

### Messages

Messages are HTTP-based.

The frontend supports:
- listing conversations
- opening a thread
- sending messages
- polling messages every 5 seconds
- marking the latest message as read
- starting a direct conversation from a nearby user marker

There is no dedicated message websocket yet.

## Demo Workflow

Seed backend demo data:

```bash
cd /home/letu/PycharmProjects/map-link-back
uv run python scripts/seed_demo.py
```

Demo accounts:

```text
driver1 / password123456
driver2 / password123456
reporter / password123456
no_messages_user / password123456
hidden_user / password123456
```

Suggested geolocation overrides:

```text
driver1: 32.08530, 34.78180
driver2: 32.08565, 34.78210
reporter: 32.08495, 34.78145
no_messages_user: 32.08545, 34.78155
hidden_user: 32.08575, 34.78235
```

To override browser location in Chrome:

1. Open DevTools.
2. Open More tools -> Sensors.
3. Set Location to custom.
4. Enter one of the demo coordinates.
5. Refresh the app.

For a multi-user demo, run multiple frontend ports:

```bash
npm run dev -- --port 5173
npm run dev -- --port 5174
npm run dev -- --port 5175
```

Use different browser profiles or incognito windows so cookies do not conflict.

Suggested presentation flow:

1. Login as `driver1`.
2. Set geolocation to `32.08530, 34.78180`.
3. Show seeded reports on the map.
4. Open another browser as `driver2`.
5. Show `driver2` on `driver1` map.
6. Login as `no_messages_user` and show the disabled message button.
7. Toggle `Hide me on map` in Profile and show the user disappearing from other maps.
8. Start a conversation from a visible user marker.
9. Send and receive messages in `/messages/:conversationId`.

## Scripts

Run dev server:

```bash
npm run dev
```

Run dev server on a specific port:

```bash
npm run dev -- --port 5174
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Project Structure

```text
src/api/client.js              Axios base client
src/api/auth.js                Auth API
src/api/mapData.js             Report API
src/api/userSettings.js        User settings API
src/api/conversations.js       Conversations/messages API
src/context/AuthContext.jsx    Auth provider
src/context/MapDataContext.jsx Map websocket/provider
src/pages/Home.jsx             Main map page
src/pages/user/Profile.jsx     Profile/settings page
src/pages/messages/            Message list/thread pages
src/components/                Shared UI components
src/assets/                    Marker icons
```

## Notes

- Vite prints several `Network` URLs because the dev script uses `vite --host`.
- The backend must allow the frontend origin for cookie auth to work.
- Browser geolocation requires permission from the user.
- If demo data does not appear, confirm your browser location is near the seeded coordinates and rerun `scripts/seed_demo.py`.
