import { crossCuttingSystems, platformLayers } from '@/app/data/portfolio';

export function ArchitectureDiagram() {
  return (
    <div className="architecture-card" aria-label="Local AI engineering platform architecture">
      <div className="architecture-topline">
        <span className="live-dot" aria-hidden="true" />
        Local AI engineering platform
        <span className="architecture-scope">single machine · explicit evidence</span>
      </div>

      <div className="architecture-flow">
        {platformLayers.map((layer, index) => (
          <div className="architecture-step" key={layer.label}>
            <div className="architecture-index" aria-hidden="true">0{index + 1}</div>
            <div>
              <p>{layer.label}</p>
              <ul>
                {layer.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="architecture-crosscut">
        <p>Cross-cutting controls</p>
        <div>
          {crossCuttingSystems.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>

      <div className="hardware-base">
        <span>Hardware boundary</span>
        <strong>RTX 3050 · Ryzen 7 · 32 GB RAM</strong>
      </div>
    </div>
  );
}
