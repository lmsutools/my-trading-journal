interface ToggleProps {
    isLong: boolean;
    onToggle: () => void;
  }
  
  export const Toggle = ({ isLong, onToggle }: ToggleProps) => {
    return (
      <button
        onClick={onToggle}
        className={`w-full py-2 rounded-lg font-bold text-lg transition-colors ${
          isLong
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isLong ? 'LONG' : 'SHORT'}
      </button>
    );
  };