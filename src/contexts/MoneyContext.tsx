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
        // Money
        setMoney(Number(localStorage.getItem("@business-game:money")) || 0);

        // Level
        let localStorageLevel = 0;

        if(Number(localStorage.getItem("@business-game:level")) >= LEVELS.length) {
            setLevel(LEVELS.length - 1);
            localStorage.setItem("@business-game:level", `${LEVELS.length - 1}`);

            localStorageLevel = LEVELS.length - 1;
        }
        else {
            setLevel(Number(localStorage.getItem("@business-game:level")));

            localStorageLevel = Number(localStorage.getItem("@business-game:level"));
        }

        // XP
        if(Number(localStorage.getItem("@business-game:xp")) > LEVELS[localStorageLevel].xpRequired) {
            setXp(LEVELS[localStorageLevel].xpRequired);
            localStorage.setItem("@business-game:xp", `${LEVELS[localStorageLevel].xpRequired}`);
        }
        else {
            setXp(Number(localStorage.getItem("@business-game:xp")));
        }
        
        if(localStorageLevel === 0) {
            setXpPreviousLevel(0);
        }
        else {
            setXpPreviousLevel(LEVELS[localStorageLevel - 1].xpRequired);
        }

        if(localStorageLevel === LEVELS.length - 1) {
            setXpToNextLevel(LEVELS[localStorageLevel].xpRequired);
        }
        else {
            setXpToNextLevel(LEVELS[localStorageLevel].xpRequired);
        }

        // Per Click
        setPerClick(LEVELS[localStorageLevel].perClick);
    }, []);

    function updateMoney(newMoney: number) {
        setMoney(newMoney);
        localStorage.setItem("@business-game:money", newMoney.toString());
    }

    function updateXp(newXp: number) {
        if(newXp <= LEVELS[LEVELS.length - 1].xpRequired) {
            setXp(newXp);
            localStorage.setItem("@business-game:xp", newXp.toString());
        }
        else {
            setXp(LEVELS[LEVELS.length - 1].xpRequired);
            localStorage.setItem("@business-game:xp", LEVELS[LEVELS.length - 1].xpRequired.toString());
        }
    }

    function checkIfUpdateLevel(newXp: number) {
        if (level > LEVELS.length - 1) {
            return;
        }

        if (level === LEVELS.length - 1) {
            setXpPreviousLevel(LEVELS[level].xpRequired);
            setXpToNextLevel(LEVELS[level].xpRequired);
            return;
        }

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