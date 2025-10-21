import { MoneyContext } from "@/contexts/MoneyContext";
import { X } from "lucide-react";
import { useContext } from "react";

interface MissingMaterialsModalProps {
    missingMaterials: { name: string; missing: number; cost: number }[] | null;
    formatCurrency: (v: number) => string;
    onConfirmPurchase: () => void;
    onClose: () => void;
}

export function MissingMaterialsModal({
    missingMaterials,
    formatCurrency,
    onConfirmPurchase,
    onClose
}: MissingMaterialsModalProps) {
    const { money, updateMoney } = useContext(MoneyContext)

    const totalCost = missingMaterials!.reduce((total, material) => total + material.cost, 0);

    function handleBuy() {
        if(money >= totalCost) {
            updateMoney(money - totalCost);
            onConfirmPurchase();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-2xl w-full max-w-md p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-secondary">Missing Materials</h2>
                    <button onClick={onClose} className="cursor-pointer hover:bg-background p-2 rounded-lg">
                        <X className="w-5 h-5 text-tertiary" />
                    </button>
                </div>

                <p className="text-tertiary mb-3">
                    You don&apos;t have all required materials. Do you want to buy the missing ones?
                </p>

                <ul className="mb-4 space-y-1">
                    {missingMaterials!.map((mat, i) => (
                        <li key={i} className="flex justify-between text-sm text-secondary">
                            <span>{mat.name}</span>
                            <span>x{mat.missing} — {formatCurrency(mat.cost)}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-secondary">Total Cost:</span>
                    <span className="font-bold text-primary">{formatCurrency(totalCost)}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleBuy}
                        className="w-full bg-primary hover:bg-primary-variation text-light rounded-lg py-2 font-semibold"
                    >
                        Buy & Continue
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full border border-border rounded-lg py-2 font-semibold text-secondary hover:bg-background"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}