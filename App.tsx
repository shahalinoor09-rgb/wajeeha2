
import React, { useState, useCallback } from 'react';
import { AdTone, Platform, AdRequest, AdVariation } from './types';
import { generateAdCopy } from './services/geminiService';
import { Button } from './components/Button';
import { AdCard } from './components/AdCard';

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Japanese", "Chinese", "Hindi", "Portuguese", "Italian"
];

const App: React.FC = () => {
  const [formData, setFormData] = useState<AdRequest>({
    productName: '',
    targetAudience: '',
    tone: AdTone.PROFESSIONAL,
    features: '',
    language: 'English',
    platforms: [Platform.FACEBOOK, Platform.EMAIL, Platform.SLOGAN]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AdVariation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refinement, setRefinement] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformToggle = (platform: Platform) => {
    setFormData(prev => {
      const isSelected = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: isSelected 
          ? prev.platforms.filter(p => p !== platform)
          : [...prev.platforms, platform]
      };
    });
  };

  const handleGenerate = async (feedback?: string) => {
    if (!formData.productName || !formData.targetAudience || !formData.features) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateAdCopy(formData, feedback);
      setResults(response.variations);
    } catch (err) {
      setError('Failed to generate ad copy. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefine = () => {
    if (!refinement.trim()) return;
    handleGenerate(refinement);
    setRefinement('');
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">AdVantage <span className="text-blue-600">AI</span></h1>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Powered by Gemini 3
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                Configure Ad Campaign
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product or Service Name*</label>
                  <input 
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="e.g. Luminar Pro Software"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Target Audience*</label>
                  <input 
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="e.g. Freelance designers (25-40)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Tone</label>
                    <select 
                      name="tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {Object.values(AdTone).map(tone => <option key={tone} value={tone}>{tone}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Language</label>
                    <select 
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Key Features/Benefits*</label>
                  <textarea 
                    name="features"
                    rows={4}
                    value={formData.features}
                    onChange={handleInputChange}
                    placeholder="e.g. 50% faster rendering, 24/7 support, AI-powered automation..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Selected Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(Platform).map(platform => (
                      <button
                        key={platform}
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          formData.platforms.includes(platform)
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                  </div>
                )}

                <Button 
                  onClick={() => handleGenerate()} 
                  isLoading={isLoading}
                  className="w-full py-3 text-lg"
                >
                  Generate Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8 space-y-6">
            {!results.length && !isLoading ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Copy Generated Yet</h3>
                <p className="text-gray-500 max-w-sm">
                  Fill in your product details on the left and click "Generate Copy" to see AI-powered marketing variations.
                </p>
              </div>
            ) : null}

            {isLoading && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Crafting your message...</h3>
                <p className="text-gray-500 animate-pulse">Gemini 3 is thinking creatively...</p>
              </div>
            )}

            {results.length > 0 && !isLoading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Campaign Variations</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Ready for use
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((variation, index) => (
                    <AdCard key={variation.id || index} variation={variation} />
                  ))}
                </div>

                {/* Refinement Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    Refine Results
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Not quite right? Ask the AI to make it more exciting, shorter, or focus on a specific feature.
                  </p>
                  <div className="flex gap-2">
                    <input 
                      value={refinement}
                      onChange={(e) => setRefinement(e.target.value)}
                      placeholder="e.g. Make it sound more luxurious and focus on the price..."
                      className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Button 
                      variant="secondary" 
                      onClick={onRefine}
                      isLoading={isLoading}
                      disabled={!refinement}
                    >
                      Refine
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 pt-8 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} AdVantage AI Generator. All high-quality content is generated using Gemini-3-Flash.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
