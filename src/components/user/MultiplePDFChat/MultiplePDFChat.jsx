import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../Layouts/Layout/Layout';
import AuthService from '../../../services/AuthService';
import { Link } from 'react-router-dom';
import './MultiplePDFChat.css';

const SinglePDFChat = () => {

    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pdfs, setPDFs] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    useEffect(() => {
        getPdfs();
    }, []);

    const getPdfs = async () => {
        try {

            const response = await AuthService.getMultiplePdf();
            setPDFs(response.data.data);
        }
        catch (err) {
            console.log(err.message)
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        setFiles(selectedFiles);
        setErrors({});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('pdfs', file);
        });

        try {

            const response = await AuthService.multiplePDFUpload(formData);
            const data = response.data;
            console.log(data)
            setLoading(false);
            alert(data.msg);
            if (data.success) {
                getPdfs();
                e.target.reset();
                setFiles([]);
            }
        }
        catch (error) {

            if (error.response && (error.response.status === 400 || error.response.status === 401)) {

                if (error.response.data.errors) {
                    const apiErrors = error.response.data.errors;
                    const newErrors = {};
                    apiErrors.forEach((apiError) => {
                        newErrors[apiError.path] = apiError.msg;
                    });

                    setErrors(newErrors);
                }
                else {
                    alert(error.response.data.msg ? error.response.data.msg : error.message);
                }

            }
            else {
                alert(error.message);
            }

            setLoading(false);

        }
    }

    const startEdit = (embedding) => {
        setEditingId(embedding._id);
        setEditingContent(embedding.content);
    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditingContent('');
    }

    const handleEdit = async (id) => {
        if(editingContent.trim() == ''){
            alert("Content cannot be empty!");
            return;
        }

        try{

            const formData = { id, text: editingContent };
            const response = await AuthService.updateEmbedding(formData);
            const data = response.data;
            if(data.success){
                setPDFs(prevPdfs => 
                    prevPdfs.map(pdf => ({
                        ...pdf,
                        embeddings: pdf.embeddings.map(embedding => 
                            embedding._id === id
                            ? { ...embedding, content: editingContent }
                            : embedding
                        )
                    }))
                );
                cancelEdit();
            }
            else{
                alert("Failed to update embedding: "+ data.msg);
            }

        }
        catch (err) {
            console.log(err.message);
            alert(err.message);
        }
    }

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete the embedding?")) return;

        try{

            const formData = { id, is_pdf: 0 };
            const response = await AuthService.deleteEmbedding(formData);
            const data = response.data;
            if(data.success){
                setPDFs(prevPdfs => 
                    prevPdfs.map(pdf => ({
                        ...pdf,
                        embeddings: pdf.embeddings.filter(embedding => embedding._id !== id)
                    })).filter(pdf => pdf.embeddings.length > 0)
                );
            }
            else{
                alert("Failed to delete embedding: "+ data.msg);
            }

        }
        catch (err) {
            console.log(err.message);
            alert(err.message);
        }
    }

    return (
        <Layout>
            <h3 className="mb-4">
                Multiple PDF Chat
                <Link className='btn btn-primary text-white chat-btn' to={'/chat-with-pdfs'}>
                    Chat with PDFs
                </Link>
            </h3>

            <div className="row">
                <div className="col-sm-12">
                    <form onSubmit={handleSubmit}>
                        <div className="card p-4">
                            <div className="mb-3">
                                <label >Upload PDF Files:</label>
                                <input
                                    type="file"
                                    className='form-control'
                                    accept="application/pdf"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            {errors.pdf && <div className='errorMessage'>{errors.pdf}</div>}
                            <button type='submit' className='btn btn-primary' disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border"></div>
                                ) : (
                                    <span>Submit</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">PDF</th>
                        <th scope="col">Content</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pdfs.length > 0 ? (
                        pdfs.map((pdf, index) => (
                            pdf.embeddings.map((embedding, idx) => (
                                <tr key={embedding._id}>
                                    <th scope="row">{index+1}.{idx+1}</th>
                                    <td><a href={pdf.fullUrl}>View PDF</a></td>
                                    <td>
                                        {editingId === embedding._id?(
                                            <textarea 
                                            className='form-control'
                                            rows="3"
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            >
                                            </textarea>
                                        ):(
                                            embedding.content
                                        )}
                                    </td>
                                    <td>
                                        {editingId === embedding._id ? (
                                            <>
                                                <button className='btn btn-success btn-sm' onClick={() => handleEdit(embedding._id)}>Save</button>
                                                <button className='btn btn-secondary btn-sm' onClick={() => cancelEdit()}>Cancel</button>
                                            </>
                                        ):(
                                            <>
                                                <button className='btn btn-warning btn-sm' onClick={() => startEdit(embedding)}>Edit</button>
                                                <button className='btn btn-danger btn-sm' onClick={() => handleDelete(embedding._id)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No PDFs avilable!</td>
                        </tr>
                    )}
                </tbody>
            </table >

        </Layout >
    );

};

export default SinglePDFChat;