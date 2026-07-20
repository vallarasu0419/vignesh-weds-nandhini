import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function MusicToggle({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && src) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [src]);

  const toggle = () => {
    if (!src) {
      setPlaying((prev) => !prev); // visual demo when no track is configured
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <>
      {src ? <audio ref={audioRef} src={src} loop preload="none" /> : null}
      <div className="music-toggle">
        <motion.button
          className="music-toggle__btn"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          animate={playing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={playing ? { repeat: Infinity, duration: 1.4 } : { duration: 0.2 }}
          whileTap={{ scale: 0.92 }}
        >
          {playing ? "♪" : "♫"}
        </motion.button>
      </div>
    </>
  );
}

MusicToggle.propTypes = {
  src: PropTypes.string.isRequired,
};
