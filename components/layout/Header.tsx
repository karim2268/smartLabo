
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Page } from '../../App';

interface HeaderProps {
    title: string;
    setActivePage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ title, setActivePage }) => {
    const { theme, toggleTheme } = useTheme();
    const { state, getCategoryNameById } = useData();

    const handlePrintInventory = () => {
        const doc = new jsPDF();
        doc.text("Inventaire Complet du Laboratoire", 14, 16);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

        // FIX: Changed "Stockage" to "Emplacement" for consistency.
        const tableColumn = ["N° Fiche", "Désignation", "Catégorie", "Reste en stock", "État", "Emplacement"];
        const tableRows: (string | number)[][] = [];

        state.materials.forEach(material => {
            const materialData = [
                material.num_fiche,
                material.name,
                getCategoryNameById(material.categoryId),
                `${material.quantity}`,
                material.etat,
                // FIX: The `Material` type has a `location` property, not `type_stockage`.
                material.location,
            ];
            tableRows.push(materialData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save("inventaire_smartlabo.pdf");
    };

    const handleImportClick = () => {
        // This is a placeholder for a more robust import feature.
        // In a real app, this would open a modal to upload and process the file.
        alert("La fonctionnalité d'importation est en cours de développement.");
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm flex-shrink-0">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                    onClick={handlePrintInventory}
                    className="hidden sm:flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm0 2h10v7H5V4zm2 9h6v2H7v-2z" clipRule="evenodd" /></svg>
                    Imprimer Inventaire
                </button>
                 <button
                    onClick={handleImportClick}
                    className="hidden sm:flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v1H5V6zm0 2h10v1H5V8zm0 2h10v1H5v-1zm0 2h6v1H5v-1z" clipRule="evenodd" /></svg>
                    Importer Stock
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                >
                    {theme === 'light' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
