# 🌍 GEOPOLIS

### **A Live Geopolitical Intelligence & World Simulation Platform**

> **Track global tensions. Explore alliances. Monitor economic pressure. Simulate possible futures.**

**GEOPOLIS** is an interactive geopolitical intelligence dashboard designed to transform fragmented global information into a single visual experience.

Instead of treating geopolitics as a collection of static articles and tables, GEOPOLIS combines **live external data, geopolitical relationships, economic indicators, risk scoring and scenario simulation** into one unified platform.

It allows users to explore:

* 🌍 Global geopolitical events
* ⚔️ Conflicts and tensions
* 🕊️ Diplomatic activity
* 🤝 International treaties and alliances
* 💰 Economic indicators
* 🚫 Sanctions and economic pressure
* 📊 Country-level risk
* 🧠 Hypothetical geopolitical scenarios
* 🔮 A **Future World Simulator**

---

## ✨ Why GEOPOLIS?

Geopolitical information is distributed across news platforms, economic databases, government publications and international datasets.

GEOPOLIS attempts to bring these different signals together into a single interface.

The platform follows a simple idea:

```text
LIVE DATA
   ↓
DATA NORMALIZATION
   ↓
GEOPOLITICAL SIGNALS
   ↓
RISK / IMPACT SCORING
   ↓
VISUALIZATION
   ↓
USER INTERPRETATION
   ↓
SCENARIO SIMULATION
```

The goal is **not to predict the future**.

Instead, GEOPOLIS provides an interactive environment where users can explore how different assumptions could influence geopolitical stability.

---

# 🚀 Core Features

## 1. 🧠 Intelligence

The Intelligence module acts as the primary geopolitical monitoring layer.

It collects and organizes current geopolitical information and converts it into visual signals.

### Features

* Live geopolitical events
* Conflict monitoring
* Tension monitoring
* Diplomacy monitoring
* Country-specific news
* Country event timelines
* Global news feed
* Geopolitical risk indicators
* War / Tension / Stable classification
* Interactive world map
* Country selection and contextual information

### Risk Classification

GEOPOLIS uses its own scoring layer rather than blindly displaying raw API information.

Conceptually:

```text
Event
 ↓
Category
 ↓
Sentiment / Severity
 ↓
Country relevance
 ↓
Weighted score
 ↓
Risk classification
```

Example:

```text
High negative conflict signal
        ↓
Higher risk contribution
        ↓
WAR / HIGH TENSION
```

While neutral diplomatic or cooperative events can reduce the overall tension contribution.

> The scoring system is an analytical visualization layer, not an official geopolitical risk index.

---

# 🗺️ Interactive World Map

The world map provides the main visual overview of geopolitical activity.

Countries/events can be represented using visual risk indicators.

### Example states

🔴 **War / Severe Conflict**

🟡 **Tension / Elevated Risk**

🟢 **Stable / Lower Risk**

Users can select countries to inspect their associated information.

The map is designed as an information layer rather than simply being decorative.

---

# 📰 Live News & Country Intelligence

The Intelligence system supports country-focused exploration.

A user can select a country and view:

```text
Country
   ↓
Current Events
   ↓
Relevant Articles
   ↓
Recent Timeline
   ↓
Risk Signals
```

This allows GEOPOLIS to move from:

**Global → Regional → Country-level analysis**

without leaving the platform.

---

# 🤝 2. Treaties & Alliance Network

The Treaties module visualizes the diplomatic structure of the modern world.

Instead of presenting treaties as a simple list, GEOPOLIS represents countries and their relationships as a network.

### Covered relationship groups

* NATO
* BRICS
* QUAD
* European Union
* ASEAN
* Bilateral agreements
* Strategic partnerships
* Defense relationships

---

## 🔗 Alliance Network Graph

Countries are represented as nodes.

Treaties and strategic relationships become connections between nodes.

Conceptually:

```text
        Country
        /     \
   Treaty     Treaty
     /           \
Country ------- Country
```

This allows users to explore the interconnected nature of international relations.

### Interactions

* Drag nodes
* Zoom
* Explore connections
* Search countries
* Filter alliance groups
* Inspect relationships
* Select countries
* Explore treaty details

---

# 📚 Treaty Database

GEOPOLIS includes a structured treaty dataset containing important international agreements and strategic relationships.

