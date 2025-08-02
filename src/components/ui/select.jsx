import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = ({ children, value, onValueChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => !disabled && setIsOpen(!isOpen),
            disabled,
            isOpen,
            selectedValue
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            onSelect: handleSelect,
            selectedValue
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ className, children, onClick, disabled, isOpen, selectedValue, ...props }) => (
  <button
    type="button"
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="truncate">
      {React.Children.map(children, child => {
        if (child.type === SelectValue) {
          return React.cloneElement(child, { selectedValue });
        }
        return child;
      })}
    </span>
    <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
  </button>
);

const SelectValue = ({ placeholder, selectedValue }) => {
  return selectedValue || placeholder || "Seleccionar...";
};

const SelectContent = ({ className, children, isOpen, onSelect, selectedValue, ...props }) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      <div className="p-1">
        {React.Children.map(children, child => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, {
              onSelect,
              isSelected: child.props.value === selectedValue
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const SelectItem = ({ className, children, value, onSelect, isSelected, ...props }) => (
  <div
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
      isSelected && "bg-accent text-accent-foreground",
      className
    )}
    onClick={() => onSelect?.(value)}
    {...props}
  >
    {children}
  </div>
);

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};