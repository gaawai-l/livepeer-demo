import React from 'react';
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';
import VideoUpload from './components/VideoUpload';
import StudioPlayer from './components/StudioPlayer';
import './App.css';

const client = createReactClient({
    provider: studioProvider({ apiKey: '1861e6be-1dd9-4aee-b588-4a7bf854560b' }),
});

function App() {
    return (
        <LivepeerConfig client={client}>
            <div className="App">
                <h1>Livepeer Video Upload & Playback Demo</h1>
                <VideoUpload />
                <StudioPlayer />
            </div>
        </LivepeerConfig>
    );
}

export default App; 