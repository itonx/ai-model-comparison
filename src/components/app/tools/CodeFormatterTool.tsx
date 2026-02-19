import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "prettier/standalone";
import * as pluginBabel from "prettier/plugins/babel";
import * as pluginEstree from "prettier/plugins/estree";
import * as pluginHtml from "prettier/plugins/html";
import * as pluginMarkdown from "prettier/plugins/markdown";
import * as pluginPostcss from "prettier/plugins/postcss";
import * as pluginTypescript from "prettier/plugins/typescript";
import * as pluginYaml from "prettier/plugins/yaml";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import type { ThemeMode } from "../types";
import CopyButton from "../CopyButton";

type CodeFormatterToolProps = {
  theme: ThemeMode;
  onToast: () => void;
};

type SupportedLanguage = {
  key: string;
  label: string;
  parser:
    | "babel"
    | "typescript"
    | "json"
    | "css"
    | "html"
    | "markdown"
    | "yaml";
  prism: string;
};

const LANGUAGE_OPTIONS: SupportedLanguage[] = [
  {
    key: "javascript",
    label: "JavaScript",
    parser: "babel",
    prism: "javascript",
  },
  {
    key: "typescript",
    label: "TypeScript",
    parser: "typescript",
    prism: "typescript",
  },
  { key: "json", label: "JSON", parser: "json", prism: "json" },
  { key: "html", label: "HTML", parser: "html", prism: "markup" },
  { key: "css", label: "CSS", parser: "css", prism: "css" },
  { key: "markdown", label: "Markdown", parser: "markdown", prism: "markdown" },
  { key: "yaml", label: "YAML", parser: "yaml", prism: "yaml" },
];

const prettierPlugins = [
  pluginBabel,
  pluginEstree,
  pluginHtml,
  pluginMarkdown,
  pluginPostcss,
  pluginTypescript,
  pluginYaml,
];

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export default function CodeFormatterTool({
  theme,
  onToast,
}: CodeFormatterToolProps) {
  const [sourceCode, setSourceCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    LANGUAGE_OPTIONS[0],
  );
  const [languageSearch, setLanguageSearch] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [formatError, setFormatError] = useState("");
  const languagePickerRef = useRef<HTMLDivElement | null>(null);

  const visibleLanguages = useMemo(
    () =>
      LANGUAGE_OPTIONS.filter((item) =>
        item.label.toLowerCase().includes(languageSearch.trim().toLowerCase()),
      ),
    [languageSearch],
  );

  const runFormat = async () => {
    if (!sourceCode.trim()) {
      setFormattedCode("");
      setFormatError("");
      return;
    }

    try {
      const output = await format(sourceCode, {
        parser: selectedLanguage.parser,
        plugins: prettierPlugins,
      });
      setFormattedCode(output);
      setFormatError("");
    } catch {
      setFormatError(`Cannot format this input as ${selectedLanguage.label}.`);
    }
  };

  useEffect(() => {
    if (!sourceCode.trim()) {
      setFormattedCode("");
      setFormatError("");
      return;
    }
    void runFormat();
  }, [selectedLanguage.key]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!languagePickerRef.current) return;
      if (!languagePickerRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const highlightedHtml = useMemo(() => {
    if (!formattedCode) return "";
    const grammar = Prism.languages[selectedLanguage.prism];
    if (!grammar) return escapeHtml(formattedCode);
    return Prism.highlight(formattedCode, grammar, selectedLanguage.prism);
  }, [formattedCode, selectedLanguage.prism]);

  return (
    <section className="tool-card tool-result-pop full-height formatter-tool">
      <header className="tool-header stagger-1">
        <h2>Code Formatter</h2>
        <p>Format source code with language-aware rules.</p>
      </header>

      <div className="formatter-controls stagger-2">
        <div className="language-picker" ref={languagePickerRef}>
          <button
            type="button"
            className="compact-input picker-button"
            onClick={() => setShowLanguageDropdown((value) => !value)}
          >
            <span>{selectedLanguage.label}</span>
            <Icon icon="tabler:chevron-down" width="16" />
          </button>

          {showLanguageDropdown ? (
            <div className="picker-popover">
              <div className="picker-search">
                <Icon icon="tabler:search" width="14" />
                <input
                  type="text"
                  value={languageSearch}
                  onChange={(event) => setLanguageSearch(event.target.value)}
                  placeholder="Search language"
                />
              </div>
              <div className="picker-options">
                {visibleLanguages.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`picker-option ${selectedLanguage.key === item.key ? "active" : ""}`}
                    onClick={() => {
                      setSelectedLanguage(item);
                      setLanguageSearch("");
                      setShowLanguageDropdown(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="action-button primary"
          onClick={() => void runFormat()}
        >
          <Icon icon="tabler:sparkles" width="16" />
          Format
        </button>
      </div>

      <div className="formatter-grid stagger-3">
        <div className="formatter-column">
          <div className="output-head formatter-head">
            <label className="field-label" htmlFor="formatterInput">
              Input
            </label>
            <span className="ghost-copy">Copy</span>
          </div>
          <textarea
            id="formatterInput"
            className="editor-area formatter-input"
            value={sourceCode}
            onChange={(event) => setSourceCode(event.target.value)}
            placeholder="Paste code here"
          />
        </div>

        <div className="formatter-column">
          <div className="output-head formatter-head">
            <label className="field-label" htmlFor="formatterOutput">
              Formatted Output
            </label>
            <CopyButton
              value={formattedCode}
              onCopied={onToast}
              disabled={!formattedCode}
            />
          </div>
          <div id="formatterOutput" className={`code-preview ${theme}`}>
            {formattedCode ? (
              <pre>
                <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              </pre>
            ) : (
              <p className="empty-code">Formatted code will appear here.</p>
            )}
          </div>
          {formatError ? <p className="error-meta">{formatError}</p> : null}
        </div>
      </div>
    </section>
  );
}
