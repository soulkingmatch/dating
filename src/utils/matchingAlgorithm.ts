import type { Profile } from '../types/profile';

export function calculateAIMatchScore(user1: Profile, user2: Profile): number {
  let score = 0;
  let total = 0;

  // Common AI tools (30%)
  const commonTools = user1.ai_tools.filter(t => 
    user2.ai_tools.includes(t)
  ).length;
  score += (commonTools / Math.max(user1.ai_tools.length, user2.ai_tools.length)) * 30;
  total += 30;

  // Common AI interests (30%)
  const commonInterests = user1.ai_interests.filter(i => 
    user2.ai_interests.includes(i)
  ).length;
  score += (commonInterests / Math.max(user1.ai_interests.length, user2.ai_interests.length)) * 30;
  total += 30;

  // Common LLMs (20%)
  const commonLLMs = user1.favorite_llms.filter(l => 
    user2.favorite_llms.includes(l)
  ).length;
  score += (commonLLMs / Math.max(user1.favorite_llms.length, user2.favorite_llms.length)) * 20;
  total += 20;

  // AI use case similarity (20%) - basic text similarity
  const useCaseSimilarity = calculateTextSimilarity(
    user1.ai_use_case || '',
    user2.ai_use_case || ''
  );
  score += useCaseSimilarity * 20;
  total += 20;

  return Math.round((score / total) * 100);
}

function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;
  
  const words1 = new Set(text1.toLowerCase().split(/\W+/));
  const words2 = new Set(text2.toLowerCase().split(/\W+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}