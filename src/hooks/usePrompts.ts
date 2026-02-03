import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type PredefinedPrompt = {
  id: string;
  title: string;
  prompt: string;
  category: string;
  icon: string | null;
};

export type PopularPrompt = {
  id: string;
  prompt: string;
  search_count: number;
};

export function usePrompts() {
  const [predefinedPrompts, setPredefinedPrompts] = useState<PredefinedPrompt[]>([]);
  const [popularPrompts, setPopularPrompts] = useState<PopularPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrompts = async () => {
    setIsLoading(true);
    
    const [predefinedResult, popularResult] = await Promise.all([
      supabase
        .from('predefined_prompts')
        .select('*')
        .order('created_at', { ascending: true }),
      supabase
        .from('popular_prompts')
        .select('*')
        .order('search_count', { ascending: false })
        .limit(10),
    ]);

    if (predefinedResult.data) setPredefinedPrompts(predefinedResult.data);
    if (popularResult.data) setPopularPrompts(popularResult.data);
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  return {
    predefinedPrompts,
    popularPrompts,
    isLoading,
    refetchPrompts: fetchPrompts,
  };
}