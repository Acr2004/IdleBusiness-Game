import { Car } from "@/classes/Car";
import { formatCurrency } from "@/utils/currency";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface BusinessCarsProps {
    activeCars: Car[];
}

export function BusinessCars({ activeCars }: BusinessCarsProps) {
    const [page, setPage] = useState(0);
    const carsPerPage = 4;

    const totalPages = Math.ceil(activeCars.length / carsPerPage);

    const startIndex = page * carsPerPage;
    const visibleCars = activeCars.slice(startIndex, startIndex + carsPerPage);
    
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {visibleCars.map((car, index) => (
                <div
                    key={index}
                    className="p-4 rounded-xl border-2 border-border bg-background shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex justify-between mb-4">
                        <h4 className="font-semibold text-primary">{car.name}</h4>
                        <span className="text-xs px-2 py-1 rounded bg-black/5 text-tertiary">{car.category}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                        <p className="text-secondary">Kilometers Left:</p>
                        <span className="text-tertiary">{car.kilometers}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                        <p className="text-secondary">Income per Hour:</p>
                        <span className="text-primary">{formatCurrency(car.incomePerHour)}</span>
                    </div>
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