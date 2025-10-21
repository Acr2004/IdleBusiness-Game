"use client"
import { createContext, ReactNode, useEffect, useState } from "react";
import { Business } from "../classes/Business";
import { TransportBusiness } from "../classes/TransportBusiness";
import { ShopBusiness } from "../classes/ShopBusiness";
import { FactoryBusiness } from "../classes/FactoryBusiness";
import { TaxiBusiness } from "../classes/TaxiBusiness";
import { Car } from "@/classes/Car";
import { ConstructionBusiness } from "@/classes/ConstructionBusiness";
import { Construction } from "@/classes/Construction";

export type ConstructionInfo = {
    name: string;
    materials: {
        name: string;
        amount: number;
        icon: string;
    }[];
    time: number;
    price: number;
    level: number;
    previous: number;
};

export type Material = {
    name: string;
    price: number;
    icon: string;
};

type SpacePrice = {
    addedSpace: number;
    price: number;
};

export type CarInfo = {
    name: string;
    maxKilometers: number;
    kilometers: number;
    incomePerHour: number;
    category: string;
    price: number;
};

type BusinessSubtypeInfo = {
    subtype: number;
    name: string;
    cost: number;
    levelUpCost: number;
    levelUpCostMultiplier: number;
    baseIncome: number;
    incomeMultiplier: number;
    maxLevel: number;
};

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
    materials?: Material[];
    constructions?: ConstructionInfo[];
};

export interface BusinessContextType {
    businessData: BusinessTypeInfo[];
    businesses: Business[];
    addBusiness: (name: string, type: number, subtype?: number) => void;
    changeBusinessName: (business: Business, newName: string) => void;
    updateBusinessLevel: (business: Business) => void;
    addCarToBusiness: (business: Business, car: CarInfo) => void;
    addMoreSpace: (business: Business, spaceToAdd: number) => void;
    addConstructionToBusiness: (business: Business, construction: ConstructionInfo) => void;
    addMaterial: (business: Business, materialName: string, quantity: number) => void;
    getMaterialAmount: (business: Business, materialName: string) => number;
    spendMaterial: (business: Business, materialName: string, quantity: number) => void;
    sellConstruction: (business: Business, constructionId: string) => void;
    removeKilometersAndTime: () => void;
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
                    else if (business.type === 4) {
                        const constructions = business.constructions.map((c: any) =>
                            new Construction(c.name, c.timeLeft, c.price, c.level, c.id)
                        );

                        return new ConstructionBusiness(business.name, business.type, constructions, business.salesMap, business.metal, business.workers, business.wood, business.concrete, business.id);
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
            case 4: {
                newBusiness = new ConstructionBusiness(name, type, []);
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

    function addConstructionToBusiness(business: Business, construction: ConstructionInfo) {
        if(business instanceof ConstructionBusiness) {
            business.addConstruction(construction.name, construction.time, construction.price, construction.level);
            localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
        }
    }

    function addMaterial(business: Business, materialName: string, quantity: number) {
        if(business instanceof ConstructionBusiness) {
            business.addMaterial(materialName, quantity);
            localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
        }
    }

    function getMaterialAmount(business: Business, materialName: string) {
        if(business instanceof ConstructionBusiness) {
            return business.getMaterialAmount(materialName);
        }

        return 0;
    }

    function spendMaterial(business: Business, materialName: string, quantity: number) {
        if(business instanceof ConstructionBusiness) {
            business.useMaterial(materialName, quantity);
            localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
        }
    }

    function sellConstruction(business: Business, constructionId: string) {
        if (business instanceof ConstructionBusiness) {
            business.sellConstruction(constructionId);
            localStorage.setItem("@business-game:businesses", JSON.stringify(businesses));
        }
    }

    function removeKilometersAndTime() {
        for(const business of businesses) {
            if(business instanceof TaxiBusiness || business instanceof TransportBusiness) {
                for(const car of business.activeCars) {
                    car.removeKilometers();
                }
            }
            if(business instanceof ConstructionBusiness) {
                for(const construction of business.constructions) {
                    construction.removeTime();
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
                addConstructionToBusiness,
                addMaterial,
                getMaterialAmount,
                spendMaterial,
                sellConstruction,
                removeKilometersAndTime,
                deleteBusiness,
                calculateAllIncomePerHour,
                getBestBusiness
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
}