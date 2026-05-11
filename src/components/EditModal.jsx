import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EditModal = ({ stock, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = React.useState({
    shares: stock.shares,
    cost: stock.cost,
  });

  return (
    <AnimatePresence>
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
          {/* iOS 風格的頂部小橫條 */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">{stock.name}</h2>
              <p className="text-gray-500 font-mono text-sm">{stock.id}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/5 p-2 rounded-full text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">持股數量</label>
              <input
                type="number"
                className="w-full bg-[#2C2C2E] border-none rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">買入成本</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-[#2C2C2E] border-none rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => onSave(formData)}
                className="flex-1 bg-blue-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform"
              >
                保存修改
              </button>
              <button
                onClick={() => onDelete(stock.id)}
                className="bg-red-500/10 text-red-500 font-bold px-6 py-4 rounded-2xl active:scale-95 transition-transform"
              >
                刪除
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditModal;