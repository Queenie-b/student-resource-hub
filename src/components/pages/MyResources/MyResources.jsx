
import { useState } from 'react';
import { FileText, BookOpen, Video, Eye, Pencil, Trash2, Bookmark, X } from 'lucide-react';
import './MyResources.css';

function MyResources({
    resources,
    savedResourceIds,
    currentUser,
    onToggleSave,
    onUpdateResource,
    onDeleteResource
}) {

    const [activeTab, setActiveTab] = useState('owned');
    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        subject: '',
        category: ''
    });

    const ownedResources = resources.filter(
        resource => resource.ownerId === currentUser
    );

    const savedResources = resources.filter(
        resource => savedResourceIds.includes(resource.id)
    );

    const displayedResources = activeTab === 'owned'
        ? ownedResources
        : savedResources;

    function getResourceIcon(resource) {
        if (resource.category === 'Videos') {
            return <Video />;
        }

        if (resource.category === 'Textbook') {
            return <BookOpen />;
        }

        return <FileText />;
    }

    function handleEdit(resource) {
        setEditingId(resource.id);

        setEditForm({
            title: resource.title,
            description: resource.description || '',
            subject: resource.subject,
            category: resource.category
        });
    }

    function handleEditChange(e) {
        const { name, value } = e.target;

        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleUpdate(e) {
        e.preventDefault();

        onUpdateResource(editingId, editForm);
        setEditingId(null);
    }

    function handleDelete(id) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this resource?'
        );

        if (confirmed) {
            onDeleteResource(id);
        }
    }

    return (
        <main className="my-resources-page page-fade">

            <div className="my-resources-heading">
                <div>
                    <h1>My Resources</h1>
                    <p>Manage your resources</p>
                </div>
            </div>

            <div className="my-resources-tabs">

                <button
                    className={activeTab === 'owned' ? 'active' : ''}
                    onClick={() => {
                        setActiveTab('owned');
                        setEditingId(null);
                    }}
                >
                    Owned
                    <span>{ownedResources.length}</span>
                </button>

                <button
                    className={activeTab === 'saved' ? 'active' : ''}
                    onClick={() => {
                        setActiveTab('saved');
                        setEditingId(null);
                    }}
                >
                    Saved
                    <span>{savedResources.length}</span>
                </button>

            </div>

            <section className="my-resources-list">

                <div className="my-resources-list-header">
                    <h2>
                        {activeTab === 'owned'
                            ? 'Owned Resources'
                            : 'Saved Resources'}
                    </h2>

                    <span>
                        {displayedResources.length} resources
                    </span>
                </div>

                {displayedResources.length > 0 ? (

                    displayedResources.map(resource => (

                        <div className="my-resource-item" key={resource.id}>

                            <div className="my-resource-icon">
                                {getResourceIcon(resource)}
                            </div>

                            <div className="my-resource-info">
                                <h3>{resource.title}</h3>

                                <p>
                                    {resource.subject} • {resource.category}
                                </p>
                            </div>

                            <div className="my-resource-meta">
                                <span>{resource.format}</span>
                            </div>

                            <div className="my-resource-view">
                                <a
                                    href={resource.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Eye />
                                </a>
                            </div>

                            {activeTab === 'owned' ? (

                                <div className="my-resource-actions">

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(resource)}
                                        title="Edit resource"
                                    >
                                        <Pencil />
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-resource"
                                        onClick={() => handleDelete(resource.id)}
                                        title="Delete resource"
                                    >
                                        <Trash2 />
                                    </button>

                                </div>

                            ) : (

                                <button
                                    type="button"
                                    className="remove-saved"
                                    onClick={() => onToggleSave(resource.id)}
                                    title="Remove from saved"
                                >
                                    <Bookmark />
                                </button>

                            )}

                        </div>

                    ))

                ) : (

                    <div className="empty-my-resources">
                        <BookOpen />

                        <h3>
                            {activeTab === 'owned'
                                ? 'No resources yet'
                                : 'No saved resources'}
                        </h3>

                        <p>
                            {activeTab === 'owned'
                                ? 'Resources you add will appear here.'
                                : 'Resources you bookmark will appear here.'}
                        </p>
                    </div>

                )}

            </section>

            {editingId !== null && (

                <div className="edit-resource-overlay">

                    <form
                        className="edit-resource-form"
                        onSubmit={handleUpdate}
                    >

                        <div className="edit-resource-header">
                            <h2>Edit Resource</h2>

                            <button
                                type="button"
                                onClick={() => setEditingId(null)}
                            >
                                <X />
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-title">Title *</label>

                            <input
                                id="edit-title"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-description">
                                Description
                            </label>

                            <textarea
                                id="edit-description"
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-subject">Subject *</label>

                            <input
                                id="edit-subject"
                                name="subject"
                                value={editForm.subject}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-category">Category *</label>

                            <select
                                id="edit-category"
                                name="category"
                                value={editForm.category}
                                onChange={handleEditChange}
                                required
                            >
                                <option value="Textbook">Textbook</option>
                                <option value="Questions">Questions</option>
                                <option value="Videos">Videos</option>
                                <option value="Notes">Notes</option>
                            </select>
                        </div>

                        <p className="edit-resource-note">
                            The uploaded file and resource link cannot be changed.
                        </p>

                        <div className="edit-resource-actions">
                            <button
                                type="button"
                                onClick={() => setEditingId(null)}
                            >
                                Cancel
                            </button>

                            <button type="submit">
                                Save Changes
                            </button>
                        </div>

                    </form>

                </div>

            )}

        </main>
    );
}

export default MyResources;
