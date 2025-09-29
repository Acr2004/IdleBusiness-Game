"use client"
import { createContext, ReactNode, useEffect, useState } from "react";
import { Business } from "../classes/Business";
import { TransportBusiness } from "../classes/TransportBusiness";
import { ShopBusiness } from "../classes/ShopBusiness";
import { FactoryBusiness } from "../classes/FactoryBusiness";
import { TaxiBusiness } from "../classes/TaxiBusiness";
import { Car } from "@/classes/Car";

export interface StoredCar {
  name: string;
  category: string;
  maxKilometers: number;
  kilometers: number;
  incomePerHour: number;
  id: string;
}

export interface StoredBusiness {
  name: string;
  type: number;
  id: string;
  subtype?: number;
  incomePerHour?: number;
  incomeMultiplier?: number;
  levelUpCost?: number;
  levelUpCostMultiplier?: number;
  maxLevel?: number;
  level?: number;
  maxSpace?: number;
  activeCars?: StoredCar[];
}

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

    useEffect(() => {
        const storedData = localStorage.getItem("@business-game:businesses");
        if (!storedData) return;

        try {
            const parsedData = JSON.parse(storedData) as unknown;

            // Garante que é um array e tem a forma esperada
            if (!Array.isArray(parsedData)) {
            throw new Error("Invalid data");
            }

            const businesses = parsedData.map((b: StoredBusiness) => {
            switch (b.type) {
                case 0:
                return new ShopBusiness(
                    b.name, b.type, b.subtype!, b.incomePerHour!,
                    b.incomeMultiplier!, b.levelUpCost!, b.levelUpCostMultiplier!,
                    b.maxLevel!, b.level!, b.id
                );

                case 1: {
                const cars = (b.activeCars ?? []).map(
                    (c: StoredCar) =>
                    new Car(c.name, c.category, c.maxKilometers, c.kilometers, c.incomePerHour, c.id)
                );
                return new TaxiBusiness(b.name, b.type, cars, b.maxSpace!, b.id);
                }

                case 2:
                return new FactoryBusiness(
                    b.name, b.type, b.subtype!, b.incomePerHour!,
                    b.incomeMultiplier!, b.levelUpCost!, b.levelUpCostMultiplier!,
                    b.maxLevel!, b.level!, b.id
                );

                case 3: {
                const cars = (b.activeCars ?? []).map(
                    (c: StoredCar) =>
                    new Car(c.name, c.category, c.maxKilometers, c.kilometers, c.incomePerHour, c.id)
                );
                return new TransportBusiness(b.name, b.type, cars, b.maxSpace!, b.id);
                }

                default:
                return new Business(b.name, b.type, b.id);
            }
            });

            setBusinesses(businesses);
        } catch (err) {
            console.error("Error parsing Local Storage:", err);
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
            business.addCar(car.name, car.category, car.maxKilometers, car.kilometers, car.incomePerHour);
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