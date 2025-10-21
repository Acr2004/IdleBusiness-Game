import { Business } from "@/classes/Business";
import { ConstructionBusiness } from "@/classes/ConstructionBusiness";
import { FactoryBusiness } from "@/classes/FactoryBusiness";
import { ShopBusiness } from "@/classes/ShopBusiness";
import { TaxiBusiness } from "@/classes/TaxiBusiness";
import { TransportBusiness } from "@/classes/TransportBusiness";

interface BusinessStatCardProps {
    business: Business;
}

export function BusinessStatCard({ business }: BusinessStatCardProps) {
    return (
        <>
            { (business instanceof ShopBusiness || business instanceof FactoryBusiness) && (
                <div className="text-right">
                    <div className="text-xs text-tertiary">Level</div>
                    <div className="text-lg font-bold text-secondary">{business.level} / {business.maxLevel}</div>
                </div>
            )}
            { (business instanceof TaxiBusiness || business instanceof TransportBusiness) && (
                <div className="text-right">
                    <div className="text-xs text-tertiary">Cars</div>
                    <div className="text-lg font-bold text-secondary">{business.activeCars.length} / {business.maxSpace}</div>
                </div>
            )}
            { (business instanceof ConstructionBusiness) && (
                <div className="text-right">
                    <div className="text-xs text-tertiary">Projects</div>
                    <div className="text-lg font-bold text-secondary">{business.constructions.length}</div>
                </div>
            )}
        </>
    );
}