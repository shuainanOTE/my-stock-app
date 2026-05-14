import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Loader2 } from 'lucide-react';

const SearchModal = ({ onAddStock, onClose }) => {
  const [query, setQuery] = useState("");
  const [allStocks, setAllStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockList = async () => {
      try {
        const token = import.meta.env.VITE_FINMIND_TOKEN;
        const response = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo&token=${token}`);
        const res = await response.json();
        if (res.data) {
          const formatted = res.data.map(s => ({
            id: s.stock_id,
            name: s.stock_name,
            price: 0 
          }));
          setAllStocks(formatted);
        }
      } catch (error) {
        console.error("無法取得股票清單", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockList();
  }, []);

  const filteredStocks = query.trim() === "" 
    ? [] 
    : allStocks.filter(s => 
        s.id.includes(query) || s.name.includes(query)
      ).slice(0, 20);

  return (
    // 關鍵 1: h-full 確保撐開，flex-col 讓內部佈局可控
    <div className="flex flex-col h-full bg-black animate-in fade-in duration-300">
      
      {/* 搜尋欄 Header - 固定高度 */}
      <div className="px-4 pt-14 pb-4 bg-[#1C1C1E]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#2C2C2E] rounded-xl px-3 py-2 flex items-center gap-2 border border-white/5">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="搜尋股票代號或名稱"
              className="bg-transparent border-none outline-none text-white text-sm w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={onClose} className="text-blue-500 font-bold text-sm">取消</button>
        </div>
      </div>

      {/* 關鍵 2: flex-1 + overflow-y-auto + touch-pan-y 確保內容可滾動 */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 no-scrollbar touch-pan-y">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-500 gap-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <p className="text-[10px] tracking-widest uppercase opacity-50">初始化數據庫...</p>
          </div>
        ) : query === "" ? (
          <div className="pt-6">
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 px-2">熱門搜尋</p>
            <div className="flex flex-wrap gap-2 px-2">
              {["2330", "0050", "2454", "2317", "2603"].map(id => {
                const s = allStocks.find(item => item.id === id);
                return s ? (
                  <button
                    key={id}
                    onClick={() => onAddStock(s)}
                    className="bg-[#2C2C2E] text-gray-300 px-4 py-2 rounded-full text-xs font-semibold border border-white/5 active:scale-95 transition-all"
                  >
                    {s.name} {id}
                  </button>
                ) : null;
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredStocks.map((stock) => (
              <button
                key={stock.id}
                onClick={() => onAddStock(stock)}
                className="w-full flex justify-between items-center p-4 hover:bg-white/5 active:bg-white/10 rounded-2xl transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span className="text-white font-bold text-base">{stock.name}</span>
                  <span className="text-gray-500 text-xs font-mono">{stock.id}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Plus size={20} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;