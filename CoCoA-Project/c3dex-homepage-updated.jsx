import React, { useState, useEffect } from 'react';

const C3DEXHomepage = () => {
  const [activeTab, setActiveTab] = useState('quest');
  
  // Wallet state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState('');

  // Check if wallet was previously connected
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (window.cardano?.lace) {
        try {
          const isEnabled = await window.cardano.lace.isEnabled();
          if (isEnabled) {
            const api = await window.cardano.lace.enable();
            const addresses = await api.getUsedAddresses();
            if (addresses && addresses.length > 0) {
              setWalletAddress(addresses[0]);
              setWalletConnected(true);
            }
          }
        } catch (e) {
          console.log('No existing wallet connection');
        }
      }
    };
    checkExistingConnection();
  }, []);

  // Connect Lace Wallet
  const connectWallet = async () => {
    setWalletError('');
    setWalletLoading(true);

    try {
      // Check if Lace is installed
      if (!window.cardano || !window.cardano.lace) {
        setWalletError('Lace wallet not found. Please install from lace.io');
        setWalletLoading(false);
        window.open('https://www.lace.io/', '_blank');
        return;
      }

      // Enable wallet
      const api = await window.cardano.lace.enable();
      
      // Get addresses
      const addresses = await api.getUsedAddresses();
      if (!addresses || addresses.length === 0) {
        const unusedAddresses = await api.getUnusedAddresses();
        if (unusedAddresses && unusedAddresses.length > 0) {
          setWalletAddress(unusedAddresses[0]);
        } else {
          throw new Error('No addresses found in wallet');
        }
      } else {
        setWalletAddress(addresses[0]);
      }

      setWalletConnected(true);
      setWalletLoading(false);

    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletError(error.message || 'Failed to connect wallet');
      setWalletLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletError('');
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    // Decode hex to bech32 if needed, or just truncate
    if (addr.length > 20) {
      return `${addr.substring(0, 8)}...${addr.slice(-6)}`;
    }
    return addr;
  };

  const coordinationLevels = {
    quest: {
      title: 'Quest',
      subtitle: 'Strategic Objectives',
      description: 'High-level coordination goals that define what the Alliance aims to achieve. Quests represent the "why" — the strategic direction that mobilizes collective action.',
      examples: ['Launch Regional Food Sovereignty Network', 'Establish 10 Community Land Trusts', 'Deploy Renewable Energy Microgrid'],
      color: 'from-purple-600 to-purple-800',
      accent: 'purple'
    },
    mission: {
      title: 'Mission',
      subtitle: 'Tactical Coordination',
      description: 'Discrete, measurable campaigns that advance Quest objectives. Missions break down strategic goals into coordinated efforts with clear deliverables and timelines.',
      examples: ['Onboard 50 Pioneer Members', 'Complete Phase 1 Infrastructure Buildout', 'Integrate Payment Rails'],
      color: 'from-blue-700 to-blue-900',
      accent: 'blue'
    },
    impact: {
      title: 'Impact Offer',
      subtitle: 'Operational Exchange',
      description: 'The atomic unit of value exchange. Impact Offers are specific contributions — skills, resources, capital, or labor — matched to Mission requirements through the marketplace.',
      examples: ['Smart Contract Development (40 hrs)', 'Legal Document Review', 'Equipment Lease: Solar Panels'],
      color: 'from-red-700 to-red-900',
      accent: 'red'
    }
  };

  const integrations = [
    {
      name: 'Lace Wallet',
      description: 'Native Cardano wallet integration for seamless ADA and native token transactions',
      status: 'Live',
      icon: '🔐'
    },
    {
      name: 'Oracle Services',
      description: 'Real-time pricing feeds and external data verification for transparent marketplace operations',
      status: 'Coming Soon',
      icon: '📡'
    },
    {
      name: 'XPT Credentials',
      description: 'Experience Proof Tokens validate member contributions and unlock governance participation',
      status: 'Coming Soon',
      icon: '🏅'
    },
    {
      name: 'CoCoA Agent Layer',
      description: 'AI-powered coordination assistant serving as the primary UI/UX interface',
      status: 'Live',
      icon: '🤖'
    }
  ];

  const tokenomics = [
    { token: 'PPT', name: 'Patronage Performance Token', purpose: 'Governance weight based on contribution history' },
    { token: 'COMM', name: 'Community Membership', purpose: 'Membership status and voting rights' },
    { token: 'JLZ', name: 'Joules', purpose: 'Energy-backed stablecoin for marketplace transactions' },
    { token: 'XPT', name: 'Experience Proof Token', purpose: 'Credential verification and reputation' }
  ];

  const roadmap = [
    { phase: 'Phase 1', title: 'Foundation', status: 'current', items: ['MVP Marketplace Framework', 'Quest/Mission/Impact Offer Architecture', 'Investor Documentation'] },
    { phase: 'Phase 2', title: 'Integration', status: 'current', items: ['Lace Wallet Connection', 'CoCoA Agent UI Layer', 'Basic Oracle Integration'] },
    { phase: 'Phase 3', title: 'Expansion', status: 'upcoming', items: ['Full Tokenomics Deployment', 'Cross-chain Bridges', 'DAO Governance Launch'] }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-700 via-purple-700 to-blue-800 flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-lg">C³</span>
            </div>
            <span className="text-xl font-bold">C3DEX</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#coordination" className="text-gray-400 hover:text-white transition-colors">Coordination</a>
            <a href="#architecture" className="text-gray-400 hover:text-white transition-colors">Architecture</a>
            <a href="#roadmap" className="text-gray-400 hover:text-white transition-colors">Roadmap</a>
            
            {/* Wallet Connection Button */}
            {walletConnected ? (
              <div className="relative group">
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  {formatAddress(walletAddress)}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a 
                    href="https://cocoa-mvp.team-d90.workers.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-t-lg"
                  >
                    🤖 Open CoCoA
                  </a>
                  <button 
                    onClick={disconnectWallet}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors rounded-b-lg"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={walletLoading}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {walletLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Wallet Error Toast */}
        {walletError && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-red-900/90 border border-red-700 rounded-lg text-sm text-red-200 flex items-center gap-2">
            <span>⚠️</span>
            {walletError}
            <button onClick={() => setWalletError('')} className="ml-2 text-red-400 hover:text-red-200">✕</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-purple-900/20 to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 mb-8">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">C3 Alliance Infrastructure</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Decentralized
            </span>
            <br />
            <span className="text-white">Coordination Marketplace</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            C3DEX enables sovereign communities to coordinate Quests, execute Missions, and exchange Impact Offers — 
            powered by blockchain-verified credentials and AI-facilitated matching.
          </p>
          
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-900/30">
              View Whitepaper
            </button>
            <a 
              href="https://cocoa-mvp.team-d90.workers.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl font-semibold hover:bg-gray-750 transition-all flex items-center gap-2"
            >
              🤖 Try CoCoA
            </a>
          </div>
        </div>
      </section>

      {/* Coordination Hierarchy Section */}
      <section id="coordination" className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Coordination Hierarchy</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A three-tier framework for organizing collective action from strategic vision to operational execution
            </p>
          </div>

          {/* Visual Flow */}
          <div className="flex justify-center items-center gap-4 mb-12">
            {['quest', 'mission', 'impact'].map((level, index) => (
              <React.Fragment key={level}>
                <button
                  onClick={() => setActiveTab(level)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === level
                      ? `bg-gradient-to-r ${coordinationLevels[level].color} shadow-lg`
                      : 'bg-gray-800 hover:bg-gray-750'
                  }`}
                >
                  {coordinationLevels[level].title}
                </button>
                {index < 2 && (
                  <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Active Level Detail */}
          <div className={`bg-gradient-to-br ${coordinationLevels[activeTab].color} rounded-2xl p-8 md:p-12`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-sm font-semibold text-gray-300 mb-2">{coordinationLevels[activeTab].subtitle}</div>
                <h3 className="text-3xl font-bold mb-4">{coordinationLevels[activeTab].title}</h3>
                <p className="text-gray-200 leading-relaxed">{coordinationLevels[activeTab].description}</p>
              </div>
              <div className="bg-black/20 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-400 mb-4">Examples</div>
                <ul className="space-y-3">
                  {coordinationLevels[activeTab].examples.map((example, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-200">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Flow Visualization */}
          <div className="mt-16 bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-bold mb-8 text-center">Impact Flow Cycle</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="font-semibold">Quest Defined</div>
                <div className="text-sm text-gray-500">Alliance governance</div>
              </div>
              <svg className="w-8 h-8 text-gray-600 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="font-semibold">Missions Created</div>
                <div className="text-sm text-gray-500">Tactical breakdown</div>
              </div>
              <svg className="w-8 h-8 text-gray-600 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤝</span>
                </div>
                <div className="font-semibold">Offers Matched</div>
                <div className="text-sm text-gray-500">CoCoA facilitates</div>
              </div>
              <svg className="w-8 h-8 text-gray-600 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="font-semibold">XPT Earned</div>
                <div className="text-sm text-gray-500">Credentials issued</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Section */}
      <section id="architecture" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Technical Architecture</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built on Cardano with native integrations for secure, verifiable coordination
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {integrations.map((integration, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{integration.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    integration.status === 'Live' 
                      ? 'bg-green-500/20 text-green-400' 
                      : integration.status === 'In Development' 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : integration.status === 'Phase 2'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
                <p className="text-gray-400">{integration.description}</p>
              </div>
            ))}
          </div>

          {/* Tokenomics */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-center">Token Architecture</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {tokenomics.map((token, i) => (
                <div key={i} className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{token.token}</div>
                  <div className="text-sm text-gray-300 font-medium mb-2">{token.name}</div>
                  <div className="text-xs text-gray-500">{token.purpose}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Development Roadmap</h2>
            <p className="text-gray-400 text-lg">Building Sovereign Stewardship as a Service</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roadmap.map((phase, i) => (
              <div key={i} className={`rounded-2xl p-6 border ${
                phase.status === 'current' 
                  ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/50' 
                  : 'bg-gray-800/50 border-gray-700'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    phase.status === 'current' 
                      ? 'bg-yellow-500 text-gray-900' 
                      : phase.status === 'upcoming'
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {phase.phase}
                  </span>
                  {phase.status === 'current' && (
                    <span className="text-yellow-400 text-sm">← Current</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        phase.status === 'current' ? 'bg-yellow-400' : 'bg-gray-600'
                      }`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-red-900/30 via-purple-900/30 to-blue-900/30 rounded-3xl p-12 border border-gray-700">
            <h2 className="text-4xl font-bold mb-4">Join the Alliance</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              We're building infrastructure for sovereign communities to coordinate at scale. 
              Interested in pioneering the future of cooperative economics?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg">
                Pioneer Program Inquiry
              </button>
              <button className="px-8 py-4 bg-gray-800 border border-gray-600 rounded-xl font-semibold hover:bg-gray-750 transition-all">
                Investment Deck
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-700 via-purple-700 to-blue-800 flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-lg">C³</span>
              </div>
              <div>
                <div className="font-bold">C3DEX</div>
                <div className="text-sm text-gray-500">A C3 Alliance Protocol</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Powered by <span className="text-yellow-500 font-semibold">Plausible Potentials</span> • Built on Cardano
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default C3DEXHomepage;
