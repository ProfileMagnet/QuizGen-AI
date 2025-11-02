import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DocumentationPage.css';

const DocumentationPage: React.FC = () => {
    const navigate = useNavigate();
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [docLoaded, setDocLoaded] = useState(false);
    const [docError, setDocError] = useState(false);

    const handleBackToQuiz = () => {
        navigate('/quiz-generator');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleVideoLoad = () => {
        setVideoLoaded(true);
        setVideoError(false);
    };

    const handleVideoError = () => {
        setVideoError(true);
        setVideoLoaded(false);
    };

    const handleDocLoad = () => {
        setDocLoaded(true);
        setDocError(false);
    };

    const handleDocError = () => {
        setDocError(true);
        setDocLoaded(false);
    };

    const retryLoad = (type: 'video' | 'doc') => {
        if (type === 'video') {
            setVideoError(false);
            setVideoLoaded(false);
        } else {
            setDocError(false);
            setDocLoaded(false);
        }
        // Force iframe reload by changing src
        const iframe = document.querySelector(type === 'video' ? '.video-iframe' : '.doc-iframe') as HTMLIFrameElement;
        if (iframe) {
            const src = iframe.src;
            iframe.src = '';
            setTimeout(() => {
                iframe.src = src;
            }, 100);
        }
    };

    return (
        <div className="documentation-page">
            <div className="container">
                <div className="doc-header">
                    <button
                        className="back-button"
                        onClick={handleBackToHome}
                    >
                        <ArrowLeft size={20} />
                        Home
                    </button>
                    <div className="doc-header-content">
                        <h1 className="page-title">
                            <img
                                src="/icon.png"
                                alt="QuizGen AI"
                                className="title-icon"
                            />
                            How to Get Your Hugging Face API Key
                        </h1>
                    </div>
                </div>

                <div className="documentation-content">
                    <div className="doc-intro">
                        <p>
                            Learn how to create your Hugging Face API key with our comprehensive guides.
                            Choose your preferred learning method below - watch the video or follow the interactive documentation.
                        </p>
                    </div>

                    <div className="guides-section">
                        <h2>Choose Your Learning Method</h2>

                        <div className="guides-grid">
                            <div className="guide-option">
                                <div className="guide-option-header">
                                    <div className="guide-icon">🎥</div>
                                    <h3>Video Tutorial</h3>
                                    <p>Watch a quick 1-minute video walkthrough</p>
                                </div>
                                <div className="guide-iframe-container">
                                    {!videoLoaded && !videoError && (
                                        <div className="iframe-loading">
                                            <div className="loading-spinner"></div>
                                            <p>Loading video tutorial...</p>
                                        </div>
                                    )}
                                    {videoError && (
                                        <div className="iframe-error">
                                            <AlertCircle size={48} />
                                            <p>Failed to load video tutorial</p>
                                            <button onClick={() => retryLoad('video')} className="retry-button">
                                                <RefreshCw size={16} />
                                                Retry
                                            </button>
                                            <a 
                                                href="https://embed.app.guidde.com/playbooks/cBj8Tg5iYep4Reqt2WRN4t?mode=videoOnly" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="external-link-button"
                                            >
                                                <ExternalLink size={16} />
                                                Open in New Tab
                                            </a>
                                        </div>
                                    )}
                                    <iframe
                                        className="video-iframe"
                                        width="700px"
                                        height="400px"
                                        src="https://embed.app.guidde.com/playbooks/cBj8Tg5iYep4Reqt2WRN4t?mode=videoOnly"
                                        title="Generate API Token Securely Using Huggingface Platform"
                                        style={{ 
                                            border: 'none', 
                                            borderRadius: '10px',
                                            display: videoError ? 'none' : 'block'
                                        }}
                                        referrerPolicy="unsafe-url"
                                        allowFullScreen
                                        allow="clipboard-write"
                                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
                                        onLoad={handleVideoLoad}
                                        onError={handleVideoError}
                                    >
                                    </iframe>
                                </div>
                            </div>

                            <div className="guide-option">
                                <div className="guide-option-header">
                                    <div className="guide-icon">📚</div>
                                    <h3>Interactive Documentation</h3>
                                    <p>Follow detailed step-by-step instructions with screenshots</p>
                                </div>
                                <div className="guide-iframe-container">
                                    {!docLoaded && !docError && (
                                        <div className="iframe-loading">
                                            <div className="loading-spinner"></div>
                                            <p>Loading interactive documentation...</p>
                                        </div>
                                    )}
                                    {docError && (
                                        <div className="iframe-error">
                                            <AlertCircle size={48} />
                                            <p>Failed to load interactive documentation</p>
                                            <button onClick={() => retryLoad('doc')} className="retry-button">
                                                <RefreshCw size={16} />
                                                Retry
                                            </button>
                                            <a 
                                                href="https://embed.app.guidde.com/playbooks/cBj8Tg5iYep4Reqt2WRN4t?mode=docOnly" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="external-link-button"
                                            >
                                                <ExternalLink size={16} />
                                                Open in New Tab
                                            </a>
                                        </div>
                                    )}
                                    <iframe
                                        className="doc-iframe"
                                        width="700px"
                                        height="600px"
                                        src="https://embed.app.guidde.com/playbooks/cBj8Tg5iYep4Reqt2WRN4t?mode=docOnly"
                                        title="Generate API Token Securely Using Huggingface Platform"
                                        style={{ 
                                            border: 'none', 
                                            borderRadius: '10px',
                                            display: docError ? 'none' : 'block'
                                        }}
                                        referrerPolicy="unsafe-url"
                                        allowFullScreen
                                        allow="clipboard-write"
                                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
                                        onLoad={handleDocLoad}
                                        onError={handleDocError}
                                    >
                                    </iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="quick-summary">
                        <h2>Quick Summary</h2>
                        <div className="summary-steps">
                            <div className="summary-step">
                                <span className="step-number">1</span>
                                <span>Visit huggingface.co and sign in</span>
                            </div>
                            <div className="summary-step">
                                <span className="step-number">2</span>
                                <span>Go to Profile → Access Tokens</span>
                            </div>
                            <div className="summary-step">
                                <span className="step-number">3</span>
                                <span>Create new token with "Read" permission</span>
                            </div>
                            <div className="summary-step">
                                <span className="step-number">4</span>
                                <span>Copy and save your token securely</span>
                            </div>
                        </div>
                    </div>

                    <div className="additional-info">
                        <h2>Additional Information</h2>
                        <div className="info-grid">
                            <div className="info-card">
                                <div className="info-icon">🔒</div>
                                <h3>Security</h3>
                                <p>Your API key is used securely and never stored on our servers. It's only used to make requests to Hugging Face on your behalf.</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">💰</div>
                                <h3>Free Usage</h3>
                                <p>Hugging Face provides generous free tier limits for API usage. Most users won't need to upgrade to a paid plan.</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">⚡</div>
                                <h3>Fast Setup</h3>
                                <p>The entire process takes less than 5 minutes. Once you have your key, you can start generating quizzes immediately.</p>
                            </div>
                        </div>
                    </div>

                    <div className="doc-actions">
                        <button
                            className="primary-button"
                            onClick={handleBackToQuiz}
                        >
                            Start Creating Quiz
                        </button>

                        <a
                            href="https://huggingface.co/settings/tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="secondary-button"
                        >
                            <ExternalLink size={18} />
                            Open Hugging Face Tokens Page
                        </a>
                    </div>

                    <div className="doc-note">
                        <div className="note-icon">💡</div>
                        <div className="note-content">
                            <strong>Important:</strong> Keep your API key secure and never share it publicly.
                            The key allows access to Hugging Face services on your behalf.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentationPage;