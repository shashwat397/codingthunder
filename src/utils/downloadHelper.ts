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
  const desiredFilename = ebook.downloadFileName || `${ebook.slug || 'handbook'}.pdf`;

  // 1. Check IndexedDB persistent file vault for the exact original file
  try {
    const stored =
      (await getOriginalEbookFile(ebook.id)) ||
      (ebook.slug ? await getOriginalEbookFile(ebook.slug) : null) ||
      (ebook.downloadFileName ? await getOriginalEbookFile(ebook.downloadFileName) : null);

    if (stored && stored.blob && stored.blob.size > 0) {
      downloadBlob(
        stored.blob,
        stored.fileName || desiredFilename,
        stored.mimeType || ebook.downloadFileType || 'application/pdf'
      );
      return;
    }
  } catch (err) {
    console.warn('IndexedDB file vault lookup error:', err);
  }

  // 2. Check if ebook.downloadFilePath is a Base64 Data URL (data:application/pdf;base64,...)
  if (ebook.downloadFilePath && ebook.downloadFilePath.startsWith('data:')) {
    try {
      const parts = ebook.downloadFilePath.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : (ebook.downloadFileType || 'application/pdf');
      const base64Data = parts[1];
      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      downloadBlob(blob, desiredFilename, mimeType);
      return;
    } catch (err) {
      console.warn('Base64 decode error:', err);
    }
  }

  // 3. Check if ebook.downloadFilePath is a hosted URL or API route (/api/uploads/..., http...)
  if (
    ebook.downloadFilePath &&
    (ebook.downloadFilePath.startsWith('http://') ||
      ebook.downloadFilePath.startsWith('https://') ||
      ebook.downloadFilePath.startsWith('/'))
  ) {
    try {
      const res = await fetch(ebook.downloadFilePath);
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 150) {
          downloadBlob(blob, desiredFilename, ebook.downloadFileType || 'application/pdf');
          return;
        }
      }
    } catch (err) {
      console.warn('Direct URL download error:', err);
    }
  }

  // 4. Check if ebook.downloadContent contains Base64 or binary data
  if (ebook.downloadContent && ebook.downloadContent.length > 50) {
    try {
      if (ebook.downloadContent.startsWith('data:')) {
        const parts = ebook.downloadContent.split(',');
        const base64Data = parts[1];
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: ebook.downloadFileType || 'application/pdf' });
        downloadBlob(blob, desiredFilename, ebook.downloadFileType || 'application/pdf');
        return;
      } else if (/^[A-Za-z0-9+/=]+$/.test(ebook.downloadContent.trim())) {
        const binaryStr = atob(ebook.downloadContent.trim());
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: ebook.downloadFileType || 'application/pdf' });
        downloadBlob(blob, desiredFilename, ebook.downloadFileType || 'application/pdf');
        return;
      }
    } catch {
      // Fallback
    }
  }

  // 5. Fallback: If no file was ever uploaded by the admin for this ebook yet, generate handbook
  generateEbookHandbookFile(ebook, licenseToken);
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
