# UMN – Ucup Menjelajah Nusantara 🧭

A travel simulation browser game built with React and Vite for the mid-term exam of IF231L Introduction to Internet Technology at Universitas Multimedia Nusantara.
The game is hosted at https://ucup-menjelajah-nusantara-spacemen.vercel.app/
## 👥 Group Members

- Andrew Imanuel Hermawan - 00000114913
- Avirel Andika Putra - 00000136675
- Theovillus Ch. M. R. Roringkon - 00000116329

---

## 🚀 Setup Instructions

### Extract from ZIP File

1. Extract the ZIP `UcupMenjelajahNusantara---spacemen`.

2. Open the extracted folder in your terminal, then open folder `UcupMenjelajahNusantara---spacemen-main`.
```bash
cd UcupMenjelajahNusantara---spacemen-main
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The app will run at `http://localhost:3000` by default.

---

## 🔹 Gameplay Rules
- Player must collect as much score as possible throughout the game. Score can be obtained through exploring different locations, doing various activities, eating various foods, and obtaining rare items. Play as long as possible to reach the highest score.
- Player's status will degrade every 10 seconds, make sure to keep the status at a healthy value to gain maximum points.
- 

### 🎭 Starting the Game
- Players choose their **avatar** and input their **name**.
- Click "Start Exploring" to begin the journey.

### 📈 Player Status
You must manage 5 key stats:
- **Meal (Hunger)**
- **Sleep (Energy)**
- **Hygiene**
- **Happiness**
- **Money** (displayed as a number)

Each stat is represented by a progress bar, starting at 50%.

### ⏰ Time Simulation
- In-game time progresses faster than real-time (e.g., 1 second IRL = 1 minute in-game).
- Time affects greetings (e.g., “Good morning”, “Good night”) and stat decay.

### 🗺 Locations
There are the **distinct locations**, such as:
- Home 🏠
- Andrew's House 🏡
- Beach 🏖️
- Lake 🦢
- Temple 🛕
- Mountain ⛰️
- Forest 🌲

### 🧐 Movement
- Control your avatar with **keyboard arrow keys**, **WASD key** or **on-screen buttons**.
- Movement between locations changes available activities.

### ⚙ Activities by Location
Each location offers unique activities that affect your stats (meal, sleep, hygiene, happiness, and money). Some activities are free, while others have a cost or provide income. Every locations have different areas which player can explore and do activities to obtain many things. Do as many activities to gain maximum points.

### 📉 Status Degradation
- Stats gradually drop over time.
- Activities influence stat change speed.
- Ignoring certain needs can reduce the effect of other actions (e.g., exploring while hungry = less happiness gain).

### 💀 Game Over
- If **any stat hits 0**, the game ends with a **Game Over screen**.

---

🧠 Good luck exploring Nusantara with Ucup!

