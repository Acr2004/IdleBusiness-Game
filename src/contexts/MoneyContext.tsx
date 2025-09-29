"use client"
import { createContext, useEffect, useState } from "react";

const LEVELS = [
    {
        level: 0,
        xpRequired: 100,
        perClick: 1,
    },
    {
        level: 1,
        xpRequired: 250,
        perClick: 2,
    },
    {
        level: 2,
        xpRequired: 600,
        perClick: 5,
    },
    {
        level: 3,
        xpRequired: 2000,
        perClick: 10,
    },
];

interface MoneyContextType {
    money: number;
    perClick: number;
    xp: number;
    xpPreviousLevel: number;
    xpToNextLevel: number;
    level: number;
    updateMoney: (newMoney: number) => void;
    updateXp: (newXp: number) => void;
    checkIfUpdateLevel: (newXp: number) => void;
}

export const MoneyContext = createContext({} as MoneyContextType);

interface MoneyProviderProps {
    children: React.ReactNode;
}

export function MoneyProvider({ children }: MoneyProviderProps) {
    const [money, setMoney] = useState(0);
    const [perClick, setPerClick] = useState(LEVELS[0].perClick);
    const [xp, setXp] = useState(0);
    const [xpPreviousLevel, setXpPreviousLevel] = useState(0);
    const [xpToNextLevel, setXpToNextLevel] = useState(LEVELS[0].xpRequired);
    const [level, setLevel] = useState(0);

    // Check Local Storage
    useEffect(() => {
        setMoney(Number(localStorage.getItem("@business-game:money")) || 0);
        setXp(Number(localStorage.getItem("@business-game:xp")) || 0);
        if(Number(localStorage.getItem("@business-game:level")) === 0) {
            setXpPreviousLevel(0);
        }
        else {
            setXpPreviousLevel(LEVELS[Number(localStorage.getItem("@business-game:level")) - 1].xpRequired || 0);
        }
        setXpToNextLevel(LEVELS[Number(localStorage.getItem("@business-game:level"))].xpRequired || LEVELS[0].xpRequired);
        setLevel(Number(localStorage.getItem("@business-game:level")) || 0);
        setPerClick(LEVELS[Number(localStorage.getItem("@business-game:level"))].perClick || LEVELS[0].perClick);
    }, []);

    function updateMoney(newMoney: number) {
        setMoney(newMoney);
        localStorage.setItem("@business-game:money", newMoney.toString());
    }

    function updateXp(newXp: number) {
        setXp(newXp);
        localStorage.setItem("@business-game:xp", newXp.toString());
    }

    function checkIfUpdateLevel(newXp: number) {
        if(LEVELS[level].xpRequired <= newXp) {
            setLevel((prevState) => prevState + 1);
            setXpPreviousLevel(LEVELS[level].xpRequired);
            setXpToNextLevel(LEVELS[level + 1].xpRequired);
            setPerClick(LEVELS[level + 1].perClick);
            localStorage.setItem("@business-game:level", (level + 1).toString());
        }
    }

    return (
        <MoneyContext.Provider value={{ money, perClick, xp, xpPreviousLevel, xpToNextLevel, level, updateMoney, updateXp, checkIfUpdateLevel }}>
            {children}
        </MoneyContext.Provider>
    );
}