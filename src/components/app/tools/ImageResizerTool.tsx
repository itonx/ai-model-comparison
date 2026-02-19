import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

type ImageResizerToolProps = {};

type ImageMeta = {
  width: number;
  height: number;
  sizeKB: number;
  name: string;
};

const formatKB = (size: number) => `${(size / 1024).toFixed(1)} KB`;

export default function ImageResizerTool(_: ImageResizerToolProps) {
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [sourceMeta, setSourceMeta] = useState<ImageMeta | null>(null);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputMeta, setOutputMeta] = useState<ImageMeta | null>(null);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    return () => {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
      }
    };
  }, [outputUrl]);

  const readImageFile = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read image file"));
      reader.readAsDataURL(file);
    });

    const bitmap = await createImageBitmap(file);

    setSourceDataUrl(dataUrl);
    setSourceMeta({
      width: bitmap.width,
      height: bitmap.height,
      sizeKB: file.size / 1024,
      name: file.name,
    });
    setTargetWidth(bitmap.width);
    setTargetHeight(bitmap.height);
    setErrorText("");
  };

  const onImagePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await readImageFile(file);
    } catch {
      setErrorText("Unable to load this image.");
    }
  };

  const resizeImage = async () => {
    if (!sourceDataUrl || !sourceMeta) {
      setErrorText("Upload an image first.");
      return;
    }

    const safeWidth = Math.max(1, Math.trunc(targetWidth));
    const safeHeight = Math.max(1, Math.trunc(targetHeight));

    const image = new Image();
    image.src = sourceDataUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to decode source image"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = safeWidth;
    canvas.height = safeHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setErrorText("Canvas is not available in this browser.");
      return;
    }

    context.drawImage(image, 0, 0, safeWidth, safeHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((nextBlob) => resolve(nextBlob), "image/png");
    });

    if (!blob) {
      setErrorText("Unable to create resized image.");
      return;
    }

    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }

    const nextUrl = URL.createObjectURL(blob);
    setOutputUrl(nextUrl);
    setOutputMeta({
      width: safeWidth,
      height: safeHeight,
      sizeKB: blob.size / 1024,
      name: sourceMeta.name,
    });
    setErrorText("");
  };

  const onWidthChange = (value: number) => {
    setTargetWidth(value);
    if (keepAspectRatio && sourceMeta) {
      const nextHeight = Math.max(
        1,
        Math.round((value / sourceMeta.width) * sourceMeta.height),
      );
      setTargetHeight(nextHeight);
    }
  };

  const onHeightChange = (value: number) => {
    setTargetHeight(value);
    if (keepAspectRatio && sourceMeta) {
      const nextWidth = Math.max(
        1,
        Math.round((value / sourceMeta.height) * sourceMeta.width),
      );
      setTargetWidth(nextWidth);
    }
  };

  const downloadResized = () => {
    if (!outputUrl) return;
    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = "code-alchemy-resized.png";
    link.click();
  };

  return (
    <section className="tool-card tool-result-pop full-height image-tool">
      <header className="tool-header stagger-1">
        <h2>Image Resizer</h2>
        <p>Resize image dimensions with optional aspect ratio lock.</p>
      </header>

      <div className="output-head stagger-2">
        <label className="field-label" htmlFor="resizeImageInput">
          Input Image
        </label>
        <label className="action-button upload" htmlFor="resizeImageInput">
          <Icon icon="tabler:upload" width="16" />
          Upload
        </label>
        <input
          id="resizeImageInput"
          type="file"
          accept="image/*"
          onChange={(event) => void onImagePicked(event)}
        />
      </div>

      <div className="image-config-grid stagger-3">
        <div className="option-card">
          <label className="field-label option-label" htmlFor="resizeWidth">
            Width
          </label>
          <input
            id="resizeWidth"
            className="compact-input"
            type="number"
            min={1}
            value={targetWidth || ""}
            onChange={(event) => onWidthChange(Number(event.target.value || 1))}
          />
        </div>

        <div className="option-card">
          <label className="field-label option-label" htmlFor="resizeHeight">
            Height
          </label>
          <input
            id="resizeHeight"
            className="compact-input"
            type="number"
            min={1}
            value={targetHeight || ""}
            onChange={(event) =>
              onHeightChange(Number(event.target.value || 1))
            }
          />
        </div>

        <label className="check-row check-card image-check">
          <input
            type="checkbox"
            checked={keepAspectRatio}
            onChange={(event) => setKeepAspectRatio(event.target.checked)}
          />
          Keep aspect ratio
        </label>
      </div>

      <div className="tool-actions stagger-4">
        <button
          type="button"
          className="action-button primary"
          onClick={() => void resizeImage()}
        >
          <Icon icon="tabler:dimensions" width="16" />
          Resize Image
        </button>
        <button
          type="button"
          className="action-button"
          onClick={downloadResized}
          disabled={!outputUrl}
        >
          <Icon icon="tabler:download" width="16" />
          Download
        </button>
      </div>

      {errorText ? <p className="error-meta">{errorText}</p> : null}

      <div className="image-preview-grid">
        <div className="image-panel">
          <p className="field-label">Original</p>
          {sourceDataUrl ? (
            <img src={sourceDataUrl} alt="Original upload" />
          ) : (
            <p className="empty-code">Upload an image to preview.</p>
          )}
          {sourceMeta ? (
            <p className="file-meta">
              {sourceMeta.width}x{sourceMeta.height} •{" "}
              {formatKB(sourceMeta.sizeKB * 1024)}
            </p>
          ) : null}
        </div>

        <div className="image-panel">
          <p className="field-label">Resized</p>
          {outputUrl ? (
            <img src={outputUrl} alt="Resized output" />
          ) : (
            <p className="empty-code">Resized image appears here.</p>
          )}
          {outputMeta ? (
            <p className="file-meta">
              {outputMeta.width}x{outputMeta.height} •{" "}
              {formatKB(outputMeta.sizeKB * 1024)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
