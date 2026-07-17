import React from 'react';
import useAppStore from './store/appStore';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ResumeBuilder from './pages/ResumeBuilder';
import CodingPractice from './pages/CodingPractice';
import DsaPractice from './pages/DsaPractice';
import HrInterview from './pages/HrInterview';
import Aptitude from './pages/Aptitude';
import SystemDesign from './pages/SystemDesign';
import LearningRoadmap from './pages/LearningRoadmap';
import CompanyPrepPage from './pages/CompanyPrep';
import Notes from './pages/Notes';
import Flashcards from './pages/Flashcards';
import Analytics from './pages/Analytics';
import CareerMentor from './pages/CareerMentor';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

export const App: React.FC = () => {
  const { isLoggedIn, currentPage } = useAppStore();

  if (!isLoggedIn) {
    return <Landing />;
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'mock-interview':
        return <MockInterview />;
      case 'resume-analyzer':
        return <ResumeAnalyzer />;
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'coding':
        return <CodingPractice />;
      case 'dsa':
        return <DsaPractice />;
      case 'hr':
        return <HrInterview />;
      case 'aptitude':
        return <Aptitude />;
      case 'system-design':
        return <SystemDesign />;
      case 'roadmaps':
        return <LearningRoadmap />;
      case 'company-prep':
        return <CompanyPrepPage />;
      case 'notes':
        return <Notes />;
      case 'flashcards':
        return <Flashcards />;
      case 'analytics':
        return <Analytics />;
      case 'mentor':
        return <CareerMentor />;
      case 'profile':
      case 'settings':
        return <Profile />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderActivePage()}
    </Layout>
  );
};

export default App;
