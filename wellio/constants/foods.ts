export type FoodItem = {
  name: string;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
};

export const FOODS: FoodItem[] = [
  { name: "Oatmeal (1 cup cooked)", grams: 234, calories: 150, carbs: 27, protein: 5, fat: 3 },
  { name: "Oatmeal with banana", grams: 350, calories: 230, carbs: 50, protein: 6, fat: 3 },
  { name: "Greek yogurt (1 cup)", grams: 245, calories: 100, carbs: 6, protein: 17, fat: 0 },
  { name: "Greek yogurt with honey", grams: 270, calories: 180, carbs: 28, protein: 17, fat: 0 },
  { name: "Scrambled eggs (2)", grams: 100, calories: 180, carbs: 2, protein: 12, fat: 13 },
  { name: "Boiled egg", grams: 50, calories: 78, carbs: 1, protein: 6, fat: 5 },
  { name: "Omelette with cheese", grams: 200, calories: 280, carbs: 2, protein: 20, fat: 22 },
  { name: "Pancakes (2)", grams: 160, calories: 350, carbs: 45, protein: 8, fat: 14 },
  { name: "Toast with butter", grams: 40, calories: 150, carbs: 18, protein: 3, fat: 7 },
  { name: "Toast with peanut butter", grams: 50, calories: 250, carbs: 22, protein: 8, fat: 15 },
  { name: "Avocado toast", grams: 100, calories: 280, carbs: 28, protein: 7, fat: 16 },
  { name: "Bagel with cream cheese", grams: 130, calories: 370, carbs: 55, protein: 11, fat: 12 },
  { name: "Croissant", grams: 60, calories: 270, carbs: 31, protein: 5, fat: 14 },
  { name: "Cereal with milk", grams: 200, calories: 200, carbs: 35, protein: 7, fat: 4 },
  { name: "Granola with yogurt", grams: 250, calories: 320, carbs: 45, protein: 10, fat: 11 },
  { name: "Smoothie (banana + berries)", grams: 300, calories: 220, carbs: 48, protein: 4, fat: 2 },
  { name: "Protein shake", grams: 300, calories: 180, carbs: 8, protein: 30, fat: 3 },

  { name: "Chicken breast", grams: 150, calories: 240, carbs: 0, protein: 45, fat: 5 },
  { name: "Grilled chicken salad", grams: 300, calories: 350, carbs: 12, protein: 38, fat: 16 },
  { name: "Chicken caesar wrap", grams: 250, calories: 520, carbs: 45, protein: 32, fat: 24 },
  { name: "Turkey sandwich", grams: 200, calories: 380, carbs: 40, protein: 28, fat: 10 },
  { name: "Ham and cheese sandwich", grams: 200, calories: 420, carbs: 38, protein: 22, fat: 20 },
  { name: "Tuna salad", grams: 200, calories: 300, carbs: 8, protein: 28, fat: 18 },
  { name: "Caesar salad", grams: 250, calories: 330, carbs: 15, protein: 10, fat: 26 },
  { name: "Cobb salad", grams: 350, calories: 450, carbs: 12, protein: 30, fat: 32 },
  { name: "Burger with fries", grams: 400, calories: 820, carbs: 75, protein: 32, fat: 42 },
  { name: "Cheeseburger", grams: 220, calories: 540, carbs: 40, protein: 28, fat: 28 },
  { name: "Hot dog", grams: 100, calories: 290, carbs: 22, protein: 10, fat: 18 },
  { name: "Pizza slice (cheese)", grams: 107, calories: 285, carbs: 36, protein: 12, fat: 10 },
  { name: "Pizza slice (pepperoni)", grams: 111, calories: 310, carbs: 36, protein: 13, fat: 12 },
  { name: "Pasta bolognese", grams: 350, calories: 560, carbs: 70, protein: 25, fat: 18 },
  { name: "Spaghetti carbonara", grams: 300, calories: 620, carbs: 65, protein: 22, fat: 28 },
  { name: "Mac and cheese", grams: 250, calories: 480, carbs: 55, protein: 18, fat: 20 },
  { name: "Sushi roll (8 pcs)", grams: 200, calories: 350, carbs: 55, protein: 12, fat: 6 },
  { name: "Ramen bowl", grams: 450, calories: 490, carbs: 65, protein: 18, fat: 18 },
  { name: "Fried rice", grams: 250, calories: 420, carbs: 60, protein: 10, fat: 14 },
  { name: "Burrito (chicken)", grams: 350, calories: 680, carbs: 75, protein: 35, fat: 24 },
  { name: "Taco (beef)", grams: 100, calories: 210, carbs: 18, protein: 10, fat: 12 },
  { name: "Falafel wrap", grams: 250, calories: 450, carbs: 55, protein: 16, fat: 18 },

  { name: "Salmon fillet", grams: 150, calories: 310, carbs: 0, protein: 34, fat: 20 },
  { name: "Grilled salmon with rice", grams: 300, calories: 540, carbs: 45, protein: 38, fat: 22 },
  { name: "Steak", grams: 200, calories: 500, carbs: 0, protein: 50, fat: 32 },
  { name: "Steak with mashed potatoes", grams: 400, calories: 720, carbs: 40, protein: 52, fat: 40 },
  { name: "Pork chop", grams: 150, calories: 310, carbs: 0, protein: 30, fat: 20 },
  { name: "Roast chicken with veggies", grams: 350, calories: 480, carbs: 25, protein: 42, fat: 22 },
  { name: "Stir fry with tofu", grams: 300, calories: 380, carbs: 35, protein: 20, fat: 18 },
  { name: "Stir fry with beef", grams: 300, calories: 450, carbs: 30, protein: 30, fat: 22 },
  { name: "Curry with rice", grams: 400, calories: 620, carbs: 75, protein: 20, fat: 24 },
  { name: "Lasagna", grams: 300, calories: 560, carbs: 45, protein: 28, fat: 28 },
  { name: "Shepherd's pie", grams: 300, calories: 480, carbs: 40, protein: 24, fat: 22 },
  { name: "Fish and chips", grams: 400, calories: 720, carbs: 70, protein: 30, fat: 36 },

  { name: "Apple", grams: 180, calories: 95, carbs: 25, protein: 0, fat: 0 },
  { name: "Banana", grams: 118, calories: 105, carbs: 27, protein: 1, fat: 0 },
  { name: "Orange", grams: 130, calories: 62, carbs: 15, protein: 1, fat: 0 },
  { name: "Strawberries (1 cup)", grams: 150, calories: 50, carbs: 12, protein: 1, fat: 0 },
  { name: "Blueberries (1 cup)", grams: 150, calories: 85, carbs: 21, protein: 1, fat: 0 },
  { name: "Grapes (1 cup)", grams: 150, calories: 100, carbs: 27, protein: 1, fat: 0 },
  { name: "Carrot sticks", grams: 100, calories: 50, carbs: 12, protein: 1, fat: 0 },
  { name: "Hummus with veggies", grams: 150, calories: 200, carbs: 18, protein: 6, fat: 12 },
  { name: "Almonds", grams: 30, calories: 170, carbs: 6, protein: 6, fat: 15 },
  { name: "Cashews", grams: 30, calories: 160, carbs: 9, protein: 5, fat: 13 },
  { name: "Peanuts", grams: 30, calories: 170, carbs: 5, protein: 7, fat: 14 },
  { name: "Trail mix", grams: 30, calories: 150, carbs: 13, protein: 4, fat: 10 },
  { name: "M&M's (fun size)", grams: 17, calories: 90, carbs: 13, protein: 1, fat: 4 },
  { name: "M&M's peanut (fun size)", grams: 18, calories: 90, carbs: 11, protein: 2, fat: 5 },
  { name: "M&M's with nuts (1 bag)", grams: 45, calories: 220, carbs: 26, protein: 4, fat: 11 },
  { name: "Snickers bar", grams: 52, calories: 250, carbs: 33, protein: 4, fat: 12 },
  { name: "KitKat bar", grams: 42, calories: 210, carbs: 27, protein: 3, fat: 11 },
  { name: "Twix bar", grams: 50, calories: 250, carbs: 34, protein: 2, fat: 12 },
  { name: "Dark chocolate", grams: 30, calories: 170, carbs: 13, protein: 2, fat: 12 },
  { name: "Milk chocolate", grams: 30, calories: 160, carbs: 18, protein: 2, fat: 9 },
  { name: "Chocolate chip cookie", grams: 30, calories: 150, carbs: 20, protein: 2, fat: 7 },
  { name: "Oreo cookies (3)", grams: 34, calories: 160, carbs: 25, protein: 1, fat: 7 },
  { name: "Brownie", grams: 60, calories: 250, carbs: 35, protein: 3, fat: 11 },
  { name: "Donut (glazed)", grams: 70, calories: 260, carbs: 31, protein: 4, fat: 14 },
  { name: "Muffin (blueberry)", grams: 130, calories: 380, carbs: 54, protein: 5, fat: 16 },
  { name: "Potato chips", grams: 30, calories: 160, carbs: 15, protein: 2, fat: 10 },
  { name: "Popcorn (plain, 1 cup)", grams: 8, calories: 30, carbs: 6, protein: 1, fat: 0 },
  { name: "Pretzels", grams: 30, calories: 110, carbs: 23, protein: 3, fat: 1 },
  { name: "Ice cream (1 scoop)", grams: 70, calories: 140, carbs: 17, protein: 2, fat: 7 },
  { name: "Cheese cubes", grams: 30, calories: 110, carbs: 1, protein: 7, fat: 9 },
  { name: "Protein bar", grams: 60, calories: 220, carbs: 22, protein: 20, fat: 7 },
  { name: "Granola bar", grams: 30, calories: 150, carbs: 25, protein: 3, fat: 5 },
  { name: "Rice cakes (2)", grams: 18, calories: 70, carbs: 15, protein: 2, fat: 0 },
];

export function searchFoods(query: string, limit = 8): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  return FOODS.filter((f) => f.name.toLowerCase().includes(q)).slice(0, limit);
}
