import { ConstructionBusiness } from "@/classes/ConstructionBusiness";
import { BusinessContext, ConstructionInfo, Material } from "@/contexts/BusinessContext";
import { formatDuration } from "@/utils/time";
import { X } from "lucide-react";
import { useContext, useState } from "react";
import { MissingMaterialsModal } from "./MissingMaterialsModal";

interface StartConstructionModalProps {
    business: ConstructionBusiness;
    materials: Material[];
    constructions: ConstructionInfo[];
    formatCurrency: (value: number) => string;
    onStart: (construction: ConstructionInfo) => void;
    onClose: () => void;
}

export function StartConstructionModal({ business, materials, constructions, formatCurrency, onStart, onClose }: StartConstructionModalProps) {
    const { addMaterial, getMaterialAmount, spendMaterial } = useContext(BusinessContext);
    
    const [missingMaterials, setMissingMaterials] = useState<{ name: string; missing: number; cost: number; }[] | null>(null);
    const [selectedConstruction, setSelectedConstruction] = useState<ConstructionInfo | null>(null);
    const [isMissingMaterialsModalOpen, setIsMissingMaterialsModalOpen] = useState(false);
    
    function addConstruction(construction: ConstructionInfo) {
        spendMaterial(business, "Metal", construction.materials[0].amount);
        spendMaterial(business, "Workers", construction.materials[1].amount);
        spendMaterial(business, "Wood", construction.materials[2].amount);
        spendMaterial(business, "Concrete", construction.materials[3].amount);

        onStart(construction);
    }

    const handleBuy = (construction: ConstructionInfo) => {
        const missing = construction.materials.map((m, i) => {
            const current = getMaterialAmount(business, m.name);
            const missingAmount = Math.max(0, m.amount - current);
            const cost = missingAmount * materials[i].price;
            
            return missingAmount > 0 ? { name: m.name, missing: missingAmount, cost } : null;
        }).filter(Boolean) as { name: string; missing: number; cost: number }[];

        if (missing.length > 0) {
            setMissingMaterials(missing);
            setSelectedConstruction(construction);
            setIsMissingMaterialsModalOpen(true);
        } else {
            addConstruction(construction);
        }
    }

    function onCloseMissingMaterialsModal() {
        setMissingMaterials(null);
        setIsMissingMaterialsModalOpen(false);
    }

    function handleBuyMissing() {
        missingMaterials?.map((material) => {
            addMaterial(business, material.name, material.missing);
        })

        setIsMissingMaterialsModalOpen(false);
        setMissingMaterials(null);
        addConstruction(selectedConstruction!);
    }
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-secondary">Start a Construction</h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 hover:bg-background rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-tertiary" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] grid grid-cols-1 md:grid-cols-2 gap-4">
                    {constructions.map((construction, index) => {
                        const previousSold = business.getSoldCountByLevel(construction.level - 1);
                        
                        return (
                            <div
                                key={index}
                                className="p-4 rounded-xl border-2 border-border hover:border-primary transition-all bg-background flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-secondary">{construction.name}</h3>

                                    {/* Materials Section */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-secondary">Materials</h4>
                                        <hr className="border-tertiary opacity-30 mb-3" />
                                        <ul className="space-y-1">
                                            {construction.materials.map((mat, i) => (
                                                <li key={i} className="flex justify-between text-sm text-tertiary">
                                                    <span>{mat.name}:</span>
                                                    <span className="font-medium text-secondary">x{mat.amount}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <hr className="border-tertiary opacity-30 mt-3" />
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-secondary">Time:</span>
                                        <span className="font-semibold text-secondary">{formatDuration(construction.time)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-secondary">Selling Price:</span>
                                        <span className="font-semibold text-primary">{formatCurrency(construction.price)}</span>
                                    </div>
                                </div>
                                { previousSold >= construction.previous ? (
                                    <button
                                        onClick={() => handleBuy(construction)}
                                        className="mt-3 px-4 py-2 rounded-lg font-semibold transition-colors bg-primary hover:bg-primary-variation text-light cursor-pointer"
                                    >
                                        Start
                                    </button>
                                ) : (
                                    <p className="text-center text-sm font-semibold text-secondary mt-4">You need to sell <span className="text-primary">{construction.previous - previousSold} more {constructions[index - 1].name}{construction.previous - previousSold > 1 ? "s" : ""}</span> to build this.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            { isMissingMaterialsModalOpen &&
                <MissingMaterialsModal
                    missingMaterials={missingMaterials}
                    formatCurrency={formatCurrency}
                    onConfirmPurchase={handleBuyMissing}
                    onClose={onCloseMissingMaterialsModal}
                />
            }
        </div>
    );
}