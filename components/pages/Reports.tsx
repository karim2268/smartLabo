import React from 'react';
import { useData } from '../../contexts/DataContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports: React.FC = () => {
    const { state } = useData();

    const generateInventoryPDF = () => {
        const doc = new jsPDF();
        doc.text("Inventaire Complet du Laboratoire", 14, 16);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

        const tableColumn = ["Code", "Nom", "Catégorie", "Quantité", "Seuil", "Emplacement"];
        const tableRows: (string | number)[][] = [];

        state.materials.forEach(material => {
            const materialData = [
                material.code,
                material.name,
                material.category,
                `${material.quantity} ${material.unit}`,
                material.alertThreshold,
                material.location
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
    
    const exportToExcel = (data: any[], fileName: string) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Génération de Rapports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Inventaire Complet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Générer un rapport PDF de tous les articles en stock.</p>
                    <button
                        onClick={generateInventoryPDF}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Générer PDF
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Export Inventaire (Excel)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Exporter la liste complète des articles au format Excel.</p>
                    <button
                        onClick={() => exportToExcel(state.materials, 'inventaire_complet')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Exporter Excel
                    </button>
                </div>
                
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Export Mouvements (Excel)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Exporter l'historique de tous les mouvements de stock.</p>
                    <button
                        onClick={() => exportToExcel(state.movements, 'historique_mouvements')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Exporter Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;