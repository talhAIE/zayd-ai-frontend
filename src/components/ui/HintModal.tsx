import { AlertCircle } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  hint: string;
  onTryAgain: () => void;
}

export function HintModal({ isOpen, hint, onTryAgain }: HintModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-amber-50 p-6 flex items-start gap-4 border-b border-amber-100">
          <div className="p-2 bg-amber-100 rounded-full text-amber-600 mt-1 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-amber-900 font-bold text-lg leading-tight tracking-tight">Incorrect</h3>
            <p className="text-amber-700 mt-1 font-medium">{hint}</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 flex justify-end">
          <button
            onClick={onTryAgain}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
