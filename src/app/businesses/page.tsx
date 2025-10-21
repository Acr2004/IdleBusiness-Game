"use client"
import React, { useContext, useState } from 'react';
import { PlusCircle, GitMerge, DollarSign, StarsIcon, PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BusinessContext } from '@/contexts/BusinessContext';
import { Business } from '@/classes/Business';
import { IconName, ICONS_MAP } from '@/utils/icons';
import { CreateBusinessModal } from '@/components/CreateBusinessModal';
import { BusinessInfoModal } from '@/components/BusinessInfoModal';
import { BusinessStatCard } from '@/components/BusinessStatCard';
import { formatCurrency } from '@/utils/currency';
import { BusinessIncomeCard } from '@/components/BusinessIncomeCard';

export default function BusinessesPage() {
    const { businessData, businesses, calculateAllIncomePerHour, getBestBusiness } = useContext(BusinessContext);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

    const bestBusiness = getBestBusiness();
    const totalIncomePerHour = calculateAllIncomePerHour();

    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

    // Pie Chart
    const totalIncome = businesses.reduce((sum, business) => sum + business.calculateIncomePerHour(), 0);

    const pieData = businesses.map(business => ({
        name: business.name,
        value: business.calculateIncomePerHour(),
        percentage: ((business.calculateIncomePerHour() / totalIncome) * 100).toFixed(1)
    }));

    const COLORS = ['#4ade80', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Open Modals
    const handleCreateBusiness = () => {
        setIsCreateModalOpen(true);
    };

    const handleOpenBusinessInfoModal = (business: Business) => {
        setIsBusinessModalOpen(true);
        setSelectedBusiness(business);
    };

    // Close Modals
    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleCloseBusinessInfoModal = () => {
        setIsBusinessModalOpen(false);
        setSelectedBusiness(null);
    };

    // Merge Business
    const handleMergeBusinesses = () => {
        console.log('Fundir negócios');
        // Aqui você implementaria a lógica para fundir negócios
    };

    return (
        <div className="w-full overflow-scroll h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-secondary mb-2">Businesses</h1>
                    <p className="text-tertiary">Manage your Businesses and maximize your profit</p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className='flex flex-col justify-between'>
                        {/* Total Income Card */}
                        <div className="bg-light rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-secondary">Total Income</h3>
                                <DollarSign className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-3xl font-bold text-primary mb-2">
                                {formatCurrency(totalIncomePerHour)}
                            </div>
                            <p className="text-sm text-tertiary">per hour</p>
                        </div>

                        {/* Best Business Card */}
                        <div className="bg-light rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-secondary">Best Business</h3>
                                <StarsIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='text-3xl font-bold text-secondary'>{bestBusiness?.name || "No Businesses Owned"}</div>
                                <div>
                                    <div className="text-3xl font-bold text-primary mb-2">
                                        {bestBusiness ? formatCurrency(bestBusiness.calculateIncomePerHour())
                                            : formatCurrency(0)
                                        }
                                    </div>
                                    <p className="text-sm text-tertiary">per hour</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pie Chart Card */}
                    <div className="bg-light rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-secondary">Income Distribution</h3>
                            <PieChartIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-64 flex justify-center items-center">
                            {pieData.length === 0 ? <div className='font-medium text-xl text-tertiary'>No Business Data</div> :
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percentage }) => `${name} - ${percentage}%`}
                                        >
                                            { pieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), 'Income per hour']}
                                            labelStyle={{ color: '#1f2937' }}
                                            contentStyle={{ 
                                                backgroundColor: 'white', 
                                                border: '1px solid #e2e8f0', 
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={handleCreateBusiness}
                        className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-variation text-background px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Business
                    </button>
                    <button
                        onClick={handleMergeBusinesses}
                        className="flex items-center cursor-pointer gap-2 bg-secondary hover:bg-secondary-variaton text-background px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    >
                        <GitMerge className="w-5 h-5" />
                        Merge Businesses
                    </button>
                </div>

                {/* Businesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    { businesses.map((business) => {
                        if (!businessData || businessData.length === 0) {
                            return <div key={business.id}>Loading...</div>;
                        }

                        const iconName = businessData[business.type].icon as IconName;
                        const Icon = ICONS_MAP[iconName];

                        return (
                            <div
                                key={business.id}
                                onClick={() => handleOpenBusinessInfoModal(business)}
                                className="bg-light rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                            >
                                {/* Accent Border Top */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                                
                                {/* Business Icon */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-soft rounded-lg text-primary">
                                            <Icon />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-secondary">{business.name}</h3>
                                            <p className="text-sm text-tertiary">{businessData[business.type].category}</p>
                                        </div>
                                    </div>
                                    <BusinessStatCard business={business} />
                                </div>

                                {/* Income */}
                                <BusinessIncomeCard business={business} />

                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Business Infos Modal */}
            { isBusinessModalOpen && selectedBusiness && (
                <BusinessInfoModal
                    selectedBusiness={selectedBusiness}
                    handleCloseBusinessInfoModal={handleCloseBusinessInfoModal}
                />
            )}

            {/* Create Business Modal */}
            { isCreateModalOpen && (
                <CreateBusinessModal
                    handleCloseModal={handleCloseModal}
                />
            )}
        </div>
    );
}