import { Canvas } from "@/components/canvas/Canvas";
import MOCK_PROFILE from "@/data/mockProfile";

export default function Home() {
  return (
    <main className="w-full h-full">
      <Canvas
        profile={MOCK_PROFILE}
        initialAlbumId={null}
        initialPhotoId={null}
      />
    </main>
  );
}

