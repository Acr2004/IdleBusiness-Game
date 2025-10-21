"use client"

import { createContext, useContext, useEffect } from "react";
import { BusinessContext } from "./BusinessContext";
import { MoneyContext } from "./MoneyContext";

interface TimeFlowContextType {
    todo: () => void;
}

export const TimeFlowContext = createContext({} as TimeFlowContextType);

interface TimeFlowProviderProps {
    children: React.ReactNode;
}

export function TimeFlowProvider({ children }: TimeFlowProviderProps) {
    const { money, updateMoney } = useContext(MoneyContext);
    const { calculateAllIncomePerHour, removeKilometersAndTime } = useContext(BusinessContext);

    // Add All Businesses Income and Remove Kilometers from Cars
    useEffect(() => {
        const interval = setInterval(() => {
            const moneyPerMinute = parseFloat((calculateAllIncomePerHour() / 60).toFixed(2));
            updateMoney(money + moneyPerMinute);

            removeKilometersAndTime();
        }, 60000);

        return () => clearInterval(interval);
    });

    function todo() {
        //TODO
    }
    
    return (
        <TimeFlowContext.Provider value={{ todo }}>
            { children }
        </TimeFlowContext.Provider>
    );
}