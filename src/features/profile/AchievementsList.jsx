import { Trophy } from 'lucide-react';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';

function AchievementsList({ achievements }) {
  if (!achievements || achievements.length === 0) {
    return <EmptyState message="No achievements earned yet — keep training!" icon={Trophy} />;
  }

  return (
    <Card>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {achievements.map((a) => (
          <li key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)' }}>
            <Trophy size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            {a.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default AchievementsList;
