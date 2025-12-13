import { Edit2, Eye, EyeOff, MoreVertical, ExternalLink, Crown, Mail, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface AccountPageProps {
  onNavigateToSetup: () => void;
}

export function AccountPage({ onNavigateToSetup }: AccountPageProps) {
  const [showTokens, setShowTokens] = useState<{ [key: string]: boolean }>({});

  const widgets = [
    {
      id: 'O2EOKV',
      name: 'Widget #O2EOKV',
      integrationToken: '••••••••••••••••••••••••••••••••',
      database: '2eebd26b4b98367d12771cec1',
      url: 'https://www.graceandigrow.co/o2okV',
    },
    {
      id: 'Ob2J3h',
      name: 'iglayout',
      integrationToken: '••••••••••••••••••••••••••••••••',
      database: '2e43dd8799dd8ebb42cf6b5c8fb591',
      url: 'https://www.graceandigrow.co/Ob2J3h',
    },
    {
      id: 'er8u0T',
      name: 'Widget #er8u0T',
      integrationToken: '••••••••••••••••••••••••••••••••',
      database: '2e0c026d94b91e5af7e89f7abd94de',
      url: 'https://www.graceandigrow.co/er#u8T',
    },
  ];

  const toggleTokenVisibility = (id: string) => {
    setShowTokens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-12 py-12">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Account Details</h1>
        <p className="text-gray-600">Manage your profile and widgets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Personal Info & License */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl text-gray-900">Personal Information</h2>
            </div>

            <div className="space-y-5">
              <div className="pb-4 border-b border-gray-100">
                <label className="block text-xs text-gray-500 mb-2">Email</label>
                <div className="flex items-center justify-between">
                  <p className="text-gray-900">20030162309@uhamka.ac.id</p>
                  <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1">
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <label className="block text-xs text-gray-500 mb-2">Name</label>
                <p className="text-gray-500 text-sm">No name</p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">Account Type</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Basic Account</span>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* License */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎟️</span>
              </div>
              <div>
                <h2 className="text-xl text-gray-900">Your License</h2>
                <p className="text-xs text-gray-600">Basic License Key</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Activated on</p>
                <p className="text-xs text-gray-600">Nov 2, 2025</p>
              </div>
              <p className="text-gray-900 font-mono text-sm break-all">
                e90d011-2302-dc51-8805-f18409C33F
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm text-gray-600 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl text-purple-600">3</p>
                <p className="text-xs text-gray-600">Active Widgets</p>
              </div>
              <div>
                <p className="text-2xl text-purple-600">∞</p>
                <p className="text-xs text-gray-600">API Calls</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">Your Widgets</h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
              {widgets.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-6 transition-all"
              >
                {/* Widget Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <span className="text-sm">{widget.id.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="text-gray-900">{widget.name}</h3>
                      <p className="text-xs text-gray-500">ID: {widget.id}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Integration Token */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <label className="block text-xs text-gray-500 mb-2">Integration Token:</label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900 font-mono flex-1 truncate">
                      {showTokens[widget.id] ? 'ntn_38356847923abcdef...' : widget.integrationToken}
                    </p>
                    <button
                      onClick={() => toggleTokenVisibility(widget.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showTokens[widget.id] ? (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Database */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-500">Database:</label>
                    <button className="text-xs text-purple-600 hover:text-purple-700 transition-colors">
                      View DB
                    </button>
                  </div>
                  <p className="text-sm text-gray-900 font-mono truncate bg-gray-50 px-2 py-1 rounded">
                    {widget.database}
                  </p>
                </div>

                {/* Widget URL */}
                <div className="pt-3 border-t border-gray-100">
                  <a
                    href={widget.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate flex-1">{widget.url}</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Widget Button */}
          <button 
            onClick={onNavigateToSetup}
            className="w-full mt-4 px-6 py-3 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Create New Widget</span>
          </button>
        </div>
      </div>
    </div>
  );
}