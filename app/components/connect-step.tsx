import { useState } from 'react';
import { Link2, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface ConnectStepProps {
  notionUrl: string;
  setNotionUrl: (url: string) => void;
  isUrlValid: boolean;
  setIsUrlValid: (valid: boolean) => void;
  onNext: () => void;
}

export function ConnectStep({
  notionUrl,
  setNotionUrl,
  isUrlValid,
  setIsUrlValid,
  onNext,
}: ConnectStepProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  // --- SMART VALIDATOR ---
  const validateUrl = (input: string) => {
    if (!input) {
      setIsUrlValid(false);
      return false;
    }

    // ACCEPT direct Notion Resource ID (NEW format)
    if (input.startsWith("ntn_") && input.length >= 24) {
      setIsUrlValid(true);
      return true;
    }

    // ACCEPT UUID 32 chars
    const clean = input.replace(/-/g, "");
    if (clean.length === 32) {
      setIsUrlValid(true);
      return true;
    }

    // ACCEPT Notion URLs (optional)
    if (input.includes("notion.so") || input.includes("ntn.so")) {
      setIsUrlValid(true);
      return true;
    }

    setIsUrlValid(false);
    return false;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setNotionUrl(val);
    validateUrl(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Link2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl text-gray-900">Connect Database</h2>
            <p className="text-sm text-gray-600">Link your Notion database to get started</p>
          </div>
        </div>
      </div>

      {/* INPUT */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Notion Database ID / URL
        </label>
        <div className="relative">
          <input
            type="text"
            value={notionUrl}
            onChange={handleUrlChange}
            placeholder="ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
              notionUrl === ''
                ? 'border-gray-300 focus:ring-purple-500'
                : isUrlValid
                ? 'border-green-500 focus:ring-green-500'
                : 'border-red-500 focus:ring-red-500'
            }`}
          />
          {notionUrl && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isUrlValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {notionUrl && !isUrlValid && (
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Please enter a valid Notion Database ID or URL
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm text-gray-900">How to get your database ID?</span>
          {showInstructions ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {showInstructions && (
          <div className="px-4 pb-4 text-sm text-gray-600 space-y-2 border-t border-gray-200 pt-4">
            <ol className="list-decimal ml-4 space-y-2">
              <li>Open your Notion database</li>
              <li>Click “Share” → “Copy link”</li>
              <li>Or copy the internal database ID starting with <strong>ntn_</strong></li>
            </ol>
          </div>
        )}
      </div>

      {/* Type Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Type:</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
          Free
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!isUrlValid}
        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
      >
        Continue to Customize
      </button>
    </div>
  );
}
