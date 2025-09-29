"use client"

import { createContext, useContext, useEffect } from "react";
import { BusinessContext } from "./BusinessContext";
import { MoneyContext } from "./MoneyContext";

export const TimeFlowContext = createContext({});

interface TimeFlowProviderProps {
    children: React.ReactNode;
}

export function TimeFlowProvider({ children }: TimeFlowProviderProps) {
    const { money, updateMoney } = useContext(MoneyContext);
    const { businesses, calculateAllIncomePerHour, removeKilometers } = useContext(BusinessContext);

    // Add All Businesses Income and Remove Kilometers from Cars
    useEffect(() => {
        const interval = setInterval(() => {
            const moneyPerMinute = parseFloat((calculateAllIncomePerHour() / 60).toFixed(2));
            updateMoney(money + moneyPerMinute);

            console.log(moneyPerMinute);
            console.log(businesses);

            removeKilometers();
        }, 60000);

        return () => clearInterval(interval);
    });
    
    return (
        <TimeFlowContext.Provider value="">
            { children }
        </TimeFlowContext.Provider>
    );
}