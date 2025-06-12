import Emotes from "./emotes.js";

export const LOCATIONS_ON_WORLD_MAP = [
    {
        id: "home",
        name: "Home",
        area: { xMin: 10, xMax: 35, yMin: 5, yMax: 25 },
        scoreValue: 10,
        description: "Your humble abode.",
    },
    {
        id: "andrew_house",
        name: "Andrew's House",
        area: { xMin: 2, xMax: 17, yMin: 28, yMax: 40 },
        scoreValue: 15,
        description: "A cozy place full of books and mysteries.",
    },
    {
        id: "mountain",
        name: "Mountain",
        area: { xMin: 50, xMax: 95, yMin: 0, yMax: 25 },
        scoreValue: 20,
        description: "A cold, windy place with a breathtaking view.",
    },
    {
        id: "temple",
        name: "Temple",
        area: { xMin: 30, xMax: 65, yMin: 30, yMax: 55 },
        scoreValue: 30,
        description: "A mysterious temple full of ancient secrets.",
    },
    {
        id: "lake",
        name: "Lake",
        area: { xMin: 0, xMax: 35, yMin: 60, yMax: 90 },
        scoreValue: 15,
        description: "A calm lake surrounded by forest.",
    },
    {
        id: "beach",
        name: "Beach",
        area: { xMin: 50, xMax: 100, yMin: 75, yMax: 100 },
        scoreValue: 10,
        description: "Golden sands and crashing waves await.",
    },
    {
        id: "forest",
        name: "Forest",
        area: { xMin: 60, xMax: 100, yMin: 50, yMax: 70 },
        scoreValue: 10,
        description: "A dense forest full of wildlife and mystery.",
    },
];


