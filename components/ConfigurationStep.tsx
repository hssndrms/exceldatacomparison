import React, { useMemo, useEffect } from 'react';
import type { ComparisonConfig, KeyPair, ExcelRow } from '../types';
import MultiSelectDropdown from './MultiSelectDropdown';
import { v4 as uuidv4 } from 'uuid';

interface ConfigurationStepProps {
  dataA: { data: ExcelRow[], headers: string[] };
  dataB: { data: ExcelRow[], headers: string[] };
  config: ComparisonConfig;
  setConfig: (config: ComparisonConfig | ((prevConfig: ComparisonConfig) => ComparisonConfig)) => void;
  onCompare: () => void;
  isComparing: boolean;
  onBack: () => void;
}

const ConfigurationStep: React.FC<ConfigurationStepProps> = ({ dataA, dataB, config, setConfig, onCompare, isComparing, onBack }) => {
  
  const handleConfigChange = <K extends keyof ComparisonConfig>(key: K, value: ComparisonConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleKeyPairChange = (id: string, part: 'columnA' | 'columnB', value: string) => {
    const newKeyPairs = config.keyPairs.map(pair => 
      pair.id === id ? { ...pair, [part]: value } : pair
    );
    handleConfigChange('keyPairs', newKeyPairs);
  };
  
  const addKeyPair = () => {
    const newKeyPairs = [...config.keyPairs, { id: uuidv4(), columnA: null, columnB: null }];
    handleConfigChange('keyPairs', newKeyPairs);
  };
  
  const removeKeyPair = (id: string) => {
    const newKeyPairs = config.keyPairs.filter(pair => pair.id !== id);
    handleConfigChange('keyPairs', newKeyPairs);
  };

  const allHeaders = [...new Set([...dataA.headers.map(h => `Kaynak: ${h}`), ...dataB.headers.map(h => `Hedef: ${h}`)])];
  const isCompareButtonDisabled = isComparing || config.keyPairs.some(p => !p.columnA || !p.columnB) || !config.compareColumnA || !config.compareColumnB || config.keyPairs.length === 0;

  const prefixedKeyColumns = useMemo(() => {
    return config.keyPairs
        .flatMap(p => [
            p.columnA ? `Kaynak: ${p.columnA}` : null,
            p.columnB ? `Hedef: ${p.columnB}` : null
        ])
        .filter((c): c is string => c !== null);
  }, [config.keyPairs]);

  useEffect(() => {
      const allKeysInOutput = prefixedKeyColumns.every(k => config.outputColumns.includes(k));

      if (!allKeysInOutput) {
          setConfig(prevConfig => ({
              ...prevConfig,
              outputColumns: [...new Set([...prevConfig.outputColumns, ...prefixedKeyColumns])]
          }));
      }
  }, [prefixedKeyColumns, config.outputColumns, setConfig]);

  const handleRemoveOutputColumn = (columnToRemove: string) => {
    setConfig(prevConfig => ({
        ...prevConfig,
        outputColumns: prevConfig.outputColumns.filter(col => col !== columnToRemove)
    }));
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full mt-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Adım 2: Karşılaştırmayı Yapılandır</h2>
      
      {/* Key Column Matching */}
      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
        <label className="block text-md font-semibold text-gray-700 dark:text-gray-300">Anahtar Kolon Eşleştirmesi</label>
        <div className="flex items-start text-xs text-gray-500 dark:text-gray-400 space-x-2 pt-1 mb-4">
          <i className="fa-solid fa-circle-info w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5"></i>
          <span>Kaynak ve Hedef bölümlerindeki satırları eşleştirmek için kullanılacak kolonları seçin. Örneğin, Kaynak'taki "FaturaNo" ile Hedef'teki "İrsaliyeNo".</span>
        </div>
        
        <div className="space-y-3">
          {config.keyPairs.map((pair, index) => (
            <div key={pair.id} className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto] gap-x-4 gap-y-2 items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
              {/* Column A */}
              <div className="flex flex-col">
                <select
                  value={pair.columnA || ''}
                  onChange={(e) => handleKeyPairChange(pair.id, 'columnA', e.target.value)}
                  disabled={isComparing}
                  className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled>Kaynak'tan Seç</option>
                  {dataA.headers.map(h => <option key={`key-a-${h}`} value={h}>{h}</option>)}
                </select>
                {pair.columnA && dataA.data[0] && <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">Örnek: {String(dataA.data[0][pair.columnA])}</span>}
              </div>

              <span className="text-center font-bold text-gray-500 dark:text-gray-400 hidden md:block">=</span>

              {/* Column B */}
              <div className="flex flex-col">
                <select
                  value={pair.columnB || ''}
                  onChange={(e) => handleKeyPairChange(pair.id, 'columnB', e.target.value)}
                  disabled={isComparing}
                  className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled>Hedef'ten Seç</option>
                  {dataB.headers.map(h => <option key={`key-b-${h}`} value={h}>{h}</option>)}
                </select>
                {pair.columnB && dataB.data[0] && <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">Örnek: {String(dataB.data[0][pair.columnB])}</span>}
              </div>

              <button onClick={() => removeKeyPair(pair.id)} disabled={isComparing || config.keyPairs.length <= 1} className="p-2 text-gray-400 hover:text-red-500 justify-self-end disabled:opacity-50 disabled:cursor-not-allowed">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addKeyPair} disabled={isComparing} className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">+ Eşleşme Ekle</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Compare Columns */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Karşılaştırma Kolonu (Sayısal)</label>
          <select
            value={config.compareColumnA || ''}
            onChange={(e) => handleConfigChange('compareColumnA', e.target.value)}
            disabled={isComparing}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="" disabled>Kaynak'tan Seç (örn: Satış Adedi)</option>
            {dataA.headers.map(h => <option key={`comp-a-${h}`} value={h}>{h}</option>)}
          </select>
          <select
            value={config.compareColumnB || ''}
            onChange={(e) => handleConfigChange('compareColumnB', e.target.value)}
            disabled={isComparing}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="" disabled>Hedef'ten Seç (örn: İade Adedi)</option>
            {dataB.headers.map(h => <option key={`comp-b-${h}`} value={h}>{h}</option>)}
          </select>
           <div className="flex items-start text-xs text-gray-500 dark:text-gray-400 space-x-2 pt-1">
            <i className="fa-solid fa-circle-info w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5"></i>
            <span>Hedef bölümündeki değeri karşılamak için Kaynak bölümünden kullanılacak sayısal kolonları seçin.</span>
          </div>
        </div>
        
        {/* Output Columns */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sonuç Tablosu Kolonları</label>
           <MultiSelectDropdown
              options={allHeaders}
              selectedOptions={config.outputColumns}
              onChange={(selected) => handleConfigChange('outputColumns', selected)}
              placeholder="Sonuç tablosu için kolon seçin"
              disabled={isComparing}
              disabledOptions={prefixedKeyColumns}
            />
            <div className="flex items-start text-xs text-gray-500 dark:text-gray-400 space-x-2 pt-1">
              <i className="fa-solid fa-circle-info w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5"></i>
              <span>Sonuç tablosunda gösterilecek kolonları seçin. Anahtar kolonlar her zaman gösterilir.</span>
            </div>
            {config.outputColumns.length > 0 && (
              <div className="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50 max-h-32 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Seçilen Kolonlar ({config.outputColumns.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {config.outputColumns.map(col => {
                    const isKeyColumn = prefixedKeyColumns.includes(col);
                    return (
                        <span key={col} className={`flex items-center text-xs font-medium pl-2.5 pr-1 py-1 rounded-full transition-all ${isKeyColumn ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                          {isKeyColumn && <i className="fa-solid fa-key mr-1.5 opacity-70"></i>}
                          {col}
                           {!isKeyColumn && (
                              <button 
                                onClick={() => handleRemoveOutputColumn(col)}
                                className="ml-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                                aria-label={`'${col}' kolonunu kaldır`}
                              >
                                <i className="fa-solid fa-xmark text-xs"></i>
                              </button>
                            )}
                        </span>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
         <button
          onClick={onBack}
          className="px-6 py-2.5 bg-gray-600 text-white font-medium text-sm leading-tight uppercase rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>Geri
        </button>
        <button
          onClick={onCompare}
          disabled={isCompareButtonDisabled}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isComparing ? 'Karşılaştırılıyor...' : 'Karşılaştırmayı Başlat'}
        </button>
      </div>
    </div>
  );
};

export default ConfigurationStep;