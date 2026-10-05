export function downloadEbookFile(ebook: {
  title: string;
  slug?: string;
  author?: string;
  description?: string;
  downloadFilePath?: string;
  downloadFileName?: string;
  downloadFileType?: string;
  downloadContent?: string;
  chapters?: Array<{ title: string; page: number }>;
  previewSnippet?: string;
}) {
  const fileName = ebook.downloadFileName || `${ebook.slug || 'ebook'}.pdf`;

  // 1. If it's a web URL (e.g. Google Drive, S3, Supabase Storage, Dropbox)
  if (ebook.downloadFilePath && (ebook.downloadFilePath.startsWith('http://') || ebook.downloadFilePath.startsWith('https://'))) {
    window.open(ebook.downloadFilePath, '_blank');
    return;
  }

  // 2. If it's a data URI (e.g. base64 uploaded in Admin)
  if (ebook.downloadFilePath && ebook.downloadFilePath.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = ebook.downloadFilePath;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
    return;
  }

  // 3. Fallback: generate high-quality readable digital publication document
  const content = ebook.downloadContent || `# ${ebook.title}
Author: ${ebook.author || 'Codingthunder Publication'}
Publication: Official Codingthunder Engineering Ebook

## About this Handbook
${ebook.description || 'Comprehensive programming architecture and implementation handbook.'}

## Chapters
${(ebook.chapters || []).map((ch, idx) => `${idx + 1}. ${ch.title} — Page ${ch.page}`).join('\n')}

---
## Digital Publication Preview
${ebook.previewSnippet || 'Full digital edition licensed to verified user.'}
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.md') : fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
