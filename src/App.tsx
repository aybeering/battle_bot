import { Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import Home from './routes/Home';
import CreateBot from './routes/CreateBot';
import Battle from './routes/Battle';
import Leaderboard from './routes/Leaderboard';

export default function App() {
  return (
    <div className="min-h-screen bg-nv-black text-white">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateBot />} />
        <Route path="/battle/:id" element={<Battle />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
