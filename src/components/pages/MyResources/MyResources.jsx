
import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { FileText, BookOpen, Video, Eye, Pencil, Trash2, Bookmark, X } from 'lucide-react';
import './MyResources.css';

function EditNoteModal({ note, onClose, onSave }) {
    const [title, setTitle] = useState(note.title);
    const [subject, setSubject] = useState(note.subject);
    const [category, setCategory] = useState(note.noteCategory || '');
    const editor = useEditor({
        extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
        content: note.content || '',
        editorProps: { attributes: { class: 'edit-note-content', 'aria-label': 'Edit note content' } },
    });

    function handleSubmit(event) {
        event.preventDefault();
        if (!editor || !title.trim() || !subject || !editor.getText().trim()) return;
        onSave({
            title: title.trim(),
            subject,
            noteCategory: category,
            content: editor.getHTML(),
            description: editor.getHTML(),
        });
    }

    return (
        <div className="edit-resource-overlay" role="presentation" onMouseDown={event => {
            if (event.target === event.currentTarget) onClose();
        }}>
            <form className="edit-note-form" onSubmit={handleSubmit}>
                <div className="edit-resource-header">
                    <h2>Edit Note</h2>
                    <button type="button" onClick={onClose} aria-label="Close editor"><X /></button>
                </div>
                <label htmlFor="edit-note-title">Title</label>
                <input id="edit-note-title" value={title} onChange={event => setTitle(event.target.value)} required />
                <div className="edit-note-fields">
                    <div><label htmlFor="edit-note-subject">Subject</label><input id="edit-note-subject" value={subject} onChange={event => setSubject(event.target.value)} required /></div>
                    <div>
                        <label htmlFor="edit-note-category">Category</label>
                        <select id="edit-note-category" value={category} onChange={event => setCategory(event.target.value)}>
                            <option value="">No category</option>
                            <option value="Lecture Notes">Lecture notes</option>
                            <option value="Revision">Revision</option>
                            <option value="Study Guide">Study guide</option>
                        </select>
                    </div>
                </div>
                <label>Note content</label>
                <div className="edit-note-editor">{editor ? <EditorContent editor={editor} /> : <p>Loading editor…</p>}</div>
                <div className="edit-resource-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit" disabled={!editor}>Save Changes</button>
                </div>
            </form>
        </div>
    );
}

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
    const [editingNote, setEditingNote] = useState(null);
    const [viewingNote, setViewingNote] = useState(null);

    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        subject: '',
        category: ''
    });

    const ownedResources = resources.filter(
        resource => resource.ownerId === (currentUser?.id ?? 'guest')
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
                                    {resource.subject} • {resource.isNote && resource.noteCategory ? resource.noteCategory : resource.category}
                                </p>
                            </div>

                            <div className="my-resource-meta">
                                <span>{resource.format}</span>
                            </div>

                            <div className="my-resource-view">
                                {resource.isNote ? (
                                    <button type="button" onClick={() => setViewingNote(resource)} aria-label={`View ${resource.title}`}>
                                        <Eye />
                                    </button>
                                ) : (
                                    <a href={resource.file} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.title}`}>
                                        <Eye />
                                    </a>
                                )}
                            </div>

                            {activeTab === 'owned' ? (

                                <div className="my-resource-actions">

                                    {resource.isNote ? (
                                        <button type="button" onClick={() => setEditingNote(resource)} title="Edit note" aria-label={`Edit ${resource.title}`}>
                                            <Pencil />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(resource)}
                                            title="Edit resource"
                                        >
                                            <Pencil />
                                        </button>
                                    )}

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

            {viewingNote && (
                <div className="edit-resource-overlay" role="presentation" onMouseDown={event => {
                    if (event.target === event.currentTarget) setViewingNote(null);
                }}>
                    <section className="note-preview" role="dialog" aria-modal="true" aria-labelledby="note-preview-title">
                        <div className="edit-resource-header">
                            <div>
                                <p>{viewingNote.subject}{viewingNote.noteCategory ? ` · ${viewingNote.noteCategory}` : ''}</p>
                                <h2 id="note-preview-title">{viewingNote.title}</h2>
                            </div>
                            <button type="button" onClick={() => setViewingNote(null)} aria-label="Close note"><X /></button>
                        </div>
                        <div className="note-preview-content" dangerouslySetInnerHTML={{ __html: viewingNote.content }} />
                    </section>
                </div>
            )}

            {editingNote && (
                <EditNoteModal
                    note={editingNote}
                    onClose={() => setEditingNote(null)}
                    onSave={updates => {
                        onUpdateResource(editingNote.id, updates);
                        setEditingNote(null);
                    }}
                />
            )}

        </main>
    );
}

export default MyResources;
