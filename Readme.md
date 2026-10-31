# Music Buddy Theory

A band room survival kit for high school music students. Instrument setup guides, a transposition explorer, flashcards, a pop quiz, and practice tools, all in plain HTML, CSS and JavaScript. No build step, no frameworks, no accounts.

Live site: https://musicbuddytheory.github.io/

## What is in it

- **Instrument guides** for flute, clarinet, saxophone, trumpet, trombone, French horn, baritone/tuba, percussion and strings. Each has four steps: assembly, posture, hand position, and breath and tone.
- **Scales and transposition explorer.** Pick a concert key (major or natural minor) and your instrument, see the scale you actually read, and hear the scale played with a real recording of the instrument (trumpet, clarinet, flute, sax, trombone, horn, tuba, strings and more).
- **Playable fingering charts** for trumpet, euphonium/baritone, tuba, French horn and trombone. Pick the instrument from the dropdown, then hold the on-screen valves with your fingers (or the keys A S D F on a keyboard, Q and W to change register). Trombone uses slide positions 1 to 7. The note keeps sounding for as long as you hold the valves or slide position, and every combination plays a real instrument recording. A "Hold to play" button (or B or Space) blows the open note. Each instrument has a Type / key menu (B♭, C, D and E♭ trumpet; BB♭, CC, E♭ and F tuba; F or B♭ side on the horn; tenor or alto trombone; bass or treble clef euphonium) and tubas and euphoniums can switch between 3 and 4 valves.
- **Scales on the fingering chart.** With Auto register on (the default), the chart picks the note closest to the last one you played, like a real player, so you can play a real scale by changing fingerings (A S D F for valves, press valves together for combinations like 1+3). Q and W jump a register. Every fingering also shows its alternates (for example 4 or 1+3, 1+2 or 3).
- **Play page.** A separate section (the Play tab on the side or bottom bar) with its own playable valves or slide positions and real staff notation with the key signature. **Scale** shows any major or natural minor scale on the staff. **Songs** lines up 12 random songs (random key, style, tempo and name, all playable on your instrument). Each one plays as it shows up, so you can skip the ones you do not like, go back, or replay, and then tap **Play this one**. Press **Practice** and play it yourself: the page waits for each correct note, and every note you get right the first time turns green while every note you miss turns red. At the end you get your score. "Show fingerings" writes the fingering under every note. Notes are written the way your instrument reads them (bass or treble clef, transposed for B♭, E♭ and F instruments).
- **Flashcards** for the circle of fifths, interval math, key color and mood, and a keyboard map.
- **Sight-reading quiz.** Ten staff questions each round: name the note (mind the key signature), name the key from its signature, or pick the fingering for a note on your instrument. Choose treble clef, bass clef, both, or match your instrument.
- **Pop quiz.** Ten new questions every round (key signatures, transposition, relative minors, intervals, music vocabulary). Your best score is saved in your browser only.
- **Practice tools.** A metronome and held tuning tones (concert B-flat, A, F and E-flat) that you can play as a piano, trumpet, trombone, tuba, horn, clarinet, flute, alto sax, violin or a plain tone.
- **Mel,** the music note mascot and chat helper. Out of the box Mel answers common band questions from built-in answers, and you can teach Mel new answers (saved in your browser only). Connect `worker.js` and Mel becomes a real AI that can answer open-ended music theory questions.

## Files

```
index.html   page structure and content
styles.css   all styling (black and blue theme)
app.js       guides, scale engine, Play page, quizzes, metronome, Mel chat
brain.js     Mel's built-in answers (works with no AI connected)
config.js    your settings: the Worker link that turns Mel into a real AI
worker.js    optional backend that gives Mel real AI answers (deployed separately)
knowledge.json  extra answers for Mel that you can edit any time
logo.svg, logo-mark.svg, favicon.svg   the logo files
```

## Put it on GitHub Pages

1. Use a repo named `<your-username>.github.io` (yours is `MusicBuddyTheory.Github.io`).
2. Put `index.html`, `styles.css`, `app.js`, `brain.js`, `config.js`, `knowledge.json`, the logo files and this README in the root of the repo. **Always upload every file together.** If `index.html` is new but `app.js` or `styles.css` is an old copy, parts of the page (the instrument menus, the Play page) will be blank, and the page shows a red warning at the top. After uploading, refresh with Ctrl+Shift+R (Cmd+Shift+R on a Mac).
3. Delete any old copies of those files so nothing conflicts.
4. In the repo, open Settings, then Pages, and set the source to your main branch and the `/ (root)` folder.
5. Commit. The site updates within a minute or two.

