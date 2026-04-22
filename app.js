// Put your PDF filename or URL here. Example: 'mybook.pdf' or 'https://example.com/book.pdf'
const pdfUrl = 'book.pdf';

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const flipbook = $('#flipbook');
const loadingEl = document.getElementById('loading');

let currentScale = 1.0;
let pdfDoc = null;
let renderedCount = 0;

function showLoading(text) {
  loadingEl.style.display = 'block';
  loadingEl.textContent = text || 'Loading PDF…';
}
function hideLoading() {
  loadingEl.style.display = 'none';
}

function renderPageToCanvas(pdf, pageNumber, canvas) {
  return pdf.getPage(pageNumber).then(page => {
    // choose a scale so pages are readable; you'll adjust CSS to fit
    const desiredWidth = 700; // base width for rendering
    const viewport = page.getViewport({ scale: 1 });
    const scale = desiredWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    canvas.width = Math.round(scaledViewport.width);
    canvas.height = Math.round(scaledViewport.height);
    const ctx = canvas.getContext('2d');

    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport
    };
    return page.render(renderContext).promise;
  });
}

function initTurn() {
  // compute page size from first page canvas
  const firstCanvas = flipbook.find('.page canvas').get(0);
  const w = firstCanvas.width;
  const h = firstCanvas.height;

  // set flipbook size to two-page visible width
  flipbook.css({ width: w * 2 + 'px', height: h + 'px' });

  // initialize turn.js
  flipbook.turn({
    width: w * 2,
    height: h,
    autoCenter: true,
    acceleration: true,
    display: 'double', // two pages visible like a real book
    gradients: true,
    elevation: 50
  });

  hideLoading();
}

// Load PDF and render pages
showLoading('Downloading PDF…');
pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  pdfDoc = pdf;
  const num = pdf.numPages;
  showLoading(`Rendering ${num} pages…`);
  // create page containers (turn.js likes an even number of pages)
  for (let i = 1; i <= num; i++) {
    const pageDiv = $('<div/>').addClass('page');
    const canvas = document.createElement('canvas');
    canvas.dataset.pageNumber = i;
    pageDiv.append(canvas);
    flipbook.append(pageDiv);
  }
  // If odd number of pages, append blank page for pairing
  if (num % 2 === 1) {
    const blank = $('<div/>').addClass('page');
    blank.append(document.createElement('canvas'));
    flipbook.append(blank);
  }

  // render all pages (concurrent but manageable)
  const canvasEls = flipbook.find('.page canvas').toArray();
  const renderPromises = canvasEls.map((c, idx) => {
    const pageNumber = idx < num ? idx + 1 : null;
    if (pageNumber) {
      return renderPageToCanvas(pdf, pageNumber, c).then(() => {
        renderedCount++;
      });
    } else {
      // blank page; fill white
      const ctx = c.getContext('2d');
      c.width = 700; c.height = 900;
      ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height);
      renderedCount++;
      return Promise.resolve();
    }
  });

  Promise.all(renderPromises).then(() => {
    showLoading('Initializing flipbook…');
    // small delay to ensure layout
    setTimeout(initTurn, 200);
  }).catch(err => {
    console.error(err);
    showLoading('Error rendering PDF. See console.');
  });
}).catch(err => {
  console.error(err);
  showLoading('Error loading PDF. Make sure the path is correct and you are serving over HTTP.');
});

// Toolbar controls
$('#prevBtn').on('click', () => flipbook.turn('previous'));
$('#nextBtn').on('click', () => flipbook.turn('next'));

$('#zoomIn').on('click', () => {
  currentScale = Math.min(2.5, currentScale + 0.15);
  flipbook.css('transform', `scale(${currentScale})`);
});
$('#zoomOut').on('click', () => {
  currentScale = Math.max(0.5, currentScale - 0.15);
  flipbook.css('transform', `scale(${currentScale})`);
});
$('#fitBtn').on('click', () => {
  currentScale = 1.0;
  flipbook.css('transform', `scale(${currentScale})`);
});

// fullscreen
$('#fsBtn').on('click', async () => {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    await el.requestFullscreen().catch(() => {});
  } else {
    await document.exitFullscreen().catch(() => {});
  }
});

// Handle window resize: keep book centered
$(window).on('resize', () => {
  flipbook.turn('resize');
});
