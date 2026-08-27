import type { ValidationMessage } from "../../lib/types";

export function ValidationPanel({ messages }: { messages: ValidationMessage[] }) {
  return <div className="panel"><div className="panel-head"><h3>검증 및 안내</h3><span>{messages.length}건</span></div><div className="validation-list">{messages.map((item, index) => <div className="validation-item" key={`${item.message}-${index}`}><span className={`validation-icon ${item.severity}`}>{item.severity === "error" ? "!" : item.severity === "warn" ? "△" : "i"}</span><span>{item.message}{item.field ? <small style={{ display: "block", color: "#8190a0" }}>대상: {item.field}</small> : null}</span></div>)}</div></div>;
}
