# Horror Labyrinth Game

A thrilling 2D horror labyrinth game built with HTML5 Canvas and JavaScript. Navigate through an ever-changing maze, avoid the lurking creature, and collect bonuses to survive as you progress through infinite levels of increasing difficulty.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [How to Play](#how-to-play)
  - [Controls](#controls)
  - [Objective](#objective)
  - [Bonuses](#bonuses)
- [Game Mechanics](#game-mechanics)
  - [Maze Generation](#maze-generation)
  - [Creature AI](#creature-ai)
  - [Levels and Difficulty](#levels-and-difficulty)

---

## Demo

_Coming soon!_

---

## Features

- **Random Maze Generation**: Each playthrough presents a unique maze.
- **Infinite Levels**: Progress through endless levels with increasing difficulty.
- **Adaptive Creature AI**: The creature gets smarter and faster as you advance.
- **Bonuses**:
  - **Extended Vision Potion**: Temporarily increases your visibility radius.
  - **Speed Potion**: Temporarily increases your movement speed.
- **Dynamic Difficulty**: The maze size grows, and the creature becomes more challenging with each level.
- **Minimalistic Graphics**: Simple yet immersive visuals using HTML5 Canvas.
- **Ambient Soundtrack**: Eerie background music and sound effects enhance the horror atmosphere.

---

## Getting Started

### Prerequisites

- A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.).
- _(Optional)_ A local web server for serving the files.

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/horror-labyrinth-game.git
   ```

## How to Play

### Controls

- **Move Up**: `Arrow Up` key
- **Move Down**: `Arrow Down` key
- **Move Left**: `Arrow Left` key
- **Move Right**: `Arrow Right` key

### Objective

- Navigate through the maze to find the exit and progress to the next level.
- Avoid the creature that wanders the maze and chases you when nearby.
- Collect bonuses to gain temporary advantages.

### Bonuses

- **Extended Vision Potion** _(Green Tile)_:
  - **Effect**: Doubles your visibility radius for 15 seconds.
- **Speed Potion** _(Blue Tile)_:
  - **Effect**: Increases your movement speed for 15 seconds.
- **Spawn Frequency**: Bonuses appear randomly every 1 minute.

## Game Mechanics

### Maze Generation

- **Algorithm**: Uses Recursive Backtracking to generate a random maze.
- **Dynamic Size**: Maze dimensions increase with each level, adding more complexity.

### Creature AI

- **Behavior**:
  - **Wandering**: Moves randomly when the player is far away.
  - **Chasing**: Uses Breadth-First Search (BFS) pathfinding to chase the player when within a certain proximity.
- **Difficulty Scaling**: The creature becomes smarter and faster as levels progress.

### Levels and Difficulty

- **Infinite Levels**: No limit to the number of levels; each level increases difficulty.
- **Difficulty Factors**:
  - **Maze Size**: Increases with each level.
  - **Creature Speed**: Creature moves faster as levels increase.
  - **Creature Intelligence**: Detection radius increases, making it more challenging to avoid.
