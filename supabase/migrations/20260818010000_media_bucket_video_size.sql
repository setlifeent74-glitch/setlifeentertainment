-- §41 Screening Room video upload — the `media` bucket had no explicit
-- file_size_limit, so it inherited the project default (often 50MB), too
-- small for uploaded video clips. Raise it to 500MB for this bucket only.
update storage.buckets set file_size_limit = 524288000 where id = 'media';
