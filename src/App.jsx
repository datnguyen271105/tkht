import { useState } from 'react';
import { INITIAL_SEAT_STATUS } from './mock';

import MainScreen from './screens/MainScreen';
import RegisterMemberScreen from './screens/RegisterMemberScreen';
import SearchMovieScreen from './screens/SearchMovieScreen';
import ChooseShowtimeScreen from './screens/ChooseShowtimeScreen';
import ChooseSeatScreen from './screens/ChooseSeatScreen';
import ConfirmOrderScreen from './screens/ConfirmOrderScreen';
import PaymentScreen from './screens/PaymentScreen';

export default function App() {
  const [screen, setScreen] = useState('main');

  // Global state
  const [members, setMembers] = useState([]); // thành viên mới đăng ký trong session
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [seatStatus, setSeatStatus] = useState({ ...INITIAL_SEAT_STATUS });

  const navigate = (s) => setScreen(s);

  const handleMemberAdded = (m) => setMembers(prev => [...prev, m]);

  const handleConfirmSeats = (order) => {
    // Mark selected seats as temporarily held in state
    setSeatStatus(prev => {
      const updated = { ...prev };
      order.ghes.forEach(seat => {
        updated[`${order.suat.id}-${seat}`] = 'tam_giu';
      });
      return updated;
    });
    setCurrentOrder(order);
  };

  const handleUpdateOrder = (updatedOrder) => {
    setCurrentOrder(updatedOrder);
  };

  const handleCancelOrder = () => {
    // Release seats
    if (currentOrder) {
      setSeatStatus(prev => {
        const updated = { ...prev };
        currentOrder.ghes.forEach(seat => {
          const key = `${currentOrder.suat.id}-${seat}`;
          // Only release if still tam_giu (not da_ban)
          if (updated[key] === 'tam_giu') {
            delete updated[key];
          }
        });
        return updated;
      });
    }
    setCurrentOrder(null);
  };

  const handlePaymentSuccess = (order, invoice) => {
    // Mark seats as sold permanently
    setSeatStatus(prev => {
      const updated = { ...prev };
      order.ghes.forEach(seat => {
        updated[`${order.suat.id}-${seat}`] = 'da_ban';
      });
      return updated;
    });
    setCurrentOrder({ ...order, invoice, trangThai: 'Da_thanh_toan' });
  };

  return (
    <div className="font-sans">
      {screen === 'main' && (
        <MainScreen onNavigate={navigate} />
      )}
      {screen === 'register' && (
        <RegisterMemberScreen
          onNavigate={navigate}
          members={members}
          onMemberAdded={handleMemberAdded}
        />
      )}
      {screen === 'searchMovie' && (
        <SearchMovieScreen
          onNavigate={navigate}
          onSelectMovie={setSelectedMovie}
        />
      )}
      {screen === 'chooseShowtime' && (
        <ChooseShowtimeScreen
          onNavigate={navigate}
          selectedMovie={selectedMovie}
          onSelectShowtime={setSelectedShowtime}
        />
      )}
      {screen === 'chooseSeat' && (
        <ChooseSeatScreen
          onNavigate={navigate}
          selectedMovie={selectedMovie}
          selectedShowtime={selectedShowtime}
          seatStatus={seatStatus}
          onConfirmSeats={handleConfirmSeats}
        />
      )}
      {screen === 'confirmOrder' && (
        <ConfirmOrderScreen
          onNavigate={navigate}
          currentOrder={currentOrder}
          onUpdateOrder={handleUpdateOrder}
          onCancelOrder={handleCancelOrder}
        />
      )}
      {screen === 'payment' && (
        <PaymentScreen
          onNavigate={navigate}
          currentOrder={currentOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
}
