import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../Layouts/Layout/Layout';
import AuthService from '../../../services/AuthService';
import { useParams, useNavigate } from 'react-router-dom';

const ImageGenerator = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const [botData, setBotData] = useState();

    const [size, setSize] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {

        const getBot = async () => {
            try {

                const response = await AuthService.getBot(id);
                const data = response.data;
                console.log(data);
                if (data.success) {
                    setBotData(data.data);
                }
                else {
                    navigate('/dashboard', { replace: true });
                }

            }
            catch (error) {
                console.log(error.message);
                navigate('/dashboard', { replace: true });
            }
        }

        getBot();

        const getImage = async () => {
            try {

                const response = await AuthService.getImages(id);
                const data = response.data;
                if (data.success) {
                    setImages(data.data);
                }
                else {
                    alert(data.msg)
                }

            }
            catch (error) {
                console.log(error.message);
            }
        }

        getImage();

    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData();
        formData.append('chat_bot_id', id);
        if (size) {
            formData.append('size', size);
        }
        formData.append('message', message);

        try {

            const response = await AuthService.generateImage(formData);
            const data = response.data;
            console.log(data)
            setLoading(false);
            if (data.success) {
                setSize('');
                setMessage('');
                setErrors({});

                setImages((prevImages) => [...prevImages, data.data]);
            }
            else {
                alert(data.msg);
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

    const handleDownloadImage = async (imageUrl) => {
        const proxyUrl = `${process.env.REACT_APP_API_URL}download-image?url=${encodeURIComponent(imageUrl)}`;
        window.open(proxyUrl, "_blank");
    }

    const handleDelete = async(imageId) => {

        if(!window.confirm("Are you sure you want to delete this image?")) return;

        try{

            const formData = {
                id: imageId
            }
            
            const response = await AuthService.deleteImage(formData);
            const data = response.data;
            if(data.success){
                setImages((prevImages) => prevImages.filter((img) => img._id !== imageId));
            }
            else{
                alert(data.msg);
            }

        }
        catch(error){
            alert(error.message);
        }

    }

    return (
        <Layout>
            <h3 className="mb-4">
                <img src={botData ? botData.fullImageUrl : ''} alt={botData ? botData.name : ''} width={50} height={50}
                    style={{ borderRadius: '100%' }} />
                &nbsp;{botData ? botData.name : ''}
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-3">
                        <select
                            className='form-control'
                            value={size}
                            onChange={(e) => setSize(e.target.value)}>
                            <option value="">Select Size</option>
                            <option value="1024x1024">1024x1024</option>
                            <option value="1024x1792">1024x1792</option>
                            <option value="1792x1024">1792x1024</option>
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <input type="text"
                            className='form-control'
                            placeholder='Enter Message'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)} />
                        {errors.message && <div className='errorMessage'>{errors.message}</div>}

                    </div>
                    <div className="col-sm-3">
                        <button type='submit' className='btn btn-primary' disabled={loading}>
                            {loading ? (
                                <div className="spinner-border"></div>
                            ) : (
                                <span>Generate</span>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-4">
                <h4>Generated Images</h4>
                <div className="row">

                    {images.length > 0 ? (

                        images.map((image, index) => (

                            <div className="col-md-3 text-center mb-3">
                                <img src={image.fullImageUrl} alt={`Generated ${index}`}
                                    className='img-fluid rounded' />

                                <div className="row">
                                    <div className="col-sm-6">
                                        <button className='btn btn-success mt-2'
                                            onClick={() => handleDownloadImage(image.fullImageUrl)}>
                                            Download
                                        </button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button className='btn btn-danger mt-2 ms-2'
                                            onClick={() => handleDelete(image._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))

                    ) : (
                        <p>No images available!</p>
                    )}

                </div>
            </div>

        </Layout>
    );
}

export default ImageGenerator;