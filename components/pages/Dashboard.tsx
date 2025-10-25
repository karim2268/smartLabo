import React, { useMemo } from 'react';
import { useData, useData as useDataHook } from '../../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MovementType } from '../../types';
import { Page } from '../../App';

interface DashboardProps {
    setActivePage: (page: Page) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; color: string; onClick?: () => void }> = ({ title, value, icon, color, onClick }) => (
    <div onClick={onClick} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 ${onClick ? 'cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform duration-200' : ''}`}>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
    const { state, getCategoryNameById } = useData();
    const { materials, movements, categories } = state;

    const totalItems = useMemo(() => materials.length, [materials]);
    const lowStockItems = useMemo(() => materials.filter(m => m.quantity <= m.alertThreshold).length, [materials]);
    const totalQuantity = useMemo(() => materials.reduce((acc, m) => acc + m.quantity, 0), [materials]);
    const uniqueCategoriesCount = useMemo(() => categories.length, [categories]);
    
    const categoriesCount = useMemo(() => {
        const counts = materials.reduce((acc, material) => {
            const catName = getCategoryNameById(material.categoryId);
            acc[catName] = (acc[catName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [materials, getCategoryNameById]);
    
    const recentMovements = useMemo(() => movements.slice(0, 5), [movements]);

    const ICONS = {
        box: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7L12 3l8 4M4 7h16" /></svg>,
        alert: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        sum: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10H6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v8m0 0v8m0-8h8m-8 0H4" /></svg>,
        category: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2" /></svg>
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Articles Totaux" value={totalItems} icon={ICONS.box} color="bg-primary-500" onClick={() => setActivePage('inventory')} />
                <StatCard title="Articles en Stock Faible" value={lowStockItems} icon={ICONS.alert} color={lowStockItems > 0 ? "bg-danger" : "bg-warning"} onClick={() => setActivePage('inventory')} />
                <StatCard title="Quantité Totale" value={totalQuantity} icon={ICONS.sum} color="bg-success" />
                <StatCard title="Catégories Uniques" value={uniqueCategoriesCount} icon={ICONS.category} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nombre d'Articles par Catégorie</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={categoriesCount} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="name" tick={{ fill: 'rgb(107 114 128)' }} className="text-xs" />
                                <YAxis tick={{ fill: 'rgb(107 114 128)' }} allowDecimals={false} />
                                <Tooltip
                                  contentStyle={{
                                      backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                      borderColor: 'rgb(55, 65, 81)',
                                      color: '#fff',
                                      borderRadius: '0.5rem'
                                  }}
                                  cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                                />
                                <Bar dataKey="value" name="Nombre d'articles" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mouvements Récents</h3>
                    <div className="space-y-4">
                        {recentMovements.length > 0 ? recentMovements.map(mov => (
                            <div key={mov.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{mov.materialName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(mov.date).toLocaleString('fr-FR')}</p>
                                </div>
                                <div className={`px-3 py-1 text-sm rounded-full font-medium ${
                                    mov.type === MovementType.ENTREE ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                    {mov.type === MovementType.ENTREE ? '+' : '-'}{mov.quantity}
                                </div>
                            </div>
                        )) : <p className="text-gray-500 dark:text-gray-400">Aucun mouvement récent.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;