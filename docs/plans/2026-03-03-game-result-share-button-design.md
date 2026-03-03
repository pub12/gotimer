# Game Result Share Button Design

## Goal
Add a WhatsApp share button to each game result in Game History. The share generates a WhatsApp-friendly preview showing the game's giphy, total score, and a message like "<winner> won the <game> game!".

## Design

### 1. New Route: `/public-challenges/[id]/game/[gameId]/page.tsx`
- Server component with `generateMetadata` querying DB for game, challenge, and player names
- OG meta tags:
  - `og:title`: "<Winner> won the <ChallengeName> game!" (or "Draw in the <ChallengeName> game!")
  - `og:image`: game's `gif_url` (fallback: `/fight.jpg`)
  - `og:description`: "Score: Tim 5 - Sarah 3"
- Page component redirects client-side to `/public-challenges/[id]`

### 2. Share Button in `GameHistory` Component
- New optional props: `challenge_id`, `challenge_name`, `scores` (Record<string, number>)
- Small WhatsApp share button in each game card (next to date/edit/delete area)
- On click: opens `https://wa.me/?text=<encoded_message>`
- Message: "<Winner> won the <ChallengeName> game!\nScore: Tim 5 - Sarah 3\nhttps://gotimer.org/public-challenges/<id>/game/<gameId>"

### 3. Visibility
- Share button appears on both public and private challenge pages
- Rich WhatsApp preview only works for public challenges (WhatsApp can scrape OG tags)
- Private challenges still share the text message with winner/score info

### 4. Landing Page
- The game-specific URL redirects to the full challenge page `/public-challenges/[id]`
