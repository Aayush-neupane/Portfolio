import { useMemo } from 'react'
import ContactForm from '../components/ContactForm'
import profile from '../data/profile.json'
import projects from '../data/projects.json'
import education from '../data/education.json'
import ProjectList from '../components/ProjectList'
import SocialLinks from '../components/SocialLinks'
import ToolsIndex from '../components/ToolsIndex'
import Portrait from '../components/Portrait'
import TechMarquee from '../components/TechMarquee'
import RetroMachine from '../components/RetroMachine'
import { RESUME_FILENAME, RESUME_PATH } from '../config/resume'

export default function HomePage() {
  const projectRows = useMemo(() => projects, [])

  return (
    <>
      <section id="home" className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 aria-label="Alshan Rijal" className="hero-title">
              <span className="title-plain" data-reveal="line">Alshan</span>
              <span className="title-outline" data-reveal="line">Rijal</span>
            </h1>

            <p className="eyebrow" data-reveal="fade">AI / ML + Cloud</p>

            <p className="summary" data-reveal="fade">
              Software engineer from Itahari, Nepal, building AI/ML and cloud projects with
              Python and the MERN stack.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#projects">
                View projects
              </a>
              <a className="link-button" href={RESUME_PATH} download={RESUME_FILENAME}>
                Download CV
              </a>
            </div>
          </div>

          <aside className="hero-machine" aria-label="Portfolio machine">
            <RetroMachine />
          </aside>
        </div>
      </section>

      <section id="about" className="section-block section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>Soft edges, <span className="accent-word">sharp</span> thinking.</h2>
          </div>

          <div className="about-layout">
            <Portrait className="about-portrait" />
            <div className="about-content">
              <div className="editorial-copy">
                <p>{profile.bio}</p>
              </div>
              <div className="facts-box">
                <ul>
                  <li>
                    <span>Role</span>
                    <strong>{profile.role}</strong>
                  </li>
                  <li>
                    <span>Location</span>
                    <strong>{profile.location}</strong>
                  </li>
                  <li>
                    <span>Email</span>
                    <strong>{profile.contact.email}</strong>
                  </li>
                </ul>
              </div>
              <div className="focus-tags">
                {profile.focusAreas.map((area) => (
                  <span key={area.label}>{area.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section-block section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>Skills</h2>
          </div>

          <TechMarquee />
          <ToolsIndex />
        </div>
      </section>

      <section id="projects" className="section-block">
        <div className="container">
          <div className="section-heading">
            <h2>Selected <span className="accent-word">work</span>.</h2>
          </div>

          <ProjectList projects={projectRows} />
        </div>
      </section>

      <section id="education" className="section-block">
        <div className="container">
          <div className="section-heading">
            <h2>Education</h2>
          </div>

          <ol className="timeline">
            {education.map((item) => (
              <li key={`${item.role}-${item.org}`} className="timeline-item">
                <time className="timeline-date" dateTime={item.period}>{item.period}</time>
                <div className="timeline-content">
                  <h3>{item.role}</h3>
                  <p>{item.org}</p>
                  <span>{item.description}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="section-block contact-section">
        <div className="container contact-wrap">
          <div className="contact-intro">
            <h2>Let’s build something <span className="accent-word">useful</span>.</h2>
            <a href={`mailto:${profile.contact.email}`} className="email-link">
              {profile.contact.email}
            </a>
            <SocialLinks />
          </div>

          <div className="contact-card">
            <ContactForm />
          </div>
        </div>
      </section>

    </>
  )
}
