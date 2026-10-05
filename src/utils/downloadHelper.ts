import { Ebook } from '../types/index.ts';

/**
 * Initiates browser download from a remote or storage URL
 */
export async function downloadFromUrl(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download request failed');
    const blob = await response.blob();
    downloadBlob(blob, filename);
  } catch {
    // Direct anchor fallback
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

/**
 * Downloads a Blob directly with custom filename
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
 * Generates an engineering digital publication package if no static file URL is attached
 */
export function generateEbookHandbookFile(ebook: Ebook, licenseToken = 'LIC-LICENSED'): void {
  const filename = ebook.downloadFileName || `${ebook.slug || 'handbook'}-codingthunder.txt`;
  
  const content = `================================================================================
CODINGTHUNDER ENGINEERING PUBLICATIONS · OFFICIAL DIGITAL EDITION
================================================================================
TITLE:       ${ebook.title}
SUBTITLE:    ${ebook.subtitle}
AUTHOR:      ${ebook.author}
PAGES:       ${ebook.pages}
LICENSE ID:  ${licenseToken}
VERIFIED AT: ${new Date().toUTCString()}
COPYRIGHT:   Codingthunder Digital Learning. All Rights Reserved.
================================================================================

ABOUT THIS PUBLICATION
--------------------------------------------------------------------------------
${ebook.description}

TABLE OF CONTENTS & CURRICULUM
--------------------------------------------------------------------------------
${ebook.chapters && ebook.chapters.length > 0
  ? ebook.chapters.map((ch, idx) => `Chapter ${idx + 1}: ${ch}`).join('\n')
  : '1. Architecture & Design Principles\n2. Implementation Details\n3. Production Hardening\n4. Benchmarks & Testing'}

DIGITAL PACKAGE FEATURES INCLUDED
--------------------------------------------------------------------------------
${ebook.features && ebook.features.length > 0
  ? ebook.features.map((f) => `• ${f}`).join('\n')
  : '• Production Ready Code Templates\n• Architectural Diagrams\n• Offline Access License'}

DIGITAL LICENSE CERTIFICATE
--------------------------------------------------------------------------------
This digital asset is legally licensed to your user account for single-developer
personal study and commercial implementation. Redistribution or resale is strictly
prohibited.

Support & Updates: support@codingthunder.dev
Official Portal:   https://codingthunder.vercel.app
================================================================================
`;

  downloadBlob(content, filename, 'text/plain;charset=utf-8');
}
