import React, { useEffect } from 'react';
import { DataProvider, useData } from './contexts/DataContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import useLocalStorage from './hooks/useLocalStorage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import Inventory from './components/pages/Inventory';
import Administration from './components/pages/Administration';
import MovementLog from './components/pages/MovementLog';
import Reservations from './components/pages/Reservations';
import RoomsAndLabs from './components/pages/RoomsAndLabs';
import Personnel from './components/pages/Personnel';
import Placeholder from './components/pages/Placeholder';
import About from './components/pages/About';
import Help from './components/pages/Help';

export type Page = 
    | 'about'
    | 'dashboard' 
    | 'inventory' 
    | 'administration' 
    | 'movement_log' 
    | 'reservations'
    | 'rooms_labs'
    | 'personnel'
    | 'help';

const PAGE_TITLES: Record<Page, string> = {
    about: 'À Propos de SmartLabo',
    dashboard: 'Tableau de Bord',
    inventory: 'Gestion du Stock',
    administration: 'Administration',
    movement_log: 'Journal des Mouvements',
    reservations: 'Réservation de Matériels',
    rooms_labs: 'Salles et Laboratoires',
    personnel: 'Gestion du Personnel',
    help: 'Aide et Support',
};

const AppContent: React.FC = () => {
    const { theme } = useTheme();
    const [activePage, setActivePage] = useLocalStorage<Page>('smartlabo_active_page', 'dashboard');
    const { state } = useData();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    const renderPage = () => {
        switch (activePage) {
            case 'about':
                return <About />;
            case 'dashboard':
                return <Dashboard setActivePage={setActivePage} />;
            case 'inventory':
                return <Inventory />;
            case 'administration':
                return <Administration />;
            case 'movement_log':
                return <MovementLog />;
            case 'reservations':
                return <Reservations />;
            case 'rooms_labs':
                return <RoomsAndLabs />;
            case 'personnel':
                return <Personnel />;
            case 'help':
                return <Help />;
            default:
                return <Dashboard setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex flex-col flex-1 w-full">
                <Header title={PAGE_TITLES[activePage] || 'SmartLabo'} setActivePage={setActivePage} />
                <main className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => (
    <ThemeProvider>
        <DataProvider>
            <AppContent />
        </DataProvider>
    </ThemeProvider>
);

export default App;
