import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X } from "lucide-react";

const categoryEmojis = {
  produce: "🥬",
  dairy: "🥛",
  meat: "🥩",
  pantry: "🥫",
  bakery: "🍞",
  frozen: "🧊",
  beverages: "🥤",
  other: "🛒"
};

const categoryColors = {
  produce: "bg-green-50 border-green-200 text-green-700",
  dairy: "bg-blue-50 border-blue-200 text-blue-700",
  meat: "bg-red-50 border-red-200 text-red-700",
  pantry: "bg-amber-50 border-amber-200 text-amber-700",
  bakery: "bg-orange-50 border-orange-200 text-orange-700",
  frozen: "bg-cyan-50 border-cyan-200 text-cyan-700",
  beverages: "bg-purple-50 border-purple-200 text-purple-700",
  other: "bg-gray-50 border-gray-200 text-gray-700"
};

export default function ItemCard({ item, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(item.name);
  const [editedQuantity, setEditedQuantity] = React.useState(item.quantity);

  const handleSave = () => {
    if (editedName.trim()) {
      onUpdate(item.id, { name: editedName.trim(), quantity: editedQuantity });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(item.name);
    setEditedQuantity(item.quantity);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative bg-white rounded-2xl border-2 p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        categoryColors[item.category] || categoryColors.other
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="h-10 rounded-xl"
            autoFocus
          />
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(parseInt(e.target.value) || 1)}
              className="h-10 rounded-xl flex-1"
            />
            <Button
              size="icon"
              onClick={handleSave}
              className="h-10 w-10 rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCancel}
              className="h-10 w-10 rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-3xl">{categoryEmojis[item.category] || categoryEmojis.other}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} {item.unit || 'item'}{item.quantity > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 rounded-lg hover:bg-white/50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(item.id)}
                className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