Each treaty can contain information such as:

```text
Treaty
├── Name
├── Organization
├── Year
├── Members
├── Status
├── Category
└── Summary
```

Users can search and filter the database.

Example:

```text
Search → India

        ↓

India–Russia
India–France
QUAD
BRICS
Other relationships
```

---

# 💰 3. Economic & Sanctions Pulse

Geopolitical stability cannot be separated from economics.

The Economy module connects geopolitical pressure with macroeconomic indicators.

### Main areas

* Global economic indicators
* GDP growth
* Country GDP growth
* Economic comparisons
* Sanctions
* Trade-related indicators
* Economic impact visualization

---

# 📈 World Bank Integration

GEOPOLIS uses World Bank indicators as one of its external data sources.

The application can request global/country economic indicators through the World Bank API.

Example data flow:

```text
World Bank API
      ↓
API Service
      ↓
Data Normalization
      ↓
React State / Query Layer
      ↓
Charts & Indicators
```

This allows the economic dashboard to display external data rather than relying entirely on hardcoded values.

---

# 🚫 Sanctions Tracker

Economic sanctions are represented as relationships between countries or political entities.

Example concept:

```text
Country A
   │
   │ Sanction
   ▼
Country B
```

The tracker can display:

* Sender
* Target
* Sanction type
* Reason
* Economic context
* Estimated impact where available

The objective is to make economic pressure easier to understand visually.

---

# 📊 Economic Impact Dashboard

The dashboard can compare economic indicators across countries and time periods.

Examples include:

* Global GDP growth
* Country GDP growth
* India vs global trends
* Pre-sanction vs post-sanction comparisons
* Historical economic movement

Charts are rendered interactively rather than using static images.

---

# 🔮 4. Future World 2035 Simulator

One of the primary differentiating features of GEOPOLIS is the **Future World Simulator**.

Instead of simply showing current geopolitical information, the simulator allows users to change assumptions and observe a hypothetical outcome.

### Core idea

```text
USER ASSUMPTIONS
       ↓
SCENARIO ENGINE
       ↓
COUNTRY IMPACTS
       ↓
REGIONAL IMPACT
       ↓
GLOBAL RISK
       ↓
2035 SIMULATION
```

---

## 🎛️ Scenario Controls

Users can experiment with hypothetical geopolitical conditions.

For example:

```text
Oil Shock
Trade Restrictions
Military Escalation
Diplomatic Cooperation
Alliance Expansion
Economic Sanctions
Regional Instability
```

The user changes scenario parameters.

The simulation engine then calculates relative changes in:

* Global risk
* Regional risk
* Country impact
* Economic pressure
* Stability indicators

---

# 🧮 Simulation Engine

The simulator is **scenario-based**, not a real-world prediction model.

A simplified conceptual model:

```text
Global Risk =
    Conflict Impact
  + Economic Shock
  + Sanction Pressure
  + Regional Instability
  - Diplomatic Stability
```

The actual implementation can apply different weights to each variable.

The output is therefore a **hypothetical analytical visualization**.

It should not be interpreted as a prediction of actual events.

---

# 🌎 Regional Risk

The simulator groups countries into regions and calculates relative regional effects.

Example:

```text
Scenario
   ↓
Asia
   ├── India
   ├── China
   ├── Japan
   └── Pakistan

Europe
   ├── Germany
   ├── France
   └── Ukraine
```

A scenario can therefore produce different effects across different regions.

---

# 🏳️ Country Impact

Each selected scenario can generate country-specific impact indicators.

Example:

```text
Country
Risk Change
Economic Impact
Stability
Exposure
```

This allows users to compare how the same global scenario could affect different countries.

---

# 🏗️ Architecture

GEOPOLIS follows a modular React architecture.

```text
GEOPOLIS/
│
├── public/
│   └── data/
│
├── src/
│   ├── components/
│   │   ├── map/
│   │   ├── news/
│   │   ├── graph/
│   │   ├── treaty/
│   │   ├── economic/
│   │   └── simulator/
│   │
│   ├── pages/
│   │   ├── Intelligence
│   │   ├── Treaties
│   │   ├── Economy
│   │   ├── Countries
│   │   ├── Compare
│   │   └── Simulator
│   │
│   ├── services/
│   │   ├── API clients
│   │   ├── data normalization
│   │   └── external data services
│   │
│   ├── hooks/
│   │
│   ├── store/
│   │
│   ├── utils/
│   │
│   ├── App
│   ├── main
│   └── index.css
│
├── package.json
├── vite.config
└── README.md
```