export const INNER_LOCATIONS_DETAILS = {
    "home": {
        name: "Home",
        avatarScaleDivider: 8,
        speedModifier: 2,
        background: "HomeMap.png",
        defaultPlayerSpawn: { x: 50, y: 75 },
        activityZones: [
            {
                id: "home_kitchen",
                name: "Kitchen",
                areaInScene: { xMin: 35, xMax: 75, yMin: 22, yMax: 52 },
                activities: [
                    {
                        id: "cook_indomie",
                        name: "Cook Indomie",
                        description: "Indomie, the best noodle in the world. A quick and satisfying meal.",
                        mode: "gradual_ff",
                        animation: Emotes.emote6,
                        duration: 10,
                        costs: {
                            items: [
                                {itemId: "indomie", quantity: 1 },
                            ],
                            status: {
                                sleep: -5,
                            }
                        },
                        effects: {
                            hygiene: -10,
                            happiness: 20,
                        },
                        rewards: {
                            items: [
                                { itemId: "cooked_indomie", quantity: 1 },
                            ],
                            playerStatus: {
                                score: 20,
                            }
                        }
                    },
                    {
                        id: "wash_dishes",
                        name: "Wash Dishes",
                        description: "Wash your dishes.",
                        mode: "gradual_ff",
                        duration: 15,
                        costs: {},
                        effects: {
                            hygiene: -10,
                        },
                        rewards: {
                            playerStatus: {
                                score: 30,
                            }
                        }
                    }
                ]
            },
            {
                id: "fridge",
                name: "Fridge",
                areaInScene: { xMin: 75, xMax: 90, yMin: 22, yMax: 52 },
                activities: [
                    {
                        id: "access_fridge_storage",
                        name: "Open Fridge",
                        modalHeader: "Fridge",
                        description: "Store or retrieve food items.",
                        mode: "ui_interaction", // Special mode indicating it triggers a UI
                        interactionType: "OPEN_STORAGE", // Custom type for game logic to identify
                        storageId: "player_home_fridge" // Unique ID for this fridge's inventory in game state
                    }
                ]
            },
            {
                id: "home_bedroom",
                name: "Bedroom",
                areaInScene: { xMin: 5, xMax: 27, yMin: 52, yMax: 82 },
                activities: [
                    {
                        id: "sleep_in_bed",
                        name: "Sleep in Bed",
                        mode: "gradual_ff",
                        description: "Sleep in the comfortable bed. Good NIGHT!",
                        duration: 480,
                        requirements: {
                            time:{
                                allowedTimesOfDay: ["NIGHT"]
                            }
                        },
                        effects: {
                            sleep: 100
                        }
                    },
                    {
                        id: "take_a_nap",
                        name: "Take a Nap",
                        mode: "gradual_ff",
                        description: "Take a nap in the comfortable bed. Just a quick nap wouldn't hurt, right?",
                        duration: 30,
                        effects: {
                            sleep: 30
                        }
                    },
                    {
                        id: "tidy_bed",
                        name: "Tidy Bed",
                        mode: "gradual_ff",
                        description: "Tidy your bed, a special surprise you may find.",
                        duration: 15,
                        costs: {},
                        effects: {
                            happiness: 5,
                            hygiene: -2
                        },
                        rewards: {
                            possibleLoots: [
                                { itemId: "coin", quantityTiers: [
                                        { range: [0, 2], chance: 0.7},
                                        { range: [3, 5], chance: 0.3},
                                    ]
                                },
                            ]
                        }
                    },
                    {
                        id: "access_closet_storage",
                        name: "Open Closet",
                        modalHeader: "Closet",
                        description: "Store or retrieve your equipment.",
                        mode: "ui_interaction", // Special mode indicating it triggers a UI
                        interactionType: "OPEN_STORAGE", // Custom type for game logic to identify
                        storageId: "player_home_closet"
                    }
                ]
            },
            {
                id: "home_bathroom",
                name: "Bathroom",
                areaInScene: { xMin: 5, xMax: 34, yMin: 22, yMax: 52 },
                activities: [
                    {
                        id: "take_a_bath",
                        name: "Take a Bath",
                        mode: "gradual_ff",
                        description: "Take a bath in the comfortable bathroom.",
                        duration: 30,
                        effects: {
                            hygiene: 100,
                        }
                    }
                ]
            },
            {
                id: "home_living_room",
                name: "Living Room",
                areaInScene: { xMin: 60, xMax: 95, yMin: 55, yMax: 82 },
                activities: [
                    {
                        id: "play_video_games",
                        name: "Play Video Games",
                        mode: "gradual_ff",
                        description: "Play video games in the comfortable living room.",
                        duration: 30,
                        effects: {
                            happiness: 30
                        }
                    }
                ]
            }
        ],
        exit: {
            name: "Go Outside",
            areaInScene: { xMin: 40, xMax: 60, yMin: 72, yMax: 82 },
            targetPlayerSpawn: { x: (10 + 35) / 2, y: (25 + 3)/2 } // Centered below the home marker area (e.g., x: 22.5, y: 28)
        }
    },

    "andrew_house": {
        name: "Andrew's House",
        avatarScaleDivider: 8,
        speedModifier: 2,
        background: "AndrewHome.png",
        defaultPlayerSpawn: { x: 50, y: 95 },
        activityZones: [
            {
                id: "andrew_living_room",
                name: "Andrew's Living Room",
                areaInScene: { xMin: 40, xMax: 85, yMin: 60, yMax: 99 },
                activities: [
                    {
                        id: "andrew_clean_house",
                        name: "Help Andrew clean house",
                        mode: "gradual_ff",
                        description: "Help Andrew clean his house. He's a bit of a mess right now.",
                        duration: 60,
                        effects: {
                            hygiene: -10,
                            meal: -10,
                            sleep: -10,
                            happiness: 30
                        },
                        rewards: {
                            playerStatus: {
                                score: 100
                            },
                            possibleLoots: [
                                { itemId: "coin", quantity: 60 },
                            ]
                        }
                    }
                ]
            },
        ],
        exit: {
            name: "Go Outside",
            areaInScene: { xMin: 40, xMax: 60, yMin: 90, yMax: 99 },
            targetPlayerSpawn: {x:(2 + 17)/2, y: (28 + 40)/ 2}
        }
    },
    "lake": {
        name: "Lake",
        avatarScaleDivider: 12,
        background: "LakeMap.png",
        speedModifier: 1.5,
        defaultPlayerSpawn: { x: 95, y: 20 },
        activityZones:[
            {
                id: "lake_fishing_dock",
                name: "Fishing Dock",
                areaInScene: { xMin: 30, xMax: 60, yMin: 40, yMax: 60 },
                activities: [
                    {
                        id: "fish_in_lake",
                        name: "Fishing",
                        mode: "gradual_ff",
                        description:
                            "Owh, it's open from 8am to 10pm. Let's go fishing!" + "\nAahhh, relaxing~ What might we find?",
                        duration: 10,
                        requirements: {
                            time: {
                                hourRange: [8, 22]
                            },
                            items: [
                                { itemId: "fishing_rod", use: 1, checkToolInstance: true }
                            ],
                        },
                        costs: {
                            items: [
                                { itemId: "fish_bait", quantity: 1, consume: true }
                            ]
                        },
                        effects: {
                            happiness: 20,
                            hygiene: -10
                        },
                        rewards: {
                            possibleLoots: [
                                {itemId: "guppy", quantity: 1, chance:0.15 },
                            ],
                            playerStatus: {
                                score: 15,
                            }
                        }
                    },
                    {
                        id: "ride_boat_in_lake",
                        name: "Ride Boat",
                        mode: "gradual_ff",
                        description: "Let's relax in the lake and ride a boat.",
                        duration: 30,
                        requirements: {
                            time: {
                                hourRange: [8, 19]
                            },
                        },
                        effects: {
                            happiness: 15,
                            sleep: 15
                        }
                        // costs: {
                        //     items: [
                        //         {}
                        //     ]
                        // }
                    }
                ]
            },
            {
                id: "lake_fishing_shop",
                name: "Fishing Shop",
                areaInScene: { xMin: 70, xMax: 95, yMin: 0, yMax: 20 },
                activities: [
                    {
                        id: "lake_fishing_shop",
                        name: "Open Shop",
                        mode: "ui_interaction",
                        description: "Anything you need for fishing",
                        interactionType: "OPEN_SHOP", // Custom type for game logic to identify
                        shopId: "lake_fishing_shop" // Unique ID for this fridge's inventory in game state
                    },
                ],
            },
            {
                id: "lake_restaurant",
                name: "B'Lake Restaurant",
                areaInScene: { xMin: 0, xMax: 20, yMin: 0, yMax: 25},
                activities: [
                    {
                        id: "lake_restaurant",
                        name: "Open Menu",
                        mode: "ui_interaction",
                        modalHeader: "B'Lake Restaurant",
                        description: "Welcome to B'Lake Restaurant. What do you want to eat?",
                        interactionType: "OPEN_SHOP",
                        shopId: "lake_restaurant"
                    }
                ]
            }
        ],
        exit: {
            name: "Exit Lake",
            areaInScene: { xMin: 85, xMax: 100, yMin: 15, yMax: 30 },
            targetPlayerSpawn: { x: (0 + 35) / 2, y: (75 + 100)/2 } // Centered below the home marker area (e.g., x: 22.5, y: 28)
        }
    },
    "mountain": {
        name: "Mountain",
        avatarScaleDivider: 12,
        background: "MountainMap.png",
        speedModifier: 1.5,
        defaultPlayerSpawn: { x: 10, y: 90 },
        activityZones: [
            {
                id: "mountain_camp",
                name: "Camping Ground",
                areaInScene: { xMin: 25, xMax: 50, yMin: 60, yMax: 80 },
                activities: [
                ]
            },

        ],
        exit: {
            name: "Exit Mountain",
            areaInScene: {xMin: 0, xMax: 20, yMin: 80, yMax: 100},
            targetPlayerSpawn: { x: (50 + 95)/2 , y: (60 + 90)/2}
        }
    },
    "beach": {
        name: "Beach",
        avatarScaleDivider: 12,
        background: "BeachMap.png",
        speedModifier: 1.5,
        defaultPlayerSpawn: { x: 10, y: 10 },
        activityZones: [
            {
                id: "beach_fishing_dock",
                name: "Fishing Dock",
                areaInScene: { xMin: 30, xMax: 60, yMin: 40, yMax: 60 },
                activities: []
            }
        ],
        exit: {
            name: "Exit Beach",
            areaInScene: { xMin: 0, xMax: 20, yMin: 0, yMax: 20 },
            targetPlayerSpawn: { x: (50 + 100)/2 , y: (75 + 100)/2}
        }
    },
    "temple": {
        name: "Temple",
        avatarScaleDivider: 12,
        background: "TempleMap.png",
        speedModifier: 1.5,
        defaultPlayerSpawn: { x: 50, y: 95 },
        activityZones: [
            // {
            //     // id: "temple_temple_entrance",
            //     // name: "Temple Entrance",
            // }
        ],
        exit: {
            name: "Exit Temple",
            areaInScene: { xMin: 40, xMax: 60, yMin: 90, yMax: 100 },
            targetPlayerSpawn: { x: (30 + 65)/2 , y: (30 + 55)/2}}
    },
    "forest": {
        name: "Forest",
        avatarScaleDivider: 12,
        background: "ForestMap.png",
        speedModifier: 1.5,
        defaultPlayerSpawn: { x: 10, y: 50 },
        activityZones: [
        ],
        exit: {
            name: "Exit Forest",
            areaInScene: { xMin: 0, xMax: 20, yMin: 40, yMax: 60 },
            targetPlayerSpawn: { x: (60 + 100)/2 , y: (50 + 70)/2}
        }
    }
}