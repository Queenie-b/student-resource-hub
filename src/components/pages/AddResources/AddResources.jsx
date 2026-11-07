import React, { useState } from 'react';
import './AddResources.css';
import { useNavigate } from 'react-router-dom';

function AddResources ({onAddResource}) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        category: '',
        format: '',
        link: '',
        file: null
    });

    const [sourceType, setSourceType] = useState('upload');

    function handleChange(e) {
        const {name, value} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const extension = selectedFile.name
                .split('.')
                .pop()
                .toUpperCase();

            setFormData(prev => ({
                ...prev,
                file: selectedFile,
                format: extension
            }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        const resourceFile = sourceType === 'upload'
        ? URL.createObjectURL(formData.file)
        : formData.link.trim();

        const newResource = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            subject: formData.subject,
            category: formData.category,
            format: formData.format,
            file: resourceFile,
            fileObject: sourceType === 'upload' ? formData.file : null
        };

        onAddResource(newResource);

        navigate('/resources');

    }

    return(
        <main className='add-resources-page page-fade'>
            <div className='add-resources-heading'>
                <h1>Add a Resource</h1>
                <p>Donate to the community</p>
            </div>

            <form action="" className="add-resource-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Resource Title *</label>
                    <input type="text"
                        id='title'
                        name='title'
                        placeholder='Enter Title'
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description"></label>
                    <textarea
                         name="description" 
                         id="description"
                         placeholder='Describe your resource (optional)'
                         value={formData.description}
                         onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="subject">Subject *</label>
                        <select name="subject" id="subject" value={formData.subject} onChange={handleChange} required>
                            <option value="">Select subject</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="English">English</option>
                            <option value="Economics">Economics</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="Category">Category *</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select category</option>
                            <option value="Textbook">Textbook</option>
                            <option value="Questions">Questions</option>
                            <option value="Videos">Videos</option>
                            <option value="Notes">Notes</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="format">Resource Type *</label>
                        <select
                            id="format"
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select resource type</option>
                            <option value="PDF">PDF</option>
                            <option value="MP4">MP4</option>
                            <option value="DOCX">DOCX</option>
                            <option value="PPTX">PPTX</option>
                            <option value="PPT">PPT</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="source-options">
                        <button
                            type="button"
                            className={sourceType === 'upload' ? 'active' : ''}
                            onClick={() => setSourceType('upload')}
                        >
                            Upload File
                        </button>

                        <button
                            type="button"
                            className={sourceType === 'link' ? 'active' : ''}
                            onClick={() => setSourceType('link')}
                        >
                            Add Link
                        </button>
                    </div>

                </div>

                {sourceType === 'upload' ? (

                    <div className="form-group">
                        <label htmlFor="resource-file">Choose File *</label>
                        <input
                            type="file"
                            id="resource-file"
                            onChange={handleFileChange}
                            required
                        />

                        {formData.file && (
                            <p className="selected-file">
                                Selected: {formData.file.name}
                            </p>
                        )}
                    </div>

                ) : (

                    <div className="form-group">
                        <label htmlFor="link">Resource URL *</label>
                        <input
                            type="url"
                            id="link"
                            name="link"
                            placeholder="https://example.com/resource"
                            value={formData.link}
                            onChange={handleChange}
                            required
                        />
                    </div>

                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/resources')}
                    >
                        Cancel
                    </button>

                    <button type="submit" className="submit-btn" onSubmit={handleSubmit}>
                        Add Resource
                    </button>
                </div>

            </form>
            
        </main>
    );
}

export default AddResources