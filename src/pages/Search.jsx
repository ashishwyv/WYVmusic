import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useSearchSongQuery, useGetSongByIdQuery } from '../Api/JioSavanApi';
import reactSvg2 from '../assets/react2.svg';
import reactSvg from '../assets/react3.svg';
import { useNavigate } from 'react-router-dom';

function Search() {
    const [search, setSearch] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [songId, setSongId] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const { data: searchData, error: searchError, isLoading: searchLoading } = useSearchSongQuery(search);
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
            if (audioRef.current) {
                if (isPlaying) {
                    setCurrentTime(audioRef.current.currentTime);
                    audioRef.current.pause();
                } else {
                    audioRef.current.currentTime = currentTime;
                    audioRef.current.play();
                }
                setIsPlaying(!isPlaying);
            }
        }
    };

    useEffect(() => {
        if (songData && audioRef.current) {
            audioRef.current.src = songData.media_url;
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [songData]);

    const handleSongSelect = (id) => {
        setSongId(id);
    };

    return (
        <>
            <div className="flex flex-col items-center p-4 bg-black">
                <input
                    type="text"
                    placeholder="Search a song"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ul className="w-full max-w-4xl flex flex-wrap justify-center gap-4">
                    {searchLoading && <p className="text-center text-blue-500">Loading...</p>}
                    {searchError && <p className="text-center text-red-500">{searchError.message}</p>}
                    {searchData &&
                        searchData.results.map((song) => {
                            const isThisSongPlaying = isPlaying && songId === song.id;
                            return (
                                <li key={song.id} className="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md w-64 ">
                                    <img
                                        src={song.image}
                                        alt={song.title}
                                        className="w-48 h-48 mb-4 rounded-lg cursor-pointer"
                                        onClick={() => navigate(`/song/${song.id}`)}
                                    />
                                    <div className="flex flex-col items-center w-full">
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <p className="text-lg font-bold text-white">{song.title.slice(0 , 20)}</p>
                                            <button
                                                className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg hover:bg-gray-900 transition duration-300"
                                                onClick={() => handlePausePlay(song.id)}
                                            >
                                                {isThisSongPlaying ? (
                                                    <img src={reactSvg2} alt="Pause" className="w-10 h-10" />
                                                ) : (
                                                    <img src={reactSvg} alt="Play" className="w-10 h-10" />
                                                )}
                                            </button>
                                        </div>
                                        <p className=" text-gray-400">{song.more_info.singers}</p>
                                    </div>
                                </li>
                            );
                        })}
                </ul>
                <audio ref={audioRef} />
            </div>
        </>
    );
}

export default Search;
