# Cartoon Card Match Game

This project is a standalone browser game. No build tools or package installation are required.

## Running the game

1. From this directory (`service.autostart-master/`), start a simple static web server. For example, using Python:
   ```bash
   python3 -m http.server 8000
   ```
2. Open your browser to [http://localhost:8000](http://localhost:8000).
3. Click `index.html` to load the game.

Alternatively, you can drag `index.html` directly into a browser window, though some browsers block local file access for audio/fonts. Serving it via a local server avoids those issues.

## Controls

- Click or press Enter/Space on a card to flip it.
- Match all 32 pairs to win. Use the **Restart Game** button to reshuffle and start over.
