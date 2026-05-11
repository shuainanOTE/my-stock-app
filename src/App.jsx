import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StockCard from "./components/StockCard";
import SearchModal from "./components/SearchModal";
import EditModal from "./components/EditModal";
import { AnimatePresence } from "framer-motion";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [editingStock, setEditingStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem("my-stocks");
    return saved
      ? JSON.parse(saved)
      : [{ id: "2330", name: "台積電", price: 820, shares: 1000, cost: 780 }];
  });

  useEffect(() => {
    localStorage.setItem("my-stocks", JSON.stringify(stocks));
  }, [stocks]);

  const refreshPrices = async (targetStocks = stocks) => {
    if (targetStocks.length === 0) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const updatedStocks = await Promise.all(
        targetStocks.map(async (stock) => {
          try {
            const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${stock.id}&start_date=${today}`;
            const response = await fetch(url);
            const res = await response.json();
            if (res.data && res.data.length > 0) {
              const latestPrice = res.data[res.data.length - 1].close;
              return { ...stock, price: latestPrice };
            }
          } catch (e) {
            console.error(`${stock.name} 抓取失敗`);
          }
          return stock;
        }),
      );
      setStocks(updatedStocks);
    } catch (error) {
      console.error("更新報價失敗", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPrices();
    const timer = setInterval(refreshPrices, 300000);
    return () => clearInterval(timer);
  }, []);

  const handleAddStock = (newStock) => {
    if (!stocks.find((s) => s.id === newStock.id)) {
      const updatedList = [
        ...stocks,
        { ...newStock, shares: 0, cost: newStock.price },
      ];
      setStocks(updatedList);
      refreshPrices(updatedList);
    }
    setActiveTab("home");
  };

  const handleDelete = (id) => {
    if (window.confirm("確定要刪除這支股票嗎？")) {
      setStocks(stocks.filter((s) => s.id !== id));
    }
  };

  const handleSaveEdit = (updatedData) => {
    setStocks(
      stocks.map((s) =>
        s.id === editingStock.id ? { ...s, ...updatedData } : s,
      ),
    );
    setEditingStock(null);
  };

  const renderContent = () => {
    if (activeTab === "home") {
      return (
        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-32 pt-12 no-scrollbar">
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onClick={() => setEditingStock(stock)}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="pt-20 text-center text-gray-600">
              <p>目前沒有自選股</p>
              <button
                onClick={() => setActiveTab("search")}
                className="text-blue-500 text-sm mt-2 font-bold"
              >
                去搜尋添加
              </button>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === "search") {
      return (
        <SearchModal
          onAddStock={handleAddStock}
          onClose={() => setActiveTab("home")}
        />
      );
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black overflow-hidden relative text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-600/10 blur-[120px] pointer-events-none" />
      {renderContent()}
      <AnimatePresence>
        {editingStock && (
          <EditModal
            stock={editingStock}
            onSave={handleSaveEdit}
            onDelete={(id) => {
              handleDelete(id);
              setEditingStock(null);
            }}
            onClose={() => setEditingStock(null)}
          />
        )}
      </AnimatePresence>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
