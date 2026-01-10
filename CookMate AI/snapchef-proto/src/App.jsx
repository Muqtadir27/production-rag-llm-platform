import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PantryScreen from './screens/PantryScreen';
import MatchesScreen from './screens/MatchesScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import LiveCookingScreen from './screens/LiveCookingScreen';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PantryScreen />} />
          <Route path="/recipes" element={<MatchesScreen />} />
          <Route path="/ai-chef" element={<Navigate to="/recipes" replace />} /> {/* Placeholder */}
          <Route path="/profile" element={<div className="p-10 text-center">Profile Coming Soon</div>} />
          <Route path="/recipe/:id" element={<RecipeDetailScreen />} />
        </Route>

        {/* Full Screen Mode for Cooking */}
        <Route path="/recipe/:id/cooking" element={<LiveCookingScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
