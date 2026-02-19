import React, { useState, useRef } from 'react';
import { AppStatus, GenerationResult } from './types';
import { generateGhibliStyle } from './services/geminiService';
import { Button } from './components/Button';
import { DeploymentGuide } from './components/DeploymentGuide';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
      return;
    }

    try {
      setStatus(AppStatus.PROCESSING_IMAGE);
      setError(null);
      
      // Create local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setResult({
          originalImage: base64,
          generatedImage: '' // Placeholder
        });
        // Immediately start generation after preview is ready
        startGeneration(file);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process image.");
      setStatus(AppStatus.ERROR);
    }
  };

  const startGeneration = async (file: File) => {
    setStatus(AppStatus.GENERATING);
    try {
      const generatedImage = await generateGhibliStyle(file);
      setResult(prev => prev ? { ...prev, generatedImage } : null);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setError("Failed to generate Ghibli style. Please try again or use a smaller image.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (result?.generatedImage) {
      const link = document.createElement('a');
      link.href = result.generatedImage;
      link.download = 'ghibli-style-photo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStatus(AppStatus.IDLE);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 flex flex-col font-sans">
      
      {/* Header */}
      <header className="py-6 px-4 md:px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <h1 className="text-2xl font-bold text-ghibli-dark tracking-tight">Ghibli<span className="text-ghibli-grass">fy</span></h1>
          </div>
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="text-sm font-medium text-gray-500 hover:text-ghibli-blue transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            How to Launch
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 flex flex-col items-center justify-center">
        
        {status === AppStatus.IDLE && (
          <div className="text-center max-w-2xl animate-float">
            <h2 className="text-5xl md:text-6xl font-bold text-ghibli-dark mb-6 leading-tight">
              Turn your world into <br/> <span className="text-ghibli-blue">Anime Magic</span>
            </h2>
            <p className="text-xl text-gray-500 mb-10">
              Upload a photo and watch it transform into a lush, hand-painted masterpiece inspired by Studio Ghibli.
            </p>
            
            <div className="relative group cursor-pointer">
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="bg-white border-2 border-dashed border-ghibli-green group-hover:border-ghibli-grass rounded-2xl p-12 transition-all shadow-sm group-hover:shadow-lg flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-2">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-lg font-semibold text-gray-700">Click to upload a photo</span>
                <span className="text-sm text-gray-400">JPG or PNG up to 5MB</span>
              </div>
            </div>
          </div>
        )}

        {(status === AppStatus.PROCESSING_IMAGE || status === AppStatus.GENERATING || status === AppStatus.SUCCESS || status === AppStatus.ERROR) && result && (
          <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-500">
            
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={handleReset} disabled={status === AppStatus.GENERATING}>
                ← Upload New
              </Button>
              {status === AppStatus.SUCCESS && (
                <Button onClick={handleDownload}>
                  Download Art ⬇
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Original */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-500 uppercase tracking-wider text-sm">Original</h3>
                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-gray-100 group">
                  <img src={result.originalImage} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Generated */}
              <div className="space-y-3">
                <h3 className="font-semibold text-ghibli-grass uppercase tracking-wider text-sm flex items-center gap-2">
                  {status === AppStatus.GENERATING ? 'Painting...' : 'Ghibli Style'}
                  {status === AppStatus.GENERATING && <span className="inline-block w-2 h-2 bg-ghibli-grass rounded-full animate-ping"></span>}
                </h3>
                
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100 flex items-center justify-center border-4 border-white ring-1 ring-gray-100">
                  {status === AppStatus.SUCCESS && result.generatedImage ? (
                    <img src={result.generatedImage} alt="Ghibli Style" className="w-full h-full object-cover animate-in fade-in duration-1000" />
                  ) : (
                    <div className="flex flex-col items-center p-6 text-center">
                       {status === AppStatus.ERROR ? (
                          <>
                            <span className="text-4xl mb-4">😿</span>
                            <p className="text-red-500 font-medium">{error || "Something went wrong."}</p>
                          </>
                       ) : (
                          <>
                            <div className="w-16 h-16 border-4 border-ghibli-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium animate-pulse">
                              The spirits are at work...<br/>
                              <span className="text-sm text-gray-400 mt-2 font-normal">This may take a few moments</span>
                            </p>
                          </>
                       )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 text-center text-gray-400 text-sm bg-white/50">
        <p>Powered by Google Gemini AI ✦ Made with React & Tailwind</p>
      </footer>

      {/* Deployment Modal */}
      <DeploymentGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

    </div>
  );
};

export default App;