import { useState } from "react";

function Home() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const startMockUpload = () => {
    setProgress(0);
    let v = 0;
    const i = setInterval(() => {
      v += 10;
      setProgress(v);
      if (v >= 100) clearInterval(i);
    }, 200);
  };

  return (
    <div className="relative min-h-screen bg-[#0b0f19] text-white overflow-hidden">

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-violet-600/25 rounded-full blur-[160px]" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-fuchsia-500/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-indigo-500/15 rounded-full blur-[180px]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="relative z-30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
              N
            </div>
            <span className="font-medium tracking-wide">NeuroCore</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer">Technology</span>
            <span className="hover:text-white cursor-pointer">Use Cases</span>
            <span className="hover:text-white cursor-pointer">Integration</span>
            <span className="hover:text-white cursor-pointer">Docs</span>
            <span className="hover:text-white cursor-pointer">ENG</span>
          </nav>

          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
            ✉
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="relative z-20 flex flex-col items-center text-center px-6 pt-20">
        <h1 className="text-[58px] md:text-[74px] leading-[1.05] font-semibold tracking-tight">
          Elevate Your
          <br />
          <span className="font-bold">Retrieval Experience</span>
        </h1>

        <p className="mt-6 max-w-xl text-gray-400 text-base md:text-lg leading-relaxed">
          Unlock the raw potential of your data in a fully regulated neural
          environment. Powered by next-gen vector embeddings that connect
          the unconnected.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-10 px-9 py-3 rounded-full bg-white text-black font-medium hover:scale-[1.06] transition shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        >
          Initialize Sequence
        </button>
      </main>

      {/* ================= SCI-FI ORB CORE ================= */}
      <section className="relative z-10 mt-12 flex items-center justify-center h-[560px] pointer-events-none">

        {/* Core */}
        <div className="absolute z-20">
          <div className="relative w-16 h-16 bg-white rounded-full shadow-[0_0_90px_rgba(255,255,255,1)] animate-pulse">
            <div className="absolute inset-0 w-28 h-28 -translate-x-6 -translate-y-6 bg-white/20 rounded-full blur-xl animate-ping" />
          </div>
        </div>

        {/* Rings */}
        <div className="absolute w-[240px] h-[240px] border border-white/30 rounded-full animate-spin-slow" />
        <div className="absolute w-[360px] h-[360px] border border-white/20 rounded-full animate-spin-reverse" />
        <div className="absolute w-[520px] h-[520px] border border-white/10 rounded-full animate-spin-slower" />

        {/* Orbiting particles */}
        <span className="absolute top-1/2 right-[calc(50%-260px)] w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_12px_#818cf8]" />
        <span className="absolute bottom-[calc(50%-190px)] left-1/2 w-3 h-3 bg-fuchsia-400 rounded-full shadow-[0_0_16px_#e879f9]" />
        <span className="absolute top-[calc(50%-220px)] left-[calc(50%-180px)] w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_14px_#34d399]" />
      </section>

      {/* ================= FLOATING STATS ================= */}
      <div className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 glass-panel p-4 rounded-2xl w-56 z-30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 uppercase">Latency</span>
          <span className="text-xs">⚡</span>
        </div>
        <h3 className="text-lg font-medium">Unparalleled Query Speed</h3>
        <div className="mt-3 w-full h-1 bg-gray-700 rounded">
          <div className="h-full w-[94%] bg-emerald-400 rounded" />
        </div>
        <p className="mt-1 text-right text-xs text-emerald-400 font-mono">12ms</p>
      </div>

      <div className="hidden md:block absolute right-10 bottom-1/3 glass-panel p-4 rounded-2xl w-48 z-30">
        <span className="text-xs text-gray-400 uppercase">Accuracy</span>
        <div className="mt-2 text-4xl font-bold">
          98.4<span className="text-xl text-gray-400">%</span>
        </div>
        <p className="text-xs text-gray-400">Context Retention</p>
      </div>

      {/* ================= NEURAL LINK PILL ================= */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full flex items-center gap-3 z-30">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs tracking-widest font-mono text-gray-300">
          NEURAL LINK ACTIVE
        </span>
      </div>

      {/* ================= UPLOADER MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl p-8 rounded-2xl relative animate-fade-in">

            <button
              onClick={() => {
                setOpen(false);
                setFile(null);
                setProgress(0);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                ⬆
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Initialize Data Ingestion
              </h2>
              <p className="text-sm text-gray-400">
                Upload documents to begin vectorization
              </p>
            </div>

            <label className="block w-full h-48 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer flex flex-col items-center justify-center text-gray-400">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  startMockUpload();
                }}
              />
              <span className="text-4xl mb-2">📁</span>
              <span className="text-sm">
                {file ? file.name : "Click to upload a file"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PDF, TXT, MD, JSON
              </span>
            </label>

            {file && (
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Uploading</span>
                  <span className="text-violet-400">{progress}%</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded">
                  <div
                    className="h-full bg-violet-400 rounded transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!file || progress < 100}
                className="px-6 py-2 text-sm font-semibold rounded-full bg-white text-black disabled:opacity-40"
              >
                Start Embedding
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 mt-24 py-6 text-center text-xs text-gray-500">
        © 2023 NeuroCore Systems. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;
