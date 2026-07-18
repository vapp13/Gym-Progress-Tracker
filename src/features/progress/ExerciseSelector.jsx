import { useExercises } from '../../hooks/useExercises';

function ExerciseSelector({ value, onChange }) {
  const { exercises, loading } = useExercises();

  if (loading) return <p>Loading exercises...</p>;

  return (
    <label className="form-field">
      <span>Exercise</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select an exercise</option>
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>
    </label>
  );
}

export default ExerciseSelector;