CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('signal', 'alert', 'system', 'account')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    link TEXT,
    additional_data JSONB DEFAULT '{}'::jsonb,
    
    -- Optional fields for enhanced functionality
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    group_id TEXT -- For grouping related notifications
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- Fix: Change USING to WITH CHECK for INSERT policy
CREATE POLICY "Service role can insert notifications" 
ON public.notifications FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Alternative policy if you need both authenticated users and service role to insert
-- CREATE POLICY "Users and service can insert notifications" 
-- ON public.notifications FOR INSERT
-- WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'service_role');
