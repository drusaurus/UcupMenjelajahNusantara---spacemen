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
    price: 20
  },
  "milk": {
    id: "milk",
    name: "Milk",
    stackable: true,
    description: "A bottle of milk. It's not very good, but it's good enough for now.",
    type: ITEM_TYPES.FOOD,
    price: 5,
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
    price: 30,
    type: ITEM_TYPES.COLLECTABLE,

  },
  "clown_fish": {
    id: "clown_fish",
    name: "Clown Fish",
    description: "Hey, you found nemo!",
    sourcePath: "ClownFish.png",
    stackable: false,
    price: 70,
    type: ITEM_TYPES.COLLECTABLE,

  },
  "axolotl": {
    id: "axolotl",
    name: "Axolotl",
    rare: true,
    description: "A cute little fish. Wait... what is this?",
    sourcePath: "Axolotl.png",
    stackable: false,
    price: 1000,
    type: ITEM_TYPES.COLLECTABLE,

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
    price: 100,
    type: ITEM_TYPES.COLLECTABLE,

  },
  "starfish": {
    id: "starfish",
    name: "Starfish",
    description: "A starfish. Why is it called a fish?",
    sourcePath: "Starfish.png",
    stackable: false,
    price: 100,
    type: ITEM_TYPES.COLLECTABLE,

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
    price: 1000,
    type: ITEM_TYPES.COLLECTABLE,
  },
  "golden_tench": {
    id: "golden_tench",
    name: "Golden Tench",
    description: "A golden variant of the tench, this fish shines with a metallic sheen and moves slowly through weedy waters.",
    sourcePath: "GoldenTench.png",
    stackable: false,
    price: 700,
    type: ITEM_TYPES.COLLECTABLE,

  },
  "seabass": {
    id: "seabass",
    name: "Atlantic Seabass",
    description: "A sleek, silvery fish known for its strong swimming and prized taste. Common in coastal waters, it's a favorite among anglers.",
    sourcePath: "AtlanticSeaBass.png",
    stackable: false,
    price: 1000,
    type: ITEM_TYPES.COLLECTABLE,

  },
  "dab": {
    id: "dab",
    name: "Dab",
    description: "A flatfish with both eyes on one side of its body, perfectly camouflaged on the ocean floor. A master of disguise!",
    sourcePath: "Dab.png",
    stackable: false,
    price: 400,
    type: ITEM_TYPES.COLLECTABLE,
  },
  "fish": {
    id: "Fish",
    name: "Fish",
    description: "We can cook something from this. Let's go ask the B'lake Restaurant.",
    sourcePath: "Ninja Adventure - Asset Pack/Items/Food/Fish.png",
    stackable: true,
    price: 10,
    type: ITEM_TYPES.INGREDIENT
  },
  "catfish": {
    id: "catfish",
    name: "Catfish",
    description: "A fish with a cat-like body and a long tail. It's a favorite of fishermen.",
    sourcePath: "Catfish.png",
    stackable: false,
    price: 20,
    type: ITEM_TYPES.INGREDIENT,
  },
  "coffee_greentea": {
    id: "coffee_greentea",
    name: "Matcha Latte",
    description: "A finely ground, emerald-green powder made from the shaded leaves of an ancient mountain shrub.",
    sourcePath: "food/coffee_greentea.png",
    stackable: true,
    type: ITEM_TYPES.FOOD,
    price: 18,
    effects: {
      meal: 5,
      happiness: 15,
      score: 5
    }
  },
  "boba_coffee" : {
    id: "boba_coffee",
    name: "Boba Coffee",
    description: "The perfect afternoon pick-me-up. A robust iced coffee sweetened with milk and brown sugar, with the delightful surprise of chewy tapioca pearls at the bottom. A trendy treat that puts a spring in your step.",
    sourcePath: "food/boba_coffee.png",
    stackable: true,
    type: ITEM_TYPES.FOOD,
    price: 20,
    effects: {
      sleep: 15,
      meal: 5,
      happiness: 15,
      score: 5
    }
  },
  "chocolate_cake": {
    id: "chocolate_cake",
    name: "Chocolate Cake",
    description: "A delicious cake made from chocolate and cream. It's a favorite of chocolate lovers.",
    sourcePath: "food/cake_chocolate.png",
    stackable: true,
    price: 30,
    type: ITEM_TYPES.FOOD,
    effects: {
      sleep: 5,
      meal: 5,
      happiness: 15,
      score: 5
    }
  },
  "onigiri": {
    id: "onigiri",
    name: "Onigiri",
    description: "A humble rice ball, skillfully shaped into a triangle and wrapped in crisp sea-leek. A staple for any traveler, offering a simple, satisfying taste of home on a long journey.",
    sourcePath: "Ninja Adventure - Asset Pack/Items/Food/Onigiri.png",
    type: ITEM_TYPES.FOOD,
    stackable: true,
    price: 15,
    effects: {
      sleep: 20,
      meal: 5,
      score: 5
    }
  },
  "yakitori": {
    id: "yakitori",
    name: "Yakitori",
    description: "Chunks of succulent bird meat, skewered and grilled over open flames by a master of the coals. Glazed with a sweet, smoky sauce that sizzles on the tongue. A favorite of adventurers gathering at the tavern after a long quest.",
    sourcePath: "Ninja Adventure - Asset Pack/Items/Food/Yakitori.png",
    type: ITEM_TYPES.FOOD,
    stackable: true,
    price: 10,
    effects: {
      sleep: 10,
      meal: 15,
      score: 5
    }
  },
  "calamari": {
    id: "calamari",
    name: "Calamari",
    description: "A classic appetizer to share with friends. Crispy, golden-brown rings of squid served with a zesty lemon wedge and dipping sauce.",
    sourcePath: "Ninja Adventure - Asset Pack/Items/Food/Calamari.png",
    type: ITEM_TYPES.FOOD,
    stackable: true,
    price: 10,
    effects: {
      happiness: 10,
      meal: 15,
      score: 5
    }
  },
  "sushi": {
    id: "sushi",
    name: "Sushi",
    description: "A masterpiece of culinary art from the far-off Eastern Isles. A slice of glisteningly fresh raw fish rests upon a perfectly seasoned pillow of rice. It is said a master must train for years to perfect this delicate balance. Consuming it clears the mind and hones the senses.",
    sourcePath: "Ninja Adventure - Asset Pack/Items/Food/Sushi.png",
    type: ITEM_TYPES.FOOD,
    stackable: true,
    price: 20,
    effects: {
      sleep: 10,
      happiness: 10,
      meal: 15,
      score: 5
    }
  }
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
//
//     {
//       "id": "TeaLeaf",
//       "sourcePath": "Ninja Adventure - Asset Pack/Items/Food/TeaLeaf.png"
//     },
//
//     {
//       "id": "chicken_meat",
//       "sourcePath": "chicken_raw.png"
//     },
//     {
//       "id": "chicken_cooked",
//       "sourcePath": "chicken_cooked.png"
//     },
//   ]
// }

