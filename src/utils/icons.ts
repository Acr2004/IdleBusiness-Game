import { ShoppingBasket, CarTaxiFront, X, Truck, Factory, Construction, InspectionPanel, HardHat, Axe, Weight } from "lucide-react";

export const ICONS_MAP = {
    "" : X,
    "shopping-basket": ShoppingBasket,
    "taxi": CarTaxiFront,
    "factory": Factory,
    "van": Truck,
    "construction": Construction,
    "inspection-panel": InspectionPanel,
    "hard-hat": HardHat,
    "axe": Axe,
    "weight": Weight,
} as const;

export type IconName = keyof typeof ICONS_MAP;