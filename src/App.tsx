import { Content, Header, HeaderMenuItem, HeaderName } from '@carbon/react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Home, Receipt } from '@carbon/icons-react';
import ReceiptUploadPage from './pages/ReceiptUploadPage';
import HomePage from './pages/HomePage';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header aria-label="Receipt Management System" className="custom-header">
          <HeaderName href="/" prefix="RMS">
            Receipt Management System
          </HeaderName>
          <HeaderMenuItem element={Link} to="/">
            <Home size={20} className="icon-spacing" /> Home
          </HeaderMenuItem>
          <HeaderMenuItem element={Link} to="/upload-receipt">
            <Receipt size={20} className="icon-spacing" /> Upload Receipt
          </HeaderMenuItem>
        </Header>
        <Content className="custom-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload-receipt" element={<ReceiptUploadPage />} />
          </Routes>
        </Content>
      </div>
    </Router>
  );
}

export default App;
