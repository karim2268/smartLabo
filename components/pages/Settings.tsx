
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: Implement Excel import logic
        alert("La fonctionnalité d'importation est en cours de développement.");
    };

    const handleReset = () => {
        if(window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.")) {
            localStorage.removeItem('smartlabo_data');
            window.location.reload();
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Paramètres</h2>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Apparence</h3>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400">Thème de l'application</p>
                    <div className="flex items-center space-x-2">
                        <span>Clair</span>
                        <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="theme-toggle"
                                className="sr-only peer"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                        <span>Sombre</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Gestion des Données</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Importer des données (Excel)</label>
                        <input onChange={handleImport} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" accept=".xlsx, .xls" />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Importer un fichier Excel pour ajouter ou mettre à jour l'inventaire.</p>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-300 dark:border-red-700">
                <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-300">Zone de Danger</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold">Réinitialiser l'application</p>
                        <p className="text-red-600 dark:text-red-400">Supprime définitivement toutes les données de l'application.</p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Settings;
