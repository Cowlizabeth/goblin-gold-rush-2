# Implemented sequence
1. Verified 163 starter asset hashes; inspected reference and contact sheet.
2. Implemented 9000-unit first slice; all three builds complete it in 60.7–63.3 seconds, 16 jumps and 1 miniboss. Evidence: frames/first-slice-report.json.
3. Expanded only after validation to a finite 27000-unit cave. Boss encounters at 8100 (30%), 17550 (65%), 26500 (98%). 49 enemies; wave density increases from 2 to 4, basic knight HP stays 48. Each repeated formation has a reachable pillar/arch/ledge route. Boss arenas are kept free of platform geometry.
4. Added telegraphed ground slams, persistent gold/passive upgrades, victory-unlocked initial Fury, mobile input and paused upgrade cards.
5. Independent code review caught a boss softlock and a platform silhouette mismatch; both fixed and regression checked.

Scope limits: guardians reuse approved knight art with larger scale and escalating health/slam threat. No additional spear/shield/executioner archetype art was generated. No physical-device or Safari testing. Ground is continuous under spikes; missing a jump causes damage rather than falling into a pit. The skeleton ref2game app was replaced with a purpose-built sim/scene/DOM interface around its original WebGL2 renderer.
