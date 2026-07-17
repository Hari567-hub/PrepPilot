import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import type { NoteItem } from '../store/appStore';
import GlassCard from '../components/GlassCard';
import ReactMarkdown from 'react-markdown';
import { Notebook, FolderPlus, Plus, Search, Edit2, Eye, Trash2, Folder } from 'lucide-react';

export const Notes: React.FC = () => {
  const { notes, folders, addNote, updateNote, deleteNote, addFolder, addNotification } = useAppStore();

  const [activeNote, setActiveNote] = useState<NoteItem | null>(notes[0] || null);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [newFolderInput, setNewFolderInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState<'write' | 'preview'>('write');

  const handleCreateNote = () => {
    const currentFolder = selectedFolder === 'All' ? folders[0] || 'General' : selectedFolder;
    addNote('Untitled Note', currentFolder, '# Untitled Note\n\nWrite markdown syntax here...');
    
    // Select the newly created note (first one in store list after write)
    setTimeout(() => {
      const storeNotes = useAppStore.getState().notes;
      if (storeNotes.length > 0) {
        setActiveNote(storeNotes[0]);
      }
    }, 50);
    
    addNotification('New markdown note created!', 'success');
  };

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderInput.trim()) {
      addFolder(newFolderInput.trim());
      setSelectedFolder(newFolderInput.trim());
      setNewFolderInput('');
      addNotification(`Folder "${newFolderInput}" created!`, 'success');
    }
  };

  const handleContentChange = (content: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, content);
    
    // Extract title from the first line of markdown if it has a header
    const lines = content.split('\n');
    let title = activeNote.title;
    if (lines[0] && lines[0].startsWith('# ')) {
      title = lines[0].replace('# ', '').trim();
    }
    
    // Partially sync active note state
    setActiveNote(prev => prev ? { ...prev, content, title } : null);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setActiveNote(null);
    addNotification('Note deleted.', 'info');
  };

  const filteredNotes = notes.filter(note => {
    const folderMatch = selectedFolder === 'All' || note.folder === selectedFolder;
    const queryMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return folderMatch && queryMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Notes Workspace</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Draft markdown checklists, save system designs notes, and search contents.</p>
        </div>
        <button onClick={handleCreateNote} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={16} /> New Note
        </button>
      </div>

      {/* Grid: Folders Sidebar, Notes List, Markdown Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 2fr', gap: '20px', height: '70vh' }}>
        
        {/* Column 1: Folders Directory */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Directories</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setSelectedFolder('All')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedFolder === 'All' ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: selectedFolder === 'All' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.85rem'
              }}
            >
              <Folder size={14} />
              <span>All Folders</span>
            </button>
            {folders.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedFolder === f ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: selectedFolder === f ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}
              >
                <Folder size={14} />
                <span>{f}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleAddFolder} style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
            <input 
              type="text" 
              placeholder="New folder..." 
              className="glass-input" 
              style={{ padding: '8px', fontSize: '0.8rem' }}
              value={newFolderInput}
              onChange={(e) => setNewFolderInput(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px' }}>
              <FolderPlus size={16} />
            </button>
          </form>
        </div>

        {/* Column 2: Notes List under selected folder */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search active notes..." 
              className="glass-input" 
              style={{ paddingLeft: '32px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.8rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredNotes.map(n => (
              <div 
                key={n.id}
                onClick={() => setActiveNote(n)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${activeNote?.id === n.id ? 'var(--primary)' : 'var(--glass-border)'}`,
                  background: activeNote?.id === n.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</h5>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.folder}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteNote(n.id); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Rich Editor / Previewer */}
        <div style={{ height: '100%' }}>
          {activeNote ? (
            <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px', gap: '15px' }}>
              {/* Tab options (Write vs Preview) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditMode('write')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      background: editMode === 'write' ? 'rgba(255,255,255,0.06)' : 'transparent',
                      color: editMode === 'write' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit2 size={12} /> Write
                  </button>
                  <button
                    onClick={() => setEditMode('preview')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      background: editMode === 'preview' ? 'rgba(255,255,255,0.06)' : 'transparent',
                      color: editMode === 'preview' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={12} /> Preview
                  </button>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto Saved</span>
              </div>

              {/* Workspace details */}
              {editMode === 'write' ? (
                <textarea
                  className="glass-textarea"
                  style={{ flex: 1, resize: 'none', fontFamily: 'monospace', fontSize: '0.85rem', background: 'none', border: 'none' }}
                  value={activeNote.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="# Enter title here..."
                />
              ) : (
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }} className="markdown-preview">
                  <ReactMarkdown>{activeNote.content}</ReactMarkdown>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <Notebook size={48} style={{ color: 'var(--text-muted)' }} />
              <h4>Select or create a markdown note to edit</h4>
            </GlassCard>
          )}
        </div>

      </div>

      <style>{`
        .markdown-preview h1 { font-size: 1.5rem; margin-bottom: 12px; border-bottom: 1px solid var(--glass-border); padding-bottom: 4px; }
        .markdown-preview h2 { font-size: 1.25rem; margin-top: 16px; margin-bottom: 8px; }
        .markdown-preview ul, .markdown-preview ol { padding-left: 20px; margin-bottom: 10px; }
        .markdown-preview li { margin-bottom: 4px; }
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 0.8fr 1fr 2fr"] {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
        }
      `}</style>

    </div>
  );
};
export default Notes;
