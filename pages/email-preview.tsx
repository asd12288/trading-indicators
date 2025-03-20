import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NewSubscriptionEmail } from '../components/emails/NewSubscriptionEmail';

export default function EmailPreview() {
  const [formData, setFormData] = useState({
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    plan: 'Premium Plan',
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    showPriceGraph: true,
  });

  // Generate sample price data for the graph
  const generateSamplePrices = () => {
    // Create a realistic looking price trend with some fluctuation
    const trend = Math.random() > 0.5 ? 1 : -1; // random up or down trend
    const startPrice = 100 + Math.random() * 50;
    const prices = [];
    
    for (let i = 0; i < 15; i++) {
      // Add some randomness to create a natural looking chart
      const randomFactor = (Math.random() - 0.5) * 2;
      const trendFactor = trend * (i / 15) * 5;
      prices.push(startPrice + trendFactor + randomFactor);
    }
    
    return prices;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Generate the sample price data
  const samplePrices = generateSamplePrices();

  // Render the email component to HTML
  const emailHtml = renderToStaticMarkup(
    <NewSubscriptionEmail
      userName={formData.userName}
      userEmail={formData.userEmail}
      plan={formData.plan}
      expirationDate={formData.expirationDate}
      priceHistory={formData.showPriceGraph ? samplePrices : []}
    />
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Email Template Preview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Email Parameters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">User Email</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plan</label>
              <input
                type="text"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPriceGraph"
                name="showPriceGraph"
                checked={formData.showPriceGraph}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="showPriceGraph" className="text-sm font-medium">
                Show Price Graph
              </label>
            </div>
            
            {formData.showPriceGraph && (
              <div className="mt-2">
                <button
                  onClick={() => setFormData(prev => ({ ...prev }))} // Trigger re-render with new random data
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Generate New Sample Data
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg shadow overflow-hidden">
          <div className="bg-gray-200 px-4 py-2 flex items-center justify-between">
            <h2 className="font-medium">Email Preview</h2>
            <button 
              className="text-blue-600 text-sm hover:underline"
              onClick={() => {
                const win = window.open('', '_blank');
                if (win) {
                  win.document.write(emailHtml);
                  win.document.close();
                }
              }}
            >
              Open in New Tab
            </button>
          </div>
          <div className="h-[600px] overflow-auto">
            <iframe
              srcDoc={emailHtml}
              title="Email Preview"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
