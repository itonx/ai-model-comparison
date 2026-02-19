import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { createFormattedGuids } from "../utils/guid";

type GuidToolProps = {
  onToast: () => void;
};

export default function GuidTool({ onToast }: GuidToolProps) {
  const [guidOutput, setGuidOutput] = useState("");
  const [count, setCount] = useState(1);
  const [caseMode, setCaseMode] = useState<"lowercase" | "uppercase">(
    "lowercase",
  );
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [includeBraces, setIncludeBraces] = useState(false);

  const generateGuid = () => {
    const result = createFormattedGuids({
      count,
      caseMode,
      includeHyphens,
      includeBraces,
    });
    setGuidOutput(result.join("\n"));
  };

  return (
    <section className="tool-card tool-result-pop">
      <header className="tool-header stagger-1">
        <h2>GUID Generator</h2>
        <p>Create RFC 4122 UUID values instantly.</p>
      </header>

      <div className="guid-option-row stagger-2">
        <div className="option-card">
          <label className="field-label option-label" htmlFor="guidCountInput">
            Count
          </label>
          <input
            id="guidCountInput"
            className="compact-input"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value || 1))}
          />
        </div>

        <div className="option-card">
          <label className="field-label option-label" htmlFor="guidCaseMode">
            Case
          </label>
          <select
            id="guidCaseMode"
            className="compact-input"
            value={caseMode}
            onChange={(event) =>
              setCaseMode(event.target.value as "lowercase" | "uppercase")
            }
          >
            <option value="lowercase">lower</option>
            <option value="uppercase">upper</option>
          </select>
        </div>

        <div className="option-card">
          <label className="field-label option-label" htmlFor="guidHyphenMode">
            Hyphens
          </label>
          <select
            id="guidHyphenMode"
            className="compact-input"
            value={includeHyphens ? "with" : "without"}
            onChange={(event) =>
              setIncludeHyphens(event.target.value === "with")
            }
          >
            <option value="with">With hyphens</option>
            <option value="without">No hyphens</option>
          </select>
        </div>

        <div className="option-card">
          <label className="field-label option-label" htmlFor="guidBraceMode">
            Braces
          </label>
          <select
            id="guidBraceMode"
            className="compact-input"
            value={includeBraces ? "with" : "without"}
            onChange={(event) =>
              setIncludeBraces(event.target.value === "with")
            }
          >
            <option value="without">No braces</option>
            <option value="with">With braces</option>
          </select>
        </div>
      </div>

      <div className="tool-actions stagger-3">
        <button
          type="button"
          className="action-button primary"
          onClick={generateGuid}
        >
          <Icon icon="tabler:wand" width="16" />
          Generate GUID
        </button>
      </div>

      <div className="output-head stagger-4">
        <label className="field-label" htmlFor="guidOutput">
          Result
        </label>
        <CopyButton
          value={guidOutput}
          onCopied={onToast}
          disabled={!guidOutput}
        />
      </div>
      <textarea
        id="guidOutput"
        className="result-area"
        value={guidOutput}
        readOnly
        placeholder="Generated GUID will appear here"
      />
    </section>
  );
}
