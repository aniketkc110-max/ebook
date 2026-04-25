import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface Page {
  id: number;
  front: React.ReactNode;
  back: React.ReactNode;
}

const pages: Page[] = [
  {
    id: 1,
    front: (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-8 text-center">
        <div className="mb-6">
          <BookOpen className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-amber-900 leading-tight">My Story</h1>
          <p className="text-amber-700 mt-3 text-lg font-light tracking-wide">A Beautiful Journey</p>
        </div>
        <div className="w-24 h-1 bg-amber-400 rounded-full mx-auto mt-4" />
        <p className="text-amber-600 mt-6 text-sm italic">Turn the page to begin...</p>
      </div>
    ),
    back: (
      <div className="h-full flex flex-col justify-center bg-gradient-to-bl from-sky-50 to-blue-100 p-8">
        <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Chapter 1</span>
        <h2 className="text-3xl font-bold text-blue-900 mb-4">The Beginning</h2>
        <div className="w-12 h-0.5 bg-blue-300 mb-5" />
        <p className="text-blue-700 leading-relaxed text-base">
          Every great adventure starts with a single step. This is a story of discovery, wonder, and the magic that hides in everyday moments.
        </p>
        <p className="text-blue-600 leading-relaxed text-base mt-4">
          Close your eyes and imagine a world where every page holds a new surprise, a new emotion, a new truth waiting to be found.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    front: (
      <div className="h-full flex flex-col bg-gradient-to-br from-emerald-50 to-green-100 p-8">
        <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">Chapter 2</span>
        <h2 className="text-3xl font-bold text-emerald-900 mb-4">Into the Forest</h2>
        <div className="w-12 h-0.5 bg-emerald-300 mb-5" />
        <img
          src="https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Forest"
          className="w-full h-44 object-cover rounded-xl mb-5 shadow-md"
        />
        <p className="text-emerald-700 leading-relaxed text-sm">
          The ancient trees whispered secrets only the wind could carry. Sunlight filtered through emerald canopies, painting the forest floor in gold.
        </p>
      </div>
    ),
    back: (
      <div className="h-full flex flex-col justify-between bg-gradient-to-bl from-rose-50 to-pink-100 p-8">
        <div>
          <span className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-2 block">Chapter 3</span>
          <h2 className="text-3xl font-bold text-rose-900 mb-4">A Hidden Valley</h2>
          <div className="w-12 h-0.5 bg-rose-300 mb-5" />
          <p className="text-rose-700 leading-relaxed text-sm">
            Beyond the treeline lay a valley untouched by time. Wildflowers bloomed in waves of crimson and gold, their petals dancing in a gentle breeze.
          </p>
        </div>
        <blockquote className="border-l-4 border-rose-300 pl-4 mt-6">
          <p className="text-rose-600 italic text-sm">"In every walk with nature, one receives far more than he seeks."</p>
          <cite className="text-rose-400 text-xs mt-1 block">— John Muir</cite>
        </blockquote>
      </div>
    ),
  },
  {
    id: 3,
    front: (
      <div className="h-full flex flex-col bg-gradient-to-br from-violet-50 to-purple-100 p-8">
        <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-2">Chapter 4</span>
        <h2 className="text-3xl font-bold text-violet-900 mb-4">Starry Nights</h2>
        <div className="w-12 h-0.5 bg-violet-300 mb-5" />
        <img
          src="https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Stars"
          className="w-full h-44 object-cover rounded-xl mb-5 shadow-md"
        />
        <p className="text-violet-700 leading-relaxed text-sm">
          Beneath a canopy of a million stars, the universe felt both vast and intimate. Each star a story, each constellation a chapter written across time.
        </p>
      </div>
    ),
    back: (
      <div className="h-full flex flex-col justify-center bg-gradient-to-bl from-yellow-50 to-amber-100 p-8">
        <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Chapter 5</span>
        <h2 className="text-3xl font-bold text-amber-900 mb-4">Golden Morning</h2>
        <div className="w-12 h-0.5 bg-amber-300 mb-5" />
        <img
          src="https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Sunrise"
          className="w-full h-36 object-cover rounded-xl mb-5 shadow-md"
        />
        <p className="text-amber-700 leading-relaxed text-sm">
          Dawn broke like a promise — slow, golden, inevitable. A new day stretched wide open, full of possibilities.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    front: (
      <div className="h-full flex flex-col bg-gradient-to-br from-cyan-50 to-teal-100 p-8">
        <span className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-2">Chapter 6</span>
        <h2 className="text-3xl font-bold text-teal-900 mb-4">By the Ocean</h2>
        <div className="w-12 h-0.5 bg-teal-300 mb-5" />
        <img
          src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Ocean"
          className="w-full h-44 object-cover rounded-xl mb-5 shadow-md"
        />
        <p className="text-teal-700 leading-relaxed text-sm">
          The ocean spoke in rhythms older than memory. Waves rose and fell like the breath of the world, patient and endless.
        </p>
      </div>
    ),
    back: (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-bl from-slate-100 to-gray-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center mb-6">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">The End</h2>
        <div className="w-24 h-1 bg-gray-400 rounded-full mx-auto mb-6" />
        <p className="text-gray-600 leading-relaxed text-base max-w-xs">
          Every ending is a new beginning. Thank you for turning these pages and sharing this journey.
        </p>
        <p className="text-gray-400 text-sm mt-8 italic">Made with love</p>
      </div>
    ),
  },
];

export default function Flipbook() {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const totalSpreads = pages.length;

  const goNext = useCallback(() => {
    if (isFlipping || currentSpread >= totalSpreads - 1) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((s) => s + 1);
      setIsFlipping(false);
    }, 600);
  }, [isFlipping, currentSpread, totalSpreads]);

  const goPrev = useCallback(() => {
    if (isFlipping || currentSpread <= 0) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((s) => s - 1);
      setIsFlipping(false);
    }, 600);
  }, [isFlipping, currentSpread]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const page = pages[currentSpread];
  const isFirst = currentSpread === 0;
  const isLast = currentSpread === totalSpreads - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 via-stone-100 to-amber-50 flex flex-col items-center justify-center select-none">
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-stone-700 tracking-tight">Interactive Flipbook</h1>
        <p className="text-stone-400 text-sm mt-1 tracking-wide">Use arrows to turn pages</p>
      </div>

      {/* Book container */}
      <div className="relative flex items-center gap-6">
        {/* Prev button */}
        <button
          onClick={goPrev}
          disabled={isFirst || isFlipping}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-stone-500 hover:text-stone-800 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Book */}
        <div className="relative" style={{ perspective: '1200px' }}>
          {/* Book shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-6 bg-black/10 rounded-full blur-xl" />

          {/* Book pages stack effect */}
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-amber-100 rounded-r-lg rounded-l-sm" />
          <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-amber-50 rounded-r-lg rounded-l-sm" />

          {/* Main page */}
          <div
            className={`relative w-72 h-96 md:w-80 md:h-[450px] rounded-r-lg rounded-l-sm shadow-2xl overflow-hidden transition-transform duration-[600ms] ease-in-out ${
              isFlipping
                ? flipDirection === 'next'
                  ? 'animate-flip-next'
                  : 'animate-flip-prev'
                : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
              transform: isFlipping
                ? flipDirection === 'next'
                  ? 'rotateY(-15deg) scale(0.97)'
                  : 'rotateY(15deg) scale(0.97)'
                : 'rotateY(0deg) scale(1)',
            }}
          >
            {/* Front of page */}
            <div className="absolute inset-0 backface-hidden">
              {page.front}
            </div>
          </div>

          {/* Page spine */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-stone-300 to-stone-100 rounded-l-sm shadow-inner" />

          {/* Page number */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSpread ? 'bg-stone-500 scale-125' : 'bg-stone-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Back panel (visible as a second page) */}
        <div
          className={`relative w-72 h-96 md:w-80 md:h-[450px] rounded-l-lg rounded-r-sm shadow-2xl overflow-hidden transition-transform duration-[600ms] ease-in-out ${
            isFlipping
              ? flipDirection === 'next'
                ? 'scale-[0.97]'
                : 'scale-[0.97]'
              : 'scale-100'
          }`}
          style={{ perspective: '1200px' }}
        >
          {/* Back of current page */}
          <div className="absolute inset-0">
            {page.back}
          </div>
          {/* Right spine */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-stone-300 to-stone-100 rounded-r-sm shadow-inner" />
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          disabled={isLast || isFlipping}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-stone-500 hover:text-stone-800 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Page counter */}
      <div className="mt-12 text-stone-400 text-sm tracking-widest uppercase">
        Page {currentSpread + 1} of {totalSpreads}
      </div>

      {/* Keyboard hint */}
      <div className="mt-3 flex gap-3 text-xs text-stone-400">
        <span className="bg-white/60 px-2 py-0.5 rounded border border-stone-200">← Prev</span>
        <span className="bg-white/60 px-2 py-0.5 rounded border border-stone-200">Next →</span>
      </div>
    </div>
  );
}
