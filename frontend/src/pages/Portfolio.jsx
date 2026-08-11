import { useState } from 'react';
import Header from '../components/layout/Header.jsx';
import TabNav from '../components/layout/TabNav.jsx';
import OverviewPanel from '../components/portfolio/OverviewPanel.jsx';
import DashboardPanel from '../components/portfolio/DashboardPanel.jsx';
import MetricsPanel from '../components/portfolio/MetricsPanel.jsx';
import CredentialsPanel from '../components/portfolio/CredentialsPanel.jsx';
import HiringPanel from '../components/portfolio/HiringPanel.jsx';
import FloatingHireButton from '../components/portfolio/FloatingHireButton.jsx';

const PANELS = {
  overview: OverviewPanel,
  dashboard: DashboardPanel,
  skills: MetricsPanel,
  credentials: CredentialsPanel,
  hiring: HiringPanel,
};

export default function Portfolio() {
  const [tab, setTab] = useState('overview');

  function switchTab(id) {
    setTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const ActivePanel = PANELS[tab];

  return (
    <div className="page-wrap">
      <Header onHireClick={() => switchTab('hiring')} />
      <TabNav active={tab} onChange={switchTab} />
      <ActivePanel />
      <FloatingHireButton visible={tab !== 'hiring'} onClick={() => switchTab('hiring')} />
    </div>
  );
}
