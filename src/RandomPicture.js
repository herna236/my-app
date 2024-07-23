import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RandomPicture = ({ timerLength }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0); 

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const response = await axios.get('https://picsum.photos/400', {
          maxRedirects: 5,
          validateStatus: status => status >= 200 && status < 400
        });

        if (isMounted) {
          setImageUrl(response.request.responseURL);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    let interval;
    if (timerLength > 0 && imageLoaded) {
      let startTime = Date.now();
      interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newPercentage = (elapsedTime / (timerLength * 1000)) * 100;
        setRevealPercentage(Math.min(newPercentage, 100)); // Cap at 100%
      }, 1000 / 60); // Update every 1/60th of a second
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerLength, imageLoaded]);

  const imageContainerStyle = {
    position: 'relative',
    width: '400px',
    height: '400px',
    overflow: 'hidden', // Hide overflowing parts of the image
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1, // Ensure image is on top of overlay
    opacity: 1, // Always visible
    transition: 'opacity 1s ease-out', // Smooth transition for opacity change
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 1)', 
    clipPath: `inset(${revealPercentage}% 0% 0% 0%)`, // Adjust reveal based on percentage
    transition: 'clip-path 0.1s linear', // Faster transition for reveal
    zIndex: 2, // Ensure overlay is above image
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2rem',
  };

  return (
    <div style={imageContainerStyle}>
      <div style={overlayStyle}>{revealPercentage === 100 && 'Time\'s up!'}</div>
      {imageUrl && <img src={imageUrl} alt="Random" style={imageStyle} />}
    </div>
  );
};

export default RandomPicture;
