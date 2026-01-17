'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface MediaPlayerProps {
  media: {
    id: string;
    title: string;
    type: 'audio' | 'video';
    thumbnail: string;
    thumbnailAlt: string;
    duration: string;
    series?: string;
    episode?: number;
    transcript?: Array<{
      timestamp: string;
      text: string;
    }>;
  };
  onClose: () => void;
}

export default function MediaPlayer({ media, onClose }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const formatTime = (seconds: number): string => {
    if (!isHydrated) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause();
      } else {
        mediaElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      setDuration(mediaElement.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (mediaElement) {
      mediaElement.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      mediaElement.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    const newVolume = parseFloat(e.target.value);
    if (mediaElement) {
      mediaElement.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      mediaElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipTime = (seconds: number) => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      mediaElement.currentTime += seconds;
    }
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!isHydrated) {
    return (
      <div className="fixed inset-0 bg-coffee-dark/95 z-50 flex items-center justify-center">
        <div className="animate-pulse text-cream">Loading player...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-coffee-dark/95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card/10 backdrop-blur-sm">
        <div className="flex-1">
          <h2 className="font-headline text-xl font-bold text-cream mb-1">
            {media.title}
          </h2>
          {media.series && (
            <p className="text-sm text-cream/70 font-cta">
              {media.series} {media.episode && `• Episode ${media.episode}`}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted/20 transition-colors duration-200"
          aria-label="Close player"
        >
          <Icon name="XMarkIcon" size={24} className="text-cream" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Media Player */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-4xl">
            {media.type === 'video' ? (
              <video
                ref={videoRef}
                className="w-full rounded-lg warm-shadow-lg"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                poster={media.thumbnail}
              >
                <source src="/assets/media/sample-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="bg-card rounded-lg p-8 warm-shadow-lg">
                <AppImage
                  src={media.thumbnail}
                  alt={media.thumbnailAlt}
                  className="w-full aspect-video object-cover rounded-lg mb-6"
                />
                <audio
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="hidden"
                >
                  <source src="/assets/media/sample-audio.mp3" type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            )}

            {/* Controls */}
            <div className="mt-4 bg-card rounded-lg p-4 warm-shadow">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => skipTime(-10)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    aria-label="Rewind 10 seconds"
                  >
                    <Icon name="BackwardIcon" size={20} className="text-foreground" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-accent rounded-full hover:bg-gold transition-colors duration-200"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    <Icon
                      name={isPlaying ? 'PauseIcon' : 'PlayIcon'}
                      variant="solid"
                      size={24}
                      className="text-accent-foreground"
                    />
                  </button>
                  <button
                    onClick={() => skipTime(10)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    aria-label="Forward 10 seconds"
                  >
                    <Icon name="ForwardIcon" size={20} className="text-foreground" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      <Icon
                        name={isMuted ? 'SpeakerXMarkIcon' : 'SpeakerWaveIcon'}
                        size={20}
                        className="text-foreground"
                      />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Speed Control */}
                  <div className="relative group">
                    <button className="px-3 py-1 bg-muted rounded-lg text-sm font-cta font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                      {playbackSpeed}x
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 bg-card rounded-lg warm-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                      <div className="p-2 space-y-1">
                        {speedOptions.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`block w-full px-3 py-1 text-sm font-cta rounded ${
                              playbackSpeed === speed
                                ? 'bg-accent text-accent-foreground'
                                : 'text-foreground hover:bg-muted'
                            } transition-colors duration-200`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transcript Toggle */}
                  {media.transcript && (
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        showTranscript
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted text-foreground'
                      }`}
                      aria-label="Toggle transcript"
                    >
                      <Icon name="DocumentTextIcon" size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Panel */}
        {showTranscript && media.transcript && (
          <div className="w-full lg:w-96 bg-card/10 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
            <div className="p-4">
              <h3 className="font-headline text-lg font-bold text-cream mb-4 flex items-center space-x-2">
                <Icon name="DocumentTextIcon" size={20} />
                <span>Transcript</span>
              </h3>
              <div className="space-y-4">
                {media.transcript.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-card/50 rounded-lg hover:bg-card/70 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="text-xs font-cta font-medium text-accent mb-1">
                      {item.timestamp}
                    </div>
                    <p className="text-sm text-cream/90">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}