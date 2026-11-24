# Ki Tower – notes for Claude

Ki Tower is Jacob's browser climbing game (Icy Tower style, anime fighters). It runs on GitHub Pages at https://jackniv01.github.io/ki-tower/ and is installed on phones as a PWA (Add to Home Screen).

## How to work with Jacob
- Always reply in **Hebrew** (masculine forms).
- Short answers, small numbered steps, simple words.
- **Interview him before big changes** (several questions with options, recommended option first).
- **Make a test version first**, let him try it, and only change the real game after he approves.
- Art comes from **Grok**: write him a detailed English prompt (sprite sheet, grid of cells, smooth HD anime style, NOT pixel art, solid magenta #FF00FF background). He sends back the image, you cut it with the scripts in `src/art/`.

## Files
- `index.html` – the built game (what players load). **Do not edit by hand.** Build it from `src/game/`.
- `src/game/` – game source, joined in this order:
  `a_head.html` (CSS + HTML screens), `b_core.js` (fighters, abilities, settings, sound and music, shared scoreboard, physics, `die()`),
  `c_world.js` (11 worlds, decor, platforms), `d_hero.js` (fallback drawn heroes), `d3_sprites.js` (fighter sprite atlases, base64), `d4_god_art.js` + `d5_god.js` (secret fighter Sonofgod),
  `e_rest.js` (effects, HUD, abilities, orbs, wishes, dragons, Beerus ride, skip button, settings, input, main loop).
- `src/build.py` – `python3 src/build.py` builds `index.html` and bumps the cache name in `sw.js`.
  `python3 src/build.py --test some-test-folder` builds a test copy that does NOT save scores.
- `src/art/` – sprite atlases and Grok originals, plus cutting scripts (`still2.py`, `mask.py`, `build.py` for fighters; `dragon/cutparts.py`; `orbs/cut.py`).
- `sw.js` – service worker (network-first). The cache name must change on every release so phones update.
- `stats-6144fab8.html` – Jacob's private stats page (Google sign-in, only jackniv01@gmail.com can read the data).

## Release steps
1. Edit files in `src/game/`.
2. For a test: `python3 src/build.py --test <random-folder>`, push, send Jacob the link. Delete the folder after.
3. For the real game: `python3 src/build.py`, commit, push to `main`. GitHub Pages updates in about a minute.
4. Players get the update after fully closing and reopening the app.

## Game content (current)
- Fighters: Jacob (Monkey Leap, 4 wall jumps), Anna (auto Revive), Adam (Vine Climb), Jonny (Green Haze cloud), Lior (Fashion Wings), Daniella (Cat Jumps, 3 air jumps). Hair color changes with power level.
- Secret fighter **Sonofgod** (only Jacob): unlocked by a secret code in Settings (only its SHA-256 hash is in the code, never the code itself). Hold Fly to fly faster and faster, Teleport button opens 3 Grok gate rings (30/50/100 floors), the screen never scrolls by itself, his scores are not saved. Code in `src/game/d5_god.js`, art in `src/art/god/` (`make_js.py` builds `d4_god_art.js`).
- Worlds every 100 floors, 11 in total (Neon City 700, Thunder Storm 800, Black Hole 900, Pure Energy 1000+, celebration at 1000). Safe full-width step every 50 floors.
- 7 wish orbs (Grok art). Collecting all calls **Aurelis** (golden Eastern dragon). He offers 3 random wishes from: Double points, Little dragon, Dragon ride on **Beerus** (blue storm dragon, 15 s), Rocket (50 floors), Shadow clone (combo bonus x2), Surprise. Skip button in the top right.
- Music that grows with height, Web Audio sound effects, Music switch in settings.
- Name prompt on first open.

## Shared scoreboard (Firebase, free Spark plan)
- Project `ki-tower`, Firestore collection `scores`, used through the REST API (no SDK) in `b_core.js` (`fetchShared`, `pushShared`).
- Fields: name, score, floor, combo, ts (server time), char, sp, wish, spok, dur, dev, did.
- Security rules (Firebase console): anyone can create a valid score and read the top 50; full data only for Jacob's signed-in Google account; no updates or deletes.
- **If you add a new field, update the rules first**, or new scores will be rejected.
- Never upgrade the Firebase plan or add a payment method.
