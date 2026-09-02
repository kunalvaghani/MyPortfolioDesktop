import type { DeliveryState, FlagshipProject } from '@/app/data/portfolio';

const stateLabels: Record<DeliveryState, string> = {
  planned: 'Planned',
  'in-development': 'In development',
  implemented: 'Implemented',
  tested: 'Tested',
  benchmarked: 'Benchmarked',
  documented: 'Documented',
  deployed: 'Deployed',
};

export function ProjectCard({ project }: { project: FlagshipProject }) {
  return (
    <article className="project-card" data-reveal>
      <div className="project-card-header">
        <div>
          <p className="project-kicker"><span>{project.number}</span>{project.kicker}</p>
          <h3>{project.title}</h3>
          <p className="project-summary">{project.summary}</p>
        </div>
        <div className="status-list" aria-label={`${project.title} delivery states`}>
          {project.states.map((state) => (
            <span className={`status status-${state}`} key={state}>{stateLabels[state]}</span>
          ))}
        </div>
      </div>

      <div className="project-details">
        <div>
          <p className="detail-label">Problem</p>
          <p>{project.problem}</p>
        </div>
        <div>
          <p className="detail-label">Constraint</p>
          <p>{project.constraint}</p>
        </div>
        <div>
          <p className="detail-label">Engineering depth</p>
          <p>{project.depth}</p>
        </div>
      </div>

      <div className="project-lower">
        <div className="component-list">
          <p className="detail-label">Architecture</p>
          <ul>
            {project.architecture.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="evidence-panel">
          <p className="detail-label">Repository evidence</p>
          {project.evidence.map((item) => (
            <div className="evidence-row" key={`${item.label}-${item.value}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              {item.note ? <small>{item.note}</small> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="project-footer">
        <div className="tag-list" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        <div className="project-actions">
          {project.repository ? (
            <a href={project.repository} target="_blank" rel="noreferrer">Repository <span aria-hidden="true">↗</span></a>
          ) : null}
          {project.documentation ? (
            <a href={project.documentation} target="_blank" rel="noreferrer">Technical docs <span aria-hidden="true">↗</span></a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
