import { Business } from "@/classes/Business";
import { BusinessContext, CarInfo, ConstructionInfo } from "@/contexts/BusinessContext";
import { FactoryBusiness } from "@/classes/FactoryBusiness";
import { ShopBusiness } from "@/classes/ShopBusiness";
import { TaxiBusiness } from "@/classes/TaxiBusiness";
import { TransportBusiness } from "@/classes/TransportBusiness";
import { BusinessTypeInfo } from "@/contexts/BusinessContext";
import { ArrowUp, CirclePlus, Handshake } from "lucide-react";
import { useContext, useState } from "react";
import { BuyCarModal } from "./BuyCarModal";
import { MoneyContext } from "@/contexts/MoneyContext";
import { formatCurrency } from "@/utils/currency";
import { BusinessCars } from "./BusinessCars";
import { GarageUpgrades } from "./GarageUpgrades";
import { ConstructionBusiness } from "@/classes/ConstructionBusiness";
import { BusinessConstructions } from "./BusinessConstructions";
import { StartConstructionModal } from "./StartConstructionModal";
import { Materials } from "./Materials";

interface BusinessStatSectionModalProps {
    businessData: BusinessTypeInfo[];
    business: Business;
}

export function BusinessStatSectionModal({ businessData, business }: BusinessStatSectionModalProps) {
    const { money, updateMoney } = useContext(MoneyContext);
    const { updateBusinessLevel, addCarToBusiness, addConstructionToBusiness } = useContext(BusinessContext);
    
    const [isCarModalOpen, setIsCarModalOpen] = useState(false);
    const [isConstructionsModalOpen, setIsConstructionsModalOpen] = useState(false);

    const handleOpenCarModal = () => {
        setIsCarModalOpen(true);
    };

    const handleCloseCarModal = () => {
        setIsCarModalOpen(false);
    };

    const handleOpenConstructionsModal = () => {
        setIsConstructionsModalOpen(true);
    };

    const handleCloseConstructionsModal = () => {
        setIsConstructionsModalOpen(false);
    };

    const handleLevelUp = () => {
        if(business && (business instanceof ShopBusiness || business instanceof FactoryBusiness)) {
            if(money >= business.levelUpCost) {
                updateMoney(money - business.levelUpCost);
                updateBusinessLevel(business);
            }
        }
    };

    const handleBuyCar = (car: CarInfo) => {
        if(business instanceof TaxiBusiness || business instanceof TransportBusiness) {
            if(money >= car.price) {
                updateMoney(money - car.price);
                addCarToBusiness(business, car);
                handleCloseCarModal();
            }
        }
    };

    const handleStartConstruction = (construction: ConstructionInfo) => {
        if(business instanceof ConstructionBusiness) {
            addConstructionToBusiness(business, construction);
            handleCloseConstructionsModal();
        }
    };
    
    return (
        <>
            { (business instanceof ShopBusiness || business instanceof FactoryBusiness) && (
                <>
                    { business.canLevelUp() && (
                        <div className="border-2 border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                                <ArrowUp className="w-5 h-5" />
                                Upgrade Business
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary">Next Level:</span>
                                    <span className="font-semibold text-secondary">Level {business.level + 1}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary">New income per hour:</span>
                                    <span className="font-semibold text-primary">{formatCurrency(business.getNextBaseIncome())}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary">Upgrade Cost:</span>
                                    <span className={`font-semibold text-primary`}>
                                        {formatCurrency(business.getLevelUpCost())}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLevelUp}
                                    className={`w-full py-3 rounded-2xl font-semibold transition-colors bg-primary hover:bg-primary-variation text-light cursor-pointer`}
                                >
                                    Level Up
                                </button>
                            </div>
                        </div>
                    )}
                    { !business.canLevelUp() && (
                        <div className='border-2 border-border rounded-lg p-4'>
                            <h3 className="text-lg font-semibold text-secondary justify-center flex items-center">
                                You already reached max level in this Business!
                            </h3>
                        </div>
                    )}
                </>
            )}
            { (business instanceof TaxiBusiness || business instanceof TransportBusiness) && (
                <>
                    <div className="border-2 border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <Handshake className="w-5 h-5" />
                            Your Cars
                        </h3>

                        { business.activeCars.length > 0 ? (
                            <BusinessCars
                                activeCars={business.activeCars}
                            />
                        ) : (
                            <h3 className="text-lg font-semibold text-secondary justify-center flex items-center py-2">
                                You don&apos;t have any cars. Try to buy one!
                            </h3>
                        )}

                        <div className="mt-4">
                            <button
                                disabled={!(business.activeCars.length < business.maxSpace)}
                                onClick={handleOpenCarModal}
                                className="w-full py-3 rounded-2xl font-semibold transition-colors bg-primary hover:bg-primary-variation disabled:cursor-not-allowed disabled:bg-primary/50 text-light cursor-pointer"
                            >
                                Buy a Car
                            </button>
                        </div>

                        { isCarModalOpen && (
                            <BuyCarModal
                                cars={businessData[business.type].cars!}
                                money={money}
                                formatCurrency={formatCurrency}
                                onClose={handleCloseCarModal}
                                onBuy={handleBuyCar}
                            />
                        )}
                    </div>
                    <div className="border-2 border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <CirclePlus className="w-5 h-5" />
                            Garage Upgrades
                        </h3>

                        <GarageUpgrades
                            business={business}
                        />
                    </div>
                </>
            )}
            { (business instanceof ConstructionBusiness) && (
                <>
                    <div className="border-2 border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <Handshake className="w-5 h-5" />
                            Your Projects
                        </h3>

                        { business.constructions.length > 0 ? (
                            <BusinessConstructions
                                constructions={business.constructions}
                                business={business}
                            />
                        ) : (
                            <h3 className="text-lg font-semibold text-secondary justify-center flex items-center py-2">
                                You don&apos;t have any constructions. Try to start one!
                            </h3>
                        )}

                        <div className="mt-4">
                            <button
                                onClick={handleOpenConstructionsModal}
                                className="w-full py-3 rounded-2xl font-semibold transition-colors bg-primary hover:bg-primary-variation disabled:cursor-not-allowed disabled:bg-primary/50 text-light cursor-pointer"
                            >
                                Start a Construction
                            </button>
                        </div>

                        { isConstructionsModalOpen && (
                            <StartConstructionModal
                                business={business}
                                materials={businessData[business.type].materials!}
                                constructions={businessData[business.type].constructions!}
                                formatCurrency={formatCurrency}
                                onStart={handleStartConstruction}
                                onClose={handleCloseConstructionsModal}
                            />
                        )}
                    </div>
                    <div className="border-2 border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <CirclePlus className="w-5 h-5" />
                            Buy Materials
                        </h3>

                        <Materials
                            business={business}
                        />
                    </div>
                </>
            )}
        </>
    );
}