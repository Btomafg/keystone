export default function ProjectPage({ params }: { params: { id?: string } }) {
  const projectId = params.id;

  if (!projectId) {
    return <div>No project selected.</div>;
  }

  return (
    <div>
      <h1>Project ID: {projectId}</h1>
      {/* Fetch and display project data based on ID */}
    </div>
  );
}
