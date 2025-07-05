import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../Layouts/Layout/Layout';
import AuthService from '../../../services/AuthService';

const ImageRecognition = () => {

    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [imageRecognition, setImageRecognition] = useState([]);

    useEffect(() => {
        fetchImageRecognition();
    }, []);

    const fetchImageRecognition = async () => {
        try {

            const response = await AuthService.getImageRecognition();
            // console.log(response.data.data);
            setImageRecognition(response.data.data);
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
        formData.append('image', file);

        try {

            const response = await AuthService.imageRecognition(formData);
            const data = response.data;
            console.log(data)
            setLoading(false);
            alert(data.msg);
            if (data.success) {
                
                setImageRecognition((imgRecognitions) => [...imgRecognitions, data.data]);

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

    const handleDelete = async (imrId) => {
    
            if (!window.confirm("Are you sure you want to delete the Data?")) return;
    
            try {
    
                const formData = {
                    id: imrId
                }
                // alert(textId)
                const response = await AuthService.deleteImageRecognition(formData);
                const data = response.data;
                if (data.success) {
                    setImageRecognition((fileData) => fileData.filter((text) => text._id !== imrId));
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
                Image Recognition
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="card p-4">
                    <div className="mb-3">
                        <label >Upload Image File:</label>
                        <input
                            type="file"
                            className='form-control'
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    {errors.image && <div className='errorMessage'>{errors.image}</div>}
                    <button type='submit' className='btn btn-primary' disabled={loading}>
                        {loading ? (
                            <div className="spinner-border"></div>
                        ) : (
                            <span>Submit</span>
                        )}
                    </button>
                </div>
            </form>

            {/* display data */}
            {imageRecognition.length > 0 && (
                <div className="card mt-4">
                    <h5>Uploaded Files</h5>
                    <table className='table table-bordered mt-3'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Text</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {imageRecognition.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={data.image} alt="" width={70} />
                                    </td>
                                    <td>{data.ai_message}</td>
                                    <td>
                                        <button className='btn btn-danger btn-sm'
                                        onClick={() => handleDelete(data._id)}>Delete</button>
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

export default ImageRecognition;