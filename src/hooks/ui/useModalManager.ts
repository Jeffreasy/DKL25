/**
 * Modal Manager Hook
 * Centralized modal state management
 */

import { useState, useCallback } from 'react'

export type ModalType = 
  | 'contact'
  | 'donate'
  | 'register'
  | 'partner'
  | 'sponsor'
  | 'privacy'
  | 'terms'
  | 'program'

interface ModalState {
  [key: string]: boolean
}

interface ModalManager {
  isOpen: (modalType: ModalType) => boolean
  open: (modalType: ModalType) => void
  close: (modalType: ModalType) => void
  toggle: (modalType: ModalType) => void
  closeAll: () => void
  openModals: ModalType[]
}

/**
 * Hook for managing modal states
 */
export const useModalManager = (): ModalManager => {
  const [modals, setModals] = useState<ModalState>({})

  const isOpen = useCallback((modalType: ModalType): boolean => {
    return modals[modalType] === true
  }, [modals])

  const open = useCallback((modalType: ModalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }))
  }, [])

  const close = useCallback((modalType: ModalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }))
  }, [])

  const toggle = useCallback((modalType: ModalType) => {
    setModals(prev => ({ ...prev, [modalType]: !prev[modalType] }))
  }, [])

  const closeAll = useCallback(() => {
    setModals({})
  }, [])

  const openModals = Object.keys(modals).filter(
    key => modals[key] === true
  ) as ModalType[]

  return {
    isOpen,
    open,
    close,
    toggle,
    closeAll,
    openModals
  }
}

/**
 * Hook for managing a single modal
 */
export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle
  }
}