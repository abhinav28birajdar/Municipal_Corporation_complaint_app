// Offline Sync Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface PendingAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

interface UseOfflineSyncOptions {
  storageKey: string;
  maxRetries?: number;
  syncInterval?: number;
  onSync?: (action: PendingAction) => Promise<boolean>;
  onSyncComplete?: () => void;
  onSyncError?: (error: Error, action: PendingAction) => void;
}

interface UseOfflineSyncReturn {
  pendingActions: PendingAction[];
  isSyncing: boolean;
  isOnline: boolean;
  addPendingAction: (type: string, data: any) => Promise<void>;
  removePendingAction: (id: string) => Promise<void>;
  clearPendingActions: () => Promise<void>;
  syncNow: () => Promise<void>;
  getPendingCount: () => number;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useOfflineSync = (options: UseOfflineSyncOptions): UseOfflineSyncReturn => {
  const {
    storageKey,
    maxRetries = 3,
    syncInterval = 30000, // 30 seconds
    onSync,
    onSyncComplete,
    onSyncError,
  } = options;

  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load pending actions from storage
  const loadPendingActions = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setPendingActions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }, [storageKey]);

  // Save pending actions to storage
  const savePendingActions = useCallback(async (actions: PendingAction[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(actions));
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }, [storageKey]);

  // Add a new pending action
  const addPendingAction = useCallback(async (type: string, data: any) => {
    const newAction: PendingAction = {
      id: generateId(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    const updatedActions = [...pendingActions, newAction];
    setPendingActions(updatedActions);
    await savePendingActions(updatedActions);

    // Try to sync immediately if online
    if (isOnline && onSync) {
      syncNow();
    }
  }, [pendingActions, isOnline, onSync, savePendingActions]);

  // Remove a pending action
  const removePendingAction = useCallback(async (id: string) => {
    const updatedActions = pendingActions.filter(action => action.id !== id);
    setPendingActions(updatedActions);
    await savePendingActions(updatedActions);
  }, [pendingActions, savePendingActions]);

  // Clear all pending actions
  const clearPendingActions = useCallback(async () => {
    setPendingActions([]);
    await AsyncStorage.removeItem(storageKey);
  }, [storageKey]);

  // Sync pending actions
  const syncNow = useCallback(async () => {
    if (isSyncing || pendingActions.length === 0 || !onSync || !isOnline) {
      return;
    }

    setIsSyncing(true);
    const actionsToProcess = [...pendingActions];
    let processedCount = 0;

    for (const action of actionsToProcess) {
      try {
        const success = await onSync(action);
        
        if (success) {
          await removePendingAction(action.id);
          processedCount++;
        } else {
          // Update retry count
          if (action.retryCount < maxRetries) {
            const updatedAction = { ...action, retryCount: action.retryCount + 1 };
            const updatedActions = pendingActions.map(a =>
              a.id === action.id ? updatedAction : a
            );
            setPendingActions(updatedActions);
            await savePendingActions(updatedActions);
          } else {
            // Max retries reached, remove action
            await removePendingAction(action.id);
            onSyncError?.(new Error('Max retries reached'), action);
          }
        }
      } catch (error: any) {
        onSyncError?.(error, action);
        
        if (action.retryCount < maxRetries) {
          const updatedAction = { ...action, retryCount: action.retryCount + 1 };
          const updatedActions = pendingActions.map(a =>
            a.id === action.id ? updatedAction : a
          );
          setPendingActions(updatedActions);
          await savePendingActions(updatedActions);
        } else {
          await removePendingAction(action.id);
        }
      }
    }

    setIsSyncing(false);
    
    if (processedCount > 0) {
      onSyncComplete?.();
    }
  }, [isSyncing, pendingActions, onSync, isOnline, maxRetries, onSyncError, onSyncComplete, removePendingAction, savePendingActions]);

  // Get pending count
  const getPendingCount = useCallback(() => {
    return pendingActions.length;
  }, [pendingActions]);

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      setIsOnline(connected);
      
      // Sync when coming back online
      if (connected && pendingActions.length > 0) {
        syncNow();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pendingActions, syncNow]);

  // Load pending actions on mount
  useEffect(() => {
    loadPendingActions();
  }, [loadPendingActions]);

  // Setup sync interval
  useEffect(() => {
    if (syncInterval > 0 && isOnline) {
      syncIntervalRef.current = setInterval(() => {
        if (pendingActions.length > 0) {
          syncNow();
        }
      }, syncInterval);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [syncInterval, isOnline, pendingActions, syncNow]);

  return {
    pendingActions,
    isSyncing,
    isOnline,
    addPendingAction,
    removePendingAction,
    clearPendingActions,
    syncNow,
    getPendingCount,
  };
};

export default useOfflineSync;
