import { useState, useCallback } from 'react';

export function useUpgradePopup() {
  const [isOpen, setIsOpen] = useState(false);

  const openUpgradePopup = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeUpgradePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openUpgradePopup,
    closeUpgradePopup
  };
}