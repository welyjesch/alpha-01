# Kaplay.js Pinball Game - Specification

## Project Overview
- **Project Name**: Kaplay Pinball
- **Package ID**: com.kaplay.pinball
- **Core Functionality**: A classic 2D pinball game built with Kaplay.js, compiled to Android via Capacitor

## Technology Stack
- **Game Engine**: Kaplay.js (latest)
- **Build Tool**: Vite + Vanilla TypeScript
- **Mobile Wrapper**: Capacitor
- **Target Platform**: Android (APK)

## Game Design

### Game Area
- Vertical pinball table (portrait orientation)
- Canvas fills the screen

### Game Elements
1. **Ball**: Circular, bounces off walls and bumpers
2. **Flippers**: Two at bottom, controlled by left/right keys or touch
3. **Bumpers**: 3 circular bumpers in the middle area that add points and bounce the ball
4. **Walls**: Angled walls at bottom corners
5. **Score Zone**: Bottom drain area - ball falling through = lose a life

### Controls
- **Desktop**: Left/Right arrow keys or A/D for flippers
- **Mobile**: Touch left/right side of screen

### Scoring
- Bumper hit: +100 points
- Wall bounce: +10 points

### Game States
- **Start Screen**: "Tap to Start" / "Press Space to Start"
- **Playing**: Active gameplay
- **Game Over**: Show final score, tap to restart

## Visual Style
- Dark background (#1a1a2e)
- Neon-style glowing elements
- Ball: White/yellow glow
- Flippers: Orange/red
- Bumpers: Green/cyan glow
- Walls: Purple/magenta

## Implementation Steps

1. Initialize Vite vanilla-ts project
2. Install kaplay.js
3. Create pinball game with:
   - Ball physics with gravity and bounce
   - Flipper controls
   - Bumper collision detection
   - Score system
   - Game state management
4. Add Capacitor and configure for Android
5. Build and verify APK

## File Structure
```
/root/alpha-01/pinball/
├── src/
│   ├── main.ts        # Game entry point
│   ├── game.ts        # Main game logic
│   └── style.css      # Basic styles
├── index.html
├── capacitor.config.ts
└── package.json
```