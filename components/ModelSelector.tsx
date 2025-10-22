
import React from 'react';
import { Model } from '../types';

interface ModelSelectorProps {
  models: Model[];
  activeModelId: string;
  onSelectModel: (modelId: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ models, activeModelId, onSelectModel }) => {
  return (
    <div className="relative">
      <select
        value={activeModelId}
        onChange={(e) => onSelectModel(e.target.value)}
        className="appearance-none w-full sm:w-72 bg-gray-800 border border-gray-600 text-white py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-700 focus:border-blue-500"
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name} (v{model.version})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};