---

# 🔄 Data Architecture

GEOPOLIS uses a hybrid data architecture.

```text
                 ┌───────────────┐
                 │ External APIs │
                 └───────┬───────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Service Layer   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Normalize Data  │
                └────────┬────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Live Data              Local Fallback
              │                     │
              └──────────┬──────────┘
                         ▼
                ┌─────────────────┐
                │ Application     │
                │ State / Query   │
                └────────┬────────┘
                         ▼
                ┌─────────────────┐
                │ UI Components   │
                └─────────────────┘
```

This architecture prevents the entire application from becoming unusable when an external API is unavailable.

---

# 🌐 External Data

GEOPOLIS is designed around APIs that can provide dynamic information.

### Economic Data

**World Bank API**

Used for:

* GDP indicators
* Country economic indicators
* Global economic trends

### Geopolitical / News Data

The application architecture supports external geopolitical/news feeds for:

* Current events
* Conflict-related information
* Country news
* Diplomatic activity

Because public APIs can change their limits, availability and authentication requirements, the application contains fallback mechanisms where appropriate.

---

# 🛡️ API Resilience

A major design principle of GEOPOLIS is:

> **Live data should enhance the application, not destroy it when unavailable.**

The data layer can follow:

```text
LIVE API
   ↓
Success?
 ┌─┴─┐
YES  NO
 │    │
 ▼    ▼
Live  Cache/Fallback
      ↓
    UI continues
```

This makes the application more resilient to:

* Rate limits
* Temporary outages
* Network failures
* API changes
* CORS restrictions

---

# ⚡ State Management

GEOPOLIS uses modern React state architecture.

### Zustand

Used for lightweight application-level state such as:

* Selected country
* User selections
* Global UI state
* Simulator state where applicable

### TanStack Query

Used where server/API data benefits from:

* Caching
* Refetching
* Loading states
* Error handling
* Stale data management

This separates **application state** from **server state**.

---

# 🧰 Technology Stack

| Technology                | Purpose                        |
| ------------------------- | ------------------------------ |
| React                     | Application UI                 |
| Vite                      | Development & production build |
| React Router              | Application routing            |
| Tailwind CSS              | Styling                        |
| Framer Motion             | Animations                     |
| Zustand                   | Client state                   |
| TanStack Query            | Server/API state               |
| Axios                     | HTTP requests                  |
| Recharts                  | Economic charts                |
| React Force Graph         | Treaty/Sanction networks       |
| React Leaflet / map layer | Geographic visualization       |
| Lucide React              | Icons                          |
| date-fns                  | Date processing                |
| World Bank API            | Economic data                  |

---

# 🎨 Design System

GEOPOLIS intentionally avoids the typical dashboard aesthetic of pure white cards and black text.

The visual language is based on a dark geopolitical interface with:

* Deep teal backgrounds
* Soft teal highlights
* Warm gold accents
* Coral warning states
* Glass panels
* Subtle gradients
* Animated indicators
* Network visualizations
* Map-based information

### Visual States

```text
🟢 Stable
🟡 Tension
🔴 Conflict
🔵 Diplomatic
```

The interface uses motion and visual hierarchy to make a large amount of information easier to scan.

---

# 📱 Responsive Design

GEOPOLIS is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

Major dashboards transform into stacked layouts on smaller screens.

Navigation changes into a mobile menu when required.

---

# 🛣️ Application Routes

The platform is organized into dedicated sections:

