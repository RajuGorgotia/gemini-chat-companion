-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create popular prompts table to track most searched
CREATE TABLE public.popular_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL UNIQUE,
  search_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predefined prompts table
CREATE TABLE public.predefined_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predefined_prompts ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no auth required for this app)
CREATE POLICY "Public read access for conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Public insert access for conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for conversations" ON public.conversations FOR UPDATE USING (true);
CREATE POLICY "Public delete access for conversations" ON public.conversations FOR DELETE USING (true);

CREATE POLICY "Public read access for messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public insert access for messages" ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for popular_prompts" ON public.popular_prompts FOR SELECT USING (true);
CREATE POLICY "Public insert access for popular_prompts" ON public.popular_prompts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for popular_prompts" ON public.popular_prompts FOR UPDATE USING (true);

CREATE POLICY "Public read access for predefined_prompts" ON public.predefined_prompts FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_popular_prompts_updated_at
  BEFORE UPDATE ON public.popular_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert predefined prompts
INSERT INTO public.predefined_prompts (title, prompt, category, icon) VALUES
  ('Write a story', 'Write a creative short story about', 'creative', 'BookOpen'),
  ('Explain concept', 'Explain the following concept in simple terms:', 'learning', 'Lightbulb'),
  ('Code help', 'Help me write code for', 'coding', 'Code'),
  ('Summarize text', 'Summarize the following text:', 'productivity', 'FileText'),
  ('Brainstorm ideas', 'Brainstorm creative ideas for', 'creative', 'Sparkles'),
  ('Plan my day', 'Help me plan and organize my day with the following tasks:', 'productivity', 'Calendar'),
  ('Learn language', 'Teach me basic phrases in', 'learning', 'Globe'),
  ('Recipe suggestion', 'Suggest a delicious recipe using these ingredients:', 'lifestyle', 'ChefHat');