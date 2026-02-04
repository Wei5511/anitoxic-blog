"use client";

import React from 'react';

export default function RenderMarkdown({ content, isPinned = false }) {
    if (!content) return null;

    const parseInline = (text) => {
        // First split by code blocks, links, and bold
        const parts = [];
        let remaining = text;

        // Regex to match Markdown links: [text](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const boldRegex = /(\*\*[^*]+\*\*)/g;

        // Combine patterns
        const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*[^*]+\*\*)/g;

        let lastIndex = 0;
        let match;

        while ((match = combinedRegex.exec(text)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
            }

            if (match[1]) {
                // It's a link: [text](url)
                parts.push({ type: 'link', text: match[2], url: match[3] });
            } else if (match[4]) {
                // It's bold: **text**
                parts.push({ type: 'bold', content: match[4].slice(2, -2) });
            }

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({ type: 'text', content: text.substring(lastIndex) });
        }

        // If no matches found, return original text
        if (parts.length === 0) {
            return text;
        }

        // Render parts
        return parts.map((part, index) => {
            if (part.type === 'link') {
                return (
                    <a
                        key={index}
                        href={part.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#FF6600',
                            textDecoration: 'underline',
                            fontWeight: '500'
                        }}
                    >
                        {part.text}
                    </a>
                );
            } else if (part.type === 'bold') {
                return <strong key={index} style={{ color: '#000', fontWeight: '700' }}>{part.content}</strong>;
            } else {
                return part.content;
            }
        });
    };

    return content.split('\n').map((line, i) => {
        const trimmed = line.trim();

        // MyVideo List Button (White/Black Style)
        const btnMatch = line.match(/^\[myvideo-btn:(.+)\]$/);
        if (btnMatch) {
            return (
                <div key={i} style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <a href={btnMatch[1]} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={markdownStyles.btnContainer}
                            onMouseOver={e => {
                                e.currentTarget.style.background = '#000';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.color = '#000';
                            }}
                        >
                            MyVideo線上看
                        </div>
                    </a>
                </div>
            );
        }

        // Orange Small Button (Embedded HTML)
        // Matches: <a href="..." class="btn-orange-small" target="_blank">...</a>
        // Note: We use a somewhat loose regex to capture the href and text.
        const orangeBtnMatch = trimmed.match(/^<a href="([^"]+)" class="btn-orange-small" target="_blank">(.+)<\/a>$/);
        if (orangeBtnMatch) {
            return (
                <div key={i} style={{ margin: '1rem 0', textAlign: 'center' }}>
                    <a
                        href={orangeBtnMatch[1]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-orange-small"
                        style={markdownStyles.btnOrangeSmall} // Fallback/Inline style
                    >
                        {orangeBtnMatch[2]}
                    </a>
                </div>
            );
        }

        // Pill Orange Button (Large User Requested Style)
        // Matches: <a href="..." class="btn-pill-orange" target="_blank">...</a>
        const pillBtnMatch = line.match(/^<a href="([^"]+)" class="btn-pill-orange" target="_blank">(.+)<\/a>$/);
        if (pillBtnMatch) {
            return (
                <div key={i} style={{ margin: '2rem 0', textAlign: 'center' }}>
                    <a
                        href={pillBtnMatch[1]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill-orange"
                        style={markdownStyles.btnPillOrange} // Fallback
                    >
                        {/* Simple SVG Icon (Clapperboard-ish) */}
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5-2h1.17L18 3.83V4h-1.17L15 2zM9 2h1.17L12 3.83V4H9V2zm-2 2L5.17 2H7l1.83 2H7zM4 6h16v12H4V6zm4 8h8v2H8v-2z" />
                        </svg>
                        {pillBtnMatch[2]}
                    </a>
                </div>
            );
        }

        // 圖片處理
        const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
            return (
                <div key={i} style={isPinned ? markdownStyles.pinnedImageContainer : markdownStyles.itemImage}>
                    <img
                        src={imgMatch[2]}
                        alt={imgMatch[1]}
                        style={isPinned ? markdownStyles.pinnedImage : markdownStyles.itemImageImg}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                    {imgMatch[1] && <div style={markdownStyles.imageCaption}>{imgMatch[1]}</div>}
                </div>
            );
        }

        // H2
        if (line.startsWith('## ')) {
            return <h2 key={i} style={isPinned ? markdownStyles.pinnedH2 : markdownStyles.mdH2}>{parseInline(line.replace('## ', ''))}</h2>;
        }

        // H3
        if (line.startsWith('### ')) {
            return <h3 key={i} style={markdownStyles.mdH3}>{parseInline(line.replace('### ', ''))}</h3>;
        }

        if (line.startsWith('- ')) return <li key={i} style={markdownStyles.mdLi}>{parseInline(line.replace('- ', ''))}</li>;
        if (trimmed === '---') return <hr key={i} style={markdownStyles.mdHr} />;
        if (trimmed.length === 0) return <br key={i} />;

        return <p key={i} style={isPinned ? markdownStyles.pinnedP : markdownStyles.mdP}>{parseInline(line)}</p>;
    });
}

const markdownStyles = {
    btnContainer: {
        display: 'inline-block',
        background: '#fff',
        border: '3px solid #000',
        padding: '10px 30px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#000',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'sans-serif'
    },
    pinnedImageContainer: {
        margin: '20px 0',
        textAlign: 'center',
    },
    pinnedImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    itemImage: { margin: '20px 0' },
    itemImageImg: {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
    },
    imageCaption: {
        fontSize: '0.8em',
        color: '#999',
        marginTop: '10px',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    pinnedH2: {
        fontSize: '1.6em',
        marginTop: '20px',
        marginBottom: '15px',
        textAlign: 'left',
        fontWeight: 'bold',
        position: 'relative',
        paddingBottom: '10px',
        borderBottom: '2px solid #eee',
    },
    mdH2: {
        fontSize: '1.5em',
        marginTop: '2em',
        marginBottom: '1em',
        fontWeight: 'bold',
        fontFamily: '"Helvetica Neue", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        display: 'inline-block',
    },
    mdH3: {
        fontSize: '1.2em',
        marginTop: '1.5em',
        marginBottom: '0.8em',
        fontWeight: 'bold',
    },
    pinnedP: {
        marginBottom: '0.8em',
        fontSize: '1em',
        textAlign: 'left',
        lineHeight: '1.7',
    },
    mdP: { marginBottom: '1.5em' },
    mdLi: { marginLeft: '20px', marginBottom: '0.5em' },
    mdHr: { border: 'none', borderTop: '1px solid #eee', margin: '50px 0' },
};
