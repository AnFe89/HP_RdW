# Implementation Plan - Optimize GlitchText Speed

The user wants the "GlitchText" animation (used in titles like "OPERATIVE PROFILE") to be "significantly faster".

## Current Behavior

- **Interval**: 30ms per frame.
- **Progress**: 1/3 character per frame.
- **Result**: It takes 3 \* 30ms = **90ms** to resolve a single character.

## Proposed Changes

I will modify `src/components/ui/GlitchText.tsx` to:

- **Interval**: Reduce to **10ms**.
- **Progress**: Increase to **1/2 (0.5)** character per frame.
- **Result**: It will take 2 \* 10ms = **20ms** to resolve a single character.

This is **4.5x faster**, which should meet the request of "deutlich beschleunigen" (significantly accelerate) while still retaining a slight "scramble" effect (2 frames per char instead of 3).

## Verification Plan

### Manual Verification

- Ask the user to reload the page and observe the headers (e.g. "OPERATIVE PROFILE" in the auth modal or "COMMAND BRIDGE" in admin dashboard).
- Confirm the animation feels snappy and not sluggish.
