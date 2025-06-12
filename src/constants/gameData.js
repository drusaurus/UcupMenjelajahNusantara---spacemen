// import characters from '../assets/characters.json'
//
// export const AVATARS = characters.map((characters, index) => ({
//     id: `avatar${index + 1}`,
//     name: characters.name,
//     avatar: characters.avatar,
//     alt: characters.name,
//     animation: characters.animation,
//     dead: characters.dead,
// }))
//
// export const LOCATIONS = [
//     {
//         id: "home",
//         name: "Home",
//         area: { xMin: 10, xMax: 35, yMin: 5, yMax: 25 },
//     },
//     {
//         id: "Andrew's house",
//         name: "Andrew's House",
//         area: { xMin: 2, xMax: 17, yMin: 28, yMax: 40 },
//     },
//     {
//         id: "mountain",
//         name: "Mountain",
//         area: { xMin: 50, xMax: 95, yMin: 0, yMax: 25 },
//     },
//     {
//         id: "temple",
//         name: "Temple",
//         area: { xMin: 30, xMax: 65, yMin: 30, yMax: 55 },
//     },
//     {
//         id: "lake",
//         name: "Lake",
//         area: { xMin: 0, xMax: 35, yMin: 75, yMax: 100 },
//     },
//     {
//         id: "beach",
//         name: "Beach",
//         area: { xMin: 50, xMax: 100, yMin: 75, yMax: 100 },
//     },
//     {
//         id: "stasion",
//         name: "Stasion",
//         area: { xMin: 5, xMax: 25, yMin: 55, yMax: 70 },
//     },
//     {
//         id: "forest",
//         name: "Forest",
//         area: { xMin: 60, xMax: 100, yMin: 50, yMax: 70 },
//     },
// ];
//
//
// export const LOCATION_ACTIVITIES = {
//     home: [
//         {
//             id: "cook",
//             name: "Cook a meal",
//             cost: 0,
//             effects: { meal: 35, happiness: 5 },
//             tooltip: "Prepare a tasty dish to restore energy and lift your mood.",
//         },
//         {
//             id: "clean",
//             name: "Clean the house",
//             cost: 0,
//             effects: { hygiene: 30, happiness: 5 },
//             tooltip: "A tidy home brings peace of mind and cleanliness.",
//         },
//         {
//             id: "nap",
//             name: "Take a nap",
//             cost: 0,
//             effects: { sleep: 25 },
//             tooltip: "Recharge with a quick power nap.",
//         },
//         {
//             id: "freelance",
//             name: "Do freelance work",
//             cost: 20,
//             effects: { sleep: -15, meal: -10 },
//             moneyGain: 80,
//             tooltip: "Trade rest and food for money with some side gigs.",
//         },
//     ],
//     beach: [
//         {
//             id: "swim",
//             name: "Go for a swim",
//             cost: 15,
//             effects: { happiness: 20, hygiene: -20, sleep: -10 },
//             tooltip: "Cool off in the sea while having fun!",
//         },
//         {
//             id: "sandcastle",
//             name: "Build sandcastles",
//             cost: 0,
//             effects: { happiness: 15, meal: -5 },
//             tooltip: "Let your creativity flow with sandy masterpieces.",
//         },
//         {
//             id: "seafood",
//             name: "Enjoy seafood",
//             cost: 40,
//             effects: { meal: 35, happiness: 10 },
//             tooltip: "Delicious ocean flavors to satisfy your hunger.",
//         },
//     ],
//     lake: [
//         {
//             id: "fishing",
//             name: "Go fishing",
//             cost: 10,
//             effects: { happiness: 20, sleep: -10, meal: 15 },
//             tooltip: "A relaxing way to catch your next meal.",
//         },
//         {
//             id: "row",
//             name: "Row a boat",
//             cost: 20,
//             effects: { happiness: 10, sleep: -15 },
//             tooltip: "Enjoy the scenery while getting some arm exercise.",
//         },
//         {
//             id: "snack",
//             name: "Have lakeside snack",
//             cost: 15,
//             effects: { meal: 20, happiness: 5 },
//             tooltip: "A light meal with a view of the lake.",
//         },
//     ],
//     temple: [
//         {
//             id: "pray",
//             name: "Pray",
//             cost: 0,
//             effects: { happiness: 25 },
//             tooltip: "Calm your mind and lift your spirit.",
//         },
//         {
//             id: "learn",
//             name: "Learn history",
//             cost: 5,
//             effects: { happiness: 10, sleep: -5 },
//             tooltip: "Gain wisdom from the past through local stories.",
//         },
//         {
//             id: "clean",
//             name: "Clean the temple",
//             cost: 0,
//             effects: { hygiene: 20, happiness: 5, sleep: -10 },
//             tooltip: "Help maintain the sacred space and feel fulfilled.",
//         },
//     ],
//     mountain: [
//         {
//             id: "climb",
//             name: "Climb a peak",
//             cost: 30,
//             effects: { happiness: 30, sleep: -25, meal: -20, hygiene: -30 },
//             tooltip: "A tough but rewarding physical journey.",
//         },
//         {
//             id: "campfire",
//             name: "Sit by a campfire",
//             cost: 5,
//             effects: { happiness: 15, sleep: 5 },
//             tooltip: "Warm up and relax with the cozy firelight.",
//         },
//         {
//             id: "localfood",
//             name: "Try local mountain food",
//             cost: 25,
//             effects: { meal: 30, happiness: 10 },
//             tooltip: "Savor traditional dishes made with local ingredients.",
//         },
//     ],
//     "Andrew's house": [
//         {
//             id: "chat",
//             name: "Chat with your friend",
//             cost: 0,
//             effects: { happiness: 20 },
//             tooltip: "Have a heart-to-heart and strengthen your bond.",
//         },
//         {
//             id: "eat",
//             name: "Eat together",
//             cost: 0,
//             effects: { meal: 30, happiness: 10 },
//             tooltip: "Share a meal and some laughs.",
//         },
//         {
//             id: "movie",
//             name: "Watch a movie",
//             cost: 10,
//             effects: { happiness: 15, sleep: 10 },
//             tooltip: "Relax and enjoy some quality time.",
//         },
//     ],
//     stasion: [
//         {
//             id: "work",
//             name: "Help staff",
//             cost: 0,
//             effects: { sleep: -15, hygiene: -10 },
//             moneyGain: 60,
//             tooltip: "Earn a little extra helping around.",
//         },
//         {
//             id: "snack",
//             name: "Buy snacks",
//             cost: 15,
//             effects: { meal: 25 },
//             tooltip: "Refuel with a quick bite from the station stalls.",
//         },
//         {
//             id: "observe",
//             name: "People watching",
//             cost: 0,
//             effects: { happiness: 10 },
//             tooltip: "Watch the hustle and bustle — it's oddly soothing.",
//         },
//     ],
//     forest: [
//         {
//             id: "gather",
//             name: "Gather herbs",
//             cost: 0,
//             effects: { happiness: 15, sleep: -10 },
//             tooltip: "You might find something useful or valuable.",
//         },
//         {
//             id: "explore",
//             name: "Explore the forest",
//             cost: 10,
//             effects: { happiness: 20, hygiene: -20, sleep: -10 },
//             tooltip: "Adventure awaits among the trees.",
//         },
//         {
//             id: "picnic",
//             name: "Have a picnic",
//             cost: 20,
//             effects: { meal: 25, happiness: 15 },
//             tooltip: "Enjoy a peaceful meal surrounded by nature.",
//         },
//     ],
// };
//
// export const CREATORS = [
//     { name: "Andrew Imanuel Hermawan", nim: "00000114913", image: "/andrew.jpg" },
//     { name: "Fulvian Calya Adhi Pramana", nim: "00000119150", image: "/fulvian.jpg" },
//     { name: "Avirel Andika Putra", nim: "00000136675", image: "/avirel.jpg" },
//     { name: "Theovillus Ch. M. R. Roringkon", nim: "00000116329", image: "/theovilus.jpg" },
// ]
//
// export const INITIAL_PLAYER_STATUS = {
//     meal: 50,
//     sleep: 50,
//     hygiene: 50,
//     happiness: 50,
//     money: 20,
// }
//
// export const INITIAL_GAME_TIME = {
//     day: 1,
//     hour: 8,
//     minute: 0,
// }
//
// // Time of day constants
// export const TimeOfDay = {
//     MORNING: "morning",
//     AFTERNOON: "afternoon",
//     EVENING: "evening",
//     NIGHT: "night",
// }
//
// // Map background images for different times of day
// export const MAP_BACKGROUNDS = {
//     [TimeOfDay.MORNING]: "/morning_map.png",
//     [TimeOfDay.AFTERNOON]: "/afternoon_map.png",
//     [TimeOfDay.EVENING]: "/evening_map.png",
//     [TimeOfDay.NIGHT]: "/night_map.png",
// }
//
// // Time ranges for different times of day
// export const TIME_RANGES = {
//     [TimeOfDay.MORNING]: { start: 5, end: 10 },
//     [TimeOfDay.AFTERNOON]: { start: 11, end: 14 },
//     [TimeOfDay.EVENING]: { start: 15, end: 19 },
//     [TimeOfDay.NIGHT]: { start: 20, end: 4 },
// }
//
// export const INITIAL_PLAYER_POSITION = {
//     x: 15,
//     y: 18,
// }
//
// // Convert enum to object with constants
// export const GameScreen = {
//     START: "start",
//     AVATAR_SELECTION: "avatar_selection",
//     GAME_ARENA: "game_arena",
//     GAME_OVER: "game_over",
//     CREATORS: "creators",
// }
//
