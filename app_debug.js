// DEBUG VERSION
// By default this points to a public sample PDF so you can test immediately.
// Replace pdfUrl with 'book.pdf' after verifying the demo works.
const pdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

const statusEl = document.getElementById('status');
const errorBox = document.getElementById('errorBox');

function setStatus(s){ statusEl.textContent = s; console.log('[flipbook]', s); }
function showError(msg){ errorBox.style.display='block'; errorBox.textContent = msg; console.error('[flipbook error]', msg); }

// Check libraries
if (typeof jQuery === 'undefined') { showError('jQuery not loaded'); setStatus('error'); throw new Error('jQuery missing'); }
if (typeof window['pdfjs-dist/build/pdf'] === 'undefined') { showError('PDF.js not loaded'); setStatus('error'); throw new Error('PDF.js missing'); }
if (typeof $.fn.turn !== 'function') { showError('turn.js not loaded or incompatible'); setStatus('error'); throw new Error('turn.js missing'); }

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const flipbook = $('#flipbook');

let currentScale = 1.0;
let pdfDoc = null;

setStatus('downloading PDF');
pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  pdfDoc = pdf;
  const num = pdf.numPages;
  setStatus(`PDF loaded — ${num} pages. Rendering...`);

  // build pages
  for (let i = 1; i <= num; i++) {
    const pageDiv = $('<div/>').addClass('page').css({ width: 700, height: 900 });
    const canvas = document.createElement('canvas');
    canvas.dataset.pageNumber = i;
    pageDiv.append(canvas);
    flipbook.append(pageDiv);
  }
  if (num % 2 === 1) {
    const blank = $('<div/>').addClass('page').css({ width:700, height:900 });
    blank.append(document.createElement('canvas'));
    flipbook.append(blank);
  }

  // render sequentially to reduce memory pressure and make errors easier to see
  (async function renderAll(){
    for (let i = 1; i <= pdf.numPages; i++){
      setStatus(`Rendering page ${i}/${pdf.numPages}`);
      try {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        // compute scale so canvas width is 700
        const scale = 700 / viewport.width;
        const vp = page.getViewport({ scale });
        const canvas = flipbook.find(`canvas[data-page-number="${i}"]`)[0];
        canvas.width = Math.round(vp.width);
        canvas.height = Math.round(vp.height);
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
      } catch (e) {
        showError('Rendering error on page ' + i + ': ' + e.message);
        setStatus('error');
        return;
      }
    }
    setStatus('All pages rendered. Initializing turn.js...');
    // initialize turn
    try {
      const firstCanvas = flipbook.find('canvas')[0];
      const w = firstCanvas.width;
      const h = firstCanvas.height;
      flipbook.css({ width: w * 2 + 'px', height: h + 'px' });
      flipbook.turn({
        width: w*2,
        height: h,
        autoCenter: true,
        display: 'double',
        gradients: true,
        elevation: 50
      });
      setStatus('Flipbook initialized');
    } catch (e) {
      showError('turn.js init error: ' + e.message);
      setStatus('error');
    }
  })();
}).catch(err => {
  showError('PDF load error: ' + err.message);
  setStatus('error');
});

// Controls
$('#prevBtn').on('click', () => { if ($.fn.turn && $('#flipbook').turn('page')) $('#flipbook').turn('previous'); });
$('#nextBtn').on('click', () => { if ($.fn.turn) $('#flipbook').turn('next'); });

$('#zoomIn').on('click', () => {
  currentScale = Math.min(2.5, currentScale + 0.15);
  $('#flipbook').css('transform', `scale(${currentScale})`);
});
$('#zoomOut').on('click', () => {
  currentScale = Math.max(0.5, currentScale - 0.15);
  $('#flipbook').css('transform', `scale(${currentScale})`);
});
$('#fitBtn').on('click', () => { currentScale = 1.0; $('#flipbook').css('transform', `scale(${currentScale})`); });
$('#fsBtn').on('click', async () => {
  const el = document.documentElement;
  if (!document.fullscreenElement) await el.requestFullscreen().catch(()=>{});
  else await document.exitFullscreen().catch(()=>{});
});
