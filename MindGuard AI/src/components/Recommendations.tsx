import { Lightbulb, Phone, Calendar, Heart, ExternalLink } from 'lucide-react';
import type { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'immediate': return <Phone className="w-5 h-5" />;
      case 'short_term': return <Calendar className="w-5 h-5" />;
      case 'long_term': return <Heart className="w-5 h-5" />;
    }
  };
  
  const getCategoryStyles = (category: Recommendation['category']) => {
    switch (category) {
      case 'immediate': return 'bg-red-100 text-red-700 border-red-200';
      case 'short_term': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'long_term': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
        <div className="flex items-center space-x-3 text-white">
          <Lightbulb className="w-5 h-5" />
          <h3 className="font-semibold">Recommendations</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {recommendations.map(rec => (
          <div key={rec.id} className={`p-3 rounded-lg border ${getCategoryStyles(rec.category)}`}>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {getCategoryIcon(rec.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{rec.title}</h4>
                  <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-white/50">
                    {rec.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-80">{rec.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {rec.resources.map((resource, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center space-x-1 text-xs bg-white/50 px-2 py-0.5 rounded-full cursor-pointer hover:bg-white transition-colors"
                    >
                      <span>{resource}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
