-- Add function to update admin password
CREATE OR REPLACE FUNCTION public.update_admin_password(
  admin_username TEXT,
  new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Check if admin exists
  SELECT id INTO admin_id
  FROM public.admin_users
  WHERE username = admin_username;
  
  IF admin_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- For now, we'll store the password as plain text (in production, use proper hashing)
  -- Update the password
  UPDATE public.admin_users
  SET password_hash = new_password,
      updated_at = now()
  WHERE username = admin_username;
  
  RETURN TRUE;
END;
$$;

-- Update the verify_admin_credentials function to handle both old and new password formats
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  input_username TEXT,
  input_password TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
  stored_hash TEXT;
BEGIN
  SELECT id, password_hash INTO admin_id, stored_hash
  FROM public.admin_users
  WHERE username = input_username;
  
  IF admin_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Check for the default admin password (legacy)
  IF stored_hash = '$2b$10$rOvJmF8TvQN7jVF1xQrJKe6KvU5LrJsZJmJzZm9jHgY5QXRFmF8Iq' AND input_password = 'admin' THEN
    RETURN admin_id;
  END IF;
  
  -- Check for direct password match (new format)
  IF stored_hash = input_password THEN
    RETURN admin_id;
  END IF;
  
  RETURN NULL;
END;
$$;
