import React from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const EditModal = ({ stock, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = React.useState({
    shares: stock.shares.toString(),
    cost: stock.cost.toString(),
  });

  const handleFocus = (e) => {
    if (e.target.value === "0" || e.target.value === "0.00") {
      setFormData((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave({
      shares: Number(formData.shares) || 0,
      cost: Number(formData.cost) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full bg-[#1C1C1E] rounded-t-[32px] p-6 pb-12 shadow-2xl border-t border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-400 active:scale-90 transition-transform"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{stock.name}</h2>
            <p className="text-gray-500 font-mono text-xs">{stock.id}</p>
          </div>

          <button
            onClick={handleSave}
            className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white active:scale-90 transition-transform shadow-lg shadow-blue-500/20"
          >
            <Check size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end ml-1">
              <label className="text-xs font-bold text-gray-500 uppercase">持股數量</label>
              <span className="text-[10px] text-blue-400 font-medium">
                {Number(formData.shares) >= 1000 
                  ? `${Math.floor(Number(formData.shares) / 1000)} 張 ${Number(formData.shares) % 1000} 股`
                  : `${formData.shares || 0} 股`}
              </span>
            </div>
            <input
              name="shares"
              type="number"
              inputMode="numeric" 
              className="w-full bg-[#2C2C2E] border-none rounded-2xl p-4 text-white font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.shares}
              placeholder="0"
              onFocus={handleFocus}
              onChange={(e) => handleInputChange("shares", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">買入成本</label>
            <input
              name="cost"
              type="number"
              inputMode="decimal"
              step="0.01"
              className="w-full bg-[#2C2C2E] border-none rounded-2xl p-4 text-white font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.cost}
              placeholder="0.00"
              onFocus={handleFocus}
              onChange={(e) => handleInputChange("cost", e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={() => onDelete(stock.id)}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-2xl active:scale-95 transition-all border border-red-500/20"
            >
              刪除此股票
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditModal;