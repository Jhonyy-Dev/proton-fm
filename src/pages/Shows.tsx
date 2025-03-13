import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlay, faExternalLinkAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import Hls from 'hls.js';
import { fetchLiveHorrorStreams, HorrorStream, StreamSource, convertIPTVToHorrorStreams } from '../services/horrorShowsService';
import { fetchIPTVChannels } from '../services/iptvService';
import '../styles/Shows.css';

// Componente para mostrar la calificación con estrellas
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="star full">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="star half">★</span>);
    } else {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
  }

  return <div className="star-rating">{stars}</div>;
};

const Shows = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<HorrorStream[]>([]);
  const [iptvChannels, setIptvChannels] = useState<HorrorStream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<HorrorStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('horror');
  const [playerError, setPlayerError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Cargar streams al montar el componente
  useEffect(() => {
    const loadStreams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar streams de horror
        const horrorStreams = await fetchLiveHorrorStreams();
        setStreams(horrorStreams);
        
        // Cargar canales IPTV
        try {
          const channels = await fetchIPTVChannels();
          const iptvStreams = convertIPTVToHorrorStreams(channels);
          setIptvChannels(iptvStreams);
        } catch (iptvError) {
          console.error('Error al cargar canales IPTV:', iptvError);
          // No establecemos error general para permitir que al menos se muestren los streams de horror
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar streams:', err);
        setError('Error al cargar los streams. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    loadStreams();
  }, []);

  // Inicializar el reproductor cuando cambia el stream activo
  useEffect(() => {
    if (!activeStream || !videoRef.current) return;

    setPlayerError(null);
    const video = videoRef.current;

    // Limpiar cualquier instancia previa de HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Función para cargar el video
    const loadVideo = (url: string) => {
      try {
        // Comprobar si la URL es un stream HLS (m3u8)
        if (url.includes('.m3u8') && Hls.isSupported()) {
          const hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
            lowLatencyMode: true
          });
          
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(err => {
              console.error('Error al reproducir el video:', err);
              setPlayerError('Error al iniciar la reproducción. Intente nuevamente.');
            });
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('Error fatal de HLS:', data);
              setPlayerError('Error al cargar el stream. Intente nuevamente más tarde.');
              hls.destroy();
            }
          });
          
          hlsRef.current = hls;
        } else {
          // Para otros formatos de video
          video.src = url;
          video.play().catch(err => {
            console.error('Error al reproducir el video:', err);
            setPlayerError('Error al iniciar la reproducción. Intente nuevamente.');
          });
        }
        
        setIsPlaying(true);
      } catch (error) {
        console.error('Error al cargar el video:', error);
        setPlayerError('Error al cargar el stream. Intente nuevamente más tarde.');
      }
    };

    loadVideo(activeStream.streamUrl);

    // Limpiar al desmontar
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      video.pause();
      video.src = '';
      setIsPlaying(false);
    };
  }, [activeStream]);

  // Manejar clic en stream
  const handleStreamClick = (stream: HorrorStream) => {
    setActiveStream(stream);
    setPlayerError(null);
  };

  // Manejar cambio de pestaña
  const handleTabChange = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
      setActiveStream(null); // Resetear stream activo al cambiar de pestaña
      setPlayerError(null);
    }
  };

  // Filtrar streams según la pestaña activa
  const getFilteredStreams = () => {
    let filteredStreams: HorrorStream[] = [];
    
    switch (activeTab) {
      case 'horror':
        filteredStreams = streams.filter(stream => 
          stream.source !== StreamSource.IPTV
        );
        break;
      case 'iptv':
        filteredStreams = iptvChannels;
        break;
      case 'all':
        filteredStreams = [...streams, ...iptvChannels];
        break;
      default:
        filteredStreams = streams;
    }
    
    return filteredStreams;
  };

  // Renderizar el reproductor de video
  const renderVideoPlayer = () => {
    if (!activeStream) {
      return (
        <div className="no-stream-message">
          <p>Selecciona un canal para comenzar a ver</p>
        </div>
      );
    }

    return (
      <div className="video-container">
        <video 
          ref={videoRef} 
          controls={true} 
          className="video-player"
          poster={activeStream.thumbnail || '/images/default-thumbnail.jpg'}
        ></video>
        {playerError && (
          <div className="player-error">
            <Alert variant="danger">
              <FontAwesomeIcon icon={faCircle} className="error-icon" /> {playerError}
            </Alert>
          </div>
        )}
      </div>
    );
  };

  // Renderizar información del stream
  const renderStreamInfo = () => {
    if (!activeStream) return null;

    return (
      <div className="stream-info">
        <h3>{activeStream.title}</h3>
        {activeStream.description && <p>{activeStream.description}</p>}
        <div className="stream-details">
          {activeStream.genre && <span className="stream-genre">Género: {activeStream.genre}</span>}
          {activeStream.year && <span className="stream-year">Año: {activeStream.year}</span>}
          {activeStream.isLive && (
            <p>
              <FontAwesomeIcon icon={faCircle} className="live-icon" />
              <span className="live-text">EN VIVO</span>
              {activeStream.viewerCount && (
                <span>{activeStream.viewerCount.toLocaleString()} espectadores</span>
              )}
            </p>
          )}
          {activeStream.rating && (
            <div className="rating-container">
              <StarRating rating={activeStream.rating} />
              <span className="rating-value">{activeStream.rating.toFixed(1)}/10</span>
            </div>
          )}
        </div>
        <div className="stream-actions">
          <Button 
            variant="outline-light" 
            href={activeStream.streamUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link-button"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} /> Ver en ventana externa
          </Button>
        </div>
      </div>
    );
  };

  // Renderizar tarjetas de streams
  const renderStreamCards = () => {
    const filteredStreams = getFilteredStreams();

    if (filteredStreams.length === 0) {
      return (
        <div className="no-streams">
          <p>No se encontraron streams que coincidan con tu búsqueda.</p>
        </div>
      );
    }

    return (
      <div className="streams-list">
        <h4 className="list-title">
          {activeTab === 'horror' ? 'Transmisiones de Terror' : 
           activeTab === 'iptv' ? 'Canales IPTV' : 
           'Todas las Transmisiones'}
        </h4>
        {filteredStreams.map(stream => (
          <div 
            key={stream.id} 
            className={`stream-card ${activeStream?.id === stream.id ? 'selected' : ''}`}
            onClick={() => handleStreamClick(stream)}
          >
            <div className="stream-card-content">
              {stream.thumbnail || stream.posterPath ? (
                <img 
                  src={stream.thumbnail || 
                       (stream.posterPath?.startsWith('http') ? 
                         stream.posterPath : 
                         `https://image.tmdb.org/t/p/w200${stream.posterPath}`)} 
                  alt={stream.title} 
                  className="stream-thumbnail"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                  }}
                />
              ) : (
                <div className="placeholder-thumbnail">
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              )}
              <div className="stream-card-info">
                <h5>{stream.title}</h5>
                {stream.isLive && (
                  <p className="stream-viewers">
                    <FontAwesomeIcon icon={faCircle} className="live-icon" />
                    <span className="live-text">EN VIVO</span>
                    {stream.viewerCount && (
                      <span> - {stream.viewerCount.toLocaleString()} espectadores</span>
                    )}
                  </p>
                )}
                {stream.year && <p className="stream-year">Año: {stream.year}</p>}
                {stream.genre && <p className="stream-category">Género: {stream.genre}</p>}
                {stream.rating && (
                  <div className="mini-rating">
                    <StarRating rating={stream.rating} />
                    <span>{stream.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="shows-container">
      <div className="back-button-container">
        <Button 
          variant="primary" 
          className="back-button" 
          onClick={() => navigate('/')}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </Button>
      </div>
      
      <h1 className="page-title">Transmisiones en Vivo</h1>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando transmisiones...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <Button 
            variant="danger" 
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      ) : (
        <div className="shows-content">
          <div className="main-player-container">
            {activeStream ? (
              <div className="player-card">
                <div className="video-overlay">
                  {activeStream && (
                    <div className="stream-hover-info">
                      <h3>{activeStream.title}</h3>
                      <div className="stream-tags">
                        {activeStream.genre && <span className="stream-genre">Género: {activeStream.genre}</span>}
                        {activeStream.source === StreamSource.IPTV && <span className="stream-source">IPTV</span>}
                        {activeStream.source === StreamSource.TMDB && <span className="stream-source">Terror</span>}
                        {activeStream.isLive && (
                          <span className="stream-live">
                            <FontAwesomeIcon icon={faCircle} className="live-icon" /> EN VIVO
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {renderVideoPlayer()}
              </div>
            ) : (
              <div className="no-stream-selected">
                <h3>Selecciona una transmisión para comenzar</h3>
                <p>Haz clic en cualquiera de las transmisiones disponibles para verla aquí.</p>
              </div>
            )}
          </div>
          
          <div className="channels-sidebar">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => handleTabChange(k)}
              className="content-tabs"
              variant="pills"
            >
              <Tab eventKey="horror" title="Terror" />
              <Tab eventKey="iptv" title="IPTV" />
              <Tab eventKey="all" title="Todos" />
            </Tabs>
            
            {renderStreamCards()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shows;
