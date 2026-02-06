# HPG Live - Q&A and Polls

Real-time Q&A and polling application for live events.

## Setup

### Firebase Configuration (Required for Cross-Device Sync)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. In the project, go to **Build** → **Realtime Database** → **Create Database**
   - Choose a location
   - Start in **test mode** for development
4. Go to **Project Settings** (gear icon) → **General** → scroll to **Your apps**
5. Click the web icon (`</>`) to add a web app
6. Copy the config object and paste it into `script.js`, replacing the placeholder:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Running Locally

Just open `index.html` in a browser. For best results, use a local server:

```bash
npx serve .
```

## Usage

- **Host**: Click "Host a session" to create a new Q&A session with a unique code
- **Participants**: Enter the session code to join and submit questions/vote on polls
- Changes sync in real-time across all connected devices