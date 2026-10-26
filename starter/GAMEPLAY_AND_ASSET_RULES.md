# Goblin Gold Rush 2.0 — production ground rules (Codex ref2game)

- New game based on original user's approved imagery and unique game rules; DO NOT clone Geometry Dash or Ball x Pit.
- Browser playable mobile landscape 16:9, one-finger: tap jump, long hold higher jump, separate Fury icon consumes its own touch.
- Original hero frame-by-frame RIGHT-facing run 8 fps and attack 9 fps from `assets/hero_approved/`. Do not redraw hero or use old `assets/recovered/production/runner_paper.png`. Preserve all frames, real transparent alpha and feet baseline. Attack plays only when contact occurs.
- Original knight frames in `assets/knight_approved/` face LEFT, sword in right hand, shield in left; their forms must not mutate.
- `assets/recovered/production/cave_v2` contains 2D cave decor, coins, HUD, potions, cliffs and icon PNGs; `assets/recovered/production/cave_v3` includes platform, poison, skill sheets. Verify visually before using and crop without cutting off silhouettes.
- Background scenery: bury background formation bottoms below floor, avoid floating pebbles, all visible props have immutable world IDs, medium and near props opaque, rare foreground silhouettes.
- Finite cave chapter with two mini-bosses and one final boss; paced rock pillars, arches and shippable spikes, real landable platform surfaces, fair jump reachability, anti-stuck.
- Clash: on knight contact solid collision, approx 0.5s shield-pressure sparks, shove enemy back, knight recharges; jumping disengages. Evolved hero gains wave-clearing power; pressure density scales rather than enemy HP only.
- 3 exclusive weapon builds AoE / focus / infectious poison burst. Manual Fury preserved between enemy encounters. Healing and meaningful miniboss loot. After level unlock passive upgrades / skills (no city).
- Validate gamefeel and HUD on mobile touch. Verify animation continuity, no leg slide, stable baseline and no overlays on hazards. Include screenshots/replay and automated checks.
- Deliver complete static HTML/CSS/JS WebGL2 game, assets, manifest, controls, tests, zipped self-contained project. This is not an Android APK. No claims of device testing without evidence.
- Limited Codex budget: make ONE polished 60–120 s trial chapter and first mini-boss before expanding; use provided imagery first, generate only missing distinct enemies if allowed; stop/review if unexpected needs. Work in batches with checkpoints.
