import React from "react";
import { motion, useAnimation } from "framer-motion";
import { Trash2, Triangle } from "lucide-react";

const StockCard = ({ stock, onClick, onDelete }) => {
  const controls = useAnimation();

  const profit = (stock.price - stock.cost) * stock.shares;
  const profitPercent =
    stock.cost > 0
      ? (((stock.price - stock.cost) / stock.cost) * 100).toFixed(2)
      : "0.00";

  const isPositive = profit >= 0;
  const themeColor = isPositive ? "#FF3B30" : "#34C759";
  const bgColor = isPositive
    ? "rgba(255, 59, 48, 0.1)"
    : "rgba(52, 199, 89, 0.1)";

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -40) {
      controls.start({ x: -80 });
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#FF3B30] mb-3">
      {/* 底部刪除按鈕 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(stock.id);
        }}
        className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center text-white active:bg-black/20 transition-colors"
      >
        <Trash2 size={24} />
      </button>

      <motion.div
        drag="x"
        animate={controls}
        whileTap={{ backgroundColor: "#2C2C2E" }}
        transition={{ duration: 0.1 }}
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        onDragEnd={handleDragEnd}
        className="relative z-10 bg-[#1C1C1E] p-5 flex justify-between items-center touch-pan-y"
        onClick={() => {
          controls.start({ x: 0 });
          onClick();
        }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold text-white">
              {stock.name}
            </span>
            <span className="text-[#8E8E93] text-xs font-bold bg-black/5 px-1.5 py-0.5 rounded">
              {stock.id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#8E8E93] text-sm font-bold">
            <span>
              {stock.shares >= 1000
                ? `${stock.shares / 1000} 張`
                : `${stock.shares} 股`}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-right mb-2 pr-2">
            <p className="text-[15px] font-bold text-white leading-none">
              {Number(stock.price).toFixed(3)}
            </p>
          </div>

          <div
            className="flex flex-col items-center justify-center px-2 py-1.5 rounded-2xl min-w-[10px]"
            style={{ backgroundColor: bgColor, color: themeColor }}
          >
            <div className="flex items-center gap-1">
              <Triangle
                size={10}
                fill={themeColor}
                className={`transition-transform ${isPositive ? "" : "rotate-180"}`}
              />
              <span className="text-[14px] font-bold">
                {isPositive ? "" : "-"}
                {Math.abs(profitPercent)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StockCard;
