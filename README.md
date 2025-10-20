# ☄️ Meteor Impact Simulator

An interactive visualization tool for modeling **asteroid impact scenarios**, combining **NASA’s Near-Earth Object data** with **AI-driven analysis** powered by the Google Gemini API.

### 🖼️ Project Screenshot
![Project Screenshot](https://github.com/kevin030-anto/Meteor-Impact-Simulator/blob/main/Demo/Screenshot%202025-10-08%20015816.png)

---

## ✨ Features

### 🔧 Manual Input
Define a meteor’s parameters manually:
- Speed  
- Diameter  
- Mass  
- Impact angle  
- Composition  

### 🌌 NASA Data Integration
Fetch **real Near-Earth Object (NEO)** data directly from the **NASA NeoWs API** using a NEO ID.

### 🗺️ Interactive Map Selection
Choose the impact location by:
- Clicking on a **world map** (Leaflet integration)
- Entering precise **latitude and longitude** values

### 🌍 Real-Time 3D Visualization
Experience a **3D simulation** of:
- Meteor’s approach  
- Atmospheric entry  
- Impact  
- Resulting dust cloud  

Built with **React Three Fiber** for realistic visualization.

### 🤖 AI-Powered Impact Analysis
Generate a **detailed, multi-section report** using the **Google Gemini API**, analyzing:
- Environmental effects  
- Blast radius  
- Crater formation  
- Seismic impact  
- Recommended evacuation zones  

### 📊 Key Metrics
Automatically calculates:
- **Impact Energy (megatons)**
- **Crater Diameter**
- **Blast Radius**
- **Evacuation Zone**
- **Seismic Magnitude**

---

## 🚀 Getting Started

Follow the steps below to set up the Meteor Impact Simulator on your local machine.

### 1️⃣ Download from GitHub

#### Using Git (Recommended)
```sh
git clone https://github.com/kevin030-anto/meteor-impact-simulator.git
```

```sh
cd meteor-impact-simulator 
```

### Using ZIP Download

- Visit the [GitHub Repository](https://github.com/kevin030-anto/Meteor-Impact-Simulator)

- Click the green <> Code button
  
- Select Download ZIP
  
- Unzip to your preferred directory

### 2️⃣ Get API Keys

You’ll need two API keys to run this project.

### 🧠 A. Google GEMINI_API_KEY

- Go to [Google AI Studio](https://aistudio.google.com)

- Sign in with your Google account

- Click Get API key (or Create API key)

- Copy the generated key

### 🚀 B. NASA_API_KEY

- Go to the [NASA Open APIs](https://api.nasa.gov) website

- Fill in your details to Generate API Key

- API Key will send to registered email ID 

- Copy your personal API key (avoid using the default DEMO_KEY due to rate limits)

### 3️⃣ Configure Environment

- In the root folder, find .env.local

- Open it in a text editor

- Add your keys as follows:

```sh
# Google Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE" #<---past your Gemini API key

# NASA API Key
NASA_API_KEY="YOUR_NASA_API_KEY_HERE"  #<---past your NASA API key
```

### 4️⃣ Install & Run the Project
**Step 1:** Install Node.js

If not already installed, download the LTS version of Node.js
.

**Step 2:** Install Dependencies

Open your terminal in the project’s root directory and run:
```sh
npm install
```
```sh
npm install react@18 react-dom@18
```

**Step 3:** Start the Development Server
```sh
npm run dev
```

Then open your browser and navigate to: http://localhost:3000

### 5️⃣ Troubleshooting

If you encounter errors during installation, try the following:

Resolve peer dependency issues:
```sh
npm install --legacy-peer-deps
```
Force install (use with caution):
```sh
npm install --force
```

---

## 🧩 Tech Stack

- React 18

- React Three Fiber (3D Visualization)

- Leaflet (Map Interaction)

- Google Gemini API (AI Analysis)

- NASA NeoWs API (Asteroid Data)

- Vite / Next.js (depending on setup)

---

## 📁 Folder Structure (Overview)
```sh
meteor-impact-simulator/
│
├── public/                # Static assets
├── src/
│   ├── components/        # UI and 3D scene components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions and calculations
│   ├── pages/             # Main app pages
│   └── styles/            # CSS / Tailwind styles
│
├── .env.local             # Environment variables
├── package.json
├── README.md
└── vite.config.js
```

---

## 🛰️ Example Use Case

- Select a real asteroid from NASA’s database.

- Choose an impact point on the map.

- Adjust speed, mass, and angle parameters.

- Watch the 3D simulation unfold.

- Generate an AI impact report detailing the consequences.

---

## 📜 License

This project is licensed under the MIT License — feel free to use, modify, and distribute it as long as proper credit is given.

---

## Sample Images and Videos

Resources: [Link](https://github.com/kevin030-anto/Meteor-Impact-Simulator/tree/main/Demo)

---

## Project Link

Project Link: [Meteor Impact Simulator](https://spaceappschallenge-meteor-impact-si.vercel.app/)

**QR Code**

![QR Code](https://github.com/kevin030-anto/Meteor-Impact-Simulator/blob/main/Demo/Image10-11-14-43-25.png)

---

## 💡 Author

GitHub: [@kevin030-anto](https://github.com/kevin030-anto)

“Simulate. Visualize. Understand the impact.”

---
