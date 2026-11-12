import './Resource.css'
import { Search, FileText, BookOpen, Video, Eye, Bookmark } from 'lucide-react'
import { useState } from 'react'




const categories = [
    "All",
    "Textbook",
    "Questions",
    "Videos",
    "Notes",
];

function Resource ({resources}) {

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredResources =  resources.filter((resource) => {
        const matchesSearch = 
            resource.title.toLowerCase().includes(search.toLowerCase()) ||
            resource.subject.toLowerCase().includes(search.toLowerCase());

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
                            <a href={resource.file} target="_blank" rel="noopener noreferrer">
                                <Eye className='resource-file-download'/>
                            </a>
                        </div>

                        <div className="save-resource" title='Save resource'onClick={() => onTogglesave(resource)}>
                            <Bookmark/>
                        </div>
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

    </main>
  );
}

export default Resource
