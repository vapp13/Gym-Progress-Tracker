import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Settings as SettingsIcon, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import AvatarDisplay from '../features/profile/AvatarDisplay';
import Card from '../components/Card';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';
import { calculateAge } from '../utils/age';
import { formatHeight } from '../utils/units';

function Profile() {
  const { user, logout } = useAuth();
  const { data, loading } = useUserProfile();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <AvatarDisplay photoURL={user?.photoURL} name={user?.displayName} size={56} />
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>{user?.displayName}</h3>
            {!loading && data?.profile?.dateOfBirth && (
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                Age {calculateAge(data.profile.dateOfBirth)}
                {data.profile.height ? ` · ${formatHeight(data.profile.height, data.preferences.units)}` : ''}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 'var(--space-md)' }}>
        <Card>
          <span className="card-eyebrow">Your Friend Code</span>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: '4px 0 10px 0' }}>
            Share this with someone so they can add you as a friend.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <code style={{
              flex: 1,
              background: 'var(--color-surface-hover)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.uid}
            </code>
            <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={handleCopyCode}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </Card>
      </div>

      {loading ? (
        <div style={{ marginTop: 'var(--space-md)' }}><SkeletonCard /></div>
      ) : null}

      <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Button variant="secondary" icon={SettingsIcon} onClick={() => navigate('/settings')} style={{ width: '100%' }}>
          Settings
        </Button>
        <Button variant="secondary" icon={Users} onClick={() => navigate('/friends')} style={{ width: '100%' }}>
          Friends
        </Button>
        <Button variant="danger" icon={LogOut} onClick={logout} style={{ width: '100%' }}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Profile;
