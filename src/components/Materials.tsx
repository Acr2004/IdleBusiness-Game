import { ConstructionBusiness } from "@/classes/ConstructionBusiness";
import { BusinessContext } from "@/contexts/BusinessContext";
import { MoneyContext } from "@/contexts/MoneyContext";
import { formatCurrency } from "@/utils/currency";
import { useContext, useState } from "react";

interface MaterialsProps {
    business: ConstructionBusiness;
}

export function Materials({ business }: MaterialsProps) {
    const { money, updateMoney } = useContext(MoneyContext);
    const { businessData, addMaterial } = useContext(BusinessContext);

    const [quantities, setQuantities] = useState<Record<string, number | "">>({});

    const handlePurchase = (materialName: string, price: number, quantity: number) => {
        addMaterial(business, materialName, quantity);
        updateMoney(money - price);

        setQuantities((prev) => ({ ...prev, [materialName]: "" }));
    };

    const handleChange = (materialName: string, value: string) => {
        const parsed = value === "" ? "" : Math.max(0, Math.floor(Number(value)));
        setQuantities((prev) => ({ ...prev, [materialName]: parsed }));
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            { businessData[business.type].materials!.map((material) => {
                const quantity = quantities[material.name] ?? "";
                const totalPrice = (Number(quantity) || 0) * material.price;

                const materialStock = material.name === "Metal" ? business.metal : 
                    material.name === "Workers" ? business.workers : 
                    material.name === "Wood" ? business.wood : 
                    business.concrete;
                
                return (
                    <div
                        key={material.name}
                        className="p-4 rounded-xl border-2 border-border bg-background shadow-sm flex flex-col"
                    >
                        <p className="text-center text-lg text-secondary font-semibold">
                            {material.name}
                        </p>

                        <p className="text-md text-secondary font-semibold my-2">
                            Stock: <span>{materialStock}</span>
                        </p>
                        
                        <div className="flex items-center gap-2 my-2">
                            <label className="text-sm text-secondary">Quantity:</label>
                            <input
                                type="number"
                                min={0}
                                placeholder="0"
                                value={quantity}
                                onChange={(e) => handleChange(material.name, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        <button
                            disabled={!quantity || Number(quantity) === 0 || totalPrice > money}
                            onClick={() => handlePurchase(material.name, totalPrice, Number(quantity) || 0)}
                            className="mt-2 px-4 py-2 rounded-lg font-semibold transition-colors w-full bg-primary hover:bg-primary-variation text-light cursor-pointer"
                        >
                            Buy for {formatCurrency(totalPrice)}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}