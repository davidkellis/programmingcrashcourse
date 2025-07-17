import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TutorialLayout } from './components/TutorialLayout';
import { TutorialHome } from './pages/TutorialHome';
import { TutorialSection } from './pages/TutorialSection';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TutorialLayout />}>
            <Route index element={<TutorialHome />} />
            <Route path="section/:sectionId" element={<TutorialSection />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
