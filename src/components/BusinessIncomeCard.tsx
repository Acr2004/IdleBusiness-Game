import { Business } from "@/classes/Business";
import { ConstructionBusiness } from "@/classes/ConstructionBusiness";
import { formatCurrency } from "@/utils/currency";

interface BusinessIncomeCardProps {
    business: Business;
}

export function BusinessIncomeCard({ business }: BusinessIncomeCardProps) {
    return (
        <>
            { (business instanceof ConstructionBusiness) ? (
                <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-tertiary">Finished Projects Income</span>
                        <span className="text-xl font-bold text-primary">
                            {formatCurrency(business.calculateFinishedProjectsIncome())}
                        </span>
                    </div>
                </div>
            ) :
            (
                <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-tertiary">Income per Hour</span>
                        <span className="text-xl font-bold text-primary">
                            {formatCurrency(business.calculateIncomePerHour())}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}