import React from 'react';
import { ICONS } from '../../constants';
import { Page } from '../../App';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

interface NavItemProps {
    page: Page;
    label: string;
    // FIX: Specify a generic type for the icon's props to allow `className` to be passed via `cloneElement`.
    icon: React.ReactElement<any>;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`flex items-center p-3 my-1 w-full text-base font-normal rounded-lg transition-all duration-200 group ${
                isActive
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {React.cloneElement(icon, { className: "w-6 h-6 flex-shrink-0"})}
            <span className="ml-3 flex-1 whitespace-nowrap text-left">{label}</span>
        </button>
    </li>
);

const NAV_ITEMS: { page: Page; label: string; iconKey: keyof typeof ICONS }[] = [
    { page: 'about', label: 'À Propos', iconKey: 'about' },
    { page: 'dashboard', label: 'Tableau de bord', iconKey: 'dashboard' },
    { page: 'inventory', label: 'Stock', iconKey: 'inventory' },
    { page: 'administration', label: 'Administration', iconKey: 'administration' },
    { page: 'movement_log', label: 'Journal du mouvement', iconKey: 'movement_log' },
    { page: 'reservations', label: 'Réserver Matériels', iconKey: 'reservations' },
    { page: 'rooms_labs', label: 'Salles et Labos', iconKey: 'rooms_labs' },
    { page: 'personnel', label: 'Gestion du personnel', iconKey: 'personnel' },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
    return (
        <aside className="w-64 flex-shrink-0" aria-label="Sidebar">
            <div className="flex flex-col h-full overflow-y-auto bg-gray-800 shadow-lg px-3 py-4">
                <button 
                    onClick={() => setActivePage('dashboard')}
                    className="flex items-center text-left w-full rounded-lg hover:bg-gray-700 p-2.5 mb-5 transition-colors duration-200"
                >
                    <svg className="w-8 h-8 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <span className="self-center text-xl font-semibold whitespace-nowrap ml-2 text-white">
                        SmartLabo
                    </span>
                </button>
                <ul className="space-y-1">
                    {NAV_ITEMS.map(item => (
                         <NavItem 
                            key={item.page}
                            page={item.page} 
                            label={item.label} 
                            icon={ICONS[item.iconKey]} 
                            isActive={activePage === item.page} 
                            onClick={() => setActivePage(item.page)} 
                        />
                    ))}
                </ul>
                <div className="mt-auto">
                     <ul className="pt-4 mt-4 space-y-2 border-t border-gray-700">
                        <NavItem page="help" label="Aide Labo" icon={ICONS.help} isActive={activePage === 'help'} onClick={() => setActivePage('help')} />
                     </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;