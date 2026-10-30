# Music Buddy

A band room survival kit for high school music students. Instrument setup guides, a transposition explorer, flashcards, a pop quiz, and practice tools, all in plain HTML, CSS and JavaScript. No build step, no frameworks, no accounts.

Live site: https://musicbuddytheory.github.io/

## What is in it

- **Instrument guides** for flute, clarinet, saxophone, trumpet, trombone, French horn, baritone/tuba, percussion and strings. Each has four steps: assembly, posture, hand position, and breath and tone.
- **Scales and transposition explorer.** Pick a concert key (major or natural minor) and your instrument, see the scale you actually read, and hear the scale played with a real recording of the instrument (trumpet, clarinet, flute, sax, trombone, horn, tuba, strings and more).
- **Playable fingering charts** for trumpet, euphonium/baritone, tuba, French horn and trombone. Pick the instrument from the dropdown, then hold the on-screen valves with your fingers (or the keys A S D F on a keyboard, Q and W to change register). Trombone uses slide positions 1 to 7. Every combination plays a real instrument sound.
- **Flashcards** for the circle of fifths, interval math, key color and mood, and a keyboard map.
- **Pop quiz.** Ten new questions every round (key signatures, transposition, relative minors, intervals, music vocabulary). Your best score is saved in your browser only.
- **Practice tools.** A metronome and held tuning tones (concert B-flat, A, F and E-flat).
- **Mel,** the music note mascot and chat helper. Out of the box Mel answers common band questions from built-in answers, and you can teach Mel new answers (saved in your browser only). Connect `worker.js` and Mel becomes a real AI that can answer open-ended music theory questions.

## Files

```
index.html   page structure and content
styles.css   all styling (black and yellow theme)
app.js       guides, scale engine, quiz, metronome, Mel chat
worker.js    optional backend that gives Mel real AI answers (deployed separately)
knowledge.json  extra answers for Mel that you can edit any time
```

## Put it on GitHub Pages

1. Use a repo named `<your-username>.github.io` (yours is `MusicBuddyTheory.Github.io`).
2. Put `index.html`, `styles.css`, `app.js`, `knowledge.json` and this README in the root of the repo.
3. Delete any old copies of those files so nothing conflicts.
4. In the repo, open Settings, then Pages, and set the source to your main branch and the `/ (root)` folder.
5. Commit. The site updates within a minute or two.

## Edit the content

- **Guide text and tips:** the `G` and `TIP` objects at the top of `app.js`.
- **Quiz questions:** the `S` list (fixed questions) and the `GEN` list (generated questions) in `app.js`.
- **Mel's built-in answers:** the `A` list in `app.js`. Each entry is a pattern and a reply.
- **Mel's personality (AI mode):** the `SYSTEM` text at the top of `worker.js`.
- **Colors and fonts:** the variables at the top of `styles.css`.

## Notes

- Sounds use the browser's Web Audio API, so the first tap on a sound button may be needed before audio plays on phones.
- Instrument sounds are real recordings from the FluidR3 GM soundfont (Creative Commons Attribution 3.0, via midi-js-soundfonts), loaded on demand with the soundfont-player library (MIT). They need an internet connection; offline, the site falls back to a simple synthesized tone. The first play of each instrument takes a moment to download.
- The site uses a dark, black and yellow theme and your device's standard system fonts.

## Make Mel a real AI chatbot

GitHub Pages only serves static files, and an API key put in `app.js` would be public for anyone to steal. So the AI part runs in a tiny free backend that holds the key.

1. Get an Anthropic API key at https://console.anthropic.com (this is separate from a Claude chat subscription). Set a low monthly spend limit there.
2. Create a free Cloudflare account, then make a new Worker (Workers and Pages, Create, Create Worker). Open its code editor, replace everything with the contents of `worker.js`, and deploy.
3. In the Worker's settings, add a secret named `ANTHROPIC_API_KEY` with your key, and a variable named `ALLOWED_ORIGIN` set to `https://musicbuddytheory.github.io` (the site address only, no path, no trailing slash).
4. Copy the Worker's URL and paste it between the quotes in `const MEL_API=''` at the top of `app.js`. Commit.

If the Worker is unreachable, Mel falls back to the built-in answers and the teach-me notebook. Mel keeps the conversation in memory while the page is open, but does not remember anything after a refresh, and the AI does not learn from chats. Things you teach Mel are saved in that browser only.

## Teach Mel new answers instantly

Open `knowledge.json` on GitHub, add an entry like `{ "q": "What does rubato mean", "a": "Rubato means flexible tempo." }`, and commit. Mel uses it as soon as the site updates (about a minute), even without the AI connected. If you also set the Worker variable `KNOWLEDGE_URL` to `https://musicbuddytheory.github.io/knowledge.json`, the AI reads those answers too and prefers them over its own.

## Keyboard keys for the fingering chart

The keys are set by the `KEYS` list at the top of the fingering section in `app.js` (default `a`, `s`, `d`, `f` for valves 1 to 4).
