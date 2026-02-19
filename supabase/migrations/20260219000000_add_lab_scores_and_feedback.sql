-- Create lab_scores table for storing student quiz scores
CREATE TABLE public.lab_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  lab_id TEXT NOT NULL,
  lab_title TEXT NOT NULL,
  quiz_score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS (quiz_score::DECIMAL / total_questions * 100) STORED,
  passed BOOLEAN GENERATED ALWAYS AS (quiz_score::DECIMAL / total_questions >= 0.75) STORED,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table for user feedback
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  feedback_type TEXT NOT NULL, -- 'suggestion', 'bug', 'feedback', 'praise'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER, -- 1-5 star rating
  related_lab TEXT, -- name of related lab if applicable
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'read', 'addressed'
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lab_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for lab_scores
CREATE POLICY "Users can view their own lab scores"
ON public.lab_scores
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lab scores"
ON public.lab_scores
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all lab scores"
ON public.lab_scores
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
    AND p.email = 'doniyal123@gmail.com'
  )
);

-- Create policies for user_feedback
CREATE POLICY "Users can view their own feedback"
ON public.user_feedback
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert feedback"
ON public.user_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
ON public.user_feedback
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
ON public.user_feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
    AND p.email = 'doniyal123@gmail.com'
  )
);

CREATE POLICY "Admins can update all feedback"
ON public.user_feedback
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
    AND p.email = 'doniyal123@gmail.com'
  )
);

-- Create indexes for better query performance
CREATE INDEX idx_lab_scores_user_id ON public.lab_scores(user_id);
CREATE INDEX idx_lab_scores_lab_id ON public.lab_scores(lab_id);
CREATE INDEX idx_lab_scores_created_at ON public.lab_scores(created_at);
CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX idx_user_feedback_status ON public.user_feedback(status);
CREATE INDEX idx_user_feedback_created_at ON public.user_feedback(created_at);
