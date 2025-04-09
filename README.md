# UMN – Ucup Menjelajah Nusantara 🧭

A travel simulation browser game built with React and Vite for the mid-term exam of IF231L Introduction to Internet Technology at Universitas Multimedia Nusantara.

## 👥 Group Members

- Andrew Imanuel Hermawan - 00000114913
- Fulvian Calya Adhi Pramana - 00000119150
- Avirel Andika Putra - 00000136675
- Theovillus Ch. M. R. Roringkon - 00000116329

---

## 🚀 Setup Instructions

You can run this project using one of the following methods:

### Extract from ZIP File

1. Extract the ZIP `UcupMenjelajahNusantara---spacemen`.

2. Open the extracted folder in your terminal.

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
- Station 🚉
- Beach 🏖️
- Lake 🦢
- Temple 🛕
- Mountain ⛰️
- Forest 🌲

### 🧐 Movement
- Control your avatar with **keyboard arrow keys**, **WASD key** or **on-screen buttons**.
- Movement between locations changes available activities.

### ⚙ Activities by Location
Each location offers unique activities that affect your stats (meal, sleep, hygiene, happiness, and money). Some activities are free, while others have a cost or provide income. Here's a summary of what you can do in each location:

- Home: Cook, clean, nap, or earn money via freelance work.

- Beach: Swim, build sandcastles, and enjoy seafood.

- Lake: Go fishing, row a boat, or enjoy a lakeside snack.

- Temple: Pray, learn history, or help clean the temple.

- Mountain: Climb, relax by a campfire, or try local food.

- Andrew's House: Socialize with a friend, share meals, or watch a movie.

- Stasion: Help staff for money, buy snacks, or people-watch.

- Forest: Gather herbs, explore, or enjoy a picnic.

**ℹ Hover Info**: Any activity that affects money includes an info icon with a tooltip explanation.

### 📉 Status Degradation
- Stats gradually drop over time.
- Activities influence stat change speed.
- Ignoring certain needs can reduce the effect of other actions (e.g., exploring while hungry = less happiness gain).

### 💀 Game Over
- If **any stat hits 0**, the game ends with a **Game Over screen**.

---

🧠 Good luck exploring Nusantara with Ucup!

