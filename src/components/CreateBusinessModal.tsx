import { BusinessContext } from "@/contexts/BusinessContext";
import { MoneyContext } from "@/contexts/MoneyContext";
import { formatCurrency } from "@/utils/currency";
import { IconName, ICONS_MAP } from "@/utils/icons";
import { ArrowLeft, X } from "lucide-react";
import { useContext, useState } from "react";

interface CreateBusinessModalProps {
    handleCloseModal: () => void;
}

export function CreateBusinessModal({
    handleCloseModal,
}: CreateBusinessModalProps) {
    const { money, updateMoney } = useContext(MoneyContext);
    const { businessData, addBusiness } = useContext(BusinessContext);

    const [modalStep, setModalStep] = useState<"select-business" | "select-subtype" | "name-business">("select-business");
    const [selectedBusinessType, setSelectedBusinessType] = useState<number | null>(null);
    const [selectedSubtype, setSelectedSubtype] = useState<number | null>(null);
    const [businessNameInput, setBusinessNameInput] = useState("");

    const handleGoToType = () => {
        setSelectedBusinessType(null);
        setModalStep("select-business");
        setBusinessNameInput("");
    };

    const handleGoToSubtype = () => {
        setSelectedSubtype(null);
        setModalStep("select-subtype");
        setBusinessNameInput("");
    };

    const handleSelectBusiness = (type: number) => {
        setSelectedBusinessType(type);

        if (businessData[type].subtypes && businessData[type].subtypes.length > 0) {
            setModalStep("select-subtype");
        } else {
            setModalStep("name-business");
        }
    };

    const handleSelectSubtype = (subtype: number) => {
        setSelectedSubtype(subtype);
        setModalStep("name-business");
    };

    const handleConfirmCreateBusiness = () => {
        if (!(selectedBusinessType !== null) || businessNameInput.trim() === "") return;

        if (businessData[selectedBusinessType].subtypes && selectedSubtype !== null) {
            const businessPrice = businessData[selectedBusinessType].subtypes[selectedSubtype].cost;
            if (money < businessPrice) return;

            updateMoney(money - businessPrice);
        }
        else if (!businessData[selectedBusinessType].subtypes) {
            const businessPrice = businessData[selectedBusinessType].cost;
            if (money < businessPrice!) return;

            updateMoney(money - businessPrice!);
        }

        if(selectedSubtype !== null) {
            addBusiness(businessNameInput.trim(), selectedBusinessType, selectedSubtype);
        }
        else {
            addBusiness(businessNameInput.trim(), selectedBusinessType);
        }

        handleClose();
    };

    const handleClose = () => {
        handleCloseModal();
        setSelectedBusinessType(null);
        setSelectedSubtype(null);
        setBusinessNameInput("");
        setModalStep("select-business");
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold text-secondary">Build New Business</h2>
                        <p className="text-tertiary">Choose a new Business to be added to your Empire</p>
                        <p className="text-sm text-secondary mt-1">
                            Money Available: <span className="font-semibold text-primary">{formatCurrency(money)}</span>
                        </p>
                    </div>
                    <div className='flex gap-2 items-center justify-center'>
                        { modalStep === "select-subtype" && (
                            <button
                                onClick={handleGoToType}
                                className="cursor-pointer p-2 hover:bg-background rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-tertiary" />
                            </button>
                        )}
                        { modalStep === "name-business" && (
                            <button
                                onClick={businessData[selectedBusinessType!].subtypes ? handleGoToSubtype : handleGoToType}
                                className="cursor-pointer p-2 hover:bg-background rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-tertiary" />
                            </button>
                        )}
                        <button
                            onClick={handleCloseModal}
                            className="cursor-pointer p-2 hover:bg-background rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-tertiary" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                    { modalStep === "select-business" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            { businessData.map((template, index) => {
                                const iconName = template.icon as IconName;
                                const Icon = ICONS_MAP[iconName];

                                return (
                                    <div
                                        key={index}
                                        className='p-4 rounded-xl border-2 transition-all cursor-pointer border-border hover:border-primary hover:shadow-md flex flex-col justify-between'
                                        onClick={() => handleSelectBusiness(index)}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Icon */}
                                            <div className='p-3 rounded-lg bg-primary-soft text-primary'>
                                                <Icon className="w-8 h-8" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 h-full flex flex-col">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className='font-semibold text-secondary'>
                                                        {template.name}
                                                    </h3>
                                                    <span className='text-xs px-2 py-1 rounded bg-black/5 text-tertiary'>
                                                        {template.category}
                                                    </span>
                                                </div>
                                    
                                                <p className='text-sm mb-4 text-tertiary flex-1'>
                                                    {template.description}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="space-y-1">
                                                        {template.subtypes ? 
                                                            <>
                                                                <div className='text-sm text-tertiary'>
                                                                    Income Range per Hour: 
                                                                    <div className='font-semibold text-primary'>
                                                                        {formatCurrency(Number(Math.min(...template.subtypes.map(s => s.baseIncome)).toFixed(2)))} - {formatCurrency(Number(Math.max(...template.subtypes.map(s => s.baseIncome)).toFixed(2)))}
                                                                    </div>
                                                                </div>
                                                                <div className='text-sm text-tertiary'>
                                                                    Cost Range: 
                                                                    <div className='font-semibold text-secondary'>
                                                                        {formatCurrency(Number(Math.min(...template.subtypes.map(s => s.cost)).toFixed(2)))} - {formatCurrency(Number(Math.max(...template.subtypes.map(s => s.cost)).toFixed(2)))}
                                                                    </div>
                                                                </div>
                                                            </> :
                                                            <>
                                                                <div className='text-sm text-tertiary'>
                                                                    Income per Hour:
                                                                    <div className='font-semibold text-primary'>
                                                                        {formatCurrency(Number(template.baseIncome))}
                                                                    </div>
                                                                </div>
                                                                <div className='text-sm text-tertiary'>
                                                                    Cost: 
                                                                    <div className='font-semibold text-secondary'>
                                                                        {formatCurrency(Number(template.cost))}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                            
                                                    <button
                                                        className='cursor-pointer self-end px-4 py-2 rounded-lg font-semibold transition-colors bg-primary hover:bg-primary-variaton text-light'
                                                    >
                                                        Buy
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    { modalStep === "select-subtype" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {businessData[selectedBusinessType!].subtypes!.map((subtype) => (
                                <div
                                    key={subtype.subtype}
                                    className="p-4 rounded-xl border-2 transition-all cursor-pointer border-border hover:border-primary hover:shadow-md"
                                    onClick={() => handleSelectSubtype(subtype.subtype)}
                                >
                                    <h3 className="font-semibold text-secondary mb-1">{subtype.name}</h3>
                                    <div className='space-y-1'>
                                        <div className="text-sm text-tertiary">
                                            Income per Hour:
                                            <div className="font-semibold text-primary">{formatCurrency(subtype.baseIncome)}</div>
                                        </div>
                                        <div className="text-sm text-tertiary">
                                            Cost:
                                            <div className="font-semibold text-secondary">{formatCurrency(subtype.cost)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    { modalStep === "name-business" && (
                        <div className="space-y-4">
                            <p className="text-tertiary">
                                Choose a name for your new business:
                            </p>
                            <input
                                type="text"
                                value={businessNameInput}
                                onChange={(e) => setBusinessNameInput(e.target.value)}
                                placeholder="My Business Name"
                                className="w-full p-3 rounded-xl border border-border bg-background text-secondary"
                            />
                            <button
                                onClick={handleConfirmCreateBusiness}
                                className="w-full bg-primary cursor-pointer hover:bg-primary-variaton text-light rounded-xl p-3 font-semibold"
                            >
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}