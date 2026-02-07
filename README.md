# DS-PRAVAAH-THE-4BITS
AI-powered Causal Traceability Dashboard. Features a predictive model trained to identify system bottlenecks and event causality. Built with Next.js, Tailwind, and Python.
# 4bits: AI-Powered Causal Traceability Dashboard

# 🚀 Overview
4bits is a full-stack solution designed for **Causal Traceability**. It combines a Python-based AI engine with a modern Next.js dashboard to help users visualize and analyze complex data relationships and system health in real-time.

---

#🧠 The Intelligence Layer (Backend)
The core of 4bits is an AI model trained to identify causality within system logs and data streams.
* **Technology**: Python, FastAPI
* **Key Features**: 
    * Automated data evaluation (`evaluation_results.csv`).
    * Custom inference engine for causal mapping.
    * Modular architecture for scaling model updates.

# 💻 The Interface (Frontend)
A developer-centric dashboard built for high-density data visualization.
* **Technology**: Next.js 15, TypeScript, Tailwind CSS
* **Key Features**:
    * **Dynamic Health Metrics**: Real-time visualization of system vitals.
    * **Responsive Design**: Optimized for all screen sizes.
    * **Dark Mode**: Sleek UI to reduce cognitive load during analysis.

---

# 🛠️ Installation & Setup

## Backend Setup
1. Navigate to `/backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `python main.py`

## Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Run development mode: `npm run dev`

---

# 🏗️ Project Structure
* **`/backend`**: Python FastAPI server, ML models, and data processing scripts.
* **`/frontend`**: Next.js application including the App Router and Tailwind styling.
* **`/data`**: Evaluation results and datasets used for model training.

---

### 👥 Team
* **Ankit** — Full-Stack Developer & AI Engineer

## Folder Structure 
THE 4BITS/
├── backend/                # AI & ML Logic (Python/FastAPI)
│   ├── models/             
│   │   └── training.ipynb  # <--- NEW: Model training & testing logic
│   ├── data/               
│   │   └── dataset.json    # <--- NEW: Raw data used for training
│   ├── main.py             # Backend entry point
│   └── requirements.txt    # Python dependencies
├── frontend/               # User Interface (Next.js/React)
│   ├── src/                
│   │   ├── app/            # Pages & Global CSS
│   │   └── lib/            # API services
│   ├── package.json        
│   └── tailwind.config.ts  
└── README.md               # Main Documentation
