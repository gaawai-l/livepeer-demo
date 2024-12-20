import React, { useState, useCallback } from 'react';
import { useCreateAsset } from '@livepeer/react';

function VideoUpload() {
    const [video, setVideo] = useState(null);
    const {
        mutate: createAsset,
        data: assets,
        status,
        progress,
        error,
    } = useCreateAsset(
        video
            ? {
                sources: [{
                    name: video.name,
                    file: video,
                    storage: {
                        ipfs: true,
                        metadata: {
                            name: video.name,
                            description: "Video upload demo",
                            author: "Livepeer Demo App",
                            type: "video",
                            uploadedAt: new Date().toISOString(),
                        },
                    },
                }],
                uploadConfig: {
                    directUpload: true,
                },
                videoConfig: {
                    enablePlayback: true,
                    enableDownload: true,
                    enableThumbnails: true,
                },
            }
            : null,
    );

    const onFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) setVideo(file);
    }, []);

    const onUpload = useCallback(() => {
        if (!video) return;
        createAsset?.();
    }, [video, createAsset]);

    const uploadProgress = progress?.[0]?.phase === 'uploading'
        ? progress[0].progress * 100
        : progress?.[0]?.phase === 'processing'
            ? 100
            : 0;

    React.useEffect(() => {
        if (assets && assets[0]) {
            setTimeout(() => {
                window.refreshVideoList?.();
            }, 2000);
        }
    }, [assets]);

    return (
        <div className="upload-container">
            <h2>Video Upload</h2>
            <input
                type="file"
                accept="video/*"
                onChange={onFileChange}
            />
            <button
                onClick={onUpload}
                disabled={!video || status === 'loading'}
            >
                Upload
            </button>
            {status === 'loading' && (
                <div className="progress">
                    <div>
                        {progress?.[0]?.phase === 'uploading'
                            ? `Uploading... ${Math.round(uploadProgress)}%`
                            : progress?.[0]?.phase === 'processing'
                                ? 'Processing...'
                                : 'Preparing upload...'}
                    </div>
                    <progress value={uploadProgress} max={100} />
                </div>
            )}
            {error && (
                <div className="error">
                    Error: {error.message}
                </div>
            )}
            {assets && assets[0] && (
                <div className="success">
                    <div>Upload Successful!</div>
                    <div>Asset ID: {assets[0].id}</div>
                    <div>Playback ID: {assets[0].playbackId}</div>
                    {assets[0].storage?.ipfs?.url && (
                        <div>IPFS URL: {assets[0].storage.ipfs.url}</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default VideoUpload; 