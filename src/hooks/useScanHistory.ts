import { useState, useEffect, useCallback } from "react";
import type { ThreatAnalysis } from "@/lib/mockAIAnalyzer";

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  inputPreview: string;
  result: ThreatAnalysis;
}

const STORAGE_KEY = "guarded_ai_scan_history";
const MAX_HISTORY_ITEMS = 10;

export const useScanHistory = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load scan history:", error);
    }
  }, []);

  // Save to localStorage whenever history changes
  const persistHistory = useCallback((items: ScanHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save scan history:", error);
    }
  }, []);

  const addScan = useCallback((input: string, result: ThreatAnalysis) => {
    const newItem: ScanHistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      inputPreview: input.slice(0, 100) + (input.length > 100 ? "..." : ""),
      result,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      persistHistory(updated);
      return updated;
    });
  }, [persistHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeScan = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persistHistory(updated);
      return updated;
    });
  }, [persistHistory]);

  return { history, addScan, clearHistory, removeScan };
};
