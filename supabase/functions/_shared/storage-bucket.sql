
-- Create storage bucket for uploaded CVs
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploaded-cvs', 'uploaded-cvs', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Users can upload their own CVs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'uploaded-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own CVs" ON storage.objects
FOR SELECT USING (bucket_id = 'uploaded-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CVs" ON storage.objects
FOR DELETE USING (bucket_id = 'uploaded-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
