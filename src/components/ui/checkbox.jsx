import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = ({ 
  id, 
  checked, 
  onCheckedChange, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          inline-flex items-center justify-center w-4 h-4 
          border-2 border-border rounded 
          cursor-pointer transition-all duration-200
          ${checked 
            ? 'bg-primary border-primary text-primary-foreground' 
            : 'bg-background hover:bg-muted'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {checked && (
          <Check className="w-3 h-3" strokeWidth={3} />
        )}
      </label>
    </div>
  );
};