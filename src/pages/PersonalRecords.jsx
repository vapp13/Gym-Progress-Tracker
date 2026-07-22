import PageHeader from '../components/PageHeader';
import ProgressPersonalRecords from '../features/progress/ProgressPersonalRecords';

function PersonalRecords() {
  return (
    <div className="page-container">
      <PageHeader title="Personal Records" showBack sticky />
      <ProgressPersonalRecords />
    </div>
  );
}

export default PersonalRecords;
