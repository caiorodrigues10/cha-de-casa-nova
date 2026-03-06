import React from 'react';
import ErrorMsg from './ErrorMsg';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">{label}</label>
    {children}
    {error && <ErrorMsg message={error} />}
  </div>
);

export default FormField;
