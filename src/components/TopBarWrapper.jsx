import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/global.css';

export default function TopBarWrapper({ src, initialTitle }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'PAGE_LOADED') {
                const cleanTitle = event.data.title.replace('HiOS | ', '');
                setTitle(cleanTitle);
            }
        };

        window.addEventListener('message', handleMessage);
    }, []);

    return (
        <div className="top-bar-wrapper-container">
            <div className="top-app-bar">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <i className="material-symbols-rounded">arrow_back</i>
                </button>
                <h1 className="top-bar-title">{title}</h1>
            </div>

            <iframe
                src={src}
                title={title}
                style={{
                    flexGrow: 1,
                    width: '100%',
                    border: 'none',
                    display: 'block'
                }}
            />
        </div>
    );
}