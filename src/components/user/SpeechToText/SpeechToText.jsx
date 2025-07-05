import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../Layouts/Layout/Layout';
import AuthService from '../../../services/AuthService';

const SpeechToText = () => {

    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fileData, setFileData] = useState([]);

    useEffect(() => {
        fetchSTTList();
    }, []);

    const fetchSTTList = async () => {
        try {

            const response = await AuthService.getSTTList();
            console.log(response.data.data);
            setFileData(response.data.data);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setErrors({});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData();
        formData.append('audio', file);

        try {

            const response = await AuthService.speechToText(formData);
            const data = response.data;
            console.log(data)
            setLoading(false);
            alert(data.msg);
            if (data.success) {
                
                setFileData((fileData) => [...fileData, data.data]);

                e.target.reset();
                setFile(null);
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

    const handleDelete = async (textId) => {

        if (!window.confirm("Are you sure you want to delete this text?")) return;

        try {

            const formData = {
                id: textId
            }
            // alert(textId)
            const response = await AuthService.deleteSTT(formData);
            const data = response.data;
            if (data.success) {
                setFileData((fileData) => fileData.filter((text) => text._id !== textId));
            }
            else {
                alert(data.msg);
            }

        }
        catch (error) {
            alert(error.message);
        }

    }

    return (
        <Layout>
            <h3 className="mb-4">
                Speech to Text
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="card p-4">
                    <div className="mb-3">
                        <label >Upload Speech Audio File:</label>
                        <input
                            type="file"
                            className='form-control'
                            accept="audio/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    {errors.audio && <div className='errorMessage'>{errors.audio}</div>}
                    <button type='submit' className='btn btn-primary' disabled={loading}>
                        {loading ? (
                            <div className="spinner-border"></div>
                        ) : (
                            <span>Convert</span>
                        )}
                    </button>
                </div>
            </form>

            {/* display data */}
            {fileData.length > 0 && (
                <div className="card mt-4">
                    <h5>Uploaded Files</h5>
                    <table className='table table-bordered mt-3'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>File</th>
                                <th>Converted Text</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fileData.map((file, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <audio controls>
                                            <source src={file.fullUrl} type="audio/mp3" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </td>
                                    <td>{file.text}</td>
                                    <td>
                                        <button className='btn btn-danger btn-sm'
                                            onClick={() => handleDelete(file._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );

};

export default SpeechToText;