export const fetchStockPrice = async (stockId) => {
  try {
    // 這裡使用 FinMind 的即時報價介面 (模擬即時)
    const response = await fetch(
      `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${stockId}&start_date=${new Date().toISOString().split('T')[0]}`
    );
    const res = await response.json();
    
    if (res.data && res.data.length > 0) {
      // 取得最新一筆成交價
      return res.data[res.data.length - 1].close;
    }
    return null;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};