import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../Layouts/Layout/Layout';
import AuthService from '../../../services/AuthService';

const TextToSpeech = () => {

    const [voice, setVoice] = useState('');
    const [text, setText] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [ttsList, setTtsList] = useState([]);

    useEffect(() => {
        fetchTTSList();
    }, []);

    const fetchTTSList = async () => {
        try {

            const response = await AuthService.getTTSList();

            setTtsList(response.data.data);

        }
        catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData();
        if (voice) {
            formData.append('voice', voice);
        }
        formData.append('text', text);

        try {

            const response = await AuthService.textToSpeech(formData);
            const data = response.data;
            console.log(data)
            setLoading(false);
            if (data.success) {
                setVoice('');
                setText('');
                setErrors({});

                setTtsList((prevList) => [...prevList, data.data]);
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

    const handleDownload = async (url) => {
        const name = new Date().getTime() + '-music.mp3';
        const proxyUrl = `${process.env.REACT_APP_API_URL}tts-download?url=${encodeURIComponent(url)}&name=${name}`;
        window.open(proxyUrl, "_blank");
    }

    const handleDelete = async(speechId) => {

        if(!window.confirm("Are you sure you want to delete this speech?")) return;

        try{

            const formData = {
                id: speechId
            }
            
            const response = await AuthService.deleteTTS(formData);
            const data = response.data;
            if(data.success){
                setTtsList((prevList) => prevList.filter((tts) => tts._id !== speechId));
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
                Text to Speech
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-3">
                        <select
                            className='form-control'
                            value={voice}
                            onChange={(e) => setVoice(e.target.value)}>
                            <option value="">Select Voice</option>
                            <option value="alloy">Alloy</option>
                            <option value="ash">Ash</option>
                            <option value="coral">Coral</option>
                            <option value="echo">Echo</option>
                            <option value="fable">Fable</option>
                            <option value="onyx">Onyx</option>
                            <option value="nova">Nova</option>
                            <option value="sage">Sage</option>
                            <option value="shimmer">Shimmer</option>
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <input type="text"
                            className='form-control'
                            placeholder='Enter Message'
                            value={text}
                            onChange={(e) => setText(e.target.value)} />
                        {errors.text && <div className='errorMessage'>{errors.text}</div>}

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
                <h4>Text-to-Speech Files</h4>
                {ttsList.length > 0 ? (

                    <div className="row">
                        {ttsList.map((tts, index) => (
                            <div key={index} className="col-md-3 text-center mb-3 ml-5">

                                <audio controls>
                                    <source src={tts.fullUrl} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                </audio>

                                <div className="row">
                                    <div className="col-sm-6">
                                        <button className='btn btn-success mt-2'
                                            onClick={() => handleDownload(tts.fullUrl)}>
                                            Download
                                        </button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button className='btn btn-danger mt-2'
                                            onClick={() => handleDelete(tts._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                ) : (
                    <p>No TTS file available!</p>
                )}
            </div>

        </Layout>
    );
}

export default TextToSpeech;