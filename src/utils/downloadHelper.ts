import { jsPDF } from 'jspdf';
import { Ebook } from '../types/index.ts';
import { getOriginalEbookFile } from './fileStorage.ts';

/**
 * Initiates browser download from a remote or storage URL
 */
export async function downloadFromUrl(
  url: string,
  filename: string,
  fallbackEbook?: Ebook,
  licenseToken?: string
): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Remote file not found');
    const blob = await response.blob();
    if (blob.size < 100 && fallbackEbook) {
      await downloadExactOriginalEbook(fallbackEbook, licenseToken);
      return;
    }
    downloadBlob(blob, filename);
  } catch {
    if (fallbackEbook) {
      await downloadExactOriginalEbook(fallbackEbook, licenseToken);
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

/**
 * Downloads a Blob directly with custom filename and triggers browser download
 */
export function downloadBlob(blob: Blob | string, filename: string, mimeType = 'application/pdf'): void {
  const dataBlob = typeof blob === 'string' ? new Blob([blob], { type: mimeType }) : blob;
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * MASTER DOWNLOAD HANDLER:
 * Always delivers the EXACT ORIGINAL FILE in the exact format uploaded by the admin.
 */
export async function downloadExactOriginalEbook(ebook: Ebook, licenseToken = 'LIC-LICENSED'): Promise<void> {
  const rawFilename = ebook.downloadFileName || `${ebook.slug || 'handbook'}.pdf`;
  const desiredFilename = rawFilename.endsWith('.pdf') ? rawFilename : `${rawFilename}.pdf`;

  // 1. Check IndexedDB persistent file vault for the exact original file (if uploaded in this browser)
  try {
    const stored =
      (await getOriginalEbookFile(ebook.id)) ||
      (ebook.slug ? await getOriginalEbookFile(ebook.slug) : null) ||
      (ebook.downloadFileName ? await getOriginalEbookFile(ebook.downloadFileName) : null);

    if (stored && stored.blob && stored.blob.size > 100) {
      downloadBlob(
        stored.blob,
        desiredFilename,
        stored.mimeType || ebook.downloadFileType || 'application/pdf'
      );
      return;
    }
  } catch (err) {
    console.warn('IndexedDB file vault lookup error:', err);
  }

  // 2. Fetch original uploaded binary from server endpoints
  const candidateUrls: string[] = [];

  // A. Dedicated download endpoint with license token
  candidateUrls.push(`/api/ebooks/${ebook.id}/download?token=${encodeURIComponent(licenseToken)}`);

  // B. ebook.downloadFilePath (if provided)
  if (ebook.downloadFilePath) {
    if (ebook.downloadFilePath.startsWith('http://') || ebook.downloadFilePath.startsWith('https://')) {
      candidateUrls.push(ebook.downloadFilePath);
    } else if (ebook.downloadFilePath.startsWith('/api/uploads/')) {
      candidateUrls.push(ebook.downloadFilePath);
    } else {
      const baseName = ebook.downloadFilePath.split('/').pop() || '';
      if (baseName) {
        candidateUrls.push(`/api/uploads/${baseName}`);
        candidateUrls.push(`/data/uploads/${baseName}`);
      }
    }
  }

  // C. Fallback file endpoints
  candidateUrls.push(`/api/uploads/${ebook.id}.pdf`);
  if (ebook.slug) {
    candidateUrls.push(`/api/uploads/${ebook.slug}.pdf`);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('codingthunder_auth_token') : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, { headers });
      if (res.ok) {
        const contentType = (res.headers.get('content-type') || '').toLowerCase();
        // CRITICAL CHECK: Ignore HTML (SPA redirects) and JSON errors to prevent corruption
        if (!contentType.includes('text/html') && !contentType.includes('application/json')) {
          const buffer = await res.arrayBuffer();
          if (buffer.byteLength > 100) {
            const bytes = new Uint8Array(buffer);
            // Verify binary doesn't start with HTML tags or JSON
            const firstChars = String.fromCharCode(...bytes.slice(0, 15)).trim().toLowerCase();
            if (!firstChars.startsWith('<!doctype') && !firstChars.startsWith('<html') && !firstChars.startsWith('{')) {
              const blob = new Blob([buffer], { type: ebook.downloadFileType || 'application/pdf' });
              downloadBlob(blob, desiredFilename, ebook.downloadFileType || 'application/pdf');
              return;
            }
          }
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 3. Check if ebook.downloadFilePath or ebook.downloadContent contains Base64 binary
  const rawBase64 = ebook.downloadFilePath?.startsWith('data:')
    ? ebook.downloadFilePath.split(',')[1]
    : (ebook.downloadContent?.startsWith('data:')
        ? ebook.downloadContent.split(',')[1]
        : (ebook.downloadContent && /^[A-Za-z0-9+/=\s]+$/.test(ebook.downloadContent.trim()) && ebook.downloadContent.length > 200
            ? ebook.downloadContent.trim()
            : null));

  if (rawBase64) {
    try {
      const clean = rawBase64.replace(/\s/g, '');
      const binaryStr = atob(clean);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: ebook.downloadFileType || 'application/pdf' });
      downloadBlob(blob, desiredFilename, ebook.downloadFileType || 'application/pdf');
      return;
    } catch (err) {
      console.warn('Base64 decode error:', err);
    }
  }

  // 4. If no admin file is available, inform the user cleanly instead of generating a dummy placeholder PDF
  alert(
    `The digital PDF for "${ebook.title}" has not been uploaded by the administrator yet. Please check back shortly or reach out to support@codingthunder.dev.`
  );
}

/**
 * Generates a fallback PDF handbook document if no admin file has been uploaded
 */
export function generateEbookHandbookFile(ebook: Ebook, licenseToken = 'LIC-LICENSED'): void {
  const rawFilename = ebook.downloadFileName || `${ebook.slug || 'handbook'}-codingthunder.pdf`;
  const filename = rawFilename.endsWith('.pdf') ? rawFilename : `${rawFilename}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // PAGE 1: COVER
  doc.setFillColor(12, 16, 28);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CODINGTHUNDER ENGINEERING PUBLICATIONS', margin, 28);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('OFFICIAL VERIFIED DIGITAL EDITION · ARCHITECTURAL PLAYBOOK', margin, 35);

  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.line(margin, 42, pageWidth - margin, 42);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  const titleLines = doc.splitTextToSize(ebook.title, contentWidth);
  doc.text(titleLines, margin, 60);

  const subtitleY = 65 + titleLines.length * 9;
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  const subtitleLines = doc.splitTextToSize(
    ebook.subtitle || 'Production-grade engineering principles, system architecture, and real-world implementation.',
    contentWidth
  );
  doc.text(subtitleLines, margin, subtitleY);

  const cardY = subtitleY + subtitleLines.length * 6 + 18;
  doc.setFillColor(21, 28, 44);
  doc.roundedRect(margin, cardY, contentWidth, 54, 3, 3, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, cardY, contentWidth, 54, 3, 3, 'D');

  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text('AUTHOR:', margin + 8, cardY + 12);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(ebook.author || 'Codingthunder Architecture Team', margin + 42, cardY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('ESTIMATED PAGES:', margin + 8, cardY + 22);
  doc.setTextColor(255, 255, 255);
  doc.text(String(ebook.pages || '250+ Pages with Production Templates'), margin + 42, cardY + 22);

  doc.setTextColor(148, 163, 184);
  doc.text('LICENSE TOKEN:', margin + 8, cardY + 32);
  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.text(licenseToken, margin + 42, cardY + 32);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('ISSUED AT:', margin + 8, cardY + 42);
  doc.setTextColor(52, 211, 153);
  doc.text(new Date().toUTCString(), margin + 42, cardY + 42);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8.5);
  doc.text('STATUS: VERIFIED PURCHASE · LIFETIME ACCESS ACTIVATED', margin + 8, cardY + 49);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('Licensed exclusively to your registered account. Redistribution or unauthorized mirror hosting is strictly prohibited.', margin, pageHeight - 22);
  doc.text('© 2026 Codingthunder Digital Publications · support@codingthunder.dev · codingthunder.vercel.app', margin, pageHeight - 16);

  // PAGE 2: SYLLABUS
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CODINGTHUNDER · CURRICULUM SYLLABUS & ARCHITECTURAL MODULES', margin, 14);

  let currentY = 36;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('1. Executive Summary & Core Mindsets', margin, currentY);
  currentY += 7;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const overviewText = doc.splitTextToSize(
    ebook.description || 'Comprehensive mental models, production-tested software patterns, and resilient architectural blueprints.',
    contentWidth
  );
  doc.text(overviewText, margin, currentY);
  currentY += overviewText.length * 5 + 10;

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('2. Curriculum Modules & Deep-Dive Chapters', margin, currentY);
  currentY += 8;

  const defaultChapters = [
    'System Architecture Foundations & Scalable Mental Models',
    'High-Throughput API Engineering & Distributed Caching Strategies',
    'Database Schema Optimization, Indexes & Query Execution Plans',
    'State Management, Reactivity & Modern Frontend Hydration',
    'Authentication, JWT, Session Security & Zero-Trust Access',
  ];

  const chaptersToPrint = (ebook.chapters && ebook.chapters.length > 0) ? ebook.chapters : defaultChapters;

  chaptersToPrint.forEach((chap, idx) => {
    const chapterTitle = typeof chap === 'string' ? chap : ((chap as any).title || `Module ${idx + 1}`);
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 25;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY - 4, contentWidth, 9, 1.5, 1.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY - 4, contentWidth, 9, 1.5, 1.5, 'D');

    doc.setTextColor(217, 119, 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`Module ${idx + 1}:`, margin + 4, currentY + 2);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(chapterTitle, margin + 28, currentY + 2);

    currentY += 13;
  });

  doc.save(filename);
}
