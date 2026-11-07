import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, FileText, Search, Video } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import './Home.css'

const resources = [
  { title: 'Research paper essentials', type: 'Templates', detail: 'A clear structure for your next research project.', icon: FileText },
  { title: 'Exam preparation workshop', type: 'Videos', detail: 'Build a revision plan and feel ready for exam day.', icon: Video },
]

const Home = () => {
  const [query, setQuery] = useState('')
  const visibleResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return resources
    return resources.filter(({ title, type, detail }) =>
      `${title} ${type} ${detail}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  return (
    <main className="home-page page-fade">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">STUDENT RESOURCE HUB</p>
          <h1 id="home-title">Make your next<br />big idea happen.</h1>
          <p className="hero-description">Find study guides, scholarships, templates, and people to help you move forward.</p>
          <Link className="hero-cta" to="/resources">Explore resources <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-note"><BookOpen size={32} /><span>Small steps.<br />Big progress.</span></div>
          <div className="art-sparkle sparkle-one">✦</div>
          <div className="art-sparkle sparkle-two">✳</div>
        </div>
      </section>

      <section className="resource-section" id="resources" aria-labelledby="resources-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A GOOD PLACE TO START</p>
            <h2 id="resources-title">Explore resources</h2>
          </div>
          <label className="resource-search">
            <Search size={19} aria-hidden="true" />
            <span className="visually-hidden">Search resources</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources" />
          </label>
        </div>

        {visibleResources.length > 0 ? (
          <div className="resource-grid">
            {visibleResources.map(({ title, type, detail, icon: Icon }) => (
              <article className="resource-card" key={title}>
                <div className="resource-icon"><Icon size={22} aria-hidden="true" /></div>
                <p className="resource-type">{type}</p>
                <h3>{title}</h3>
                <p className="resource-detail">{detail}</p>
                <NavLink className="link-to-resources" to="/resources">
                  Explore <ArrowRight size={16} aria-hidden="true" />
                </NavLink>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-search">No resources match “{query}”. Try another search.</p>
        )}
      </section>
    </main>
  )
}

export default Home
