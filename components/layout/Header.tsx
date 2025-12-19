

import React, { useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Page } from '../../App';
import { Material, Unit } from '../../types';

interface HeaderProps {
    title: string;
    setActivePage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ title, setActivePage }) => {
    const { theme, toggleTheme } = useTheme();
    const { state, dispatch, getCategoryNameById, lowStockItems } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                if (json.length === 0) {
                    alert("Le fichier Excel est vide ou mal formaté.");
                    return;
                }

                let addedCount = 0;
                let updatedCount = 0;
                const errors: string[] = [];

                json.forEach((row, index) => {
                    if (!row.name || !row.categoryName || row.quantity === undefined || row.alertThreshold === undefined) {
                        errors.push(`Ligne ${index + 2}: Manque une colonne obligatoire (name, categoryName, quantity, alertThreshold).`);
                        return; // Skip this row
                    }

                    const category = state.categories.find(c => c.name.trim().toLowerCase() === String(row.categoryName).trim().toLowerCase());
                    if (!category) {
                        errors.push(`Ligne ${index + 2}: Catégorie "${row.categoryName}" non trouvée. Veuillez la créer d'abord.`);
                        return; // Skip this row
                    }

                    const existingMaterial = (row.num_fiche && String(row.num_fiche).trim() !== '')
                        ? state.materials.find(m => m.num_fiche === String(row.num_fiche).trim())
                        : null;

                    const materialData: Omit<Material, 'id' | 'date_saisie' | 'date_modification'> = {
                        num_fiche: String(row.num_fiche || '').trim(),
                        name: String(row.name),
                        description: String(row.description || ''),
                        brand: String(row.brand || ''),
                        categoryId: category.id,
                        quantity: Number(row.quantity) || 0,
                        unit: Object.values(Unit).includes(row.unit) ? row.unit : Unit.UNITE,
                        location: String(row.location || ''),
                        etat: ['Neuf', 'Bon', 'À réparer', 'Hors service'].includes(row.etat) ? row.etat : 'Bon',
                        observation: String(row.observation || ''),
                        alertThreshold: Number(row.alertThreshold) || 0,
                    };
                    
                    if (existingMaterial) {
                        dispatch({
                            type: 'UPDATE_MATERIAL',
                            payload: {
                                ...existingMaterial,
                                ...materialData,
                                date_modification: new Date().toISOString()
                            }
                        });
                        updatedCount++;
                    } else {
                        dispatch({
                            type: 'ADD_MATERIAL',
                            payload: {
                                ...materialData,
                                id: `mat-${Date.now()}-${index}`,
                                date_saisie: new Date().toISOString(),
                                date_modification: new Date().toISOString()
                            }
                        });
                        addedCount++;
                    }
                });
                
                let summary = `Importation terminée !\n- Articles ajoutés : ${addedCount}\n- Articles mis à jour : ${updatedCount}`;
                if (errors.length > 0) {
                    summary += `\n\nErreurs rencontrées (les lignes suivantes ont été ignorées) :\n${errors.join('\n')}`;
                }
                alert(summary);

            } catch (error) {
                console.error("Erreur lors du traitement du fichier Excel:", error);
                alert("Une erreur est survenue lors de la lecture du fichier Excel. Assurez-vous qu'il est au bon format.");
            } finally {
                if(event.target) {
                    event.target.value = '';
                }
            }
        };

        reader.onerror = (error) => {
             console.error("Erreur FileReader:", error);
             alert("Impossible de lire le fichier.");
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm flex-shrink-0">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".xlsx, .xls"
                />
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
                 {lowStockItems.length > 0 && (
                    <button
                        onClick={() => setActivePage('inventory')}
                        className="relative flex items-center px-3 py-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-md text-sm font-bold text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900 animate-pulse"
                        title="Cliquez pour voir les articles en stock faible"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 12.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        {lowStockItems.length} Alerte(s)
                    </button>
                )}
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