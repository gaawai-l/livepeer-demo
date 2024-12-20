import React, { useState, useEffect, useCallback } from 'react';
import { Player } from '@livepeer/react';

function StudioPlayer() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssets = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('https://livepeer.studio/api/asset', {
                headers: {
                    'Authorization': `Bearer 1861e6be-1dd9-4aee-b588-4a7bf854560b`
                }
            });
            const data = await response.json();
            console.log('Retrieved video list:', data);

            const firstFiveVideos = data.slice(0, 5).map(video => ({
                playbackId: video.playbackId,
                name: video.name
            }));
            setVideos(firstFiveVideos);
        } catch (error) {
            console.error('Failed to fetch video list:', error);
            setError('Failed to load videos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    // 导出刷新方法，供其他组件使用
    window.refreshVideoList = fetchAssets;

    if (loading) {
        return (
            <div className="player-container">
                <h2>Studio Video Player</h2>
                <div className="no-video">Loading Studio videos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="player-container">
                <h2>Studio Video Player</h2>
                <div className="error">{error}</div>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="player-container">
                <h2>Studio Video Player</h2>
                <div className="no-video">No videos available</div>
            </div>
        );
    }

    return (
        <div className="player-container">
            <h2>Studio Video Player (Latest 5 Videos)</h2>
            <div className="video-grid">
                {videos.map((video, index) => (
                    <div key={video.playbackId} className="video-item">
                        <h3>Video {index + 1}{video.name ? `: ${video.name}` : ''}</h3>
                        <Player
                            title={video.name || `Video ${index + 1}`}
                            playbackId={video.playbackId}
                            showPipButton
                            showTitle={true}
                            aspectRatio="16to9"
                            controls={{
                                autohide: 3000,
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudioPlayer; 