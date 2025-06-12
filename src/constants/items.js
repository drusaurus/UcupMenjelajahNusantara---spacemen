export const ITEM_TYPES = {
  FOOD: "food",
  INGREDIENT: "ingredient",
  TOOL: "tool",
  QUEST: "quest_item",
  EQUIPMENT: "equipment",
  COLLECTABLE: "collectable",
}

export const ITEMS = {
  "indomie" : {
    id: "indomie",
    name: "Indomie",
    stackable: true,
    description: "A packet of legendary instant noodles. Needs cooking.",
    type: ITEM_TYPES.INGREDIENT,
    sourcePath: "indomie.png",
    price: 3,
  },
  "cooked_indomie" : {
    id: "cooked_indomie",
    name: "Cooked Indomie",
    stackable: true,
    description: "The best noodle in the world, ready to eat!",
    type: ITEM_TYPES.FOOD,
    sourcePath: "cooked_indomie_goreng.png",
    price: 5,
    effects: {
      meal: 15,
      happiness: 15,
      score: 10
    }
  },
  "fishing_rod": {
    id: "fishing_rod",
    name: "Fishing Rod",
    stackable: false,
    description: "A simple rod for catching fish.",
    type: ITEM_TYPES.TOOL,
    sourcePath: "fishing_rod.png",
    maxUse: 5,
    price: 20
  },
  "raw_chicken": {
    id: "raw_chicken",
    name: "Raw Chicken",
    stackable: true,
    description: "Bok, bok, bok. This is the raw chicken. It's not cooked yet.",
    type: ITEM_TYPES.INGREDIENT,
    sourcePath: "chicken_raw.png",
    price: 10
  },
  "bag": {
    id: "bag",
    name: "Bag",
    stackable: false,
    description: "Increases your storage by 10",
    type: ITEM_TYPES.EQUIPMENT,
    sourcePath: "Ninja Adventure - Asset Pack/Items/Object/Bag.png",
    price: 50,
    equipmentSlot: "bag",
    modifiers: {
      inventorySlot: 10
    }
  },
  "shoes": {
    id: "shoes",
    name: "Shoes",
    stackable: false,
    description: "Increases your walking speed by 0.2",
    type: ITEM_TYPES.EQUIPMENT,
    sourcePath: "Ninja Adventure - Asset Pack/Items/Object/Shoes.png",
    price: 40,
    equipmentSlot: "shoes",
    modifiers: {
      speed: 0.2
    }
  },
  "ticket":{
    id: "ticket",
    reusable: false,

  },
  "milk": {
    id: "milk",
    name: "Milk",
    stackable: true,
    description: "A bottle of milk. It's not very good, but it's good enough for now.",
    type: ITEM_TYPES.FOOD,
    sourcePath: "Ninja Adventure - Asset Pack/Items/Potion/MilkPot.png",
    effects: {
      meal: 5,
      happiness: 5,
      score: 2
    }
  },
  "coin": {
    id: "coin",
    name: "coin",
    description: "Money, money, moneyy~~.",
    sourcePath: "coin.png",
  },
  "fish_bait": {
    id: "fish_bait",
    name: "Fish Bait",
    description: "It's a bait for fish. DON'T eat it!",
    sourcePath: "Worm.png",
    stackable: true,
    price: 1
  },
  "bluegill_fish" : {
    id: "bluegill_fish",
    name: "Bluegill Fish",
    description: "A small, round freshwater fish with striking blue and purple hues. Agile, feisty, and common in warm lakes and ponds.",
    sourcePath: "BlueGillFish.png",
    stackable: false,
    price: 30
  },
  "clown_fish": {
    id: "clown_fish",
    name: "Clown Fish",
    description: "Hey, you found nemo!",
    sourcePath: "ClownFish.png",
    stackable: false,
    price: 70
  },
  "axolotl": {
    id: "axolotl",
    name: "Axolotl",
    rare: true,
    description: "A cute little fish. Wait... what is this?",
    sourcePath: "Axolotl.png",
    stackable: false,
    price: 1000
  },
  "mossball": {
    id: "mossball",
    name: "Moss Ball",
    description: "Ma-ma-marimooo??",
    sourcePath: "MossBall.png",
    stackable: true,
    price: 5
  },
  "plastic_bag": {
    id: "plastic_bag",
    name: "Plastic Bag",
    description: "A plastic bag. It's not very good, but it's good enough for now.",
    sourcePath: "PlasticBag.png",
    stackable: true,
    price: 1
  },
  "sea_spider": {
    id: "sea_spider",
    name: "Sea Spider",
    description: "A sea spider. It's not a crab, but it's a spider.",
    sourcePath: "SeaSpider.png",
    stackable: false,
    price: 100
  },
  "starfish": {
    id: "starfish",
    name: "Starfish",
    description: "A starfish. Why is it called a fish?",
    sourcePath: "Starfish.png",
    stackable: false,
    price: 100
  },
  "guppy": {
    id: "guppy",
    name: "Guppy Fish",
    description: "Oooh, so pretty~",
    sourcePath: "Guppy.png",
    stackable: false,
    price: 90,
    type: ITEM_TYPES.COLLECTABLE,
  },
  "highfin_banded_shark": {
    id: "highfin_banded_shark",
    name: "Highfin Banded Shark",
    description: "I don't think that's a shark. But must be very expansive.",
    sourcePath: "HighFinBandedShark.png",
    stackable: false,
    price: 1000
  },
  "golden_tench": {
    id: "golden_tench",
    name: "Golden Tench",
    description: "A golden variant of the tench, this fish shines with a metallic sheen and moves slowly through weedy waters.",
    sourcePath: "GoldenTench.png",
    stackable: false,
    price: 700
  },
  "seabass": {
    id: "seabass",
    name: "Atlantic Seabass",
    description: "A sleek, silvery fish known for its strong swimming and prized taste. Common in coastal waters, it's a favorite among anglers.",
    sourcePath: "AtlanticSeaBass.png",
    stackable: false,
    price: 1000,
  },
  "dab": {
    id: "dab",
    name: "Dab",
    description: "A flatfish with both eyes on one side of its body, perfectly camouflaged on the ocean floor. A master of disguise!",
    sourcePath: "Dab.png",
    stackable: false,
    price: 400,
  },

}
//
// {
//   "foodItems": [
//     {
//       "id": "Beef",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Beaf.png"
//     },
//     {
//       "id": "Calamari",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Calamari.png"
//     },
//     {
//       "id": "Fish",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Fish.png"
//     },
//     {
//       "id": "FortuneCookie",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/FortuneCookie.png"
//     },
//     {
//       "id": "Honey",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Honey.png"
//     },
//     {
//       "id": "Meat",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Meat.png"
//     },
//     {
//       "id": "Noodle",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Noodle.png"
//     },
//     {
//       "id": "Nut",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Nut.png"
//     },
//     {
//       "id": "Nut2",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Nut2.png"
//     },
//     {
//       "id": "Octopus",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Octopus.png"
//     },
//     {
//       "id": "Onigiri",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Onigiri.png"
//     },
//     {
//       "id": "Seed1",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Seed1.png"
//     },
//     {
//       "id": "Seed2",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Seed2.png"
//     },
//     {
//       "id": "Seed3",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Seed3.png"
//     },
//     {
//       "id": "SeedBig1",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/SeedBig1.png"
//     },
//     {
//       "id": "SeedBig2",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/SeedBig2.png"
//     },
//     {
//       "id": "SeedBig3",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/SeedBig3.png"
//     },
//     {
//       "id": "SeedLarge",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/SeedLarge.png"
//     },
//     {
//       "id": "SeedLargeWhite",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/SeedLargeWhite.png"
//     },
//     {
//       "id": "Shrimp",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Shrimp.png"
//     },
//     {
//       "id": "Sushi",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Sushi.png"
//     },
//     {
//       "id": "Sushi2",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Sushi2.png"
//     },
//     {
//       "id": "TeaLeaf",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/TeaLeaf.png"
//     },
//     {
//       "id": "Yakitori",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/Yakitori.png"
//     },
//     {
//       "id": "chicken_meat",
//       "sourcePath": "chicken_raw.png"
//     },
//     {
//       "id": "chicken_cooked",
//       "sourcePath": "chicken_cooked.png"
//     },
//     {
//       "id": "indomie",
//       "name": "Indomie",
//       "sourcePath": "indomie.png"
//     }
//   ]
// }

