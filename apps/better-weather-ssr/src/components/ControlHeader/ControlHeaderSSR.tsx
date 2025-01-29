// src/components/ControlHeaderServer.tsx
import dynamic from "next/dynamic";

// Dynamically import the client-side component
const ControlHeaderClient = dynamic(() => import("./ControlHeaderClient"), {
  ssr: false, // Disable SSR for the client component
});

// Server Component
export default function ControlHeaderSSR(userLocation?: any) {
  try {
    return (
      <div className="min-h-[130px] w-full">
        {/* Pass preloaded data to the client component */}
        <ControlHeaderClient  />
      </div>
    );
  } catch (error) {
    console.error("Error in ControlHeaderSSR:", error);

    // Render fallback UI
    return (
      <div className="min-h-[130px] w-full">
        <ControlHeaderClient  />
      </div>
    );
  }
}


