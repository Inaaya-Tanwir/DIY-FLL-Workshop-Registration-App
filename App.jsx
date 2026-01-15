import React, { useState, useEffect } from 'react';
import { Gift, Users, Package, CheckCircle, Circle, Search } from 'lucide-react';

const TEAMS = {
  '16188': 'Archers',
  '23767': 'JJaM \'n WaffLes MM...',
  '26706': 'Fossilized',
  '30787': 'Lego Ravens',
  '39001': 'Skywalker Squirrels',
  '40877': 'ATA Wolfpack',
  '49055': 'Bombastic Builder Bees',
  '50981': 'The Bricktastic Beaver Builder Knights of Noodle',
  '55487': 'Earth Builders',
  '55957': 'Nuclear Axolotls',
  '56661': 'Dynosaurs',
  '57605': 'BananaBot',
  '58444': 'Purring Fury',
  '58690': 'Synafactors',
  '60493': 'The Lego Krafters',
  '61884': 'Building Bananas',
  '62105': 'Waves, Flames and Games',
  '62685': 'Electro Engineers',
  '62725': 'MASTERMINDZ',
  '62999': 'I-ROBOT',
  '63860': 'St. Cecilia Middle School Sleep Deprived Cyclonebots',
  '64079': 'LEGO Pups',
  '64393': '7-Headed Flying Chicken Squirrels',
  '65280': 'CIRCUIT BREAKERS',
  '65622': 'The Riveteers',
  '66753': 'Ashland Earthworms',
  '67133': 'Kraxberger Gearheads Lego Robotics Challenge Team',
  '68234': 'Code Crushers PDX',
  '68532': 'CLA Explorers 1',
  '68909': 'Krakens',
  '69367': 'REACH for Robotics',
  '69866': 'Digital Diggers',
  '69923': 'The Dig Bots',
  '70004': 'Grinches',
  '70006': 'Indiana Girls',
  '70511': 'FLL Computer Cookies',
  '70536': 'AVESTA BOTS',
  '70589': 'Portland LEGO Masters',
  '70623': 'Golden MINED',
  '70695': 'The Wild Kings',
  '71024': 'RoboMania',
  '71076': 'Unearthed Rising Legends',
  '71195': 'Techno Squad',
  '71327': 'Compass Dino-Mights',
  '71467': 'L.E.G.O. (Lost Excavation & Gadget Operators)',
  '71529': 'WildBots',
  '71736': 'Fire Dogs',
  '71737': 'Lego Wizards',
  '71906': 'The Electric Engineers',
  '72087': 'B.O.B. Squad Elite',
  '72825': 'Lego Legends',
  '73299': 'Yantra',
  '73315': 'Lego Studs',
  '73374': 'Jaguar Botz',
  '73692': 'The Dino Bricks',
  '73761': 'Creative Dragons',
  '74003': 'Danger Kitty 2025',
  '74609': 'Circuit_Breakers',
  '74653': 'Lego Dragons'
};

const KITS = [
  { id: 'arduino', name: 'Arduino Vibe Coding Kit', team: '70511', limit: 20, emoji: '💡' },
  { id: 'robot', name: 'DIY Robot Kit', team: '70695', limit: 20, emoji: '🤖' },
  { id: 'gadget', name: 'DIY STEM Gadget', team: '71076', limit: 20, emoji: '⚙️' }
];

