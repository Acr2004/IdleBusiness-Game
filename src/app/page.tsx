"use client"
import { useContext, useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { MoneyContext } from '@/contexts/MoneyContext';

export default function Home() {
  const handleEarnCash = () => {
    updateMoney(money + perClick);
    updateXp(xp + 1);
    checkIfUpdateLevel(xp + 1);
  };

  const { money, perClick, xp, xpPreviousLevel, xpToNextLevel, level, updateMoney, updateXp, checkIfUpdateLevel } = useContext(MoneyContext);

  const [xpProgress, setXpProgress] = useState("");

  useEffect(() => {
    setXpProgress(((xp - xpPreviousLevel) / (xpToNextLevel - xpPreviousLevel) * 100).toFixed(2));
  }, [xp, level, xpPreviousLevel, xpToNextLevel]);

  return (
    <div className='w-full overflow-scroll h-screen bg-background'>
      <div className='container h-screen flex flex-col mx-auto px-6 py-8'>
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-secondary mb-2">Home</h1>
            <p className="text-tertiary">Earn Money by clicking and Level Up</p>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Left Side - Cash Card */}
          <div className="bg-light rounded-2xl p-8 shadow-sm border border-border flex flex-col justify-between">              
            <div className="mb-6">
              <div className="text-tertiary text-sm mb-2">Current Money</div>
              
              <div className="text-5xl font-semibold text-primary tracking-tight">
                €{money.toFixed(2)}
              </div>
            </div>
                          
            <div className="flex justify-between items-end">
              <div className="text-secondary text-lg">**** **** **** 1234</div>
              <div className="w-10 h-6 bg-secondary rounded"></div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-light rounded-2xl p-8 shadow-sm border border-border">
            <div className="mb-6">
              <div className="text-tertiary text-sm mb-2">Progress</div>
              
              <div className="text-5xl font-semibold text-primary tracking-tight mb-2">
                Level {level}
              </div>
              
              <div className="text-secondary">{xp}/{xpToNextLevel} XP</div>
            </div>
              
            <div className="space-y-2">
              <div className="w-full bg-background rounded-full h-3">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
              </div>

              <div className="text-tertiary text-sm">
                {xpToNextLevel - xp} XP to the Next Level
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleEarnCash}
          className={`cursor-pointer flex flex-col flex-grow w-full bg-primary hover:bg-primary-variation text-light rounded-2xl shadow-sm`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-20 h-20 bg-light/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-10 h-10" />
            </div>
            <div>
              <div className="text-3xl font-semibold mb-2">Earn Cash</div>
              <div className="text-red-50 text-lg">Click here to get Money</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}