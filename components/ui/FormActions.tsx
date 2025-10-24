import React from 'react';

interface FormActionsProps {
    onCancel: () => void;
    submitLabel: string;
    isSubmitting?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, submitLabel, isSubmitting = false }) => (
    <div className="pt-4 flex justify-end space-x-3 mt-5 border-t border-gray-200 dark:border-gray-700">
        <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
        >
            Annuler
        </button>
        <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow disabled:opacity-50"
            disabled={isSubmitting}
        >
            {submitLabel}
        </button>
    </div>
);

export default FormActions;
