import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalType = 'auth' | 'cart' | 'search' | 'quickView' | 'newsletter' | null;

interface UIState {
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  activeModal: ModalType;
  modalData: Record<string, unknown>;
  isScrolled: boolean;
  isCartUpdating: boolean;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isSidebarOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  activeModal: null,
  modalData: {},
  isScrolled: false,
  isCartUpdating: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      state.isSidebarOpen = false;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMobileMenuOpen = action.payload;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
      state.isMobileMenuOpen = false;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
    },
    toggleSearch(state) {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.isSearchOpen = action.payload;
    },
    openModal(state, action: PayloadAction<{ modal: ModalType; data?: Record<string, unknown> }>) {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || {};
    },
    closeModal(state) {
      state.activeModal = null;
      state.modalData = {};
    },
    setScrolled(state, action: PayloadAction<boolean>) {
      state.isScrolled = action.payload;
    },
    setCartUpdating(state, action: PayloadAction<boolean>) {
      state.isCartUpdating = action.payload;
    },
    closeAll(state) {
      state.isMobileMenuOpen = false;
      state.isSidebarOpen = false;
      state.isCartOpen = false;
      state.isSearchOpen = false;
      state.activeModal = null;
      state.modalData = {};
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSidebar,
  setSidebarOpen,
  toggleCart,
  setCartOpen,
  toggleSearch,
  setSearchOpen,
  openModal,
  closeModal,
  setScrolled,
  setCartUpdating,
  closeAll,
} = uiSlice.actions;

export default uiSlice.reducer;
