-- Enable row-level security for councils, districts, and units
ALTER TABLE public.councils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Policies to allow all authenticated users (including scouts, guardians, leaders, district/council members, providers) to read reference data
CREATE POLICY "read councils" ON public.councils FOR SELECT USING (true);
CREATE POLICY "read districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "read units" ON public.units FOR SELECT USING (true);
