# Minevania

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/RullDeef/minevania-proto)

Minevania is an innovative fusion of the classic puzzle game Minesweeper with the exploration and ability-gating mechanics of a Metroidvania. Players navigate a vast, procedurally generated 2D world, unlocking abilities to access new areas and unravel a mystery, all with a stunning retro-hacker visual theme.

## Key Features

*   **Hybrid Gameplay:** A unique blend of Minesweeper's strategic puzzle-solving with Metroidvania's exploration and progression.
*   **Procedurally Generated World:** Explore a massive, scrollable world that is different with every new game, ensuring high replayability.
*   **Ability-Gated Exploration:** Discover powerful abilities like scanners and drills to overcome obstacles and unlock new regions of the map.
*   **Stunning Retro Visuals:** Immerse yourself in a 90s hacker aesthetic, complete with pixel art, neon palettes, glitch effects, and a CRT monitor overlay.
*   **Direct Mouse Interface:** Interact with the world directly using your mouse as a remote defusal probe, offering a unique and intuitive control scheme.
*   **Engaging Narrative:** Uncover a compelling story through lore fragments and hand-designed zones that guide the player's journey.

## Technology Stack

*   **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/)
*   **Deployment:** [Cloudflare Pages & Workers](https://workers.cloudflare.com/)

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://github.com/your-username/minevania.git
    ```
2.  Navigate into the project directory:
    ```sh
    cd minevania
    ```
3.  Install the dependencies using Bun:
    ```sh
    bun install
    ```

## Development

To start the local development server, run the following command. This will launch the application, typically on `http://localhost:3000`.

```sh
bun run dev
```

The server supports hot-reloading, so any changes you make to the source code will be reflected in the browser instantly.

## Deployment

This project is configured for seamless deployment to the Cloudflare network.

### Deploying via Wrangler CLI

1.  Ensure you have the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured.
2.  Run the build command to create a production-ready version of the application:
    ```sh
    bun run build
    ```
3.  Deploy the application using the following command:
    ```sh
    bun run deploy
    ```

### Deploy with Cloudflare Button

You can also deploy this project to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/RullDeef/minevania-proto)