## Edit the content

- **Guide text and tips:** the `G` and `TIP` objects at the top of `app.js`.
- **Quiz questions:** the `S` list (fixed questions) and the `GEN` list (generated questions) in `app.js`.
- **Mel's built-in answers:** the list in `brain.js` (about a hundred topics already). Each entry is a pattern and a reply. Add your own at the bottom.
- **Mel's personality (AI mode):** the `SYSTEM` text at the top of `worker.js`.
- **Colors:** the variables at the top of `styles.css` (`--bg`, `--card`, `--tint` and `--line` are the blacks and greys, `--accent` and `--at` are the blues).
- **Fingering chart instruments and keys:** the `FI` object in `app.js`. Each instrument has a list of `vars` (its keys or types), with a half-step shift `s` and a reading offset `off`.
- **Fonts:** `--head` and `--body` at the top of `styles.css`, plus the Google Fonts link in `index.html`.
- **Logo:** `logo-mark.svg` and `favicon.svg`. Mel is only the chat mascot and is not part of the logo.
- **Logo wordmark font:** the `--logo-font` line near the bottom of `styles.css`.

## Notes

- Sounds use the browser's Web Audio API, so the first tap on a sound button may be needed before audio plays on phones.
- Instrument sounds are real recordings from the MusyngKite soundfont (Creative Commons Attribution Share-Alike 3.0, via midi-js-soundfonts), with the FluidR3 GM soundfont (Creative Commons Attribution 3.0) as a backup if it cannot load, loaded on demand with the soundfont-player library (MIT). They need an internet connection; offline, the site falls back to a simple synthesized tone. The first play of each instrument takes a moment to download.
- The site uses a black and blue theme. Text is set in Barlow (headings) and Source Sans 3 (body), loaded from Google Fonts; if they cannot load, your device's standard system fonts are used.

## Make Mel a real AI chatbot

GitHub Pages only serves static files, and an API key put in `app.js` would be public for anyone to steal. So the AI part runs in a tiny free backend that holds the key.

1. Get an Anthropic API key at https://console.anthropic.com (this is separate from a Claude chat subscription). Set a low monthly spend limit there.
2. Create a free Cloudflare account, then make a new Worker (Workers and Pages, Create, Create Worker). Open its code editor, replace everything with the contents of `worker.js`, and deploy.
3. In the Worker's settings, add a secret named `ANTHROPIC_API_KEY` with your key, and a variable named `ALLOWED_ORIGIN` set to `https://musicbuddytheory.github.io` (the site address only, no path, no trailing slash).
4. Copy the Worker's URL and paste it between the quotes in `window.MEL_API = ''` in `config.js` (not in `app.js`, so updates never wipe it). Commit and refresh.
5. Check it: open the Worker's address in a browser tab. It should say "Mel's Worker is running" and tell you whether the API key and allowed site are set. Then open Mel on your site: the line under her name changes from "Offline mode" to "AI mode".

Until step 4 is done, Mel is in offline mode and can only answer what is in `brain.js`, `knowledge.json` and what students teach her. A real AI that can answer any music question needs the API key, because the key is what pays for the AI. Haiku answers cost a fraction of a cent each, and you can set a monthly spend limit in the Anthropic console.

If the Worker is unreachable, Mel falls back to the built-in answers and the teach-me notebook. Mel keeps the conversation in memory while the page is open, but does not remember anything after a refresh, and the AI does not learn from chats. Things you teach Mel are saved in that browser only.

## Teach Mel new answers instantly

Open `knowledge.json` on GitHub, add an entry like `{ "q": "What does rubato mean", "a": "Rubato means flexible tempo." }`, and commit. Mel uses it as soon as the site updates (about a minute), even without the AI connected. If you also set the Worker variable `KNOWLEDGE_URL` to `https://musicbuddytheory.github.io/knowledge.json`, the AI reads those answers too and prefers them over its own.

## Keyboard keys for the fingering chart

The keys are set by the `KEYS` list at the top of the fingering section in `app.js` (default `a`, `s`, `d`, `f` for valves 1 to 4).
