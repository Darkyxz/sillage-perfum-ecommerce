import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDebug = () => {
  const { user, profile, isAdmin, loading, isAuthLoading } = useAuth();

  // Solo mostrar en desarrollo o si hay query param ?debug=true
  const showDebug = import.meta.env.DEV || 
    new URLSearchParams(window.location.search).get('debug') === 'true';

  if (!showDebug) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold text-yellow-400 mb-2">🔧 Admin Debug Info</h3>
      
      <div className="space-y-1">
        <div>
          <strong>Loading:</strong> {loading ? '✅' : '❌'}
        </div>
        <div>
          <strong>Auth Loading:</strong> {isAuthLoading ? '✅' : '❌'}
        </div>
        <div>
          <strong>User:</strong> {user ? '✅' : '❌'}
        </div>
        {user && (
          <div>
            <strong>Email:</strong> {user.email}
          </div>
        )}
        <div>
          <strong>Profile:</strong> {profile ? '✅' : '❌'}
        </div>
        {profile && (
          <>
            <div>
              <strong>Role:</strong> {profile.role || 'No role'}
            </div>
            <div>
              <strong>Full Name:</strong> {profile.full_name || 'No name'}
            </div>
          </>
        )}
        <div>
          <strong>Is Admin:</strong> {isAdmin ? '✅ YES' : '❌ NO'}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="text-yellow-300">
          Para acceder al admin necesitas:
        </div>
        <div>• User: ✅</div>
        <div>• Profile: ✅</div>
        <div>• Role: 'admin'</div>
        <div>• Is Admin: ✅</div>
      </div>
    </div>
  );
};

export default AdminDebug;