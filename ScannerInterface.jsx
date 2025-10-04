import React, { useState, useRef } from "react";
import { Camera, Keyboard, X, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

export default function ScannerInterface({ onAddItem }) {
  const [showManualInput, setShowManualInput] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("other");
  const [quantity, setQuantity] = useState(1);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const categories = [
    { value: "produce", label: "Produce", emoji: "🥬" },
    { value: "dairy", label: "Dairy", emoji: "🥛" },
    { value: "meat", label: "Meat", emoji: "🥩" },
    { value: "pantry", label: "Pantry", emoji: "🥫" },
    { value: "bakery", label: "Bakery", emoji: "🍞" },
    { value: "frozen", label: "Frozen", emoji: "🧊" },
    { value: "beverages", label: "Beverages", emoji: "🥤" },
    { value: "other", label: "Other", emoji: "🛒" }
  ];

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage = "Unable to access camera. ";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage += "Please allow camera access in your browser settings and try again.";
      } else if (err.name === "NotFoundError") {
        errorMessage += "No camera found on this device.";
      } else {
        errorMessage += "Please try using manual input instead.";
      }
      
      setCameraError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
    setCameraError(null);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim()) {
      onAddItem({
        name: itemName.trim(),
        category,
        quantity,
        unit: "item"
      });
      setItemName("");
      setQuantity(1);
      setShowManualInput(false);
    }
  };

  const handleCameraClose = () => {
    setShowCamera(false);
    setCameraError(null);
  };

  const handleSwitchToManual = () => {
    setShowCamera(false);
    setCameraError(null);
    setShowManualInput(true);
  };

  React.useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCamera(true)}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Scan Item</h3>
            <p className="text-sm text-emerald-50 opacity-90">Use camera to scan</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowManualInput(true)}
          className="relative overflow-hidden bg-white border-2 border-gray-200 text-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Keyboard className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Add Manually</h3>
            <p className="text-sm text-gray-500">Type item name</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-50 rounded-full" />
        </motion.button>
      </div>

      {/* Manual Input Dialog */}
      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Plus className="w-5 h-5 text-emerald-600" />
              Add Item
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Item Name
              </label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Fresh Tomatoes"
                className="h-12 rounded-xl"
                autoFocus
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quantity
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowManualInput(false)}
                className="flex-1 h-12 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                Add Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={handleCameraClose}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Scan Barcode or Package
            </DialogTitle>
          </DialogHeader>

          {cameraError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <Keyboard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  You can still add items manually
                </p>
                <Button
                  onClick={handleSwitchToManual}
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item Manually
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {!isCameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      Loading camera...
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-40 border-4 border-emerald-400 rounded-2xl opacity-50" />
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Position the barcode within the frame to scan
              </p>
            </>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCameraClose}
              className="flex-1 rounded-xl"
            >
              Close
            </Button>
            {!cameraError && (
              <Button
                variant="outline"
                onClick={handleSwitchToManual}
                className="flex-1 rounded-xl"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Manual Input
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