export default function WorkshopApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [confirmingTeam, setConfirmingTeam] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [viewMode, setViewMode] = useState('registered');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadRegistrations();
    const interval = setInterval(loadRegistrations, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadRegistrations = async () => {
    try {
      const result = await window.storage.get('fll-registrations', true);
      if (result && result.value) {
        const data = JSON.parse(result.value);
        setRegistrations(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const saveRegistrations = async (newRegistrations) => {
    setSyncing(true);
    try {
      await window.storage.set('fll-registrations', JSON.stringify(newRegistrations), true);
      setRegistrations(newRegistrations);
    } catch (error) {
      console.error('Failed to save registrations:', error);
      alert('Failed to save registration. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const getKitCounts = () => {
    return KITS.map(kit => ({
      ...kit,
      assigned: registrations.filter(r => r.kitId === kit.id).length,
      remaining: kit.limit - registrations.filter(r => r.kitId === kit.id).length
    }));
  };

  const assignKit = () => {
    const counts = getKitCounts();
    const available = counts.filter(k => k.remaining > 0);
    
    if (available.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  };

  const handleTeamNumberSubmit = () => {
    const normalized = teamNumber.replace(/\D/g, '');
    
    if (!normalized) {
      setMessage({ type: 'error', text: 'Please enter a valid team number (numbers only)' });
      return;
    }

    if (!TEAMS[normalized]) {
      setMessage({ 
        type: 'error', 
        text: `Team number ${normalized} is not registered for Oregon FLL State Championship. Please check your team number and try again.` 
      });
      return;
    }

    setConfirmingTeam(normalized);
    setMessage(null);
  };

  const handleConfirmYes = async () => {
    const existing = registrations.find(r => r.teamNumber === confirmingTeam);
    if (existing) {
      const kit = KITS.find(k => k.id === existing.kitId);
      setMessage({
        type: 'warning',
        text: `⚠️ Team ${confirmingTeam} (${TEAMS[confirmingTeam]}) already registered!\n\nWe have 1 kit per State team - please share!\n\n(You were assigned: ${kit.name} from Team ${kit.team})`
      });
      setTeamNumber('');
      setConfirmingTeam(null);
      return;
    }

    const assignedKit = assignKit();
    if (!assignedKit) {
      setMessage({
        type: 'error',
        text: 'Sorry! All kits have been assigned. Thank you for your interest!'
      });
      setTeamNumber('');
      setConfirmingTeam(null);
      return;
    }

    const newReg = {
      teamNumber: confirmingTeam,
      teamName: TEAMS[confirmingTeam],
      kitId: assignedKit.id,
      timestamp: new Date().toISOString(),
      collected: false
    };

    await saveRegistrations([...registrations, newReg]);
    
    setMessage({
      type: 'success',
      text: `🎉 Team ${confirmingTeam} (${TEAMS[confirmingTeam]}) registered!\n\nAssigned: ${assignedKit.emoji} ${assignedKit.name}\n(from Team ${assignedKit.team})\n\nPick up at the workshop table to build!`
    });
    
    setTeamNumber('');
    setConfirmingTeam(null);
  };

  const handleConfirmNo = () => {
    setConfirmingTeam(null);
    setTeamNumber('');
    setMessage({ type: 'error', text: 'Registration cancelled. Please enter the correct team number.' });
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'STEM20FOREVER26') {
      setIsAdmin(true);
      setAdminPassword('');
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Incorrect password. Please try again.' });
    }
  };

  const toggleCollected = async (teamNumber) => {
    const updated = registrations.map(r =>
      r.teamNumber === teamNumber ? { ...r, collected: !r.collected } : r
    );
    await saveRegistrations(updated);
  };

  const handleResetConfirm = async () => {
    if (resetConfirmText === 'RESET2026') {
      await saveRegistrations([]);
      setShowResetConfirm(false);
      setResetConfirmText('');
      alert('All registrations have been reset!');
    } else {
      alert('Incorrect confirmation code. Reset cancelled.');
    }
  };

  const filteredRegistrations = registrations.filter(r =>
    r.teamNumber.includes(searchTerm) || 
    r.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allTeamsList = Object.entries(TEAMS).map(([number, name]) => {
    const registration = registrations.find(r => r.teamNumber === number);
    return {
      teamNumber: number,
      teamName: name,
      isRegistered: !!registration,
      registration: registration
    };
  }).filter(team => 
    !searchTerm || 
    team.teamNumber.includes(searchTerm) || 
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const notRegisteredTeams = allTeamsList.filter(team => !team.isRegistered);

  const kitCounts = getKitCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (showAdminLogin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-lg"
              />
              <button
                onClick={handleAdminLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
            </div>
            
            {message && message.type === 'error' && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {message.text}
              </div>
            )}
            
            <button
              onClick={() => setShowAdminLogin(false)}
              className="w-full mt-4 text-blue-600 hover:underline"
            >
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Workshop Dashboard</h1>
                {syncing && <p className="text-sm text-blue-600 mt-1">🔄 Syncing...</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Reset Data
                </button>
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    setShowAdminLogin(false);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Exit Admin
                </button>
              </div>
            </div>

            {showResetConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Reset All Data</h2>
                  <p className="text-gray-700 mb-4">
                    This will delete ALL registrations and reset the system to start fresh. This action cannot be undone!
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    To confirm, type: <span className="font-mono bg-gray-100 px-2 py-1 rounded">RESET2026</span>
                  </p>
                  <input
                    type="text"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    placeholder="Type RESET2026 to confirm"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 font-mono"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleResetConfirm}
                      disabled={syncing}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => {
                        setShowResetConfirm(false);
                        setResetConfirmText('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {kitCounts.map(kit => (
                <div key={kit.id} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{kit.emoji}</span>
                    <span className="text-sm font-medium text-gray-600">Team {kit.team}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{kit.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{kit.remaining}</span>
                    <span className="text-sm text-gray-600">of {kit.limit} remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(kit.assigned / kit.limit) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by team number or name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setViewMode('registered')}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  viewMode === 'registered' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Registered ({registrations.length})
              </button>
              <button
                onClick={() => setViewMode('not-registered')}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  viewMode === 'not-registered' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Not Registered ({Object.keys(TEAMS).length - registrations.length})
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  viewMode === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Teams ({Object.keys(TEAMS).length})
              </button>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Team #</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Team Name</th>
                    {viewMode === 'registered' && (
                      <>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Kit Assigned</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      </>
                    )}
                    {viewMode === 'all' && (
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Registration Status</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {viewMode === 'registered' && (
                    filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                          No registrations yet
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => {
                        const kit = KITS.find(k => k.id === reg.kitId);
                        return (
                          <tr key={reg.teamNumber} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-800">{reg.teamNumber}</td>
                            <td className="px-4 py-3 text-gray-700">{reg.teamName}</td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-gray-800">{kit.emoji} {kit.name}</div>
                                <div className="text-sm text-gray-500">Team {kit.team}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleCollected(reg.teamNumber)}
                                disabled={syncing}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition disabled:opacity-50"
                                style={{
                                  backgroundColor: reg.collected ? '#dcfce7' : '#f3f4f6',
                                  color: reg.collected ? '#16a34a' : '#6b7280'
                                }}
                              >
                                {reg.collected ? (
                                  <>
                                    <CheckCircle className="w-5 h-5" />
                                    Collected
                                  </>
                                ) : (
                                  <>
                                    <Circle className="w-5 h-5" />
                                    Not Collected
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )
                  )}
                  
                  {viewMode === 'not-registered' && (
                    notRegisteredTeams.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="px-4 py-8 text-center text-gray-500">
                          {searchTerm ? 'No teams found' : 'All teams have registered! 🎉'}
                        </td>
                      </tr>
                    ) : (
                      notRegisteredTeams.map((team) => (
                        <tr key={team.teamNumber} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-gray-800">{team.teamNumber}</td>
                          <td className="px-4 py-3 text-gray-700">{team.teamName}</td>
                        </tr>
                      ))
                    )
                  )}
                  
                  {viewMode === 'all' && (
                    allTeamsList.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                          No teams found
                        </td>
                      </tr>
                    ) : (
                      allTeamsList.map((team) => {
                        const kit = team.registration ? KITS.find(k => k.id === team.registration.kitId) : null;
                        return (
                          <tr 
                            key={team.teamNumber} 
                            className={`border-t border-gray-200 hover:bg-gray-50 ${
                              team.isRegistered ? 'bg-green-50' : ''
                            }`}
                          >
                            <td className="px-4 py-3 font-semibold text-gray-800">{team.teamNumber}</td>
                            <td className="px-4 py-3 text-gray-700">{team.teamName}</td>
                            <td className="px-4 py-3">
                              {team.isRegistered ? (
                                <div className="flex items-center gap-2">
                                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                                    ✓ Registered
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {kit.emoji} {kit.name}
                                  </span>
                                  {team.registration.collected && (
                                    <span className="text-xs text-green-700 font-semibold">(Collected)</span>
                                  )}
                                </div>
                              ) : (
                                <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-sm font-semibold">
                                  Not Registered
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
              {viewMode === 'all' ? (
                <>
                  Showing all {allTeamsList.length} teams • 
                  <span className="font-semibold text-green-600"> {registrations.length} registered</span> • 
                  <span className="font-semibold text-gray-500"> {Object.keys(TEAMS).length - registrations.length} not registered</span>
                </>
              ) : viewMode === 'not-registered' ? (
                <>
                  <span className="font-semibold text-gray-500">{notRegisteredTeams.length} teams</span> have not registered yet
                </>
              ) : (
                <>Total registrations: {registrations.length} / {Object.keys(TEAMS).length} teams</>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600 font-semibold">
                ✨ Live Sync Enabled - All devices update automatically every 2 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-lg mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 text-center">
          <p className="text-xs text-gray-600 leading-relaxed">
            App Created By <span className="font-semibold text-blue-600">Inaaya Tanwir & Ivan Samanta</span>,<br />
            friends of FLL teams 70511 FLL Computer Cookies, 70695 The Wild Kings, 71076 Unearthed Rising Legends
          </p>
          {syncing && <p className="text-xs text-blue-600 mt-2">🔄 Syncing...</p>}
        </div>

        <div className="bg-white rounded-t-2xl shadow-2xl p-6 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            DIY STEM Workshop
          </h1>
          <p className="text-gray-600 mb-1">Free STEM Kits for State Teams!</p>
        </div>

        <div className="bg-white px-6 py-4 border-t-2 border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-3 text-center">Available Kits:</h2>
          <div className="space-y-2">
            {kitCounts.map(kit => (
              <div key={kit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{kit.emoji}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-800">{kit.name}</div>
                    <div className="text-xs text-gray-500">Team {kit.team}</div>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${kit.remaining > 5 ? 'text-green-600' : kit.remaining > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                  {kit.remaining} left
                </span>
              </div>
            ))}
          </div>
        </div>

        {!confirmingTeam ? (
          <div className="bg-white px-6 py-6 border-t-2 border-gray-100">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Enter Your FLL Team Number
              </label>
              <input
                type="text"
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value.replace(/\D/g, ''))}
                onKeyPress={(e) => e.key === 'Enter' && handleTeamNumberSubmit()}
                placeholder="e.g., 70511"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-lg font-mono"
                autoFocus
                maxLength="5"
              />
              <button
                onClick={handleTeamNumberSubmit}
                disabled={syncing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white px-6 py-6 border-t-2 border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Team</h2>
              <p className="text-gray-600 mb-4">Are you team:</p>
              <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{confirmingTeam}</div>
                <div className="text-lg font-semibold text-gray-800">{TEAMS[confirmingTeam]}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmYes}
                disabled={syncing}
                className="flex-1 bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg disabled:opacity-50"
              >
                Yes, that's us! ✓
              </button>
              <button
                onClick={handleConfirmNo}
                className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg"
              >
                No, go back
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-6 rounded-2xl shadow-lg ${
            message.type === 'success' ? 'bg-green-50 border-2 border-green-500' :
            message.type === 'warning' ? 'bg-yellow-50 border-2 border-yellow-500' :
            'bg-red-50 border-2 border-red-500'
          }`}>
            <p className={`whitespace-pre-line text-center font-semibold ${
              message.type === 'success' ? 'text-green-800' :
              message.type === 'warning' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white rounded-b-2xl shadow-2xl px-6 py-4 mt-4 text-center text-sm text-gray-600">
          <p className="mb-2">✨ One kit per team • Random assignment</p>
          <p className="font-semibold text-purple-600">Demonstrating Gracious Professionalism</p>
          <p className="text-xs text-gray-500 mt-3">Oregon FLL State Championship 2026</p>
          
          <button
            onClick={() => setShowAdminLogin(true)}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition"
          >
            Admin Login
          </button>
          
          <p className="text-xs text-blue-600 font-semibold mt-3">
            🔄 Auto-syncing across all devices
          </p>
        </div>
      </div>
    </div>
  );
}
