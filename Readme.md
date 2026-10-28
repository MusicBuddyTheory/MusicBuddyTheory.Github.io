# Music Buddy

A band room survival kit for high school music students. Instrument setup guides, a transposition explorer, flashcards, a pop quiz, and practice tools, all in plain HTML, CSS and JavaScript. No build step, no frameworks, no accounts.

Live site: https://problemsolver77.github.io/

## What is in it

- **Instrument guides** for flute, clarinet, saxophone, trumpet, trombone, French horn, baritone/tuba, percussion and strings. Each has four steps: assembly, posture, hand position, and breath and tone.
- **Scales and transposition explorer.** Pick a concert key (major or natural minor) and your instrument, see the scale you actually read, and hear the concert scale played back.
- **Trumpet valve cheat sheet** for written notes C4 to B4.
- **Flashcards** for the circle of fifths, interval math, key color and mood, and a keyboard map.
- **Pop quiz.** Ten new questions every round (key signatures, transposition, relative minors, intervals, music vocabulary). Your best score is saved in your browser only.
- **Practice tools.** A metronome and held tuning tones (concert B-flat, A, F and E-flat).
- **Mel,** the music note mascot. Mel answers common band questions by keyword matching. It is not a real AI.

## Files

```
index.html   page structure and content
styles.css   all styling (light and dark mode)
app.js       guides, scale engine, quiz, metronome, Mel chat
images/      optional photos for the instrument guides
```

## Put it on GitHub Pages

1. Create a repo named `problemsolver77.github.io` (or use your existing one).
2. Put `index.html`, `styles.css`, `app.js` and this `README.md` in the root of the repo.
3. Delete any old copies of those files so nothing conflicts.
4. In the repo, open Settings, then Pages, and set the source to your main branch and the `/ (root)` folder.
5. Commit. The site updates within a minute or two.

## Add your own photos

Each guide step shows a photo if one exists. Put images in an `images/` folder named after the instrument and step number:

```
images/flute-1.jpg      images/flute-2.jpg      images/flute-3.jpg      images/flute-4.jpg
```

Instrument names used in filenames: `flute`, `clarinet`, `sax`, `trumpet`, `trombone`, `horn`, `tuba`, `perc`, `strings`. Steps are 1 (assembly), 2 (posture), 3 (hands), 4 (breath and tone). If a photo is missing, that step simply has no image.

## Edit the content

- **Guide text and tips:** the `G` and `TIP` objects at the top of `app.js`.
- **Quiz questions:** the `S` list (fixed questions) and the `GEN` list (generated questions) in `app.js`.
- **Mel's answers:** the `A` list in `app.js`. Each entry is a pattern and a reply.
- **Colors and fonts:** the variables at the top of `styles.css`.

## Notes

- Sounds use the browser's Web Audio API, so the first tap on a sound button may be needed before audio plays on phones.
- Fonts load from Google Fonts. Without a connection the site falls back to system fonts.
- Light and dark mode follow the device setting.
