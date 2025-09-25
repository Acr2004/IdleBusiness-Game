import { Business } from "@/classes/Business";
import { FactoryBusiness } from "@/classes/FactoryBusiness";
import { ShopBusiness } from "@/classes/ShopBusiness";
import { TaxiBusiness } from "@/classes/TaxiBusiness";
import { TransportBusiness } from "@/classes/TransportBusiness";

interface BusinessStatModalProps {
    business: Business;
}

export function BusinessStatModal({ business }: BusinessStatModalProps) {
    return (
        <>
            { (business instanceof ShopBusiness || business instanceof FactoryBusiness) && (
                <div className="bg-background rounded-lg p-4 border-2 border-border">
                    <div className="font-semibold text-secondary mb-1">Level</div>
                    <div className="text-2xl font-bold text-secondary">{business.level} / {business.maxLevel}</div>
                </div>
            )}
            { (business instanceof TaxiBusiness || business instanceof TransportBusiness) && (
                <div className="bg-background rounded-lg p-4 border-2 border-border">
                    <div className="font-semibold text-secondary mb-1">Cars</div>
                    <div className="text-2xl font-bold text-secondary">{business.activeCars.length} / {business.maxSpace}</div>
                </div>
            )}
        </>
    );
}