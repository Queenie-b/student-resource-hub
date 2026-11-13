import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { BookOpen, Eye, Pencil, Plus, Send, X } from 'lucide-react';
import './AddNote.css';

function AddNote({ notes = [], onAddNote, onUpdateNote, onPublishNote }) {
    const [creatingNote, setCreatingNote] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [viewingNote, setViewingNote] = useState(null);
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [savedMessage, setSavedMessage] = useState('');
    const [isEditorEmpty, setIsEditorEmpty] = useState(true);

    const editor = useEditor({
        extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
        content: '',
        onUpdate: ({ editor: updatedEditor }) => setIsEditorEmpty(updatedEditor.isEmpty),
        editorProps: {
            attributes: {
                class: 'note-editor',
                id: 'note-content',
                'aria-label': 'Note content',
            },
        },
    });

    function resetComposer() {
        setTitle('');
        setSubject('');
        setCategory('');
        setSavedMessage('');
        setEditingNoteId(null);
        editor?.commands.clearContent();
        setIsEditorEmpty(true);
    }

    function startEditing(note) {
        setTitle(note.title);
        setSubject(note.subject);
        setCategory(note.category || '');
        setSavedMessage('');
        setEditingNoteId(note.id);
        editor?.commands.setContent(note.content || '');
        setIsEditorEmpty(!note.content || !note.content.replace(/<[^>]*>/g, '').trim());
        setCreatingNote(true);
    }

    function handleSave(event) {
        event.preventDefault();
        const contentText = editor?.getText().trim();
        if (!title.trim() || !subject || !contentText) {
            setSavedMessage('Add a title, choose a subject, and write some note content before saving.');
            return;
        }

        const noteUpdates = {
            title: title.trim(),
            subject,
            category,
            content: editor.getHTML(),
        };
        if (editingNoteId !== null) {
            onUpdateNote(editingNoteId, noteUpdates);
        } else {
            onAddNote({ ...noteUpdates, createdAt: new Date().toISOString() });
        }
        resetComposer();
        setCreatingNote(false);
    }

    if (!creatingNote) {
        return (
            <main className="add-note-page">
                <header className="add-note-heading note-list-heading">
                    <div>
                        <p className="add-note-eyebrow">YOUR STUDY SPACE</p>
                        <h1>My Notes</h1>
                        <p>View and edit your notes before publishing them to the shared resources.</p>
                    </div>
                    <button className="new-note-button" type="button" onClick={() => { setSavedMessage(''); setCreatingNote(true); }}>
                        <Plus size={18} /> Add new note
                    </button>
                </header>

                {notes.length ? (
                    <section className="notes-list" aria-label="My notes">
                        {notes.map(note => (
                            <article className="note-list-card" key={note.id}>
                                <div className="note-list-icon"><BookOpen size={21} /></div>
                                <div className="note-list-info">
                                    <h2>{note.title}</h2>
                                    <p>{note.subject}{note.category ? ` · ${note.category}` : ''}</p>
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="note-list-actions">
                                    <button className="note-view-button" type="button" onClick={() => setViewingNote(note)}><Eye size={16} /> View</button>
                                    {!note.published && <button className="note-edit-button" type="button" onClick={() => startEditing(note)}><Pencil size={15} /> Edit</button>}
                                    {note.published ? (
                                        <span className="note-published-badge">Published</span>
                                    ) : (
                                        <button className="publish-note-button" type="button" onClick={() => onPublishNote(note.id)}>
                                            <Send size={16} /> Publish
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="notes-empty-state">
                        <BookOpen size={34} />
                        <h2>No notes yet</h2>
                        <p>Create your first note, then publish it to share it with everyone.</p>
                        <button className="new-note-button" type="button" onClick={() => setCreatingNote(true)}>
                            <Plus size={18} /> Add new note
                        </button>
                    </section>
                )}
                {viewingNote && (
                    <div className="note-view-overlay" role="presentation" onMouseDown={event => {
                        if (event.target === event.currentTarget) setViewingNote(null);
                    }}>
                        <article className="note-view-dialog" role="dialog" aria-modal="true" aria-labelledby="note-view-title">
                            <button className="note-view-close" type="button" onClick={() => setViewingNote(null)} aria-label="Close note"><X /></button>
                            <p>{viewingNote.subject}{viewingNote.category ? ` · ${viewingNote.category}` : ''}</p>
                            <h2 id="note-view-title">{viewingNote.title}</h2>
                            <div className="note-view-content" dangerouslySetInnerHTML={{ __html: viewingNote.content }} />
                            {viewingNote.published && <span className="note-published-badge">Published</span>}
                        </article>
                    </div>
                )}
            </main>
        );
    }

    return (
        <main className="add-note-page">
            <header className="add-note-heading">
                <p className="add-note-eyebrow">YOUR STUDY SPACE</p>
                <h1>{editingNoteId !== null ? 'Edit your note' : 'Create a note'}</h1>
                <p>Capture ideas, class notes, and revision points in one place.</p>
            </header>

            <form className="note-form" onSubmit={handleSave}>
                <div className="note-details-grid">
                    <div className="note-field note-title-field">
                        <label htmlFor="note-title">Note title</label>
                        <input id="note-title" name="title" type="text" placeholder="e.g. Week 3: Cell Biology" value={title} onChange={event => setTitle(event.target.value)} required />
                    </div>
                    <div className="note-field">
                        <label htmlFor="note-subject">Subject</label>
                        <select id="note-subject" name="subject" value={subject} onChange={event => setSubject(event.target.value)} required>
                            <option value="" disabled>Select a subject</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="note-field">
                        <label htmlFor="note-category">Category <span>(optional)</span></label>
                        <select id="note-category" name="category" value={category} onChange={event => setCategory(event.target.value)}>
                            <option value="">Choose a category</option>
                            <option value="Lecture Notes">Lecture notes</option>
                            <option value="Revision">Revision</option>
                            <option value="Study Guide">Study guide</option>
                        </select>
                    </div>
                </div>

                <div className="note-field">
                    <label htmlFor="note-content">Note content</label>
                    <section className="editor-container" aria-label="Note editor">
                        {editor ? (
                            <>
                                <div className="editor-toolbar" role="toolbar" aria-label="Text formatting">
                                    <button type="button" aria-label="Bold" aria-pressed={editor.isActive('bold')} className={editor.isActive('bold') ? 'active' : ''} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
                                    <button type="button" aria-label="Italic" aria-pressed={editor.isActive('italic')} className={editor.isActive('italic') ? 'active' : ''} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
                                    <button type="button" aria-label="Strikethrough" aria-pressed={editor.isActive('strike')} className={editor.isActive('strike') ? 'active' : ''} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
                                    <span className="toolbar-divider" aria-hidden="true" />
                                    <button type="button" aria-label="Bulleted list" aria-pressed={editor.isActive('bulletList')} className={editor.isActive('bulletList') ? 'active' : ''} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                                    <button type="button" aria-label="Numbered list" aria-pressed={editor.isActive('orderedList')} className={editor.isActive('orderedList') ? 'active' : ''} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
                                    <span className="toolbar-divider" aria-hidden="true" />
                                    <button type="button" onClick={() => editor.chain().focus().undo().run()}>Undo</button>
                                    <button type="button" onClick={() => editor.chain().focus().redo().run()}>Redo</button>
                                </div>
                                <div className="editor-writing-area">
                                    <EditorContent editor={editor} />
                                    {isEditorEmpty && <span className="editor-placeholder" aria-hidden="true">Start writing your note here…</span>}
                                </div>
                            </>
                        ) : <div className="editor-loading">Preparing your editor…</div>}
                    </section>
                </div>

                <div className="note-form-footer">
                    <p className="note-save-message" role="status" aria-live="polite">{savedMessage}</p>
                    <div className="note-composer-actions">
                        <button className="cancel-note-button" type="button" onClick={() => { resetComposer(); setCreatingNote(false); }}>Cancel</button>
                        <button className="save-note-button" type="submit">{editingNoteId !== null ? 'Save changes' : 'Save note'}</button>
                    </div>
                </div>
            </form>
        </main>
    );
}

export default AddNote;
