import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar } from 'lucide-react';

const EditModal = ({ stock, onSave, onDelete, onClose }) => {
  const [unit, setUnit] = useState('zhang'); 
  
  // 關鍵：將初始值轉為字串，避免 input 被 Number 控制
  const [inputValue, setInputValue] = useState(String(stock.shares / 1000));
  const [costValue, setCostValue] = useState(String(stock.cost));

  // 計算最終要儲存的數據
  const getFinalData = () => {
    const shares = unit === 'zhang' ? Number(inputValue) * 1000 : Number(inputValue);
    return {
      shares: shares,
      cost: Number(costValue)
    };
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end">
      <div className="w-full bg-[#1C1C1E] rounded-t-[30px] p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="text-gray-400"><X size={24} /></button>
          <h2 className="text-xl font-bold text-white">{stock.name}</h2>
          {/* 儲存時呼叫 getFinalData */}
          <button 
            onClick={() => onSave(getFinalData())} 
            className="text-blue-500 font-bold active:opacity-60"
          >
            完成
          </button>
        </div>

        <div className="space-y-6">
          {/* 股數輸入區塊 */}
          <div className="bg-[#2C2C2E] rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <label className="text-gray-400 text-xs font-bold">持有數量</label>
              <div className="bg-black p-1 rounded-lg flex gap-1">
                <button 
                  onClick={() => { setUnit('zhang'); setInputValue(String(Number(inputValue) / (unit === 'share' ? 1000 : 1))); }}
                  className={`px-4 py-1 rounded-md text-xs font-bold transition-all ${unit === 'zhang' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500'}`}
                >張</button>
                <button 
                  onClick={() => { setUnit('share'); setInputValue(String(Number(inputValue) * (unit === 'zhang' ? 1000 : 1))); }}
                  className={`px-4 py-1 rounded-md text-xs font-bold transition-all ${unit === 'share' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500'}`}
                >股</button>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <input 
                type="number"
                inputMode="decimal"
                className="bg-transparent text-white text-3xl font-semibold w-full outline-none"
                value={inputValue}
                // 當輸入為 0 時，聚焦自動清空，方便輸入
                onFocus={(e) => { if(inputValue === "0") setInputValue("") }}
                // 直接存入字串，不轉 Number
                onChange={(e) => setInputValue(e.target.value)}
              />
              <span className="text-gray-500 font-bold">{unit === 'zhang' ? '張' : '股'}</span>
            </div>
          </div>

          {/* 成本輸入區塊 */}
          <div className="bg-[#2C2C2E] rounded-2xl p-4">
            <label className="text-gray-400 text-xs block mb-2 font-semibold">買入單價 (每股成本)</label>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-500 text-xl">$</span>
              <input 
                type="number"
                inputMode="decimal"
                className="bg-transparent text-white text-3xl font-semibold w-full outline-none"
                value={costValue}
                onFocus={(e) => { if(costValue === "0") setCostValue("") }}
                onChange={(e) => setCostValue(e.target.value)}
              />
            </div>
          </div>

          {/* 刪除與資訊 */}
          <div className="pt-4 space-y-4">
            <button 
              onClick={() => onDelete(stock.id)}
              className="w-full bg-[#2C2C2E] active:bg-[#3A3A3C] text-[#FF3B30] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={20} />
              刪除此股票
            </button>
            <p className="text-center text-gray-600 text-[10px] flex items-center justify-center gap-1">
              <Calendar size={12} /> 最後更新：{new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;