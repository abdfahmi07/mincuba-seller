interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function SwitchButton({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex items-center h-7 w-12 rounded-full transition-all duration-300
        ${checked ? "bg-[#F05000]" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          inline-block h-6 w-6 bg-white rounded-full shadow-md transform transition-all duration-300
          ${checked ? "translate-x-5" : "translate-x-1"}
        `}
      ></span>

      {/* Glow effect */}
      <span
        className={`
          absolute inset-0 rounded-full transition-opacity duration-300
          ${checked ? "bg-[#F05000]/40 opacity-0" : "opacity-0"}
        `}
      ></span>
    </button>
  );
}
