
import React, { useState, useCallback } from 'react';
import { Model } from '../types';
import { generateYamlConfig } from '../services/geminiService';

interface YamlGeneratorProps {
  model: Model;
}

export const YamlGenerator: React.FC<YamlGeneratorProps> = ({ model }) => {
  const [yamlConfig, setYamlConfig] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setYamlConfig('');
    try {
      const config = await generateYamlConfig(model);
      setYamlConfig(config);
    } catch (error) {
      setYamlConfig('# An error occurred while generating the configuration.');
    } finally {
      setIsLoading(false);
    }
  }, [model]);

  const handleCopy = () => {
      if (yamlConfig) {
          navigator.clipboard.writeText(yamlConfig);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      }
  };

  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-[28rem] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-200">YAML Config Generator</h3>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      <div className="relative flex-grow bg-gray-900 rounded-md p-2 border border-gray-600">
        <pre className="w-full h-full overflow-auto text-sm text-gray-300 whitespace-pre-wrap">
          <code>
            {isLoading ? "Contacting Gemini API..." : yamlConfig || "# Click 'Generate' to create monitoring config..."}
          </code>
        </pre>
        {yamlConfig && !isLoading && (
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:bg-gray-600 px-2 py-1 text-xs font-semibold rounded"
            >
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        )}
      </div>
    </div>
  );
};
