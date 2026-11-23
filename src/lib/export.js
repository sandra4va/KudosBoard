// ====================================================================
// KudosBoard — Export Engine (High-Res JPG, Multi-Page PDF & Print)
// ====================================================================

// High-Res JPG Snapshot
export async function exportBoardAsJPG(boardSlug, title) {
  const boardEl = document.getElementById('kudos-board-canvas') || document.getElementById('board-content-wrapper');
  if (!boardEl) {
    alert('Board element not found for export');
    return;
  }

  // Load html2canvas if not already available
  if (typeof window.html2canvas === 'undefined') {
    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
  }

  // Temporarily add capturing class to hide .no-print elements
  document.body.classList.add('export-mode-active');

  try {
    const canvas = await window.html2canvas(boardEl, {
      scale: 2, // 2x Retina DPI
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      ignoreElements: (element) => {
        return element.classList && element.classList.contains('no-print');
      }
    });

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `${boardSlug || 'kudosboard'}-keepsake.jpg`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export JPG', err);
    alert('Export to JPG failed: ' + err.message);
  } finally {
    document.body.classList.remove('export-mode-active');
  }
}

// Multi-Page PDF Celebration Book
export async function exportBoardAsPDF(boardSlug, title, subtitle, posts = []) {
  if (typeof window.jspdf === 'undefined') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Cover Page
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(251, 191, 36); // Amber-400
  doc.setLineWidth(1.5);
  doc.rect(margin - 5, margin - 5, pageWidth - (margin - 5) * 2, pageHeight - (margin - 5) * 2);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  const cleanTitle = title.replace(/[^\x00-\x7F]/g, '');
  const titleLines = doc.splitTextToSize(cleanTitle || 'Celebration Kudos Board', pageWidth - margin * 2 - 10);
  doc.text(titleLines, pageWidth / 2, 80, { align: 'center' });

  // Subtitle
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  const cleanSub = (subtitle || 'A digital keepsake of warm messages & congratulations').replace(/[^\x00-\x7F]/g, '');
  const subLines = doc.splitTextToSize(cleanSub, pageWidth - margin * 2 - 20);
  doc.text(subLines, pageWidth / 2, 110, { align: 'center' });

  // Stats
  doc.setTextColor(251, 191, 36);
  doc.setFontSize(12);
  doc.text(`Total Messages: ${posts.length}  •  Created on KudosBoard`, pageWidth / 2, 150, { align: 'center' });
  doc.text(`Exported: ${new Date().toLocaleDateString()}`, pageWidth / 2, 160, { align: 'center' });

  // Cards Pages
  let currentY = margin + 10;
  doc.addPage();
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('Messages & Well Wishes', margin, currentY);
  currentY += 15;

  posts.forEach((post, idx) => {
    const cardHeight = 45;
    if (currentY + cardHeight > pageHeight - margin) {
      doc.addPage();
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      currentY = margin + 10;
    }

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, cardHeight, 3, 3, 'FD');

    // Author Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    const authorText = (post.is_anonymous ? 'Anonymous' : (post.author_name || 'Guest')).replace(/[^\x00-\x7F]/g, '');
    doc.text(authorText, margin + 6, currentY + 10);

    // Timestamp
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const dateStr = new Date(post.created_at).toLocaleDateString();
    doc.text(dateStr, pageWidth - margin - 25, currentY + 10);

    // Message
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const cleanMsg = (post.message || '').replace(/[^\x00-\x7F]/g, '');
    const msgLines = doc.splitTextToSize(cleanMsg, pageWidth - margin * 2 - 12);
    doc.text(msgLines.slice(0, 3), margin + 6, currentY + 20);

    currentY += cardHeight + 8;
  });

  doc.save(`${boardSlug || 'kudosboard'}-celebration-book.pdf`);
}

// Print Keepsake Card Trigger
export function printKeepsakeCard() {
  window.print();
}

// Script Loader Helper
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}
