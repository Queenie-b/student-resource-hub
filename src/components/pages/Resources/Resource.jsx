import './Resource.css'
import { Search, FileText, BookOpen, Video, Eye, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'




const categories = [
    "All",
    "Textbook",
    "Questions",
    "Videos",
    "Notes",
];

function Resource ({resources, savedResourceIds = [], onToggleSave = () => {}}) {

    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get('search') || '');
    const [activeCategory, setActiveCategory] = useState("All");
    const [viewingNote, setViewingNote] = useState(null);

    const filteredResources =  resources.filter((resource) => {
        const matchesSearch = 
            [resource.title, resource.subject, resource.category, resource.description, resource.content]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory = 
            activeCategory === "All" ||
            resource.category === activeCategory;

        return matchesCategory && matchesSearch;
    });

    function getResourceIcon(resource) {
        if (resource.category === "Videos") {
            return <Video/>
        }

        if (resource.category === "Textbook") {
            return <BookOpen/>
        }

        return <FileText/>
    }


  return (
    <main className="resources-page page-fade">
        <div className="resources-heading">
            <div>
                <h1>Resources</h1>
                <p>Browse your resources</p>
            </div> 
        </div>

        <div className="resources-search">
            <Search className='search-res'/>
            <input 
                type="text"
                placeholder='Search Resources'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
        </div>

        <div className="resource-categories">
            {categories.map((category) => (
                <button
                    key={category}
                    className={
                        activeCategory === category ? "active" : ""
                    }
                    onClick={() => setActiveCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>

        <div className="resources-list">
            <div className="resources-list-header">
                <h2>Available Resources</h2>
                <span>{filteredResources.length} resources</span>
            </div>

            {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                    <div className="resource-item" key={resource.id}>
                        <div className="resource-icon">
                            {getResourceIcon(resource)}
                        </div>

                        <div className="resource-info">
                            <h3>{resource.title}</h3>
                            <p>
                                {resource.subject} • {resource.category}
                            </p>
                        </div>

                        <div className="resource-meta">
                            <span>{resource.format}</span>
                        </div>

                        <div className="resource-file">
                            {resource.isNote ? (
                                <button type="button" aria-label={`Read ${resource.title}`} onClick={() => setViewingNote(resource)}>
                                    <Eye className='resource-file-download'/>
                                </button>
                            ) : (
                                <a href={resource.file} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.title}`}>
                                    <Eye className='resource-file-download'/>
                                </a>
                            )}
                        </div>

                        <button
                            type="button"
                            className={`save-resource ${savedResourceIds.includes(resource.id) ? 'saved' : ''}`}
                            title={savedResourceIds.includes(resource.id) ? 'Remove saved resource' : 'Save resource'}
                            aria-label={savedResourceIds.includes(resource.id) ? 'Remove saved resource' : 'Save resource'}
                            aria-pressed={savedResourceIds.includes(resource.id)}
                            onClick={() => onToggleSave(resource.id)}
                        ><Bookmark /></button>
                    </div>
                )) 
            ) : (
                <div className="empty-resources">
                    <BookOpen/>
                    <h3>No resources found</h3>
                    <p>Try another search or category</p>
                </div>
            )}
        </div>

        {viewingNote && (
            <div className="published-note-overlay" role="presentation" onMouseDown={event => {
                if (event.target === event.currentTarget) setViewingNote(null);
            }}>
                <article className="published-note-dialog" role="dialog" aria-modal="true" aria-labelledby="published-note-title">
                    <button className="published-note-close" type="button" onClick={() => setViewingNote(null)} aria-label="Close note">×</button>
                    <p>{viewingNote.subject}{viewingNote.noteCategory ? ` · ${viewingNote.noteCategory}` : ''}</p>
                    <h2 id="published-note-title">{viewingNote.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: viewingNote.content }} />
                </article>
            </div>
        )}
    </main>
  );
}

export default Resource
