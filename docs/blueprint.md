# **App Name**: Autonomous Structural Intelligence System

## Core Features:

- Floor Plan Uploader: Enable users to upload 2D floor plans (PNG) via a dedicated dropzone and display a mock processing pipeline status (Parsing -> Graphing -> 3D Ready).
- Interactive 3D Model Viewer: Render and display 3D models of processed floor plans with interactive camera controls (pan, zoom, rotate), dynamically coloring 'load_bearing' walls red and 'partition' walls blue based on backend data.
- AI Material Recommendation Display: Present AI-generated explanations and material tradeoff scores (Strength vs. Cost) for selected elements of the 3D model, utilizing a generative AI tool to provide clear and concise material insights.
- Stellar Wallet Integration: Allow users to securely connect their Stellar wallet via the Freighter extension to enable Web3 functionalities within the application.
- Mock Stellar Audit Transaction: Simulate a Stellar blockchain transaction for verifying audit information related to the structural design, returning a dummy transaction hash upon successful mock completion.

## Style Guidelines:

- Primary UI Accent: Vibrant Blue (#48A2FF) to highlight interactive elements and convey a high-tech feel against the dark background.
- Background Color: Deep Slate Blue (#1A2026) for a clean, modern, and high-tech dark-mode industrial aesthetic.
- Secondary Accent: Cyan (#19D1D1) for a sharp, contrasting pop in specific UI components, providing an analogous but distinct complement to the primary blue.
- 3D Model - Load-Bearing Walls: Solid Red (#FF0000) for explicit visual identification within the 3D environment.
- 3D Model - Partition Walls: Solid Blue (#0000FF) for clear differentiation and identification within the 3D environment.
- Headline and Body Font: 'Space Grotesk' (sans-serif) for its modern, computerized, and scientific feel, aligning with the project's high-tech theme and ensuring readability for dashboard content.
- Code and Data Display Font: 'Source Code Pro' (monospace) for displaying technical information such as transaction hashes, ensuring monospace consistency and readability.
- Icons: Utilize the `lucide-react` library for all UI iconography, maintaining a clean, consistent, and modern line-icon aesthetic suitable for a high-tech dashboard.
- Dashboard Structure: A full-screen, responsive dashboard layout consisting of a fixed top header, a left sidebar for file upload and processing status, a main central canvas for 3D visualization, and a right sidebar for AI-driven material intelligence.
- Subtle UI Transitions: Implement smooth and understated transitions for elements like processing status updates and component state changes to enhance perceived performance and user experience in a high-tech environment.