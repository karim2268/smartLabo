
import React from 'react';
import { ICONS } from '../../constants';

type Page = 'dashboard' | 'inventory' | 'reports' | 'orders' | 'settings';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
    page: Page;
    label: string;
    // FIX: Changed JSX.Element to React.ReactElement to avoid namespace issue.
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}> = ({ page, label, icon, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`flex items-center p-3 my-1 w-full text-base font-normal rounded-lg transition duration-75 group ${
                isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ml-3 flex-1 whitespace-nowrap text-left">{label}</span>
        </button>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
    return (
        <aside className="w-64 flex-shrink-0" aria-label="Sidebar">
            <div className="flex flex-col h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-lg px-3 py-4">
                <div className="flex items-center pl-2.5 mb-5">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <span className="self-center text-xl font-semibold whitespace-nowrap ml-2 text-gray-900 dark:text-white">
                        SmartLabo
                    </span>
                </div>
                <ul className="space-y-2">
                    <NavItem page="dashboard" label="Tableau de Bord" icon={ICONS.dashboard} isActive={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                    <NavItem page="inventory" label="Inventaire" icon={ICONS.inventory} isActive={activePage === 'inventory'} onClick={() => setActivePage('inventory')} />
                    <NavItem page="orders" label="Commandes" icon={ICONS.orders} isActive={activePage === 'orders'} onClick={() => setActivePage('orders')} />
                    <NavItem page="reports" label="Rapports" icon={ICONS.reports} isActive={activePage === 'reports'} onClick={() => setActivePage('reports')} />
                </ul>
                <div className="mt-auto">
                     <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                        <NavItem page="settings" label="Paramètres" icon={ICONS.settings} isActive={activePage === 'settings'} onClick={() => setActivePage('settings')} />
                     </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;