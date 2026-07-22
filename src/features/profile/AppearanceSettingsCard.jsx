import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Card from '../../components/Card';

function AppearanceSettingsCard() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary">{isDark ? <Moon size={18} /> : <Sun size={18} />}</span>
        <span className="card-eyebrow">Appearance</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
        <button
          type="button"
          className={`visibility-toggle ${isDark ? 'is-private' : 'is-friends'}`}
          onClick={toggleTheme}
          aria-pressed={!isDark}
        >
          Switch to {isDark ? 'Light' : 'Dark'}
        </button>
      </div>
    </Card>
  );
}

export default AppearanceSettingsCard;
