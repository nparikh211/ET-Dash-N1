-- Create tables for Exordiom Talent Dashboard

-- CRM Entries Table
CREATE TABLE IF NOT EXISTS crm_entries (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('Contracted', 'Hired In-Seat', 'Terminated')),
  company_name TEXT NOT NULL,
  personnel_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  hiring_manager TEXT NOT NULL,
  cost NUMERIC(10, 2) NOT NULL,
  exordiom_rate NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE,
  is_churned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on record update
CREATE TRIGGER update_crm_entries_updated_at
BEFORE UPDATE ON crm_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to log changes to audit_logs
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB := NULL;
  new_data JSONB := NULL;
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    old_data = to_jsonb(OLD);
    new_data = to_jsonb(NEW);
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, old_data, new_data, auth.uid());
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    old_data = to_jsonb(OLD);
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, old_data, auth.uid());
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    new_data = to_jsonb(NEW);
    INSERT INTO audit_logs (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, new_data, auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
CREATE TRIGGER audit_crm_entries
AFTER INSERT OR UPDATE OR DELETE ON crm_entries
FOR EACH ROW
EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_customers
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW
EXECUTE FUNCTION log_audit();

-- Create RLS policies for security
ALTER TABLE crm_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users full access to crm_entries"
ON crm_entries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to customers"
ON customers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read audit_logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (true);
