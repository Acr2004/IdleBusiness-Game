import { ShoppingBasket, CarTaxiFront, X, Truck, Factory } from "lucide-react";

export const ICONS_MAP = {
    "" : X,
    "shopping-basket": ShoppingBasket,
    "taxi": CarTaxiFront,
    "factory": Factory,
    "van": Truck,
} as const;

export type IconName = keyof typeof ICONS_MAP;