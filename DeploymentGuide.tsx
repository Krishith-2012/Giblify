import React from 'react';
import { DeploymentGuideProps } from '../types';

export const DeploymentGuide: React.FC<DeploymentGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-ghibli-dark">Launch Instructions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Launch as a Website</h3>
            </div>
            <div className="prose text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p>Since this is a React app, you can deploy it instantly to Vercel or Netlify.</p>
              <ol className="list-decimal ml-5 mt-2 space-y-2">
                <li>Push this code to a <strong>GitHub</strong> repository.</li>
                <li>Go to <a href="https://vercel.com" target="_blank" className="text-blue-500 underline">Vercel.com</a> and sign in.</li>
                <li>Click <strong>"Add New Project"</strong> and select your repository.</li>
                <li>
                  <strong>Important:</strong> In the environment variables section, add your 
                  <code className="bg-gray-200 px-1 rounded mx-1">API_KEY</code> from Google AI Studio.
                </li>
                <li>Click <strong>Deploy</strong>. Your app is now live on the web!</li>
              </ol>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Launch as an Android App</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">Option A: Capacitor (Recommended for React)</h4>
                <p className="text-sm text-gray-600 mb-2">Capacitor wraps your React app into a native Android container.</p>
                <code className="block bg-gray-800 text-white p-3 rounded-lg text-sm overflow-x-auto">
                  npm install @capacitor/core @capacitor/cli @capacitor/android<br/>
                  npx cap init [AppName] [com.example.app]<br/>
                  npm run build<br/>
                  npx cap add android<br/>
                  npx cap open android
                </code>
                <p className="text-xs text-gray-500 mt-2">This opens Android Studio where you can hit "Run" to install on a device.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">Option B: Trusted Web Activity (TWA)</h4>
                <p className="text-sm text-gray-600">
                  If you have deployed the website (Step 1), you can use <strong>Bubblewrap</strong> to package the URL as an APK.
                  This requires no code changes, just your website URL.
                </p>
                <div className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">
                  <a href="https://github.com/GoogleChromeLabs/bubblewrap" target="_blank">View Bubblewrap Documentation &rarr;</a>
                </div>
              </div>
            </div>
          </section>

        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};