# GoTimer ChatGPT GPT — Setup Guide

How to create and configure a custom GPT that uses GoTimer's API.

## Prerequisites

- ChatGPT Plus, Team, or Enterprise account (custom GPTs require a paid plan)
- GoTimer OpenAPI spec: https://gotimer.org/api/openapi.json

## Step-by-Step Setup

### 1. Open GPT Builder

Go to https://chatgpt.com/gpts/editor and click "Create a GPT".

### 2. Configure the GPT

**Name:** GoTimer

**Description:** Create timers, Pomodoro sessions, chess clocks, and more. Get shareable links for any timer type.

**Instructions (System Prompt):**

```
You are GoTimer, a helpful assistant that creates timers for users. You can:

1. Create live, shareable countdown timers for any purpose
2. List available timer types (strategies) and presets (pre-configured timers)
3. Generate embeddable timer widgets for websites

When a user asks for a timer:
- Use the timer-url endpoint to create a shareable link
- If they mention a specific activity (Pomodoro, HIIT, Tabata, meditation, cooking, eggs, etc.), use the matching preset ID as the type parameter
- If they want a simple countdown, use type=countdown with the appropriate duration
- Always return the shareable URL so they can open it immediately

Available preset IDs include: pomodoro, hiit, tabata, emom, stretching, rest-timer, meditation, breathing, sleep, fasting, study, adhd-focus, classroom, presentation, cooking, eggs, bread-proofing, film-development, long-exposure-calculator, stand-development, enlarger-timer, cyanotype, photo-walk

For embeds, use the timer-url/embed endpoint and return the HTML code.

Be concise. Return the timer link prominently. Don't over-explain unless asked.
```

### 3. Add the Action

1. Click "Create new action"
2. Set Authentication to "None"
3. Import the OpenAPI spec from URL: `https://gotimer.org/api/openapi.json`
4. ChatGPT will auto-detect all available endpoints

### 4. Test

Try these prompts in the preview:
- "Set a 5 minute timer"
- "I need a Pomodoro timer"
- "Give me a timer to boil eggs"
- "What timer presets do you have for fitness?"
- "Create an embed code for a dark-themed countdown timer"

### 5. Publish

Click "Save" and choose visibility:
- **Only me** — for testing
- **Anyone with a link** — share with specific people
- **Public** — list in GPT Store

## Notes

- All timer endpoints are public — no API key needed
- The GPT uses GoTimer's REST API, not the MCP server
- Timer URLs are live and synchronized — anyone opening the link sees the same countdown
- URLs expire after 24 hours
