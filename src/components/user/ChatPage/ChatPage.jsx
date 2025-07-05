import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../Layouts/Layout/Layout';
import AuthService from '../../../services/AuthService';
import { useParams, useNavigate } from 'react-router-dom';
import "./ChatPage.css";

const ChatPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [message, setMessage] = useState('');
    const [botData, setBotData] = useState();
    const [errors, setErrors] = useState({});
    const [conversations, setConversations] = useState([]);
    const [listening, setListening] = useState(false);

    const userData = AuthService.getUserData();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    }

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

        setMessages([]);
        setConversations([]);
        setSelectedConversation(null);

        const getConversation = async () => {
            try {

                const response = await AuthService.getConversations(id);
                const data = response.data;
                if (data.success) {
                    setConversations(data.data);
                }
                else {
                    alert(data.msg);
                }

            }
            catch (error) {
                console.log(error.message);
            }
        }

        getConversation();

    }, [id]);

    const sendMessage = async () => {
        setErrors({});
        setLoading(true);

        const userMessageObj = {
            _id: new Date().getTime(),
            user_message: message,
            ai_message: "",
        }

        setMessages((prevMessages) => [...prevMessages, userMessageObj]);

        setMessage('');
        const formData = new FormData();
        formData.append('chat_bot_id', id);
        formData.append('message', message);
        formData.append('conversation_id', selectedConversation ? selectedConversation._id : "");

        try {

            const response = await AuthService.sendMessage(formData);
            const data = response.data;
            console.log(data)
            if (data.success) {
                // alert(data.msg);

                const aiMessageObj = {
                    _id: data.data._id,
                    user_message: userMessageObj.user_message,
                    ai_message: data.data.ai_message,
                }

                if(!selectedConversation){
                    setConversations((prevConversations) => [
                        {
                            _id: data.conversation_id,
                            last_message: data.data.ai_message,
                            updatedAt: data.data.updatedAt,
                            createdAt: data.data.createdAt,
                        },
                        ...prevConversations
                    ]);

                    setSelectedConversation({
                        _id: data.conversation_id,
                        last_message: data.data.ai_message,
                        updatedAt: data.data.updatedAt,
                        createdAt: data.data.createdAt,
                    });
                }
                else{
                    setConversations((prevConversations) => 
                        prevConversations.map((conv) => 
                            conv._id === selectedConversation._id
                            ? { ...conv, last_message: data.data.ai_message}
                            : conv
                        )
                    );
                }

                setMessages((prevMessages) => 
                    prevMessages.map((msg) => 
                        msg._id === userMessageObj._id ? aiMessageObj : msg
                    )
                )
                
                setLoading(false);

            }
            else {
                alert(data.msg);
                setLoading(false);
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
    };

    const truncateMessage = (message, wordLimit = 7) => {
        const words = message.split(' ');
        if (words.length <= wordLimit) return message;
        return words.slice(0, wordLimit).join(' ') + '...';
    }

    const handleMicClick = () => {

        if (!recognition) {
            alert("Speech Recognition is not supported in your browser!");
            return;
        }

        if (listening) return;

        setListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage((prevMessage) => (prevMessage ? prevMessage + ' ' + transcript : transcript));
        };

        recognition.onerror = (event) => {
            console.log("Speech recognition error", event.error);
            setListening(false);
        }

        recognition.onend = () => {
            setListening(false);
        }

    }

    const loadMessages = async (conv) => {
        setSelectedConversation(conv);
        try {

            const response = await AuthService.getConversationMessages(conv._id)
            const data = response.data;
            if (data.success) {
                setMessages(data.data);
            }
            else {
                alert(data.msg);
            }
        }
        catch (error) {
            alert(error.message)
        }
    }


    return (
        <Layout>
            <h3 className="mb-4">
                <img src={botData ? botData.fullImageUrl : ''} alt={botData ? botData.name : ''} width={50} height={50}
                    style={{ borderRadius: '100%' }} />
                &nbsp;{botData ? botData.name : ''}
            </h3>

            <div className="row">
                <div className="col-md-4">
                    {/* conversations */}
                    <h5>Conversations</h5>
                    <div className="list-group">
                        {conversations.length ? (
                            conversations.map((conv) => (
                                <a
                                    key={conv._id}
                                    className={`list-group-item list-group-item-action 
                                    ${selectedConversation && selectedConversation._id === conv._id ? 'active' : ''}`}
                                    onClick={() => loadMessages(conv)}
                                >
                                    <div>
                                        <p className='mb-1'>{truncateMessage(conv.last_message)}</p>
                                        <small className='text-muted'>
                                            {new Date(conv.updatedAt).toLocaleString()}
                                        </small>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="p-2">No Conversations Found!</div>
                        )}
                    </div>
                </div>
                <div className="col-md-8">

                    <div className="container">
                        <div className="card">
                            <div className="card-body">

                                <div className="mb-3" style={{ maxHeight: '300px', overflow: 'auto', height: '300px' }}>

                                    {messages.length ? (

                                        messages.map((msg) => (
                                            <div key={msg._id} className='mb-3'>
                                                {msg.user_message && (
                                                    <div className="text-end mt-2">
                                                        <div className="d-inline-block p-2 rounded">
                                                            <p className='mb-1'>
                                                                <img src={userData.image} alt={userData.name} className="chat-images" />
                                                                &nbsp;{msg.user_message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {msg.ai_message && (
                                                    <div className="text-start mt-1">
                                                        <div className="d-inline-block p-2 rounded bg-light text-dark">
                                                            <p className='mb-1'>
                                                                <img src={botData.fullImageUrl} alt={botData.name} className="chat-images" />
                                                                &nbsp;{msg.ai_message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))

                                    ) : (
                                        <div>No messages yet.</div>
                                    )}

                                    {loading && (
                                        <div className="text-start mt-1">
                                            <div className="d-inline-block p-2 rounded bg-light text-dark">
                                                <p className='mb-1'>
                                                    <strong><img src={botData?.fullImageUrl} alt={botData?.name} className="chat-images" /></strong>
                                                    <span className='typing-bots'>Typing<span>.</span><span>.</span><span>.</span></span>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className="row">
                                    <div className="col-md-10 d-flex">
                                        <span
                                            onClick={handleMicClick}
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '1.5rem',
                                                marginRight: '5px',
                                                color: listening ? 'red' : '#333'
                                            }}

                                            title='Click to speak'
                                        >
                                            <i className='fa fa-microphone'></i>
                                        </span>
                                        <textarea
                                            className='form-control'
                                            placeholder='Type a message...'
                                            rows="3"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}></textarea>
                                        {errors.message && <div className='errorMessage'>{errors.message}</div>}
                                    </div>
                                    <div className="col-md-2">
                                        <button className='btn btn-primary' onClick={sendMessage}>
                                            Send
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default ChatPage;