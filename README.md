# Meteor Impact Simulator

An interactive visualization and simulation tool for modeling asteroid impact scenarios using real NASA and USGS data. Built for the NASA Space Apps Challenge 2025.

## Features

- **Manual Location Selection**: Input precise latitude/longitude coordinates or select from preset locations
- **Interactive 2D Earth Map**: Visual selection of impact zones with coordinate display
- **Meteor Parameter Configuration**: 
  - Manual input for speed, size, mass, angle, and composition
  - NASA API integration to load real asteroid data
  - Auto-calculation of mass based on size and composition
- **3D Visualization**:
  - Animated meteor approach with trail effects
  - Rotating 3D Earth model with impact markers
  - Cosmic dust cloud simulation post-impact
- **AI-Powered Impact Analysis**:
  - Gemini API integration for detailed impact reports
  - Damage zone calculations (blast radius, evacuation zones)
  - Casualty and infrastructure damage estimates
  - Environmental effects analysis
  - Seismic activity predictions
- **Report Generation**:
  - Download reports in TXT, HTML, or JSON formats
  - Copy to clipboard functionality
  - Comprehensive metrics and detailed analysis

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React Three Fiber** - 3D visualization with Three.js
- **@react-three/drei** - 3D helpers and components
- **Google Gemini AI** - Impact analysis generation
- **NASA APIs**:
  - Near-Earth Object (NEO) API
  - Near-Earth Comets - Orbital Elements API
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- NASA API key (get one at https://api.nasa.gov/)
- Google Gemini API key (optional, falls back to mock data)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   \`\`\`
   NASA_API_KEY=your_nasa_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Setup**: Configure meteor parameters manually or load from NASA API
2. **Location**: Select impact coordinates on the 2D Earth map
3. **Simulate**: Watch the 3D visualization of the meteor impact
4. **Report**: View and download the AI-generated impact analysis

## NASA Data Sources

- [NASA Near-Earth Object API](https://api.nasa.gov/)
- [Near-Earth Comets - Orbital Elements](https://data.nasa.gov/resource/b67r-rgxc.json)
- [USGS Earthquake Catalog](https://earthquake.usgs.gov/)
- [USGS National Map Elevation Data](https://www.usgs.gov/programs/national-geospatial-program/national-map)

## Scientific Models

The simulator uses established scientific formulas:
- **Kinetic Energy**: E = 0.5 × m × v²
- **Crater Scaling**: Based on impact energy and geological factors
- **Blast Radius**: Scaled from TNT equivalent energy
- **Seismic Magnitude**: Calculated from impact energy

## Disclaimer

This tool is for educational and planning purposes only. Actual impact effects may vary based on numerous factors including terrain, weather conditions, local geology, and infrastructure. The AI-generated analysis should not be used as the sole basis for emergency planning decisions.

## License

MIT License - Built for NASA Space Apps Challenge 2025

## Acknowledgments

- NASA for providing open data APIs
- USGS for geological and seismic data
- Google for Gemini AI API
- The open-source community for amazing tools and libraries
