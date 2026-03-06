import React, { useEffect } from 'react';
import { useAppState } from './src/hooks/useAppState';
import Navbar from './src/components/layout/Navbar';
import AppHeader from './src/components/layout/AppHeader';
import Footer from './src/components/layout/Footer';
import UserAuthModal from './src/components/modals/UserAuthModal';
import AdminLoginModal from './src/components/modals/AdminLoginModal';
import GiftDetails from './src/components/gifts/GiftDetails';
import EventoTab from './src/tabs/EventoTab';
import PresentesTab from './src/tabs/PresentesTab';
import MeusSelecionadosTab from './src/tabs/MeusSelecionadosTab';
import AdminTab from './src/tabs/AdminTab';
import { Toaster } from 'sonner';

export default function App() {
  const {
    user, isAdmin, showAdminLogin, setShowAdminLogin,
    activeTab, setActiveTab, selectedGiftId, setSelectedGiftId,
    gifts, confirmacoes, config,
    handleReserve, handleCancelReserve, onAddGift, onEditGift, handleRemoveGift,
    onConfirmPresenca, onSaveConfig,
    handleAdminLogin, handleAdminLogout, handleLogout, handleSaveUser,
    isReservaPast, totalPessoas, totalAdultos, totalCriancas, totalNaoVao,
    userReserva, reservedGiftsCount, myGifts, progressPercent, selectedGift,
    isLoading, error
  } = useAppState();

  // Atalho secreto: Ctrl+Shift+A abre o modal de login admin
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAdmin) setShowAdminLogin(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAdmin, setShowAdminLogin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F2] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#C9A694] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#7A7165] font-serif italic text-lg animate-pulse">Carregando nosso evento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F2] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg text-center border border-red-100">
           <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-3xl">⚠️</span>
           </div>
           <h2 className="text-2xl font-serif text-[#4A4238] mb-2">Ops! Algo deu errado.</h2>
           <p className="text-[#7A7165] mb-6">{error}</p>
           <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#B59A57] text-white rounded-lg font-bold hover:bg-[#9E8548] transition">Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F2]">
      <Toaster position="top-center" />

      {/* Modals */}
      {!user && !isAdmin && <UserAuthModal onSave={handleSaveUser} />}
      {showAdminLogin && (
        <AdminLoginModal
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Navigation */}
      <Navbar
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onAdminLoginClick={() => setShowAdminLogin(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Header (hero + progress + tabs) - hidden when viewing gift detail */}
      {!selectedGiftId && (
        <AppHeader
          user={user}
          isAdmin={isAdmin}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          myGiftsCount={myGifts.length}
          reservedGiftsCount={reservedGiftsCount}
          totalGiftsCount={gifts.length}
          progressPercent={progressPercent}
        />
      )}

      <main className="max-w-5xl mx-auto px-6 py-16">
        {selectedGift ? (
          <GiftDetails
            gift={selectedGift}
            currentUser={user}
            onReserve={handleReserve}
            onCancel={handleCancelReserve}
            onBack={() => setSelectedGiftId(null)}
          />
        ) : (
          <>
            {activeTab === 'evento' && (
              <EventoTab
                user={user}
                isAdmin={isAdmin}
                config={config}
                userReserva={userReserva}
                confirmacoes={confirmacoes}
                onConfirmPresenca={onConfirmPresenca}
                isReservaPast={isReservaPast}
              />
            )}

            {activeTab === 'presentes' && (
              <PresentesTab
                gifts={gifts}
                currentUser={user}
                isAdmin={isAdmin}
                onReserve={handleReserve}
                onCancel={handleCancelReserve}
                onRemove={handleRemoveGift}
                onEdit={onEditGift}
                onViewDetails={(id) => setSelectedGiftId(id)}
              />
            )}

            {activeTab === 'meus-selecionados' && user && !isAdmin && (
              <MeusSelecionadosTab
                myGifts={myGifts}
                onCancelReserve={handleCancelReserve}
                onViewDetails={(id) => setSelectedGiftId(id)}
                onNavigateToPresentes={() => setActiveTab('presentes')}
              />
            )}

            {activeTab === 'admin' && isAdmin && (
              <AdminTab
                gifts={gifts}
                confirmacoes={confirmacoes}
                config={config}
                onSaveConfig={onSaveConfig}
                onAddGift={onAddGift}
                totalPessoas={totalPessoas}
                totalAdultos={totalAdultos}
                totalCriancas={totalCriancas}
                totalNaoVao={totalNaoVao}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
