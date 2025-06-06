
-- Create a storage bucket for resume exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('resume_exports', 'Resume Exports', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read items from the bucket
CREATE POLICY "Public Access to Resume Exports" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resume_exports');

-- Allow any authenticated user to upload to the bucket
CREATE POLICY "Authenticated users can upload resume exports" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resume_exports');
