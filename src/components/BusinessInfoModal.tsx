import { Business } from "@/classes/Business";
import { BusinessContext } from "@/contexts/BusinessContext";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { BusinessStatModal } from "./BusinessStatModal";
import { BusinessStatSectionModal } from "./BusinessStatSectionModal";
import { ShopBusiness } from "@/classes/ShopBusiness";
import { FactoryBusiness } from "@/classes/FactoryBusiness";
import { useContext, useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { MoneyContext } from "@/contexts/MoneyContext";

interface BusinessInfoModalProps {
    selectedBusiness: Business;
    handleCloseBusinessInfoModal: () => void;
}

export function BusinessInfoModal({
    selectedBusiness,
    handleCloseBusinessInfoModal,
}: BusinessInfoModalProps) {
    const { money } = useContext(MoneyContext);
    const { businessData, changeBusinessName, deleteBusiness } = useContext(BusinessContext);

    const [editingName, setEditingName] = useState('');

    const handleSaveName = () => {
        if (!selectedBusiness || !editingName.trim()) return;
        
        changeBusinessName(selectedBusiness, editingName.trim());
        
        handleCloseBusinessInfoModal();
    };

    const handleDeleteBusiness = () => {
        handleCloseBusinessInfoModal();
        deleteBusiness(selectedBusiness);
    };

    const handleClose = () => {
        handleCloseBusinessInfoModal();
        setEditingName("");
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Modal Header*/}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold text-secondary flex items-center gap-1">
                            {selectedBusiness.name}
                            { (selectedBusiness instanceof ShopBusiness || selectedBusiness instanceof FactoryBusiness) ? (
                                <span className="text-xl font-medium text-tertiary"> - {businessData[selectedBusiness.type].subtypes![selectedBusiness.subtype].name}</span>
                            ) : (
                                <span className="text-xl font-medium text-tertiary"> - {businessData[selectedBusiness.type].name}</span>
                            )}
                        </h2>
                        <p className="text-tertiary">{businessData[selectedBusiness.type].category}</p>
                        <p className="text-sm text-secondary mt-1">
                            Money Available: <span className="font-semibold text-primary">{formatCurrency(money)}</span>
                        </p>
                    </div>
                    <div className='flex gap-2 items-center justify-center'>
                        <button
                            onClick={handleClose}
                            className="cursor-pointer p-2 hover:bg-background rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-tertiary" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background rounded-lg p-4 border-2 border-border">
                            <div className="font-semibold text-secondary mb-1">Income</div>
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(selectedBusiness.calculateIncomePerHour())} <span className="text-sm font-normal">per hour</span>
                            </div>
                        </div>
                        <BusinessStatModal business={selectedBusiness} />
                    </div>

                    {/* Edit Name Section */}
                    <div className="border-2 border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <Edit2 className="w-5 h-5" />
                            Edit Name
                        </h3>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Business Name"
                            />
                            <button
                                onClick={handleSaveName}
                                disabled={!editingName.trim() || editingName === selectedBusiness.name}
                                className="px-4 py-2 bg-primary text-light rounded-lg hover:bg-primary-variation disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Business Specific Section */}
                    <BusinessStatSectionModal
                        businessData={businessData}
                        business={selectedBusiness}
                    />

                    {/* Danger Zone */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                        <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Danger Zone
                        </h3>
                        <p className="text-sm text-red-600 mb-3">
                            Deleting this business will remove it completely forever. This action cannot be undone.
                        </p>
                        <button
                            onClick={handleDeleteBusiness}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-light rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Business
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}