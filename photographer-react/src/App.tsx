import { Providers } from "@/components/canvas/Providers";
import Home from "./pages/home";

export default function App() {
  return (
    <div className="h-full bg-white dark:bg-black">
      <Providers>
        <Home />
      </Providers>
    </div>
  );
}