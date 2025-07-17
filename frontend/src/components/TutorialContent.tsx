import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import type { TutorialContentProps, CodeSnippet } from "../types";
import "./TutorialContent.css";

export const TutorialContent: React.FC<TutorialContentProps> = ({ section, language, onCodeExecute }) => {
  const [executingSnippets, setExecutingSnippets] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSnippetExecute = async (snippet: CodeSnippet) => {
    if (!language || !snippet.isExecutable) return;

    setExecutingSnippets((prev) => new Set(prev).add(snippet.id));

    try {
      await onCodeExecute(snippet.code);
    } catch (error) {
      console.error("Failed to execute snippet:", error);
    } finally {
      setExecutingSnippets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(snippet.id);
        return newSet;
      });
    }
  };

  const handleCodeExecute = useCallback(
    async (code: string, blockId: string) => {
      if (!language) return;

      setExecutingSnippets((prev) => new Set(prev).add(blockId));

      try {
        await onCodeExecute(code);
      } catch (error) {
        console.error("Failed to execute code:", error);
      } finally {
        setExecutingSnippets((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }
    },
    [language, onCodeExecute]
  );

  // ReactMarkdown components - render code blocks with Run buttons directly
  const components: Components = {
    code: (props) => {
      const { className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      const codeLanguage = match ? match[1] : "";
      const codeString = String(children).replace(/\n$/, "");

      // Check if this is inline code by looking at the node structure
      const isInline = !match || !className?.includes("language-");

      if (!isInline && match) {
        // Check if it's an executable language
        const isExecutableLanguage = ["python", "javascript", "typescript", "js", "ts", "py"].includes(codeLanguage.toLowerCase());

        // Block code - render with syntax highlighting and Run button if executable
        return (
          <div style={{ position: "relative" }}>
            <SyntaxHighlighter style={vscDarkPlus as { [key: string]: React.CSSProperties }} language={codeLanguage} PreTag="div" className="code-block">
              {codeString}
            </SyntaxHighlighter>
            {isExecutableLanguage && language && (
              <button
                onClick={async () => {
                  console.log("Direct Run button clicked!", { codeString, codeLanguage });
                  const blockId = `direct-${Date.now()}`;
                  await handleCodeExecute(codeString, blockId);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  zIndex: 1000,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                ▶️ Run
              </button>
            )}
          </div>
        );
      } else {
        // Inline code
        return (
          <code className="inline-code" {...rest}>
            {children}
          </code>
        );
      }
    },
  };

  return (
    <div className="tutorial-content">
      <div className="content-body">
        <div className="markdown-content" ref={contentRef}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {section.content}
          </ReactMarkdown>
        </div>
      </div>

      {section.codeSnippets.length > 0 && (
        <div className="code-snippets-summary">
          <h3>Code Examples in This Section</h3>
          <div className="snippets-grid">
            {section.codeSnippets
              .filter((snippet) => snippet.isExecutable)
              .map((snippet) => (
                <div key={snippet.id} className="snippet-card">
                  <div className="snippet-context">{snippet.context}</div>
                  <SyntaxHighlighter style={vscDarkPlus} language={snippet.language} PreTag="div" className="snippet-code">
                    {snippet.code}
                  </SyntaxHighlighter>
                  <button onClick={() => handleSnippetExecute(snippet)} disabled={executingSnippets.has(snippet.id)} className="snippet-execute-button">
                    {executingSnippets.has(snippet.id) ? "Running..." : "Try This Code"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
