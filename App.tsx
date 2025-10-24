
import React, { useState, useMemo } from 'react';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import Inventory from './components/pages/Inventory';
import Reports from './components/pages/Reports';
import Orders from './components/pages/Orders';
import Settings from './components/pages/Settings';

type Page = 'dashboard' | 'inventory' | 'reports' | 'orders' | 'settings';

const AppContent: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const { theme } = useTheme();

    const pageComponent = useMemo(() => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard />;
            case 'inventory':
                return <Inventory />;
            case 'reports':
                return <Reports />;
            case 'orders':
                return <Orders />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    }, [activePage]);

    return (
        <div className={`${theme} font-sans`}>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                        {pageComponent}
                    </main>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <DataProvider>
                <AppContent />
            </DataProvider>
        </ThemeProvider>
    );
};

export default App;
