import { Icon } from "@iconify/react";
import { useState } from "react";
import QRCode from "qrcode";

type QrGeneratorToolProps = {
  onToast: () => void;
};

export default function QrGeneratorTool({ onToast }: QrGeneratorToolProps) {
  const [inputValue, setInputValue] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [errorText, setErrorText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateQr = async () => {
    if (!inputValue.trim()) {
      setQrDataUrl("");
      setErrorText("Enter text or URL to generate a QR code.");
      return;
    }

    try {
      const url = await QRCode.toDataURL(inputValue, {
        width: 320,
        margin: 1,
      });
      setQrDataUrl(url);
      setErrorText("");
    } catch {
      setErrorText("Unable to generate QR code for this input.");
    }
  };

  const copyQrImage = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();

      if (navigator.clipboard && "ClipboardItem" in window) {
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        setCopied(true);
        onToast();
        window.setTimeout(() => setCopied(false), 1200);
      }
    } catch {
      setErrorText("Unable to copy QR image.");
    }
  };

  return (
    <section className="tool-card tool-result-pop full-height">
      <header className="tool-header stagger-1">
        <h2>QR Generator</h2>
        <p>Create QR images from text or links.</p>
      </header>

      <label className="field-label stagger-2" htmlFor="qrInput">
        Text / URL
      </label>
      <textarea
        id="qrInput"
        className="editor-area stagger-3"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Paste URL or text"
      />

      <div className="tool-actions stagger-4">
        <button
          type="button"
          className="action-button primary"
          onClick={() => void generateQr()}
        >
          <Icon icon="tabler:qrcode" width="16" />
          Generate QR
        </button>
      </div>

      {errorText ? <p className="error-meta">{errorText}</p> : null}

      <div className="output-head">
        <label className="field-label">Output</label>
        <button
          type="button"
          className={`action-button ${copied ? "copied" : ""}`}
          onClick={() => {
            void copyQrImage();
          }}
          disabled={!qrDataUrl}
        >
          <Icon icon={copied ? "tabler:check" : "tabler:copy"} width="16" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {qrDataUrl ? (
        <div className="qr-preview">
          <img src={qrDataUrl} alt="Generated QR code" />
        </div>
      ) : (
        <p className="empty-code">QR preview appears here.</p>
      )}
    </section>
  );
}
