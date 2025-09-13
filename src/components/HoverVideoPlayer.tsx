import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface HoverVideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
  previewDuration?: number; // Duration in seconds for preview
}

const HoverVideoPlayer = ({ 
  videoUrl, 
  title, 
  className = "", 
  previewDuration = 5 
}: HoverVideoPlayerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowControls(true);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Start from beginning
      videoRef.current.play();
      setIsPlaying(true);
      
      // Auto-pause after preview duration
      timeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }, previewDuration * 1000);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowControls(false);
    
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        muted
        loop={false}
        onEnded={handleVideoEnd}
        preload="metadata"
      />
      
      {/* Overlay with play/pause button */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition-colors">
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white ml-1" />
          )}
        </div>
      </div>
      
      {/* Click to play/pause overlay */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={handlePlayPause}
        title={title || "Click to play/pause"}
      />
      
      {/* Progress indicator */}
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-white/80 transition-all duration-100"
            style={{
              width: videoRef.current 
                ? `${(videoRef.current.currentTime / previewDuration) * 100}%` 
                : '0%'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HoverVideoPlayer;
