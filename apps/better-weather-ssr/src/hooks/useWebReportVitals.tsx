import { onLCP, onTTFB, onFCP, onCLS } from "web-vitals";

export function useCollectWebVitals() {
  onCLS(console.log);
  onLCP(console.log);
  onTTFB(console.log);
  onFCP(console.log);
}