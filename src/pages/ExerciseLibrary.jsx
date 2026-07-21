import ExerciseBrowser from '../features/exercises/ExerciseBrowser';
import PageHeader from '../components/PageHeader';

function ExerciseLibrary() {
  return (
    <div className="page-container">
      <PageHeader title="Exercises" showBack sticky />
      <ExerciseBrowser />
    </div>
  );
}

export default ExerciseLibrary;
