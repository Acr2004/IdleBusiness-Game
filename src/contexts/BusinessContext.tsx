"use client"
import { createContext, ReactNode, useEffect, useState } from "react";
import { Business } from "../classes/Business";
import { TransportBusiness } from "../classes/TransportBusiness";
import { ShopBusiness } from "../classes/ShopBusiness";
import { FactoryBusiness } from "../classes/FactoryBusiness";
import { TaxiBusiness } from "../classes/TaxiBusiness";
import { Car } from "@/classes/Car";

type SpacePrice = {
    addedSpace: number;
    price: number;
}

export type CarInfo = {
    name: string;
    maxKilometers: number;
    kilometers: number;
    incomePerHour: number;
    category: string;
    price: number;
}

type BusinessSubtypeInfo = {
    subtype: number;
    name: string;
    cost: number;
    levelUpCost: number;
    levelUpCostMultiplier: number;
    baseIncome: number;
    incomeMultiplier: number;
    maxLevel: number;
}

export type BusinessTypeInfo = {
    name: string;
    description: string;
    category: string;
    icon: string;
    subtypes?: BusinessSubtypeInfo[];
    cost?: number;
    baseIncome?: number;
    maxBaseSpace?: number;
    cars?: CarInfo[];
    spacePrices?: SpacePrice[];
}

export interface BusinessContextType {
    businessData: BusinessTypeInfo[];
    businesses: Business[];
    addBusiness: (name: string, type: number, subtype?: number) => void;
    changeBusinessName: (business: Business, newName: string) => void;
    updateBusinessLevel: (business: Business) => void;
    addCarToBusiness: (business: Business, car: CarInfo) => void;
    addMoreSpace: (business: Business, spaceToAdd: number) => void;
    removeKilometers: () => void;
    deleteBusiness: (businessToDelete: Business) => void;
    calculateAllIncomePerHour: () => number;
    getBestBusiness: () => Business | null;
}

export const BusinessContext = createContext({} as BusinessContextType);

interface BusinessProviderProps {
    children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
    const [businessData, setBusinessData] = useState<BusinessTypeInfo[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);

    // Get Business Data from JSON
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/data/businessData.json");
                const data = await res.json();
                setBusinessData(data);
            } catch {
                console.error("Error loading Business Data from JSON.");
            }
        }

        fetchData();
    }, []);

    // Check for Player Data in Local Storage
    useEffect(() => {
        const storedData = localStorage.getItem("@business-game:businesses");
        
        if (storedData) {
            try {
                const parsedData: any[] = JSON.parse(storedData);

                const businesses = parsedData.map((business) => {
                    if (business.type === 0) {
                        return new ShopBusiness(business.name, business.type, business.subtype, business.incomePerHour, business.incomeMultiplier, business.levelUpCost, business.levelUpCostMultiplier, business.maxLevel, business.level, business.id);
                    }
                    else if (business.type === 1) {
                        const cars = business.activeCars.map((c: any) =>
                            new Car(c.name, c.category, c.maxKilometers, c.kilometers, c.incomePerHour, c.id)
                        );

                        console.log(cars);

                        return new TaxiBusiness(business.name, business.type, cars, business.maxSpace, business.id);
                    }
                    else if (business.type === 2) {
                        return new FactoryBusiness(business.name, business.type, business.subtype, business.incomePerHour, business.incomeMultiplier, business.levelUpCost, business.levelUpCostMultiplier, business.maxLevel, business.level, business.id);
                    }
                    else if (business.type === 3) {
                        const cars = business.activeCars.map((c: any) =>
                            new Car(c.name, c.category, c.maxKilometers, c.kilometers, c.incomePerHour, c.id)
                        );

                        return new TransportBusiness(business.name, business.type, cars, business.maxSpace, business.id);
                    }
                    else {
                        return new Business(business.name, business.type, business.id);
                    }
                });

                setBusinesses(businesses);
            } catch (error) {
                console.error("Error with Local Storage parsing.", error);
            }
        }
    }, [businessData]);

    function addBusiness(name: string, type: number, subtype?: number) {
        let newBusiness: Business;

        switch(type) {
            case 0: {
                const subtypeData = businessData[type].subtypes![subtype!];
                newBusiness = new ShopBusiness(
                    name, type, subtype!,
                    subtypeData.baseIncome, subtypeData.incomeMultiplier,
                    subtypeData.levelUpCost, subtypeData.levelUpCostMultiplier, subtypeData.maxLevel
                );
                break;
            }
            case 1: {
                newBusiness = new TaxiBusiness(name, type, [], businessData[type].maxBaseSpace!);
                break;
            }
            case 2: {
                const subtypeData = businessData[type].subtypes![subtype!];
                newBusiness = new FactoryBusiness(
                    name, type, subtype!,
                    subtypeData.baseIncome, subtypeData.incomeMultiplier,
                    subtypeData.levelUpCost, subtypeData.levelUpCostMultiplier, subtypeData.maxLevel
                );
                break;
            }
            case 3: {
                newBusiness = new TransportBusiness(name, type, [], businessData[type].maxBaseSpace!);
                break;
            }
            default: {
                newBusiness = new Business(name, type);
                break;
            }
        }

        setBusinesses((prevState) => {
            const updated = [...prevState, newBusiness];
            localStorage.setItem("@business-game:businesses", JSON.stringify(updated));

            return updated;
        });
    }

    function changeBusinessName(business: Business, newName: string) {
        business.setName(newName);
        localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
    }

    function updateBusinessLevel(business: Business) {
        if(business instanceof ShopBusiness || business instanceof FactoryBusiness) {
            business.levelUp();
            localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
        }
    }

    function addCarToBusiness(business: Business, car: CarInfo) {
        if(business instanceof TaxiBusiness || business instanceof TransportBusiness) {
            business.addCar(car.name, car.category, car.kilometers, car.kilometers, car.incomePerHour);
            localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
        }
    }

    function addMoreSpace(business: Business, spaceToAdd: number) {
        if(business instanceof TaxiBusiness || business instanceof TransportBusiness) {
            business.addSpace(spaceToAdd);
            localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
        }
    }

    function removeKilometers() {
        for(const business of businesses) {
            if(business instanceof TaxiBusiness || business instanceof TransportBusiness) {
                for(const car of business.activeCars) {
                    car.removeKilometers();
                }
            }
        }
        localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
    }

    function deleteBusiness(businessToDelete: Business) {
        setBusinesses(() => {
            const businessWithoutDeleted = businesses.filter((business) => business.id !== businessToDelete.id);
            localStorage.setItem("@business-game:businesses", JSON.stringify(businessWithoutDeleted));

            return businessWithoutDeleted;
        });
    }

    function calculateAllIncomePerHour() {
        return Number(businesses.reduce((total, business) => total + business.calculateIncomePerHour(), 0).toFixed(2));
    }

    function getBestBusiness() {
        if (businesses.length === 0) return null;

        return businesses.reduce((max, business) =>
            business.calculateIncomePerHour() > max.calculateIncomePerHour() ? business : max
        );
    }

    return (
        <BusinessContext.Provider
            value={{
                businessData,
                businesses,
                addBusiness,
                changeBusinessName,
                updateBusinessLevel,
                addCarToBusiness,
                addMoreSpace,
                removeKilometers,
                deleteBusiness,
                calculateAllIncomePerHour,
                getBestBusiness
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
}