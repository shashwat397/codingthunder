import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Upload,
  Eye,
  FileCode,
  Check,
  X,
  HelpCircle,
  Copy,
  Terminal,
} from 'lucide-react';
import { api } from '../../services/api.ts';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your technical article, tutorial, or architectural guide here...',
  minHeight = '500px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'html'>('edit');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageAltInput, setImageAltInput] = useState('');
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize incoming value when editor first mounts or changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const executeCommand = (command: string, arg?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleInput();
    }
  };

  const handleFormatBlock = (tag: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('formatBlock', false, tag);
      handleInput();
    }
  };

  // Image Upload Handler (drag & drop or file picker)
  const processImageFile = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string) || '';
        const res = await api.uploadBlogImage(file.name, base64Data, file.type);
        if (res && res.url) {
          insertImageHtml(res.url, file.name);
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload failed:', err);
      setIsUploadingImage(false);
    }
  };

  const insertImageHtml = (url: string, alt = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
      const imgHtml = `
        <figure class="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 p-2 text-center group">
          <img src="${url}" alt="${alt || 'Tutorial Architecture Asset'}" class="w-full max-h-[500px] object-contain rounded-xl mx-auto shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]" />
          ${alt ? `<figcaption class="text-xs text-slate-400 font-mono mt-2">${alt}</figcaption>` : ''}
        </figure><p><br></p>
      `;
      document.execCommand('insertHTML', false, imgHtml);
      handleInput();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processImageFile(file);
    }
  };

  const insertCodeBlock = () => {
    if (!codeSnippet.trim()) return;
    if (editorRef.current) {
      editorRef.current.focus();
      const escaped = codeSnippet
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const codeHtml = `
        <div class="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-2xl">
          <div class="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80 text-xs font-mono">
            <span class="text-amber-400 font-semibold uppercase tracking-wider">${codeLanguage}</span>
            <span class="text-slate-500 text-[11px]">Technical Snippet</span>
          </div>
          <pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed bg-[#060911]"><code>${escaped}</code></pre>
        </div><p><br></p>
      `;
      document.execCommand('insertHTML', false, codeHtml);
      handleInput();
    }
    setCodeSnippet('');
    setCodeModalOpen(false);
  };

  const insertCustomLink = () => {
    if (!linkUrl.trim()) return;
    if (editorRef.current) {
      editorRef.current.focus();
      const text = linkText.trim() || linkUrl;
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:text-amber-300 underline font-medium">${text}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
      handleInput();
    }
    setLinkUrl('');
    setLinkText('');
    setLinkModalOpen(false);
  };

  // Word count & read time stats
  const plainText = (value || '').replace(/<[^>]*>/g, ' ').trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] shadow-2xl flex flex-col overflow-hidden">
      {/* Editor Top Bar: Tabs & Live Metrics */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/70 gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
            <span>Rich Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Article Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'html'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw HTML</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>{wordCount.toLocaleString()} words</span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">{estimatedReadTime} min read</span>
          {isUploadingImage && (
            <span className="text-cyan-400 animate-pulse flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 animate-spin" /> Uploading image...
            </span>
          )}
        </div>
      </div>

      {/* Formatting Toolbar (Visible in 'edit' tab) */}
      {activeTab === 'edit' && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-800/80 bg-slate-950/70 text-slate-300">
          {/* Headings */}
          <button
            type="button"
            onClick={() => handleFormatBlock('h2')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer text-xs font-mono font-bold"
            title="Heading 2 (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormatBlock('h3')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer text-xs font-mono font-bold"
            title="Heading 3 (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormatBlock('p')}
            className="px-2 py-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer text-xs font-mono"
            title="Paragraph Text"
          >
            P
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Text Styles */}
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormatBlock('blockquote')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Technical Elements: Code Block, Link, Image */}
          <button
            type="button"
            onClick={() => setCodeModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-mono font-semibold"
            title="Insert Formatted Code Block"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Code Block</span>
          </button>

          <button
            type="button"
            onClick={() => setLinkModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setImageModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-mono font-semibold"
            title="Upload or Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Insert Image</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer text-slate-400"
            title="Browse image from computer"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="h-4 w-px bg-slate-800 mx-1 ml-auto" />

          {/* History */}
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Body */}
      <div className="relative flex-1 bg-[#070b14]">
        {activeTab === 'edit' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative min-h-[450px] p-6 focus:outline-none transition-colors ${
              isDragOver ? 'bg-cyan-950/20 ring-2 ring-cyan-500/50' : ''
            }`}
          >
            {isDragOver && (
              <div className="absolute inset-0 z-30 bg-cyan-950/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none border-2 border-dashed border-cyan-400 rounded-xl">
                <Upload className="w-10 h-10 text-cyan-400 animate-bounce mb-2" />
                <span className="text-sm font-bold text-white">Drop image file here to upload directly to article</span>
              </div>
            )}

            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onBlur={handleInput}
              style={{ minHeight }}
              className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed focus:outline-none [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-slate-800 [&_h2]:pb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-amber-300 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_blockquote]:my-6 [&_blockquote]:bg-slate-900/50 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_code]:bg-slate-900 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_a]:text-amber-400 [&_a]:underline"
            />
          </div>
        )}

        {/* Live Article Preview Tab */}
        {activeTab === 'preview' && (
          <div className="p-8 max-w-4xl mx-auto min-h-[450px]">
            <div
              className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-slate-800 [&_h2]:pb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-amber-300 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_blockquote]:my-6 [&_blockquote]:bg-slate-900/50 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_code]:bg-slate-900 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_a]:text-amber-400 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-500 italic">No content yet. Switch to Rich Editor to start authoring.</p>' }}
            />
          </div>
        )}

        {/* Raw HTML Code Tab */}
        {activeTab === 'html' && (
          <div className="p-4">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ minHeight }}
              className="w-full h-full p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* Code Block Modal */}
      {codeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1220] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Insert Syntax-Highlighted Code Block</h3>
              </div>
              <button
                type="button"
                onClick={() => setCodeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Target Language / Syntax</label>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              >
                <option value="python">Python (Pandas, scikit-learn, PySpark)</option>
                <option value="sql">SQL / BigQuery / Snowflake</option>
                <option value="bash">Bash / Shell Terminal</option>
                <option value="typescript">TypeScript / React</option>
                <option value="json">JSON / Schema</option>
                <option value="yaml">YAML / dbt Config</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Code Snippet</label>
              <textarea
                rows={8}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Paste your formatted technical code here..."
                className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCodeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertCodeBlock}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Insert Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1220] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Insert or Upload Article Image</h3>
              </div>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drag & Drop Browse Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-cyan-950/10 group"
            >
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 mx-auto mb-2 transition-colors" />
              <div className="text-xs font-bold text-white">Click to browse or drag & drop image</div>
              <div className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG, WebP supported</div>
            </div>

            <div className="text-center text-xs font-mono text-slate-500">— OR ENTER DIRECT URL —</div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Image URL (Cloudinary / S3 / Unsplash)</label>
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Caption / Alt Text</label>
              <input
                type="text"
                value={imageAltInput}
                onChange={(e) => setImageAltInput(e.target.value)}
                placeholder="e.g., BigQuery Execution Architecture Diagram"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!imageUrlInput.trim()}
                onClick={() => {
                  insertImageHtml(imageUrlInput.trim(), imageAltInput.trim());
                  setImageUrlInput('');
                  setImageAltInput('');
                  setImageModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1220] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Insert Embedded Link</h3>
              </div>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Destination URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Anchor Text (Optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g., Official BigQuery Documentation"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!linkUrl.trim()}
                onClick={insertCustomLink}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
