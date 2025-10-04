import React, { useState, useEffect } from "react";
import { ScannedItem } from "@/entities/ScannedItem";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import ScannerInterface from "../components/scan/ScannerInterface";
import ItemCard from "../components/items/ItemCard";

export default function ScanPage() {
  const [items, setItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const allItems = await ScannedItem.list("-created_date");
    setItems(allItems);
    setRecentItems(allItems.slice(0, 3));
  };

  const handleAddItem = async (itemData) => {
    await ScannedItem.create(itemData);
    loadItems();
  };

  const handleUpdateItem = async (id, data) => {
    await ScannedItem.update(id, data);
    loadItems();
  };

  const handleDeleteItem = async (id) => {
    await ScannedItem.delete(id);
    loadItems();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SmartCart</h1>
              <p className="text-gray-500">Scan items to get started</p>
            </div>
          </div>
        </motion.div>

        {/* Scanner Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ScannerInterface onAddItem={handleAddItem} />
        </motion.div>

        {/* Stats Card */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 shadow-lg mb-8"
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Items</p>
                <p className="text-4xl font-bold">{items.length}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <p className="text-emerald-50 text-sm mt-4">
              Ready to generate amazing recipes!
            </p>
          </motion.div>
        )}

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Added</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {recentItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items yet
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Start scanning or adding items to discover delicious recipes
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
