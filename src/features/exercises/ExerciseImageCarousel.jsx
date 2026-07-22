import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { getExerciseImageGroups } from '../../utils/exerciseImage';
import './ExerciseImageCarousel.css';

// Tries each candidate URL for one variant in order, resolving with the
// first one that actually loads (or null if none do) — used to tolerate
// inconsistent file extension casing (.png vs .PNG) without producing
// duplicate slides for the same image.
function loadFirstWorking(urls) {
  return new Promise((resolve) => {
    let i = 0;
    function tryNext() {
      if (i >= urls.length) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.onload = () => resolve(urls[i]);
      img.onerror = () => {
        i += 1;
        tryNext();
      };
      img.src = urls[i];
    }
    tryNext();
  });
}

function ExerciseImageCarousel({ imageId }) {
  const [validImages, setValidImages] = useState(null); // null = still checking
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const groups = getExerciseImageGroups(imageId);

    Promise.all(
      groups.map(async (group) => {
        const url = await loadFirstWorking(group.urls);
        return url ? { url, label: group.label } : null;
      })
    ).then((results) => {
      if (!cancelled) setValidImages(results.filter(Boolean));
    });

    return () => { cancelled = true; };
  }, [imageId]);

  if (validImages === null) return null; // still checking, show nothing yet
  if (validImages.length === 0) {
    return (
      <div className="exercise-carousel-empty">
        <ImageOff size={20} />
        <span>No images yet</span>
      </div>
    );
  }

  const goPrev = () => setIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));

  return (
    <div className="exercise-carousel">
      <div className="exercise-carousel-frame">
        <img src={validImages[index].url} alt={validImages[index].label} />

        {validImages.length > 1 && (
          <>
            <button type="button" className="exercise-carousel-arrow exercise-carousel-arrow-left" onClick={goPrev} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="exercise-carousel-arrow exercise-carousel-arrow-right" onClick={goNext} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <p className="exercise-carousel-caption">{validImages[index].label}</p>

      {validImages.length > 1 && (
        <div className="exercise-carousel-dots">
          {validImages.map((img, i) => (
            <button
              key={img.url}
              type="button"
              className={`exercise-carousel-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`View ${img.label}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExerciseImageCarousel;
