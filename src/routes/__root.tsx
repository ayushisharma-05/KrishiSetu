import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { OfflineIndicator } from "@/components/OfflineIndicator";

// Font side-effect imports — bundled CSS loaded once.
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/600.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/500.css";
import "@fontsource/noto-sans-bengali/400.css";
import "@fontsource/noto-sans-tamil/400.css";
import "@fontsource/noto-sans-telugu/400.css";
import "@fontsource/noto-sans-gujarati/400.css";
import "@fontsource/noto-sans-kannada/400.css";
import "@fontsource/noto-sans-malayalam/400.css";
import "@fontsource/noto-sans-oriya/400.css";
import "@fontsource/noto-nastaliq-urdu/400.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-medium text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found.</p>
        <a href="/home" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark">
          Go home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-medium">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "KrishiSetu — Smart Farming for Indian Farmers" },
      { name: "description", content: "Crop planning, harvest timing, pest alerts, mandi prices & water budget — in 11 Indian languages." },
      { name: "theme-color", content: "#1D9E75" },
      { property: "og:title", content: "KrishiSetu — Smart Farming for Indian Farmers" },
      { property: "og:description", content: "Crop planning, harvest timing, pest alerts, mandi prices & water budget — in 11 Indian languages." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "KrishiSetu — Smart Farming for Indian Farmers" },
      { name: "twitter:description", content: "Crop planning, harvest timing, pest alerts, mandi prices & water budget — in 11 Indian languages." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/718115b6-4f14-44da-a0ef-ead2fc6361a2/id-preview-7e1d2199--c53b18d8-bef1-4d83-a4b6-ca03f8a511c7.lovable.app-1779874520084.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/718115b6-4f14-44da-a0ef-ead2fc6361a2/id-preview-7e1d2199--c53b18d8-bef1-4d83-a4b6-ca03f8a511c7.lovable.app-1779874520084.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
    });
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => subscription.unsubscribe();
  }, [router]);
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Outlet />
          <OfflineIndicator />
          <Toaster position="top-right" />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
