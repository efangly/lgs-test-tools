interface DropdownProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  className?: string;
  disable?: boolean;
}

export function Dropdown({ 
  label, 
  value, 
  onChange, 
  max = 9, 
  min = 1, 
  className = "",
  disable = false
}: DropdownProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="select select-bordered w-full"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        disabled={disable}
      >
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const optionValue = i + min;
          return (
            <option key={optionValue} value={optionValue}>
              {label} {optionValue}
            </option>
          );
        })}
      </select>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disable?: boolean;
}

export function NumberInput({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 255, 
  className = "",
  disable = false 
}: NumberInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        className="input input-bordered w-full"
        min={min}
        max={max}
        disabled={disable}
      />
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'success' | 'error' | 'warning' | 'primary';
  children: React.ReactNode;
  className?: string;
}

export function ActionButton({ 
  onClick, 
  disabled = false, 
  loading = false, 
  variant = 'primary', 
  children, 
  className = "" 
}: ActionButtonProps) {
  const variantClasses = {
    success: 'bg-green-500 hover:bg-green-600',
    error: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-orange-500 hover:bg-orange-600',
    primary: 'bg-blue-500 hover:bg-blue-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variantClasses[variant]} text-white px-4 py-2 rounded-md disabled:bg-gray-400 transition-colors ${className}`}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
}
