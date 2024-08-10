import React, { useState, useEffect, useRef } from 'react';
import { useGetTop10SongsQuery, useGetSongByIdQuery } from '../Api/JioSavanApi';
import reactSvg2 from '../assets/react2.svg';
import reactSvg from '../assets/react3.svg';
import Header from '../Components/Header';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom'

function TopAlbums() {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [songId, setSongId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const { data: topSong, error: topSongError, isLoading: topSongLoading } = useGetTop10SongsQuery(language);
  const { data: songData, error: songError, isLoading: songLoading } = useGetSongByIdQuery(songId, {
    skip: !songId,
  });

  const audioRef = useRef();
  const navigate = useNavigate();

  const handlePausePlay = (id) => {
    if (audioRef.current && songId !== id) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
    if (id !== songId) {
      setSongId(id);
    } else {
      if (isPlaying) {
        setCurrentTime(audioRef.current.currentTime);
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if(songData && audioRef.current){
        audioRef.current.src = songData.media_url;
        audioRef.current.play()
        setIsPlaying(true);
    }
} , [songData])

  const isNumericId = (id) => /^\d+$/.test(id);


  return (
    <>
      <Header />
      <main>
        <div className="flex flex-col items-center p-4 bg-black">
          {topSongLoading && <p className="text-center text-blue-500">Loading...</p>}
          {topSongError && <p className="text-center text-red-500">{topSongError.message}</p>}
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full max-w-7xl">
            {topSong &&
              topSong.results.map((item) => {
                const isThisSongPlaying = isPlaying && songId === item.id;
                const isAlbum = isNumericId(item.id);
                return (
                  <li
                    key={item.id}
                    className="flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 rounded-3xl shadow-lg transform transition-transform hover:scale-105  mb-8 w-60"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-52 h-52 mb-4 rounded-2xl cursor-pointer"
                      onClick={isAlbum ? null : () => navigate(`/song/${item.id}`)}
                    />
                    <div className="flex flex-col items-center w-full">
                      <div className="flex items-center justify-between w-full mb-2 relative">
                        <p className="text-lg font-semibold text-white">{item.title}</p>
                        {isAlbum ? (
                          <button
                            className="w-20 h-12 flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-400 rounded-full text-black font-bold"
                            onClick={() => navigate(`/album/${item.id}`)}
                          >
                            Details
                          </button>
                        ) : (
                          <button
                            className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg relative"
                            onClick={() => handlePausePlay(item.id)}
                          >
                            {isThisSongPlaying ? (
                              <img src={reactSvg2} alt="Pause" className="w-8 h-8" />
                            ) : (
                              <img src={reactSvg} alt="Play" className="w-8 h-8" />
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-gray-400">{item.more_info.singers}</p>
                    </div>
                  </li>
                );
              })}
          </ul>
          <audio ref={audioRef} />
        </div>
      </main>
    </>
  );
}

export default TopAlbums;
