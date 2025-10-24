import React, { useState } from 'react';
import Settings from './Settings';
import Reports from './Reports';
import Orders from './Orders';

type AdminTab = 'reports' | 'orders' | 'settings';

const Administration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('reports');

    const renderContent = () => {
        switch (activeTab) {
            case 'reports':
                return <Reports />;
            case 'orders':
                return <Orders />;
            case 'settings':
                return <Settings />;
            default:
                return <Reports />;
        }
    };

    const TabButton: React.FC<{ tab: AdminTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`${
                activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <TabButton tab="reports" label="Rapports" />
                        <TabButton tab="orders" label="Commandes" />
                        <TabButton tab="settings" label="Paramètres" />
                    </nav>
                </div>
            </div>
            
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default Administration;