```text
/                    → Intelligence
/intelligence        → Intelligence Dashboard
/simulator           → Future World Simulator
/treaties            → Treaty & Alliance Network
/economy             → Economic Dashboard
/countries           → Country Explorer
/compare             → Country Comparison
```

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Tanishka-Sharma0/GEOPOLIS.git
cd GEOPOLIS
```

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start development:

```bash
npm run dev
```

---

# 🏭 Production Build

Create the production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The production build is generated inside:

```text
dist/
```

---

# 🚀 Deployment

GEOPOLIS is configured for deployment as a Vite application.

For GitHub Pages, the Vite base path is configured for:

```text
/GEOPOLIS/
```

Deployment command:

```bash
npm run deploy
```

The deployment generates the production build and publishes the `dist` directory.

---

# 🔐 Environment Variables

Public API endpoints can be consumed directly from the browser when their CORS and usage policies allow it.

However, **secret API keys must never be treated as secure inside a client-side Vite application**.

A variable such as:

```text
VITE_API_KEY
```

is ultimately exposed to the browser after the application is built.

For production applications requiring secret credentials, a backend/API proxy should be used.

---

# 🧠 Analytical Philosophy

GEOPOLIS deliberately separates:

### FACT

Information retrieved from an external dataset or API.

### SIGNAL

A normalized representation of an event.

### SCORE

A calculated value generated by GEOPOLIS.

### SIMULATION

A hypothetical scenario generated from user-controlled assumptions.

For example:

```text
News/Event
    ↓
FACT

Event severity
    ↓
SIGNAL

Weighted geopolitical calculation
    ↓
SCORE

User changes assumptions
    ↓
SIMULATION
```

This distinction is important because a calculated risk score is **not equivalent to an official government, military or financial assessment**.

---

# ⚠️ Limitations

GEOPOLIS is an analytical visualization and simulation project.

It does **not** claim to provide:

* Official intelligence
* Military intelligence
* Financial advice
* Government assessments
* Guaranteed geopolitical predictions

External APIs may also have:

* Rate limits
* Downtime
* CORS restrictions
* Changing response formats
* Authentication requirements

For that reason, GEOPOLIS uses resilient data handling wherever possible.

---

# 🔮 Future Improvements

Potential future versions could include:

### AI Geopolitical Analyst

Automatically summarize events and explain:

```text
What happened?
Why does it matter?
Which countries are affected?
What could happen next?
```

### Advanced Event Correlation

Connect multiple events into geopolitical chains:

```text
Sanction
   ↓
Trade disruption
   ↓
Commodity pressure
   ↓
Economic impact
   ↓
Political tension
```

### Historical Geopolitical Timeline

Allow users to move through:

```text
1990 → 2000 → 2010 → 2020 → 2030
```

and observe geopolitical changes.

### Scenario Comparison

Compare multiple futures:

```text
Scenario A
vs
Scenario B
vs
Scenario C
```

### AI-Assisted Simulation

Allow natural-language scenarios such as:

> "What if global oil prices double and major economies impose new trade restrictions?"

The system could convert the scenario into simulation parameters.

---

# 🎯 Project Goals

GEOPOLIS was built around five major goals:

### 01 — Visualize

Make complex geopolitical relationships understandable.

### 02 — Connect

Bring events, treaties and economics into one platform.

### 03 — Analyze

Transform raw information into interpretable signals.

### 04 — Simulate

Allow users to experiment with hypothetical futures.

### 05 — Explore

Make geopolitical research interactive rather than static.

---

# 🧩 What Makes GEOPOLIS Different?

Most portfolio dashboards are:

```text
API → Cards → Table → Chart
```

GEOPOLIS attempts to go further:

```text
API
 ↓
DATA
 ↓
GEOPOLITICAL MODEL
 ↓
RELATIONSHIPS
 ↓
RISK SIGNALS
 ↓
INTERACTIVE MAP
 ↓
NETWORK GRAPH
 ↓
ECONOMIC IMPACT
 ↓
FUTURE SIMULATION
```

The result is a project that combines:

**Frontend Engineering + Data Visualization + API Integration + Geopolitical Modeling + Interactive Simulation**

in a single application.

---

# 👩‍💻 Built With

**React • Vite • Tailwind CSS • Zustand • TanStack Query • Axios • Recharts • Framer Motion • React Force Graph • World Bank API**

---

# 📜 Disclaimer

GEOPOLIS is an educational and experimental software project.

Its risk scores, classifications and future scenarios are generated by application logic and should not be interpreted as official geopolitical intelligence, predictions or professional financial analysis.

External data remains subject to the accuracy, availability and terms of its respective providers.

---

# ⭐ Explore GEOPOLIS

**GEOPOLIS — See the world as a system, not as isolated events.**

If you find the project interesting, consider ⭐ starring the repository and exploring the different geopolitical modules.
