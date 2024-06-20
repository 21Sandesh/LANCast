import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ConfigPage = () => {
    const [dbName, setDbName] = useState('');
    const [dbUser, setDbUser] = useState('');
    const [dbPassword, setDbPassword] = useState('');
    const [dbHost, setDbHost] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        const configData = {
            dbName,
            dbUser,
            dbPassword,
            dbHost
        };

        try {
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configData),
            });

            if (response.ok) {
                alert('Configuration saved successfully!');
                // Redirect to homepage after successful save
                navigate('/homepage'); // Navigate to homepage
            } else {
                alert('Failed to save configuration');
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            alert('Error saving configuration');
        }
    };

    return (
        <div>
            <h2>Configure Database and Server</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Database Name:
                    <input type="text" value={dbName} onChange={(e) => setDbName(e.target.value)} required />
                </label>
                <label>
                    Database User:
                    <input type="text" value={dbUser} onChange={(e) => setDbUser(e.target.value)} required />
                </label>
                <label>
                    Database Password:
                    <input type="password" value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} required />
                </label>
                <label>
                    Database Host:
                    <input type="text" value={dbHost} onChange={(e) => setDbHost(e.target.value)} required />
                </label>
                <button type="submit">Save Configuration</button>
            </form>
        </div>
    );
};

export default ConfigPage;
