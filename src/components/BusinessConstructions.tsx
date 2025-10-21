import { Construction } from "@/classes/Construction";
import { ConstructionBusiness } from "@/classes/ConstructionBusiness";
import { BusinessContext } from "@/contexts/BusinessContext";
import { MoneyContext } from "@/contexts/MoneyContext";
import { formatCurrency } from "@/utils/currency";
import { formatDuration } from "@/utils/time";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useState } from "react";

interface BusinessConstructionsProps {
    constructions: Construction[];
    business: ConstructionBusiness;
}

export function BusinessConstructions({ constructions, business }: BusinessConstructionsProps) {
    const [page, setPage] = useState(0);
    const constructionsPerPage = 4;

    const totalPages = Math.ceil(constructions.length / constructionsPerPage);

    const startIndex = page * constructionsPerPage;
    const visibleConstructions = constructions.slice(startIndex, startIndex + constructionsPerPage);

    const { money, updateMoney } = useContext(MoneyContext);
    const { sellConstruction } = useContext(BusinessContext);

    const handleSellConstruction = (construction: Construction) => {
        updateMoney(money + construction.price);
        sellConstruction(business, construction.id);
    }
    
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {visibleConstructions.map((construction, index) => (
                <div
                    key={index}
                    className="p-4 rounded-xl border-2 border-border bg-background shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex justify-between mb-4">
                        <h4 className="font-semibold text-primary">{construction.name}</h4>
                    </div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                        <p className="text-secondary">Time Left:</p>
                        <span className="text-tertiary">{formatDuration(construction.timeLeft)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                        <p className="text-secondary">Price:</p>
                        <span className="text-primary">{formatCurrency(construction.price)}</span>
                    </div>

                    <button
                        disabled={construction.timeLeft !== 0}
                        onClick={() => handleSellConstruction(construction)}
                        className="w-full mt-2 py-2 rounded-2xl font-semibold transition-colors bg-primary hover:bg-primary-variation disabled:cursor-not-allowed disabled:bg-primary/50 text-light cursor-pointer"
                    >
                        Sell
                    </button>
                </div>
                ))}
            </div>

            {/* Navigation */}
            { totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 rounded-lg bg-background text-primary hover:bg-primary-soft disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-background disabled:text-black"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-tertiary">
                    Page {page + 1} / {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 rounded-lg bg-background text-primary hover:bg-primary-soft disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-background disabled:text-black"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                </div>
            )}
        </>
    );
}