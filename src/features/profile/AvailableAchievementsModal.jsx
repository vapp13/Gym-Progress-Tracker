import { Trophy, Lock } from 'lucide-react';
import Modal from '../../components/Modal';
import { ACHIEVEMENTS } from '../../utils/achievements';

function AvailableAchievementsModal({ isOpen, onClose, earnedAchievements = [] }) {
  const earnedKeys = earnedAchievements.map((a) => a.key);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="All Achievements">
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ACHIEVEMENTS.map((achievement) => {
          const isEarned = earnedKeys.includes(achievement.key);
          return (
            <li
              key={achievement.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 'var(--text-sm)',
                color: isEarned ? 'var(--color-text)' : 'var(--color-text-faint)',
              }}
            >
              {isEarned ? (
                <Trophy size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              ) : (
                <Lock size={16} style={{ flexShrink: 0 }} />
              )}
              {achievement.label}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}

export default AvailableAchievementsModal;
