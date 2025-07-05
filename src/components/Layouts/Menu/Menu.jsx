import React, { useState, useEffect } from 'react';
import AuthService from '../../../services/AuthService';
import { Link } from 'react-router-dom';

const Menu = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [bots, setBots] = useState([]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {

        const fetchBots = async () => {
            try {
                const response = await AuthService.getUBots();
                const data = response.data;
                if (data.success) {
                    setBots(data.data);
                }
            }
            catch (error) {
                alert(error.message);
            }
        }

        fetchBots();

    }, []);

    const textBots = bots.filter(bot => bot.type === 0);
    const imageBots = bots.filter(bot => bot.type === 1);

    return (
        <ul className="list-unstyled components mb-5">

            <div className="dropdown">
                <li
                    onClick={toggleDropdown}
                    aria-expanded={isOpen}>
                    <a href="#">Chat Bots</a>
                </li>
                <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                    {textBots.map((bot) => (
                        <Link
                            key={bot._id}
                            className="dropdown-item"
                            to={`/chat/${bot._id}`}>
                            {bot.name}
                        </Link>
                    ))}
                </div>
            </div>

            {imageBots.map((bot) => (
                <li key={bot._id} className="active">
                    <Link
                        key={bot._id}
                        className="dropdown-item"
                        to={`/text-to-image/${bot._id}`}>
                        {bot.name}
                    </Link>
                </li>
            ))}

            <li className="active">
                <Link
                    className="dropdown-item"
                    to={`/text-to-speech`}>
                    Text-to-Speech
                </Link>
            </li>

            <li className="active">
                <Link
                    className="dropdown-item"
                    to={`/speech-to-text`}>
                    Speech-to-Text
                </Link>
            </li>
            <li className="active">
                <Link
                    className="dropdown-item"
                    to={`/image-recognition`}>
                    Image Recognition
                </Link>
            </li>

            <li className="active">
                <Link
                    className="dropdown-item"
                    to={`/single-pdf-chat`}>
                    Single PDF Chat
                </Link>
            </li>
            <li className="active">
                <Link
                    className="dropdown-item"
                    to={`/multiple-pdf-chat`}>
                    Multiple PDF Chat
                </Link>
            </li>
        </ul>
    )

}

export default Menu;