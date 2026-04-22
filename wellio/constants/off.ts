import { FoodItem } from "./foods";

const OFF_ENDPOINT = "https://world.openfoodfacts.org/api/v2/product";

type OffNutriments = {
  "energy-kcal_100g"?: number;
  "energy-kcal_serving"?: number;
  energy_100g?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
};

type OffProduct = {
  product_name?: string;
  brands?: string;
  generic_name?: string;
  nutriments?: OffNutriments;
};

type OffResponse = {
  status: 0 | 1;
  product?: OffProduct;
};

export type OffLookupResult =
  | { ok: true; food: FoodItem; barcode: string }
  | { ok: false; reason: "not_found" | "no_nutrition" | "network" };

function pickName(p: OffProduct): string {
  const name = p.product_name?.trim() || p.generic_name?.trim() || "Scanned product";
  const brand = p.brands?.split(",")[0]?.trim();
  return brand ? `${name} (${brand})` : name;
}

function toKcal(n: OffNutriments): number | null {
  if (typeof n["energy-kcal_100g"] === "number") return n["energy-kcal_100g"];
  if (typeof n.energy_100g === "number") return n.energy_100g / 4.184;
  return null;
}

export async function lookupBarcode(barcode: string): Promise<OffLookupResult> {
  try {
    const res = await fetch(
      `${OFF_ENDPOINT}/${encodeURIComponent(barcode)}.json?fields=product_name,generic_name,brands,nutriments`
    );
    if (!res.ok) return { ok: false, reason: "network" };
    const data = (await res.json()) as OffResponse;
    if (data.status !== 1 || !data.product) return { ok: false, reason: "not_found" };

    const n = data.product.nutriments ?? {};
    const kcal = toKcal(n);
    if (kcal === null) return { ok: false, reason: "no_nutrition" };

    const food: FoodItem = {
      name: pickName(data.product),
      grams: 100,
      calories: Math.round(kcal),
      carbs: Math.round((n.carbohydrates_100g ?? 0) * 10) / 10,
      protein: Math.round((n.proteins_100g ?? 0) * 10) / 10,
      fat: Math.round((n.fat_100g ?? 0) * 10) / 10,
    };
    return { ok: true, food, barcode };
  } catch {
    return { ok: false, reason: "network" };
  }
}
