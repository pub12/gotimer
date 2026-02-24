# Game Timer

A modern, mobile-friendly web app for game timing and competitive challenge tracking. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

### Timers
- **Countdown Timer** - Configurable countdown with audio alerts for the final 10 seconds
- **Chess Clock** - Two-player time control with per-player settings
- **Round Timer** - Track total elapsed time and per-round time with round history

### Game Challenges
- **Create Challenges** - Set up ongoing competitions with friends
- **Track Scores** - Record game results with winner tracking and draw support
- **Invite Friends** - Share invite links for friends to join challenges
- **Game History** - View all game results with dates, notes, and GIF reactions
- **GIF Reactions** - Attach GIPHY GIFs to game results
- **Trash Talk** - Random motivational or trash talk banners based on who's winning
- **Charts** - Per-challenge histograms and overall performance charts

### Authentication
- Google OAuth login via hazo_auth
- Profile pictures and user profiles
- Secure session management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: SQLite via better-sqlite3
- **Auth**: hazo_auth (Google OAuth)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `HAZO_AUTH_COOKIE_PREFIX` | Cookie prefix (must match `config/hazo_auth_config.ini`) |
| `JWT_SECRET` | JWT signing secret (min 32 chars). Generate: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | NextAuth session secret. Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App base URL (e.g., `http://localhost:3000` for dev) |
| `HAZO_AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `HAZO_AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `HAZO_CONNECT_SQLITE_PATH` | SQLite database path (default: `./data/hazo_auth.sqlite`) |
| `GIPHY_API_KEY` | GIPHY API key from [developers.giphy.com](https://developers.giphy.com/) |

Optional:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID (omit to disable) |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `{NEXTAUTH_URL}/api/hazo_auth/oauth/google/callback`
4. Copy Client ID and Client Secret to `.env.local`

### Database

The SQLite database is created automatically on first run in the `data/` directory. No manual initialization needed.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm run start
```

### Production Notes

- Set `NEXTAUTH_URL` to your production domain
- Use strong, unique values for `JWT_SECRET` and `NEXTAUTH_SECRET`
- Update Google OAuth redirect URI to match your production domain
- SQLite requires a persistent filesystem (not compatible with serverless platforms like Vercel). Deploy to a VPS or container-based platform.
- The `data/` directory must be writable for the SQLite database
- Profile picture uploads are stored in `public/profile_pictures/uploads/`

## Project Structure

```
src/
  app/
    api/               # API routes (challenges, auth, giphy proxy)
    challenges/        # Challenge pages (dashboard, detail, create, edit, invite)
    chess-clock/       # Chess clock timer
    countdown/         # Countdown timer
    round-timer/       # Round timer
    hazo_auth/         # Authentication pages (login, register, settings)
  components/
    challenges/        # Challenge-specific components
    ui/                # shadcn/ui base components
  lib/
    db.ts              # SQLite connection and table initialization
config/
  hazo_auth_config.ini # Authentication configuration
data/                  # SQLite database (auto-created, gitignored)
public/
  data/                # Static JSON (trash talk, motivational quotes)
```

## License

Private project.
