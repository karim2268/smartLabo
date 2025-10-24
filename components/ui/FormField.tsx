import React from 'react';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        {children}
    </div>
);

export default FormField;
