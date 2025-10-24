import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Material, Movement, MovementType } from '../../types';

const Reports: React.FC = () => {
    const { state, getCategoryNameById } = useData();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const generateInventoryPDF = () => {
        const doc = new jsPDF();
        const { configuration } = state;
        doc.setFontSize(18);
        doc.text(configuration.school_name, 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Inventaire du Laboratoire - ${configuration.region}`, 105, 22, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

        const tableColumn = ["N° Fiche", "Désignation", "Catégorie", "Quantité", "Emplacement", "État"];
        const tableRows: (string | number)[][] = [];

        state.materials.forEach(material => {
            const materialData = [
                material.num_fiche,
                material.name,
                getCategoryNameById(material.categoryId),
                `${material.quantity} ${material.unit}`,
                material.location,
                material.etat,
            ];
            tableRows.push(materialData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] }
        });

        doc.save("inventaire_smartlabo.pdf");
    };
    
    const exportToExcel = (data: any[], fileName: string) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const prepareMaterialsForExport = (materials: Material[]) => {
        return materials.map(m => ({
            "ID": m.id,
            "Num Fiche": m.num_fiche,
            "Désignation": m.name,
            "Catégorie": getCategoryNameById(m.categoryId),
            "Quantité": m.quantity,
            "Unité": m.unit,
            "Seuil d'Alerte": m.alertThreshold,
            "Emplacement": m.location,
            "État": m.etat,
            "Description": m.description,
            "Marque": m.brand,
            "Observation": m.observation,
        }));
    };
    
    const prepareMovementsForExport = (movements: Movement[]) => {
        return movements.map(m => ({
            "ID Mouvement": m.id,
            "ID Article": m.materialId,
            "Nom Article": m.materialName,
            "Type": m.type,
            "Quantité": m.quantity,
            "Date": new Date(m.date).toLocaleString('fr-FR'),
            "Notes": m.notes
        }));
    };

    const getFilteredMovements = () => {
        return state.movements.filter(mov => {
            const moveDate = new Date(mov.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);

            if (start && moveDate < start) return false;
            if (end && moveDate > end) return false;
            return true;
        });
    };

    const handleGenerateMovementsPDF = () => {
        const doc = new jsPDF();
        const movements = getFilteredMovements();
        const { configuration } = state;

        doc.setFontSize(18);
        doc.text(configuration.school_name, 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Historique des Mouvements - ${configuration.region}`, 105, 22, { align: 'center' });
        doc.setFontSize(10);
        if (startDate || endDate) {
            doc.text(`Période du ${startDate ? new Date(startDate).toLocaleDateString('fr-FR') : 'début'} au ${endDate ? new Date(endDate).toLocaleDateString('fr-FR') : "aujourd'hui"}`, 14, 30);
        } else {
            doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
        }

        const tableColumn = ["Date", "Article", "Type", "Quantité", "Notes"];
        const tableRows = movements.map(mov => [
            new Date(mov.date).toLocaleString('fr-FR'),
            mov.materialName,
            mov.type,
            mov.quantity.toString(),
            mov.notes,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save(`historique_mouvements_${Date.now()}.pdf`);
    };

    const handleExportMovementsExcel = () => {
        const movements = getFilteredMovements();
        exportToExcel(prepareMovementsForExport(movements), `historique_mouvements_${Date.now()}`);
    };
    
    // New logic for consumption report
    const getFilteredConsumptionMovements = () => {
        return state.movements.filter(mov => {
            if (mov.type !== MovementType.SORTIE) return false;

            const moveDate = new Date(mov.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);

            if (start && moveDate < start) return false;
            if (end && moveDate > end) return false;
            
            if (categoryFilter !== 'all') {
                const material = state.materials.find(m => m.id === mov.materialId);
                if (!material || material.categoryId !== categoryFilter) {
                    return false;
                }
            }
            return true;
        });
    };

    const handleGenerateConsumptionPDF = () => {
        const doc = new jsPDF();
        const movements = getFilteredConsumptionMovements();
        if (movements.length === 0) {
            alert("Aucune donnée de consommation à afficher pour les filtres sélectionnés.");
            return;
        }

        const { configuration } = state;
        doc.setFontSize(18);
        doc.text(configuration.school_name, 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Rapport de Consommation - ${configuration.region}`, 105, 22, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Période: ${startDate ? new Date(startDate).toLocaleDateString('fr-FR') : 'Début'} au ${endDate ? new Date(endDate).toLocaleDateString('fr-FR') : "Aujourd'hui"}`, 14, 30);
        const categoryName = categoryFilter === 'all' ? 'Toutes' : getCategoryNameById(categoryFilter);
        doc.text(`Catégorie: ${categoryName}`, 14, 35);
        
        const tableColumn = ["Date", "Article", "Catégorie", "Quantité Consommée", "Motif"];
        const tableRows = movements.map(mov => {
             const material = state.materials.find(m => m.id === mov.materialId);
             return [
                new Date(mov.date).toLocaleString('fr-FR'),
                mov.materialName,
                material ? getCategoryNameById(material.categoryId) : 'Inconnue',
                mov.quantity.toString(),
                mov.notes,
            ]
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [192, 57, 43] }
        });

        doc.save(`rapport_consommation_${Date.now()}.pdf`);
    };

    const handleExportConsumptionExcel = () => {
        const movements = getFilteredConsumptionMovements();
         if (movements.length === 0) {
            alert("Aucune donnée de consommation à exporter pour les filtres sélectionnés.");
            return;
        }
        const dataToExport = movements.map(mov => {
            const material = state.materials.find(m => m.id === mov.materialId);
            return {
                "Date": new Date(mov.date).toLocaleString('fr-FR'),
                "Article": mov.materialName,
                "Catégorie": material ? getCategoryNameById(material.categoryId) : 'Inconnue',
                "Quantité Consommée": mov.quantity,
                "Motif": mov.notes,
            };
        });
        exportToExcel(dataToExport, `rapport_consommation_${Date.now()}`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Génération de Rapports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Inventaire Complet (PDF)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Générer un rapport PDF de tous les articles en stock.</p>
                    <button
                        onClick={generateInventoryPDF}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Générer PDF
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Inventaire Complet (Excel)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Exporter la liste complète des articles au format Excel.</p>
                    <button
                        onClick={() => exportToExcel(prepareMaterialsForExport(state.materials), 'inventaire_complet')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Exporter Excel
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
                <h3 className="text-xl font-semibold mb-4">Historique des Mouvements par Période</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Sélectionnez une plage de dates pour générer un rapport des mouvements de stock. Laissez vide pour inclure tous les mouvements.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de début</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de fin</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500" />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                        onClick={handleGenerateMovementsPDF}
                        className="w-full sm:w-auto flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Générer PDF
                    </button>
                    <button
                        onClick={handleExportMovementsExcel}
                        className="w-full sm:w-auto flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Exporter Excel
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
                <h3 className="text-xl font-semibold mb-4">Rapport de Consommation</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Générer un rapport sur les articles consommés (sorties de stock) par période et par catégorie.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                     <div>
                        <label htmlFor="start-date-cons" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de début</label>
                        <input type="date" id="start-date-cons" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label htmlFor="end-date-cons" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de fin</label>
                        <input type="date" id="end-date-cons" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500" />
                    </div>
                     <div>
                        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
                        <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500">
                            <option value="all">Toutes les catégories</option>
                            {state.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                        onClick={handleGenerateConsumptionPDF}
                        className="w-full sm:w-auto flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Générer PDF de Consommation
                    </button>
                    <button
                        onClick={handleExportConsumptionExcel}
                        className="w-full sm:w-auto flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                        Exporter Excel de Consommation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;