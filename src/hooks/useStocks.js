import { useState, useEffect, useCallback } from "react";
import { fetchStockPrice, fetchFundPrice } from "../services/api";

export const useStocks = () => {
  // 從本地儲存初始化狀態
  const [stocks, setStocks] = useState(() => {
    try {
      const saved = localStorage.getItem("my-stocks");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("解析本地資料失敗:", error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // 當 stocks 變動時自動同步到 localStorage
  useEffect(() => {
    localStorage.setItem("my-stocks", JSON.stringify(stocks));
  }, [stocks]);

  // 使用 useCallback 包裹，確保 function 參照穩定
  const refreshPrices = useCallback(async (targetStocks = []) => {
    const listToUpdate = targetStocks.length > 0 ? targetStocks : stocks;
    if (listToUpdate.length === 0) return;

    setLoading(true);
    try {
      const updated = await Promise.all(
        listToUpdate.map(async (stock) => {
          try {
            const price = stock.type === "fund" 
              ? await fetchFundPrice(stock.id) 
              : await fetchStockPrice(stock.id);
            
            if (price && !isNaN(price)) {
              return { 
                ...stock, 
                price: price,
                // 成本防呆：若無成本則以市價當作初始成本
                cost: (stock.cost === 0 || !stock.cost) ? price : stock.cost 
              };
            }
          } catch (e) {
            console.error(`更新 ${stock.name || stock.id} 價格失敗:`, e);
          }
          return stock;
        })
      );
      setStocks(updated);
    } catch (error) {
      console.error("更新價格清單時發生錯誤:", error);
    } finally {
      setLoading(false);
    }
  }, [stocks]); // 依賴 stocks，確保抓到的是最新狀態

  const addStock = (newStock) => {
    // 檢查是否已存在
    if (stocks.some(s => s.id === newStock.id)) return;

    const initialStock = {
      ...newStock,
      shares: newStock.shares || 0,
      price: newStock.price || 0,
      cost: newStock.price || 0,
      type: newStock.type || "stock" // 確保有類別辨識是股票或基金
    };
    
    const newList = [...stocks, initialStock];
    setStocks(newList);
    
    // 立即更新這批新清單的價格
    refreshPrices(newList);
  };

  const deleteStock = (id) => {
    // 使用這種方式可以避免在某些環境下 window.confirm 造成的卡頓
    if (window.confirm("確定要從投資組合中移除嗎？")) {
      setStocks(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateStock = (id, data) => {
    setStocks(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  return { 
    stocks, 
    loading, 
    addStock, 
    deleteStock, 
    updateStock, 
    refreshPrices 
  };
};