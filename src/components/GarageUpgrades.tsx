import { Business } from "@/classes/Business";
import { BusinessContext } from "@/contexts/BusinessContext";
import { MoneyContext } from "@/contexts/MoneyContext";
import { formatCurrency } from "@/utils/currency";
import { useContext } from "react";

interface GarageUpgradesProps {
    business: Business;
}

export function GarageUpgrades({ business }: GarageUpgradesProps) {
    const { money, updateMoney } = useContext(MoneyContext);
    const { businessData, addMoreSpace } = useContext(BusinessContext);

    const handlePurchase = (addedSpace: number, price: number) => {
        addMoreSpace(business, addedSpace);
        updateMoney(money - price);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            { businessData[business.type].spacePrices!.map((upgrade) => (
                <div
                    key={upgrade.addedSpace}
                    className="p-4 rounded-xl border-2 border-border bg-background shadow-sm flex flex-col items-center justify-between"
                >
                    <p className="text-md text-secondary font-semibold">
                        Adds {upgrade.addedSpace} slot{upgrade.addedSpace > 1 ? "s" : ""}
                    </p>
                    <p className="text-xl font-bold text-primary mb-3">{formatCurrency(upgrade.price)}</p>

                    <button
                        disabled={upgrade.price > money}
                        onClick={() => handlePurchase(upgrade.addedSpace, upgrade.price)}
                        className="px-4 py-2 rounded-lg font-semibold transition-colors w-full bg-primary text-light hover:bg-primary-variation cursor-pointer"
                    >
                        Buy
                    </button>
                </div>
            ))}
        </div>
    );
}