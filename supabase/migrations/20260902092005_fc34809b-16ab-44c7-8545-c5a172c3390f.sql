CREATE POLICY "Anyone can upload reel videos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'reel-videos');