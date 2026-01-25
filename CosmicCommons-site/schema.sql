-- Cosmic Commons Investor Portal - D1 Database Schema
-- Database: pinnacle-peaks-inquiries
-- ID: d1d0dae3-cdea-4019-84cd-40a7ecc435ee

-- Drop existing table if needed (uncomment for reset)
-- DROP TABLE IF EXISTS investor_inquiries;

-- Main investor inquiries table
CREATE TABLE IF NOT EXISTS investor_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  peak TEXT NOT NULL,                          -- fulmina, horizonta, rikolta, fajruja, vekiga, kerna, all
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,                           -- Company, family office, institution
  accredited_status TEXT,                      -- qualified_purchaser, accredited_investor, family_office, institutional, other
  investment_range TEXT,                       -- 500k-1m, 1m-5m, 5m-25m, 25m+
  message TEXT,
  referral_source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new',                   -- new, contacted, qualified, in_progress, closed, declined
  notes TEXT
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON investor_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_peak ON investor_inquiries(peak);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON investor_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON investor_inquiries(created_at DESC);

-- Document tracking table (for R2 storage references)
CREATE TABLE IF NOT EXISTS investor_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inquiry_id INTEGER REFERENCES investor_inquiries(id),
  document_type TEXT NOT NULL,                 -- nda, subscription, pitch_deck, term_sheet
  r2_key TEXT NOT NULL,                        -- R2 object key
  filename TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  uploaded_by TEXT
);

-- Activity log for audit trail
CREATE TABLE IF NOT EXISTS inquiry_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inquiry_id INTEGER REFERENCES investor_inquiries(id),
  action TEXT NOT NULL,                        -- created, status_change, note_added, document_uploaded, email_sent
  details TEXT,
  actor TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_inquiry ON inquiry_activity(inquiry_id);
