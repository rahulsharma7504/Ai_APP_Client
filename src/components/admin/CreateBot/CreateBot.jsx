import React, { useState, useEffect } from "react";
import AuthService from "../../../services/AuthService";

const CreateBot = ({ id, title, onBotCreated, isEditing, selectedBot }) => {

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [prompt_message, setPromptMessage] = useState('');
    const [image, setImage] = useState(null);
    const [type, setType] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setName('');
        setMessage('');
        setPromptMessage('');
        setImage(null);
        setType(0);
        setErrors({});

        if (isEditing && selectedBot) {
            setName(selectedBot.name);
            setMessage(selectedBot.message);
            setPromptMessage(selectedBot.prompt_message);
            setImage(null);
            setType(selectedBot.type);
        }
    }, [isEditing, selectedBot]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = new FormData();
        if(image){
            formData.append('image', image);
        }

        if(isEditing){
            formData.append('id', selectedBot._id);
        }

        formData.append('name', name);
        formData.append('message', message);
        formData.append('prompt_message', prompt_message);
        formData.append('type', type);

        try {

            let response;
            if(isEditing && selectedBot){
                response = await AuthService.updateBot(formData);
            }
            else{
                response = await AuthService.createBot(formData);
            }

            const data = response.data;
            console.log(data);
            alert(data.msg);
            if (data.success) {
                onBotCreated(data.data);
                document.getElementById("closeBtn").click();
                form.reset();
                setName('');
                setMessage('');
                setPromptMessage('');
                setImage(null);
                setType(0);
                setErrors({});
            }
        }
        catch (error) {
            console.log(error);

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

        }
    };

    return (

        <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">{title}</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">

                            <div className="form-group">
                                <label>Select Image</label>
                                <input type="file"
                                    className="form-control"
                                    onChange={(e) => setImage(e.target.files[0])} />
                                {errors.image && <div className='errorMessage'>{errors.image}</div>}
                            </div>
                            <div className="form-group">
                                <label>Enter Name</label>
                                <input type="text"
                                    className="form-control"
                                    value={name}
                                    placeholder="Enter Name"
                                    onChange={(e) => setName(e.target.value)} />
                                {errors.name && <div className='errorMessage'>{errors.name}</div>}

                            </div>
                            <div className="form-group">
                                <label>Enter Message</label>
                                <textarea className="form-control"
                                    value={message}
                                    placeholder="Enter Message"
                                    onChange={(e) => setMessage(e.target.value)}>
                                </textarea>
                                {errors.message && <div className='errorMessage'>{errors.message}</div>}
                            </div>
                            <div className="form-group">
                                <label>Enter Prompt Message</label>
                                <textarea className="form-control"
                                    value={prompt_message}
                                    placeholder="Enter Prompt Message"
                                    onChange={(e) => setPromptMessage(e.target.value)}>
                                </textarea>
                                {errors.prompt_message && <div className='errorMessage'>{errors.prompt_message}</div>}
                            </div>
                            <div className="form-group">
                                <label>Select Type</label>
                                <select className="form-control"
                                    value={type}
                                    onChange={(e) => setType(Number(e.target.value))}>
                                    <option value={0}>Text</option>
                                    <option value={1}>Image</option>
                                </select>
                                {errors.type && <div className='errorMessage'>{errors.type}</div>}
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" id="closeBtn" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">{isEditing?'Update':'Create'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );

};

export default CreateBot;