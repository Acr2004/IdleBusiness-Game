import { CarInfo } from "@/contexts/BusinessContext";
import { X } from "lucide-react";

interface BuyCarModalProps {
  cars: CarInfo[];
  money: number;
  formatCurrency: (value: number) => string;
  onClose: () => void;
  onBuy: (car: CarInfo) => void;
}

export function BuyCarModal({ cars, money, formatCurrency, onClose, onBuy }: BuyCarModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-secondary">Buy a Car</h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 hover:bg-background rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-tertiary" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cars.map((car, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-xl border-2 border-border hover:border-primary transition-all bg-background flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <h3 className="font-semibold text-secondary">{car.name}</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary">Category:</span>
                                    <span className="font-semibold text-secondary">{car.category}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary">Kilometers:</span>
                                    <span className="font-semibold text-secondary">{car.kilometers} km</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary">Income per Hour:</span>
                                    <span className="font-semibold text-primary">{formatCurrency(car.incomePerHour)}</span>
                                </div>
                            </div>
                            <button
                                disabled={money < car.price}
                                onClick={() => onBuy(car)}
                                className="mt-3 px-4 py-2 rounded-lg font-semibold transition-colors bg-primary hover:bg-primary-variation text-light cursor-pointer"
                            >
                                Buy for {formatCurrency(car.price)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}