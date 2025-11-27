import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming this exists, or I'll use a simple join
// If @/lib/utils doesn't exist, I'll use a local helper or clsx/tailwind-merge directly if installed.
// Checking package.json, clsx and tailwind-merge are installed.

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  dir?: "ltr" | "rtl";
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className,
  dir = "rtl",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} dir={dir}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-sm font-['Almarai'] bg-surface-overlay border border-border-subtle rounded-xl text-text-primary hover:border-primary/50 focus:outline-none focus:border-primary transition-all",
          className
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-secondary transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-border-subtle rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <ul className="p-1 max-h-60 overflow-auto custom-scrollbar">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-['Almarai'] rounded-lg transition-colors",
                    value === option.value
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-text-primary hover:bg-surface-overlay"
                  )}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
