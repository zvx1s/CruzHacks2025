import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scan, ShoppingBasket, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: "Scan",
      icon: Scan,
      url: createPageUrl("Scan"),
      color: "text-emerald-600"
    },
    {
      name: "Items",
      icon: ShoppingBasket,
      url: createPageUrl("Items"),
      color: "text-emerald-600"
    },
    {
      name: "Recipes",
      icon: ChefHat,
      url: createPageUrl("Recipes"),
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50/30">
      <style>{`
        :root {
          --primary: #10b981;
          --primary-dark: #059669;
          --primary-light: #d1fae5;
          --background: #fafaf9;
          --text: #1f2937;
          --text-light: #6b7280;
          --card: #ffffff;
          --shadow: rgba(0, 0, 0, 0.05);
        }
      `}</style>
      
      {/* Main Content Area */}
      <main className="pb-24 md:pb-28">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 z-50">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className="relative flex flex-col items-center gap-1 group"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-emerald-100' 
                        : 'bg-transparent group-hover:bg-gray-100'
                    }`}
                  >
                    <Icon 
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isActive 
                          ? item.color 
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                  </motion.div>
                  <span 
                    className={`text-xs font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-emerald-600' 
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
