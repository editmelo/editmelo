-- Harden the has_role function security

-- Revoke execute from public (anonymous users)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;

-- Only authenticated users can call this function
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Recreate the function with additional security: 
-- Only allow checking roles for the current authenticated user OR by service role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security check: only allow checking your own role or if called from service context
  -- auth.uid() returns NULL for service role, so we allow that case for admin operations
  IF auth.uid() IS NOT NULL AND auth.uid() != _user_id THEN
    -- User is trying to check someone else's role - deny
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;