import React from 'react';
import { User } from '../../types';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
  onLogout: () => void;
  onAdminLoginClick: () => void;
  onAdminLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, isAdmin, onLogout, onAdminLoginClick, onAdminLogout }) => (
  <nav className="sticky top-0 z-50 bg-[#FAF9F2]/90 backdrop-blur-md border-b border-[#E8E1D1] px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <h1 className="text-xl font-bold text-[#4A4238] tracking-tight hidden sm:block">Caio <span className="text-[#C9A694]">&</span> Jhennifer</h1>
    </div>
    <div className="flex items-center gap-4">
      {user && !isAdmin && (
        <span className="hidden md:block text-[#A19A8E] text-[10px] font-bold uppercase tracking-wider">Olá, {user.name.split(' ')[0]}</span>
      )}

      {/* Botão admin só aparece quando já está autenticado como admin */}
      {isAdmin && (
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-[#B59A57] bg-[#B59A57]/10 px-3 py-1.5 rounded-lg border border-[#B59A57]/30">
            <span>🔐</span> Admin
          </span>
          <button
            onClick={onAdminLogout}
            className="text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-lg font-bold transition bg-[#E8E1D1] text-[#7A7165] hover:bg-[#DED5C3]"
          >
            Sair do Admin
          </button>
        </div>
      )}

      {user && !isAdmin && (
        <button onClick={onLogout} className="text-[10px] font-bold text-[#C9A694] hover:text-[#A68574] uppercase tracking-widest">Sair</button>
      )}
    </div>
  </nav>
);

export default Navbar;
