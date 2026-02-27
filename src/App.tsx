import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import BatchesPage from './pages/BatchesPage';
import SamplesPage from './pages/SamplesPage';
import SlidesPage from './pages/SlidesPage';
import SampleDetailsPage from './pages/SampleDetailsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/batches" replace />} />
              <Route path="/batches" element={<BatchesPage />} />
              <Route path="/batches/:id" element={<BatchesPage />} />
              <Route path="/samples" element={<SamplesPage />} />
              <Route path="sample-details/:sampleId" element={<SampleDetailsPage />} />

              <Route path="/slides" element={<SlidesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
