import React, { useEffect, useRef, useState } from 'react';
import './AdminDashboard.css';
import Layout from '../Layouts/Layout/Layout';
import AuthService from '../../../services/AuthService';
import CreateBot from '../CreateBot/CreateBot';
import DeleteBot from '../DeleteBot/DeleteBot';

const AdminDashboard = () => {

    // const userData = AuthService.getUserData();

    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBot, setSelectedBot] = useState(null);
    const [selectedEditBot, setSelectedEditBot] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchBots = async() => {
            try{
                const response = await AuthService.getBots();
                if(response.data.success){
                    setBots(response.data.data);
                }
            }
            catch(error){
                alert(error.message);
            }
            finally{
                setLoading(false);
            }
        };
        fetchBots();
    }, []);

    const handleDeleteBot = async () => {
        if(!selectedBot) return;

        try{

            const data = {
                id: selectedBot._id
            }
            await AuthService.deleteBot(data);
            setBots(bots.filter(bot => bot._id !== selectedBot._id));

        }
        catch(error){
            alert(error.message);
        }
    }

    return (
        <Layout>
            <h2 className="mb-4">Chat Bots</h2>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal"
            onClick={() => { setIsEditing(false); }}>
                Create Chat Bot
            </button>

            <CreateBot 
            id="createModal" 
            title={isEditing ? "Edit Chat Bot": "Create Chat Bot"}
            onBotCreated={(newBot) => {
                if(isEditing){
                    setBots(bots.map(bot => (bot._id === newBot._id ? newBot: bot)));
                }
                else{
                    setBots([...bots, newBot]);
                }
            }}
            isEditing={isEditing}
            selectedBot={selectedEditBot}
            >
            </CreateBot>

            {/* Table to diplay Bots */}

            {loading ? (
                <p>Loading chat bots....</p>
            ) :(
                <table className='table table-striped mt-4'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Message</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bots.map((bot, index) => (
                            <tr key={bot._id}>
                                <td>{ index+1 }</td>
                                <td>
                                    <img src={bot.fullImageUrl} alt={bot.name} width="50" height="50" />
                                </td>
                                <td>{bot.name}</td>
                                <td>{bot.message}</td>
                                <td>{bot.type === 0 ? "Chat Bot" : "Image Generator"}</td>
                                <td>{bot.status === 1 ? "Active" : "Inactive"}</td>
                                <td>
                                    <button className='btn btn-warning btn-sm me-2'
                                    onClick={() => { setIsEditing(true); setSelectedEditBot(bot); }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#createModal">
                                        Edit
                                    </button>
                                    <button className='btn btn-danger btn-sm'
                                        data-bs-toggle="modal" 
                                        data-bs-target="#deleteModal"
                                        onClick={() => setSelectedBot(bot)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Delete Bot modal */}
            <DeleteBot id="deleteModal" bot={selectedBot} onDelete={handleDeleteBot}/>

        </Layout>
    );
}

export default AdminDashboard;