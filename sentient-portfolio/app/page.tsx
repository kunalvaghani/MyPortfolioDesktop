import { ArchitectureDiagram } from '@/app/components/portfolio/ArchitectureDiagram';
import { Navigation } from '@/app/components/portfolio/Navigation';
import { ProjectCard } from '@/app/components/portfolio/ProjectCard';
import { SectionHeading } from '@/app/components/portfolio/SectionHeading';
import {
  certifications,
  education,
  experience,
  flagshipProjects,
  foundationProjects,
  hardwareContext,
  methodology,
  profile,
  recognition,
  skillGroups,
} from '@/app/data/portfolio';

const siteUrl = 'https://sentient-portfolio.vercel.app';

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 7c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.85 3A1.94 1.94 0 1 0 4.8 6.88 1.94 1.94 0 0 0 4.85 3ZM21 13.66c0-3.86-2.06-5.66-4.81-5.66a4.16 4.16 0 0 0-3.75 2.06V8.2H9.13V21h3.31v-6.33c0-1.67.32-3.29 2.39-3.29 2.04 0 2.06 1.91 2.06 3.4V21H21v-7.34Z" />
    </svg>
  );
}

export default function Home() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: siteUrl,
    sameAs: [profile.github, profile.linkedin],
    email: `mailto:${profile.email}`,
    knowsAbout: [
      'Local LLM inference',
      'Agent runtimes',
      'Information retrieval',
      'C++ performance engineering',
      'AI evaluation',
    ],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Humber College' },
      { '@type': 'CollegeOrUniversity', name: 'Parul University' },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navigation />
      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-grid page-shell">
            <div className="hero-copy">
              <p className="hero-eyebrow"><span aria-hidden="true" />{profile.eyebrow}</p>
              <h1>{profile.headline}</h1>
              <p className="hero-intro">{profile.introduction}</p>

              <div className="hero-actions">
                <a className="button button-primary" href="#projects">Explore flagship systems <span aria-hidden="true">↓</span></a>
                <a className="button button-secondary" href={profile.github} target="_blank" rel="noreferrer">
                  <GitHubIcon /> GitHub
                </a>
                <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn <ArrowIcon />
                </a>
              </div>

              <div className="availability-line">
                <span className="availability-dot" aria-hidden="true" />
                Open to software engineering and AI/ML systems opportunities
              </div>
            </div>

            <div className="hero-system" aria-label="Local AI runtime flow">
              <div className="system-window">
                <div className="system-window-bar">
                  <span>runtime / request_001</span>
                  <span className="window-status">inspectable</span>
                </div>
                <div className="system-path">
                  <div className="system-node system-node-input">
                    <span>Input</span>
                    <strong>User task</strong>
                  </div>
                  <div className="system-connector" aria-hidden="true"><span /></div>
                  <div className="system-row">
                    <div className="system-node"><span>Runtime</span><strong>Agent state</strong></div>
                    <div className="system-node"><span>Policy</span><strong>Scheduler</strong></div>
                  </div>
                  <div className="system-connector" aria-hidden="true"><span /></div>
                  <div className="system-row">
                    <div className="system-node"><span>Evidence</span><strong>Retrieval</strong></div>
                    <div className="system-node"><span>Compute</span><strong>Model router</strong></div>
                  </div>
                  <div className="system-connector" aria-hidden="true"><span /></div>
                  <div className="system-node system-node-output">
                    <span>Local hardware</span>
                    <strong>Guarded inference + trace</strong>
                  </div>
                </div>
                <div className="system-telemetry">
                  <span><i /> permission checked</span>
                  <span><i /> resource admitted</span>
                  <span><i /> evidence retained</span>
                </div>
              </div>
            </div>
          </div>

          <div className="constraint-strip page-shell" aria-label="Hardware and operating constraints">
            {hardwareContext.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="section page-shell" id="systems">
          <SectionHeading
            eyebrow="Current engineering focus"
            title="One platform. Three connected systems tracks."
            description="The runtime, retrieval, and performance work share a single operating constraint: useful AI should be inspectable, measurable, and practical on local hardware."
          />
          <ArchitectureDiagram />
        </section>

        <section className="section projects-section" id="projects">
          <div className="page-shell">
            <SectionHeading
              eyebrow="Flagship work"
              title="Engineering evidence before marketing claims."
              description="Implementation, testing, benchmarking, documentation, and deployment are separate states. Each project shows only what its repository currently supports."
            />
            <div className="project-stack">
              {flagshipProjects.map((project) => <ProjectCard project={project} key={project.number} />)}
            </div>
          </div>
        </section>

        <section className="section page-shell methodology-section" id="method">
          <SectionHeading
            eyebrow="Engineering method"
            title="“It works” is the beginning of the investigation."
            description="Changes earn their place through a repeatable loop, with failed experiments and accepted tradeoffs kept visible."
          />
          <ol className="method-flow" aria-label="Engineering methodology">
            {methodology.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <div className="questions-grid">
            {['How fast?', 'How much RAM / VRAM?', 'What fails?', 'What happens under concurrency?', 'Can it be reproduced?', 'What tradeoff was accepted?'].map((question) => (
              <div key={question}><span aria-hidden="true">?</span>{question}</div>
            ))}
          </div>
        </section>

        <section className="section experience-section" id="experience">
          <div className="page-shell split-heading">
            <SectionHeading
              eyebrow="Experience"
              title="Real-time systems became the foundation for local AI infrastructure."
            />
            <p className="section-sidecopy">
              Graphics and game work taught the same habits local inference demands: explicit resources, tight feedback loops, profiling, debugging, and respect for hardware limits.
            </p>
          </div>

          <div className="page-shell timeline">
            {experience.map((item, index) => (
              <article className="timeline-item" key={item.organization}>
                <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
                <div className="timeline-content">
                  <p className="timeline-period">{item.period}</p>
                  <h3>{item.organization}</h3>
                  <h4>{item.role}</h4>
                  <p>{item.description}</p>
                  <div className="tag-list">
                    {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section page-shell foundation-section" id="foundation">
          <SectionHeading
            eyebrow="Systems & graphics foundation"
            title="Previous work, reframed by what it proves."
            description="These projects are lower in the hierarchy, but they remain useful evidence of low-level C++, real-time constraints, and resource ownership."
          />
          <div className="foundation-grid">
            {foundationProjects.map((project) => (
              <article key={project.title}>
                <div className="foundation-icon" aria-hidden="true"><span /></div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <a href={project.href} target="_blank" rel="noreferrer">View source evidence <ArrowIcon /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="section skills-section" id="skills">
          <div className="page-shell">
            <SectionHeading
              eyebrow="Capabilities"
              title="Skills grouped by engineering domain, not percentages."
              description="The emphasis is on systems that can be explained, profiled, tested, and maintained."
            />
            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <article key={group.title}>
                  <span className="skill-number">0{index + 1}</span>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section page-shell education-section" id="education">
          <div className="education-column">
            <SectionHeading eyebrow="Education" title="Current study and technical foundation." />
            <div className="education-list">
              {education.map((item) => (
                <article className={item.primary ? 'education-primary' : ''} key={item.institution}>
                  <div className="education-year">{item.period}</div>
                  <div>
                    <h3>{item.institution}</h3>
                    <p>{item.credential}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="recognition"><span aria-hidden="true">✦</span>{recognition}</p>
          </div>

          <div className="certification-column">
            <SectionHeading eyebrow="Recent learning" title="Certifications" />
            <div className="certification-list">
              {certifications.map((certificate) => (
                <article key={certificate.title}>
                  <div>
                    <p>{certificate.issuer}</p>
                    <h3>{certificate.title}</h3>
                  </div>
                  <time>{certificate.date}</time>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="page-shell contact-card">
            <div>
              <p className="section-eyebrow">Let’s build useful systems</p>
              <h2>Interested in local AI, retrieval, or performance engineering?</h2>
              <p>I’m looking for opportunities where careful systems work matters—from C++ and infrastructure to evaluation and AI/ML engineering.</p>
            </div>
            <div className="contact-actions">
              <a className="button button-light" href={`mailto:${profile.email}`}>Email Kunal <span aria-hidden="true">↗</span></a>
              <div>
                <a href={profile.github} target="_blank" rel="noreferrer"><GitHubIcon /><span>GitHub</span></a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon /><span>LinkedIn</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-grid">
          <div>
            <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true">KV</span><span>Kunal Vaghani</span></a>
            <p>Software engineering · AI/ML systems · Local-first by design</p>
          </div>
          <div className="footer-links">
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href="/kunalos">Legacy KunalOS <ArrowIcon /></a>
          </div>
          <p className="footer-note">Built as a lightweight Next.js portfolio. No hosted AI endpoint required.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
