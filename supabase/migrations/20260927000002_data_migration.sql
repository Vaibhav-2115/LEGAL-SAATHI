-- ==============================================================================
-- Legal Saathi - Data Migration Script (PostgreSQL / Supabase)
-- Generated: 2026-09-26T19:42:40.651473+00:00
-- ==============================================================================

BEGIN;

-- Table: sessions (66 rows)
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_3fa3c83933fa4f99', 'usr_a474c18f56', 'en', '2026-09-26T17:21:43.606598+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_sub_51e314d5', 'usr_e3a2b6cf48', 'en', '2026-09-26T17:21:49.726688+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_notice_b352db49', 'usr_bb354d5a92', 'en', '2026-09-26T17:21:49.741687+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_verify_6015c762', 'usr_9159753499', 'en', '2026-09-26T17:21:49.756598+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_gatekeeper_aef43c60', 'usr_7f6c4694e8', 'en', '2026-09-26T17:21:49.802725+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_collective_af17b25e', 'usr_fd5a11eb62', 'en', '2026-09-26T17:21:49.843071+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_ac1c32fa953c42b7', 'usr_75ab5a59dc', 'en', '2026-09-26T17:21:55.013142+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_e8c321c3d7c04b59', 'usr_866d54a196', 'en', '2026-09-26T17:21:55.124048+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_ai_civic_001', 'usr_cd6b83453a', 'en', '2026-09-26T17:21:55.175047+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_ai_pro_002', 'usr_96d5c9f1a9', 'en', '2026-09-26T17:21:55.296819+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_ai_col_003', 'usr_786c0e2d47', 'en', '2026-09-26T17:21:55.419390+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_ai_free_004', 'usr_2a991cd492', 'en', '2026-09-26T17:21:55.533393+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_7f0e6df05acb4670', 'usr_fcf5189e93', 'en', '2026-09-26T17:22:00.742638+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_sub_d9bdda7d', 'usr_a8e6edb547', 'en', '2026-09-26T17:22:01.299539+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_notice_2b7c56c6', 'usr_4fceecd52f', 'en', '2026-09-26T17:22:01.316047+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_verify_894923ad', 'usr_25d28a6212', 'en', '2026-09-26T17:22:01.330255+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_gatekeeper_086d8d71', 'usr_eada858eb8', 'en', '2026-09-26T17:22:01.373478+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_collective_48548642', 'usr_4d45f2fc2b', 'en', '2026-09-26T17:22:01.412786+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_22b5b7c7e0ec4eed', 'usr_44e965afd3', 'en', '2026-09-26T17:22:01.460208+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_91d3d3ff3fc541cb', 'usr_688a47fac4', 'en', '2026-09-26T17:22:01.565057+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_607bf0a325f34f9a', 'usr_91de5acd5d', 'en', '2026-09-26T19:17:59.122530+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_sub_f6b22327', 'usr_606652a663', 'en', '2026-09-26T19:17:59.625300+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_notice_b60b1631', 'usr_558c2ed662', 'en', '2026-09-26T19:17:59.640424+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_verify_d41c97fb', 'usr_f0276593d3', 'en', '2026-09-26T19:17:59.653554+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_gatekeeper_f7576d11', 'usr_b456feb4bc', 'en', '2026-09-26T19:17:59.693077+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_collective_4652d812', 'usr_6cb706a392', 'en', '2026-09-26T19:17:59.740205+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_0646032a43124efc', 'usr_f417bc7180', 'en', '2026-09-26T19:17:59.804232+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_b6c58fef5b344656', 'usr_4bed2faf53', 'en', '2026-09-26T19:17:59.907932+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_1bab99992cf74097', 'usr_ac909aec31', 'en', '2026-09-26T19:30:36.754965+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_sub_1f028082', 'usr_1af0d6a38b', 'en', '2026-09-26T19:30:37.259130+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_notice_de00ba40', 'usr_79499fcc6c', 'en', '2026-09-26T19:30:37.272957+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_verify_40d02d97', 'usr_26d46078e9', 'en', '2026-09-26T19:30:37.287700+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_gatekeeper_fba88a81', 'usr_0d0067984c', 'en', '2026-09-26T19:30:37.328473+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_collective_d622371f', 'usr_1a235497f7', 'en', '2026-09-26T19:30:37.369643+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_f06de89e56ee46f6', 'usr_8ae485af84', 'en', '2026-09-26T19:30:37.417996+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_0597e7b4a9fb4c30', 'usr_2cdb825bae', 'en', '2026-09-26T19:30:37.524158+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_60677ea6e15c487e', 'usr_f6cff68320', 'en', '2026-09-26T19:35:28.397073+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_sub_4638ca79', 'usr_abf4716922', 'en', '2026-09-26T19:35:28.956773+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_notice_88460c0e', 'usr_3cbe978544', 'en', '2026-09-26T19:35:28.974111+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_verify_f75ad39d', 'usr_07ebc82f17', 'en', '2026-09-26T19:35:28.987614+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_gatekeeper_34113abf', 'usr_5d7aa1fedb', 'en', '2026-09-26T19:35:29.029138+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_collective_8a6ab4f4', 'usr_02296d8437', 'en', '2026-09-26T19:35:29.075189+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_d7ae21a52dbe40d6', 'usr_a07fa8f23d', 'en', '2026-09-26T19:35:29.135271+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_a7ee4df749a64fa2', 'usr_db28525dc1', 'en', '2026-09-26T19:35:29.258545+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_99f60aa3e98f4a25', 'usr_0f988079a0', 'en', '2026-09-26T19:35:41.857807+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_sub_aa01e055', 'usr_5306762b82', 'en', '2026-09-26T19:35:42.371238+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_notice_3c752a6a', 'usr_2151def9ee', 'en', '2026-09-26T19:35:42.386574+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_verify_73574b95', 'usr_5f227ea1d2', 'en', '2026-09-26T19:35:42.401671+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_gatekeeper_5fecc649', 'usr_6ea327def5', 'en', '2026-09-26T19:35:42.456909+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_collective_ce5a62c6', 'usr_8d2e1767b2', 'en', '2026-09-26T19:35:42.495867+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_7f2fa7e19a194206', 'usr_cc11005993', 'en', '2026-09-26T19:35:42.541265+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_65bff3dd36c24040', 'usr_24ee344211', 'en', '2026-09-26T19:35:42.644876+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_66eedfba18654a30', 'usr_f93d4eebec', 'en', '2026-09-26T19:40:54.418884+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_sub_4d342ef5', 'usr_17d30741de', 'en', '2026-09-26T19:40:54.919354+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_notice_2bfe9a9f', 'usr_b652b4b22c', 'en', '2026-09-26T19:40:54.936517+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_verify_19eae352', 'usr_090299a782', 'en', '2026-09-26T19:40:54.948890+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_gatekeeper_376aff54', 'usr_5df3ccfa8f', 'en', '2026-09-26T19:40:55.200376+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_collective_65206c0f', 'usr_d0fcf240ce', 'en', '2026-09-26T19:40:55.243475+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_093950c50ef84a97', 'usr_d5125fdcca', 'en', '2026-09-26T19:40:55.290289+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('sess_2d31916dfa8141e2', 'usr_e2f1eb5cb7', 'en', '2026-09-26T19:40:55.392567+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('citizen_sess_supertech_1', 'legacy_migrated_user', 'en', '2026-09-26T19:42:40.649789+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('citizen_sess_supertech_2', 'legacy_migrated_user', 'en', '2026-09-26T19:42:40.649799+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('session_actions_owner', 'legacy_migrated_user', 'en', '2026-09-26T19:42:40.649802+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('session_citizen_alice_123', 'legacy_migrated_user', 'en', '2026-09-26T19:42:40.649803+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('session_citizen_consent_a', 'legacy_migrated_user', 'en', '2026-09-26T19:42:40.649804+00:00') ON CONFLICT DO NOTHING;
INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES ('test_sess_001', 'legacy_migrated_user', 'en', '2026-09-26T19:42:40.649806+00:00') ON CONFLICT DO NOTHING;

-- Table: subscription_plans (5 rows)
INSERT INTO subscription_plans (plan_id, name, tier, amount_inr, billing_period, features_json, is_active, created_at) VALUES ('plan_civic', 'Bharat Civic Access', 'civic', 0, 'one_time', '["Unlimited Multilingual Legal AI Chat", "Evidence Checklist Generation", "NALSA & DLSA Free Legal Aid Directory", "Emergency 112 / 1930 / 181 Guidance", "Consumer & Tenancy Rights Literacy"]'::jsonb, 1, '2026-09-26T17:21:19.408469+00:00') ON CONFLICT DO NOTHING;
INSERT INTO subscription_plans (plan_id, name, tier, amount_inr, billing_period, features_json, is_active, created_at) VALUES ('plan_pro_monthly', 'Saathi Pro Monthly', 'pro', 14900, 'monthly', '["Unlimited Court-Ready Legal Notices", "Section 6(1) RTI Applications with PIO Addresses", "Formal e-FIR & Cyber Crime Filing Packets", "Watermark-Free PDF Dossier Downloads", "Automated 15-Day Postal Dispatch Tracking", "Priority AI Multi-Act Legal Retrieval"]'::jsonb, 1, '2026-09-26T17:21:19.408469+00:00') ON CONFLICT DO NOTHING;
INSERT INTO subscription_plans (plan_id, name, tier, amount_inr, billing_period, features_json, is_active, created_at) VALUES ('plan_pro_annual', 'Saathi Pro Annual', 'pro', 129900, 'annual', '["All Saathi Pro Monthly Features", "Collective Action Docket Filing Rights", "Multi-Year Document Vault (Encrypted)", "27% Annual Savings (\u20b9108/month effective)"]'::jsonb, 1, '2026-09-26T17:21:19.408469+00:00') ON CONFLICT DO NOTHING;
INSERT INTO subscription_plans (plan_id, name, tier, amount_inr, billing_period, features_json, is_active, created_at) VALUES ('plan_advocate_monthly', 'Advocate Practice Hub Monthly', 'advocate', 149900, 'monthly', '["AI Chronology & Brief Extraction for Case Files", "Bulk Case File OCR & Landmark Precedent Search", "Multi-Client Case Management & Timeline Generator", "Verified BCI-Compliant Public Profile (Non-Promotional)", "Court Hearing Calendar & Daily Cause List Sync"]'::jsonb, 1, '2026-09-26T17:21:19.408469+00:00') ON CONFLICT DO NOTHING;
INSERT INTO subscription_plans (plan_id, name, tier, amount_inr, billing_period, features_json, is_active, created_at) VALUES ('plan_advocate_annual', 'Advocate Practice Hub Annual', 'advocate', 1499000, 'annual', '["All Advocate Practice Hub Features", "Unlimited Junior Associate Sub-Accounts (up to 3)", "Custom Law Firm Letterhead Automation", "Priority Phone & Case File Ingestion Support"]'::jsonb, 1, '2026-09-26T17:21:19.408469+00:00') ON CONFLICT DO NOTHING;

-- Table: clusters (8 rows)
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('clust_c027647418', 'property_rera', 'Noida / Greater Noida (UP)', '2 citizens in Noida / Greater Noida (UP) have reported similar issues with property rera.', 2, '["inc_688733aa3c", "inc_34dcbb19ad"]'::jsonb, '2026-09-26T17:21:43.769034+00:00', 'active') ON CONFLICT DO NOTHING;
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('clust_2e39e77e35', 'property_rera', 'Noida / Greater Noida (UP)', '4 citizens in Noida / Greater Noida (UP) have reported similar issues with property rera.', 4, '["inc_688733aa3c", "inc_34dcbb19ad", "inc_38273a4980", "inc_fabcd095bd"]'::jsonb, '2026-09-26T17:22:01.682697+00:00', 'active') ON CONFLICT DO NOTHING;
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('clust_2b3d542e98', 'property_rera', 'Noida / Greater Noida (UP)', '6 citizens in Noida / Greater Noida (UP) have reported similar issues with property rera.', 6, '["inc_688733aa3c", "inc_34dcbb19ad", "inc_38273a4980", "inc_fabcd095bd", "inc_ede3f4f99b", "inc_ce15ce110b"]'::jsonb, '2026-09-26T19:18:00.011580+00:00', 'active') ON CONFLICT DO NOTHING;
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('clust_9eee4b116d', 'property_rera', 'Noida / Greater Noida (UP)', '8 citizens in Noida / Greater Noida (UP) have reported similar issues with property rera.', 8, '["inc_688733aa3c", "inc_34dcbb19ad", "inc_38273a4980", "inc_fabcd095bd", "inc_ede3f4f99b", "inc_ce15ce110b", "inc_89a61c26fd", "inc_ab994746b1"]'::jsonb, '2026-09-26T19:30:37.631331+00:00', 'active') ON CONFLICT DO NOTHING;
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('clust_a0dafabfe8', 'property_rera', 'Noida / Greater Noida (UP)', '10 citizens in Noida / Greater Noida (UP) have reported similar issues with property rera.', 10, '["inc_688733aa3c", "inc_34dcbb19ad", "inc_38273a4980", "inc_fabcd095bd", "inc_ede3f4f99b", "inc_ce15ce110b", "inc_89a61c26fd", "inc_ab994746b1", "inc_abcefff10e", "inc_5c2cb49ecb"]'::jsonb, '2026-09-26T19:35:29.344727+00:00', 'active') ON CONFLICT DO NOTHING;
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('clust_bfea2b1aaa', 'property_rera', 'Noida / Greater Noida (UP)', '12 citizens in Noida / Greater Noida (UP) have reported similar issues with property rera.', 12, '["inc_688733aa3c", "inc_34dcbb19ad", "inc_38273a4980", "inc_fabcd095bd", "inc_ede3f4f99b", "inc_ce15ce110b", "inc_89a61c26fd", "inc_ab994746b1", "inc_abcefff10e", "inc_5c2cb49ecb", "inc_9017c18817", "inc_ef3941de40"]'::jsonb, '2026-09-26T19:35:42.719500+00:00', 'active') ON CONFLICT DO NOTHING;
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('cluster_bengaluru_deposit_withholding', 'tenancy', 'Bengaluru', 'Widespread refusal by landlords to return rental deposits upon move-out in Bengaluru.', 3, '["inc_bg_1", "inc_bg_2", "inc_bg_3"]'::jsonb, '2026-09-26T19:40:54.693643+00:00', 'active') ON CONFLICT DO NOTHING;
INSERT INTO clusters (cluster_id, issue_type, locality_bucket, explanation_text, member_count, incident_ids_json, created_at, status) VALUES ('clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '14 citizens in Noida / Greater Noida (UP) have reported similar issues with property rera.', 14, '["inc_688733aa3c", "inc_34dcbb19ad", "inc_38273a4980", "inc_fabcd095bd", "inc_ede3f4f99b", "inc_ce15ce110b", "inc_89a61c26fd", "inc_ab994746b1", "inc_abcefff10e", "inc_5c2cb49ecb", "inc_9017c18817", "inc_ef3941de40", "inc_7a9950f096", "inc_df6aff6618"]'::jsonb, '2026-09-26T19:40:55.465859+00:00', 'active') ON CONFLICT DO NOTHING;

-- Table: cases (77 rows)
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_651e7f6092', 'test_sess_001', 'tenancy', 'Updated Dispute with Landlord Sharma', 'Landlord deducted 50000 rupees security deposit without any repair receipts.', '{"opposing_party": "Landlord Sharma", "opposing_party_hash": "f2c7ed0d345897ef", "location": "Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 50000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_8f0eb08abc", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.666003+00:00"}, {"evidence_id": "evi_1f3d02dc2e", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.666027+00:00"}, {"evidence_id": "evi_f1a42c1101", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.666039+00:00"}]'::jsonb, 'granted', '2026-09-26T17:21:43.667387+00:00', '2026-09-26T17:21:43.688487+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_26fb5cb122', 'citizen_sess_supertech_1', 'property_rera', 'Supertech delay tower B', 'Builder Supertech has not delivered flat possession since 2 years in Greater Noida.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 4500000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_4cab26ee47", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.711577+00:00"}, {"evidence_id": "evi_3f81a963e3", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.711601+00:00"}, {"evidence_id": "evi_8ca0618e09", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.711608+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:43.711815+00:00', '2026-09-26T17:21:43.711815+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_c6000e807a', 'citizen_sess_supertech_2', 'property_rera', 'Supertech delay tower C', 'Supertech failed to hand over apartment possession in Greater Noida sector 1.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 5000000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_320426136e", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.727378+00:00"}, {"evidence_id": "evi_d3379366f2", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.727394+00:00"}, {"evidence_id": "evi_657120276e", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.727399+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:43.728373+00:00', '2026-09-26T17:21:43.728373+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_7fdc2ff2d4', 'session_citizen_alice_123', 'consumer', 'Alice Defective Laptop Grievance', 'Purchased laptop with defective motherboard; retailer refusing replacement.', '{"opposing_party": "MegaElectronics Store", "opposing_party_hash": "7282b47646230757", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_1ab903d472", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.780491+00:00"}, {"evidence_id": "evi_48115fa620", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.780515+00:00"}, {"evidence_id": "evi_6bf5ec92b7", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.780527+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:43.781707+00:00', '2026-09-26T17:21:43.781707+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_44198e1cbd', 'session_citizen_consent_a', 'tenancy', 'Deposit issue', 'Deposit withheld', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_b980a59bb8", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.814039+00:00"}, {"evidence_id": "evi_a9b808e659", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.814053+00:00"}, {"evidence_id": "evi_a96aae3797", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.814058+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:43.814196+00:00', '2026-09-26T17:21:43.814196+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_d181da2065', 'session_actions_owner', 'consumer', 'Action Test Case', '', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_0e36866ccf", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.851679+00:00"}, {"evidence_id": "evi_f8ec677fc1", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.851693+00:00"}, {"evidence_id": "evi_ad5f6d4c82", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:43.851697+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:43.852666+00:00', '2026-09-26T17:21:43.852666+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_7b3d3c77f8', 'sess_ac1c32fa953c42b7', 'consumer', 'Consumer - Grievance', 'The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.', '{"opposing_party": "delivered a broken refrigerator and customer care", "opposing_party_hash": "db3fd930125f8977", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."], "grievance": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."}'::jsonb, '[{"evidence_id": "evi_905f670792", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.024382+00:00"}, {"evidence_id": "evi_96d3379d49", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.024395+00:00"}, {"evidence_id": "evi_7e784977d8", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.024401+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:55.024410+00:00', '2026-09-26T17:21:55.024410+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_8d72f62635', 'test_sess_ai_civic_001', 'consumer', 'Consumer - Grievance', 'I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.', '{"opposing_party": "refuses to refund my Rs 35", "opposing_party_hash": "fec3027c35e2be20", "location": null, "locality_bucket": "General / Unspecified Region", "amount": 35000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."], "grievance": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."}'::jsonb, '[{"evidence_id": "evi_619e88f358", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.179434+00:00"}, {"evidence_id": "evi_88c75c2f6e", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.179446+00:00"}, {"evidence_id": "evi_e1f70c2154", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.179451+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:55.179460+00:00', '2026-09-26T17:21:55.179460+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_cd56192812', 'test_sess_ai_pro_002', 'consumer', 'Consumer - Grievance', 'The laptop delivered to me has a cracked screen and the store claims no return policy.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The laptop delivered to me has a cracked screen and the store claims no return policy."], "grievance": "The laptop delivered to me has a cracked screen and the store claims no return policy."}'::jsonb, '[{"evidence_id": "evi_cd54fca375", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.314017+00:00"}, {"evidence_id": "evi_cb9da980a3", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.314027+00:00"}, {"evidence_id": "evi_c4529e0381", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.314031+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:55.314036+00:00', '2026-09-26T17:21:55.314036+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_1cae89d1fd', 'test_sess_ai_col_003', 'tenancy', 'Tenancy - Bengaluru', 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.', '{"opposing_party": "in Bengaluru", "opposing_party_hash": "29a0bbda7db86c25", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."], "grievance": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."}'::jsonb, '[{"evidence_id": "evi_aa75a5b1bc", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.424067+00:00"}, {"evidence_id": "evi_b9c4ad72f1", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.424079+00:00"}, {"evidence_id": "evi_6c910fd6a9", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.424084+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:55.424090+00:00', '2026-09-26T17:21:55.424090+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_c051855932', 'test_sess_ai_free_004', 'general', 'General - Grievance', 'I cannot afford a lawyer and need free legal aid for my case.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["I cannot afford a lawyer and need free legal aid for my case."], "grievance": "I cannot afford a lawyer and need free legal aid for my case."}'::jsonb, '[{"evidence_id": "evi_e35931304b", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.537875+00:00"}, {"evidence_id": "evi_2c93b03a42", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.537886+00:00"}, {"evidence_id": "evi_f22df52745", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:21:55.537891+00:00"}]'::jsonb, 'pending', '2026-09-26T17:21:55.537899+00:00', '2026-09-26T17:21:55.537899+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_62e67eeefb', 'test_sess_ai_civic_001', 'consumer', 'Consumer - Grievance', 'I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.', '{"opposing_party": "refuses to refund my Rs 35", "opposing_party_hash": "fec3027c35e2be20", "location": null, "locality_bucket": "General / Unspecified Region", "amount": 35000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."], "grievance": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."}'::jsonb, '[{"evidence_id": "evi_220e6808a8", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:00.789723+00:00"}, {"evidence_id": "evi_3bf16f567c", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:00.789736+00:00"}, {"evidence_id": "evi_815f165682", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:00.789741+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:00.789748+00:00', '2026-09-26T17:22:00.789748+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_2a58bddf30', 'test_sess_ai_pro_002', 'consumer', 'Consumer - Grievance', 'The laptop delivered to me has a cracked screen and the store claims no return policy.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The laptop delivered to me has a cracked screen and the store claims no return policy."], "grievance": "The laptop delivered to me has a cracked screen and the store claims no return policy."}'::jsonb, '[{"evidence_id": "evi_df75264d27", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:00.954042+00:00"}, {"evidence_id": "evi_e49441734e", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:00.954054+00:00"}, {"evidence_id": "evi_6462c02039", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:00.954059+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:00.954066+00:00', '2026-09-26T17:22:00.954066+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_b89479c6f4', 'test_sess_ai_col_003', 'tenancy', 'Tenancy - Bengaluru', 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.', '{"opposing_party": "in Bengaluru", "opposing_party_hash": "29a0bbda7db86c25", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."], "grievance": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."}'::jsonb, '[{"evidence_id": "evi_444ef448de", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.081581+00:00"}, {"evidence_id": "evi_92595e1b73", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.081597+00:00"}, {"evidence_id": "evi_7b1281d308", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.081603+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.081622+00:00', '2026-09-26T17:22:01.081622+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_95514a4374', 'test_sess_ai_free_004', 'general', 'General - Grievance', 'I cannot afford a lawyer and need free legal aid for my case.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["I cannot afford a lawyer and need free legal aid for my case."], "grievance": "I cannot afford a lawyer and need free legal aid for my case."}'::jsonb, '[{"evidence_id": "evi_778d579348", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.192191+00:00"}, {"evidence_id": "evi_d8a512da46", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.192204+00:00"}, {"evidence_id": "evi_f23a711a8d", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.192209+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.192214+00:00', '2026-09-26T17:22:01.192214+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_98a36bca1c', 'test_sess_001', 'tenancy', 'Updated Dispute with Landlord Sharma', 'Landlord deducted 50000 rupees security deposit without any repair receipts.', '{"opposing_party": "Landlord Sharma", "opposing_party_hash": "f2c7ed0d345897ef", "location": "Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 50000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_e14f38c502", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.425122+00:00"}, {"evidence_id": "evi_85a2c6b593", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.425136+00:00"}, {"evidence_id": "evi_883854a7f7", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.425140+00:00"}]'::jsonb, 'granted', '2026-09-26T17:22:01.426590+00:00', '2026-09-26T17:22:01.442879+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_80c7207e5f', 'sess_22b5b7c7e0ec4eed', 'consumer', 'Consumer - Grievance', 'The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.', '{"opposing_party": "delivered a broken refrigerator and customer care", "opposing_party_hash": "db3fd930125f8977", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."], "grievance": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."}'::jsonb, '[{"evidence_id": "evi_44fe7fbcab", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.464237+00:00"}, {"evidence_id": "evi_c58fb7d35d", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.464248+00:00"}, {"evidence_id": "evi_2c29162293", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.464254+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.464261+00:00', '2026-09-26T17:22:01.464261+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_a2e70865a5', 'citizen_sess_supertech_1', 'property_rera', 'Supertech delay tower B', 'Builder Supertech has not delivered flat possession since 2 years in Greater Noida.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 4500000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_f4c1fcd47d", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.600599+00:00"}, {"evidence_id": "evi_14bc6a3c56", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.600619+00:00"}, {"evidence_id": "evi_c763336a6d", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.600626+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.602164+00:00', '2026-09-26T17:22:01.602164+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_4542f11e90', 'citizen_sess_supertech_2', 'property_rera', 'Supertech delay tower C', 'Supertech failed to hand over apartment possession in Greater Noida sector 1.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 5000000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_076bc11a63", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.646290+00:00"}, {"evidence_id": "evi_637f49e544", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.646303+00:00"}, {"evidence_id": "evi_1dab5bc09a", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.646307+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.647195+00:00', '2026-09-26T17:22:01.647195+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_f91a913622', 'session_citizen_alice_123', 'consumer', 'Alice Defective Laptop Grievance', 'Purchased laptop with defective motherboard; retailer refusing replacement.', '{"opposing_party": "MegaElectronics Store", "opposing_party_hash": "7282b47646230757", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_7580152118", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.749584+00:00"}, {"evidence_id": "evi_2067f3208f", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.749599+00:00"}, {"evidence_id": "evi_731d596e47", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.749604+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.749774+00:00', '2026-09-26T17:22:01.749774+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_6f32f05f1e', 'session_citizen_consent_a', 'tenancy', 'Deposit issue', 'Deposit withheld', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_d4e885b1c8", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.775949+00:00"}, {"evidence_id": "evi_828fa7e9c1", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.775963+00:00"}, {"evidence_id": "evi_642f7ba524", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.775968+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.776082+00:00', '2026-09-26T17:22:01.776082+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_ff2b772523', 'session_actions_owner', 'consumer', 'Action Test Case', '', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_863b0342b0", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.813697+00:00"}, {"evidence_id": "evi_b931fac364", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.813711+00:00"}, {"evidence_id": "evi_6b1c7177d7", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T17:22:01.813716+00:00"}]'::jsonb, 'pending', '2026-09-26T17:22:01.814951+00:00', '2026-09-26T17:22:01.814951+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_03d371315e', 'test_sess_ai_civic_001', 'consumer', 'Consumer - Grievance', 'I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.', '{"opposing_party": "refuses to refund my Rs 35", "opposing_party_hash": "fec3027c35e2be20", "location": null, "locality_bucket": "General / Unspecified Region", "amount": 35000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."], "grievance": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."}'::jsonb, '[{"evidence_id": "evi_a66fcf493d", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.174832+00:00"}, {"evidence_id": "evi_edcf585ab3", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.174845+00:00"}, {"evidence_id": "evi_6c77823505", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.174851+00:00"}]'::jsonb, 'pending', '2026-09-26T19:17:59.174857+00:00', '2026-09-26T19:17:59.174857+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_73843cf550', 'test_sess_ai_pro_002', 'consumer', 'Consumer - Grievance', 'The laptop delivered to me has a cracked screen and the store claims no return policy.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The laptop delivered to me has a cracked screen and the store claims no return policy."], "grievance": "The laptop delivered to me has a cracked screen and the store claims no return policy."}'::jsonb, '[{"evidence_id": "evi_a864906c5e", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.309075+00:00"}, {"evidence_id": "evi_8122ed9dbd", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.309087+00:00"}, {"evidence_id": "evi_bf42e5aab7", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.309092+00:00"}]'::jsonb, 'pending', '2026-09-26T19:17:59.309098+00:00', '2026-09-26T19:17:59.309098+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_d29e9ba6c1', 'test_sess_ai_col_003', 'tenancy', 'Tenancy - Bengaluru', 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.', '{"opposing_party": "in Bengaluru", "opposing_party_hash": "29a0bbda7db86c25", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."], "grievance": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."}'::jsonb, '[{"evidence_id": "evi_779735b391", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.412257+00:00"}, {"evidence_id": "evi_dae562e26d", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.412269+00:00"}, {"evidence_id": "evi_c0c01b250a", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.412275+00:00"}]'::jsonb, 'pending', '2026-09-26T19:17:59.412281+00:00', '2026-09-26T19:17:59.412281+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_ffbb21658c', 'test_sess_ai_free_004', 'general', 'General - Grievance', 'I cannot afford a lawyer and need free legal aid for my case.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["I cannot afford a lawyer and need free legal aid for my case."], "grievance": "I cannot afford a lawyer and need free legal aid for my case."}'::jsonb, '[{"evidence_id": "evi_70f1583070", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.520851+00:00"}, {"evidence_id": "evi_bff3c993ed", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.520861+00:00"}, {"evidence_id": "evi_8cef2084bf", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.520866+00:00"}]'::jsonb, 'pending', '2026-09-26T19:17:59.520871+00:00', '2026-09-26T19:17:59.520871+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_0f453f9da5', 'test_sess_001', 'tenancy', 'Updated Dispute with Landlord Sharma', 'Landlord deducted 50000 rupees security deposit without any repair receipts.', '{"opposing_party": "Landlord Sharma", "opposing_party_hash": "f2c7ed0d345897ef", "location": "Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 50000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_c9f0081730", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.760775+00:00"}, {"evidence_id": "evi_c00a6e8adf", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.760791+00:00"}, {"evidence_id": "evi_4a4ea2dac0", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.760796+00:00"}]'::jsonb, 'granted', '2026-09-26T19:17:59.761552+00:00', '2026-09-26T19:17:59.784003+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_ea58d8417c', 'sess_0646032a43124efc', 'consumer', 'Consumer - Grievance', 'The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.', '{"opposing_party": "delivered a broken refrigerator and customer care", "opposing_party_hash": "db3fd930125f8977", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."], "grievance": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."}'::jsonb, '[{"evidence_id": "evi_439432d1c4", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.808543+00:00"}, {"evidence_id": "evi_a755add018", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.808555+00:00"}, {"evidence_id": "evi_586cf75ff3", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.808560+00:00"}]'::jsonb, 'pending', '2026-09-26T19:17:59.808567+00:00', '2026-09-26T19:17:59.808567+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_2ebc7b780c', 'citizen_sess_supertech_1', 'property_rera', 'Supertech delay tower B', 'Builder Supertech has not delivered flat possession since 2 years in Greater Noida.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 4500000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_d9965be420", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.929704+00:00"}, {"evidence_id": "evi_35da19f985", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.929720+00:00"}, {"evidence_id": "evi_de00cd5b30", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.929725+00:00"}]'::jsonb, 'pending', '2026-09-26T19:17:59.930581+00:00', '2026-09-26T19:17:59.930581+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_a109df09e4', 'citizen_sess_supertech_2', 'property_rera', 'Supertech delay tower C', 'Supertech failed to hand over apartment possession in Greater Noida sector 1.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 5000000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_fe04f57e26", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.973598+00:00"}, {"evidence_id": "evi_f759ba142c", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.973611+00:00"}, {"evidence_id": "evi_b615345aaf", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:17:59.973615+00:00"}]'::jsonb, 'pending', '2026-09-26T19:17:59.974312+00:00', '2026-09-26T19:17:59.974312+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_b20909cbea', 'session_citizen_alice_123', 'consumer', 'Alice Defective Laptop Grievance', 'Purchased laptop with defective motherboard; retailer refusing replacement.', '{"opposing_party": "MegaElectronics Store", "opposing_party_hash": "7282b47646230757", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_5959ed9555", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.096770+00:00"}, {"evidence_id": "evi_03f4dc6fea", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.096783+00:00"}, {"evidence_id": "evi_7f464bddfc", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.096788+00:00"}]'::jsonb, 'pending', '2026-09-26T19:18:00.096957+00:00', '2026-09-26T19:18:00.096957+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_95e1a18118', 'session_citizen_consent_a', 'tenancy', 'Deposit issue', 'Deposit withheld', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_d761f2522f", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.126074+00:00"}, {"evidence_id": "evi_048523b0c1", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.126088+00:00"}, {"evidence_id": "evi_2d4b209c3b", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.126093+00:00"}]'::jsonb, 'pending', '2026-09-26T19:18:00.126231+00:00', '2026-09-26T19:18:00.126231+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_bb1dc341a3', 'session_actions_owner', 'consumer', 'Action Test Case', '', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_a17ea0cd1d", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.166999+00:00"}, {"evidence_id": "evi_da716ce113", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.167016+00:00"}, {"evidence_id": "evi_842075395e", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:18:00.167021+00:00"}]'::jsonb, 'pending', '2026-09-26T19:18:00.168868+00:00', '2026-09-26T19:18:00.168868+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_d86ff6433c', 'test_sess_ai_civic_001', 'consumer', 'Consumer - Grievance', 'I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.', '{"opposing_party": "refuses to refund my Rs 35", "opposing_party_hash": "fec3027c35e2be20", "location": null, "locality_bucket": "General / Unspecified Region", "amount": 35000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."], "grievance": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."}'::jsonb, '[{"evidence_id": "evi_379497c12c", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:36.803485+00:00"}, {"evidence_id": "evi_45586a7c1e", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:36.803502+00:00"}, {"evidence_id": "evi_4960e00dbc", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:36.803509+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:36.803520+00:00', '2026-09-26T19:30:36.803520+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_0f0c9d5388', 'test_sess_ai_pro_002', 'consumer', 'Consumer - Grievance', 'The laptop delivered to me has a cracked screen and the store claims no return policy.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The laptop delivered to me has a cracked screen and the store claims no return policy."], "grievance": "The laptop delivered to me has a cracked screen and the store claims no return policy."}'::jsonb, '[{"evidence_id": "evi_b4a1f7bbb5", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:36.936714+00:00"}, {"evidence_id": "evi_fe6e030b4c", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:36.936725+00:00"}, {"evidence_id": "evi_9c9e75f6b8", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:36.936730+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:36.936742+00:00', '2026-09-26T19:30:36.936742+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_12fd33c51f', 'test_sess_ai_col_003', 'tenancy', 'Tenancy - Bengaluru', 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.', '{"opposing_party": "in Bengaluru", "opposing_party_hash": "29a0bbda7db86c25", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."], "grievance": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."}'::jsonb, '[{"evidence_id": "evi_ee48c45076", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.045420+00:00"}, {"evidence_id": "evi_225b8810e5", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.045431+00:00"}, {"evidence_id": "evi_81d4271e37", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.045439+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.045444+00:00', '2026-09-26T19:30:37.045444+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_f7042f6b24', 'test_sess_ai_free_004', 'general', 'General - Grievance', 'I cannot afford a lawyer and need free legal aid for my case.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["I cannot afford a lawyer and need free legal aid for my case."], "grievance": "I cannot afford a lawyer and need free legal aid for my case."}'::jsonb, '[{"evidence_id": "evi_b419499f67", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.154154+00:00"}, {"evidence_id": "evi_bfdd1f0db5", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.154165+00:00"}, {"evidence_id": "evi_7e2b8af728", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.154171+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.154176+00:00', '2026-09-26T19:30:37.154176+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_04a0830866', 'test_sess_001', 'tenancy', 'Updated Dispute with Landlord Sharma', 'Landlord deducted 50000 rupees security deposit without any repair receipts.', '{"opposing_party": "Landlord Sharma", "opposing_party_hash": "f2c7ed0d345897ef", "location": "Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 50000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_00858f3139", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.382410+00:00"}, {"evidence_id": "evi_60f5633cea", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.382426+00:00"}, {"evidence_id": "evi_83a878a913", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.382431+00:00"}]'::jsonb, 'granted', '2026-09-26T19:30:37.383699+00:00', '2026-09-26T19:30:37.400794+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_8c38cfcfdf', 'sess_f06de89e56ee46f6', 'consumer', 'Consumer - Grievance', 'The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.', '{"opposing_party": "delivered a broken refrigerator and customer care", "opposing_party_hash": "db3fd930125f8977", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."], "grievance": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."}'::jsonb, '[{"evidence_id": "evi_c2205f7baa", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.422145+00:00"}, {"evidence_id": "evi_17e08de399", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.422157+00:00"}, {"evidence_id": "evi_0d7944a6db", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.422161+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.422169+00:00', '2026-09-26T19:30:37.422169+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_1653e79247', 'citizen_sess_supertech_1', 'property_rera', 'Supertech delay tower B', 'Builder Supertech has not delivered flat possession since 2 years in Greater Noida.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 4500000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_92b17d42f2", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.545681+00:00"}, {"evidence_id": "evi_7ede6a5cac", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.545694+00:00"}, {"evidence_id": "evi_e38e4c2ec2", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.545699+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.546690+00:00', '2026-09-26T19:30:37.546690+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_1f0c815a47', 'citizen_sess_supertech_2', 'property_rera', 'Supertech delay tower C', 'Supertech failed to hand over apartment possession in Greater Noida sector 1.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 5000000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_1c907ca1ea", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.557945+00:00"}, {"evidence_id": "evi_d903ac8773", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.557958+00:00"}, {"evidence_id": "evi_95f06db3a6", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.557963+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.558545+00:00', '2026-09-26T19:30:37.558545+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_534f0aec4e', 'session_citizen_alice_123', 'consumer', 'Alice Defective Laptop Grievance', 'Purchased laptop with defective motherboard; retailer refusing replacement.', '{"opposing_party": "MegaElectronics Store", "opposing_party_hash": "7282b47646230757", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_ac53abb458", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.705438+00:00"}, {"evidence_id": "evi_c9665cc66e", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.705453+00:00"}, {"evidence_id": "evi_b999c00dfc", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.705458+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.705610+00:00', '2026-09-26T19:30:37.705610+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_17b9acfd7d', 'session_citizen_consent_a', 'tenancy', 'Deposit issue', 'Deposit withheld', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_6764e31b45", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.731155+00:00"}, {"evidence_id": "evi_f7990f2e57", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.731169+00:00"}, {"evidence_id": "evi_01790e9669", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.731174+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.731323+00:00', '2026-09-26T19:30:37.731323+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_730c8c16a3', 'session_actions_owner', 'consumer', 'Action Test Case', '', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_e817ab9a3d", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.768133+00:00"}, {"evidence_id": "evi_f99d0c479a", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.768148+00:00"}, {"evidence_id": "evi_ea2f373273", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:30:37.768153+00:00"}]'::jsonb, 'pending', '2026-09-26T19:30:37.769265+00:00', '2026-09-26T19:30:37.769265+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_33a2e5bce0', 'test_sess_ai_civic_001', 'consumer', 'Consumer - Grievance', 'I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.', '{"opposing_party": "refuses to refund my Rs 35", "opposing_party_hash": "fec3027c35e2be20", "location": null, "locality_bucket": "General / Unspecified Region", "amount": 35000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."], "grievance": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."}'::jsonb, '[{"evidence_id": "evi_16cf1c860a", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.447247+00:00"}, {"evidence_id": "evi_6fa4ec2f51", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.447259+00:00"}, {"evidence_id": "evi_c6634b16e5", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.447265+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:28.447272+00:00', '2026-09-26T19:35:28.447272+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_5611f8fba9', 'test_sess_ai_pro_002', 'consumer', 'Consumer - Grievance', 'The laptop delivered to me has a cracked screen and the store claims no return policy.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The laptop delivered to me has a cracked screen and the store claims no return policy."], "grievance": "The laptop delivered to me has a cracked screen and the store claims no return policy."}'::jsonb, '[{"evidence_id": "evi_29fde95747", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.595538+00:00"}, {"evidence_id": "evi_fb0a92ef1c", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.595551+00:00"}, {"evidence_id": "evi_a12783886c", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.595556+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:28.595564+00:00', '2026-09-26T19:35:28.595564+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_2a7ee6e852', 'test_sess_ai_col_003', 'tenancy', 'Tenancy - Bengaluru', 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.', '{"opposing_party": "in Bengaluru", "opposing_party_hash": "29a0bbda7db86c25", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."], "grievance": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."}'::jsonb, '[{"evidence_id": "evi_5baa60eef6", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.707777+00:00"}, {"evidence_id": "evi_2ac7847d93", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.707789+00:00"}, {"evidence_id": "evi_bb495e5e30", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.707794+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:28.707799+00:00', '2026-09-26T19:35:28.707799+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_8e4c41bfb0', 'test_sess_ai_free_004', 'general', 'General - Grievance', 'I cannot afford a lawyer and need free legal aid for my case.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["I cannot afford a lawyer and need free legal aid for my case."], "grievance": "I cannot afford a lawyer and need free legal aid for my case."}'::jsonb, '[{"evidence_id": "evi_7b16a2216e", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.839048+00:00"}, {"evidence_id": "evi_13c725a127", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.839059+00:00"}, {"evidence_id": "evi_640e0da8d5", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:28.839065+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:28.839071+00:00', '2026-09-26T19:35:28.839071+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_3973d04aef', 'test_sess_001', 'tenancy', 'Updated Dispute with Landlord Sharma', 'Landlord deducted 50000 rupees security deposit without any repair receipts.', '{"opposing_party": "Landlord Sharma", "opposing_party_hash": "f2c7ed0d345897ef", "location": "Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 50000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_77d8ff13a1", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.095353+00:00"}, {"evidence_id": "evi_1b92b5d806", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.095368+00:00"}, {"evidence_id": "evi_bc37b6a011", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.095373+00:00"}]'::jsonb, 'granted', '2026-09-26T19:35:29.096594+00:00', '2026-09-26T19:35:29.115504+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_f420cc13f9', 'sess_d7ae21a52dbe40d6', 'consumer', 'Consumer - Grievance', 'The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.', '{"opposing_party": "delivered a broken refrigerator and customer care", "opposing_party_hash": "db3fd930125f8977", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."], "grievance": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."}'::jsonb, '[{"evidence_id": "evi_636f04ab5e", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.140100+00:00"}, {"evidence_id": "evi_c10850dcf8", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.140113+00:00"}, {"evidence_id": "evi_44e7e0e4d4", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.140117+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:29.140125+00:00', '2026-09-26T19:35:29.140125+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_1003f9c21f', 'citizen_sess_supertech_1', 'property_rera', 'Supertech delay tower B', 'Builder Supertech has not delivered flat possession since 2 years in Greater Noida.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 4500000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_d390a05818", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.284673+00:00"}, {"evidence_id": "evi_ecf7d11458", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.284686+00:00"}, {"evidence_id": "evi_10c941a66b", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.284690+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:29.285837+00:00', '2026-09-26T19:35:29.285837+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_b89cd9931d', 'citizen_sess_supertech_2', 'property_rera', 'Supertech delay tower C', 'Supertech failed to hand over apartment possession in Greater Noida sector 1.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 5000000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_240562c8bf", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.301697+00:00"}, {"evidence_id": "evi_10df85581a", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.301776+00:00"}, {"evidence_id": "evi_6b25c44aa1", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.301833+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:29.302752+00:00', '2026-09-26T19:35:29.302752+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_b84c7ad945', 'session_citizen_alice_123', 'consumer', 'Alice Defective Laptop Grievance', 'Purchased laptop with defective motherboard; retailer refusing replacement.', '{"opposing_party": "MegaElectronics Store", "opposing_party_hash": "7282b47646230757", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_8944f6f804", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.414451+00:00"}, {"evidence_id": "evi_5b7a2b0ebb", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.414467+00:00"}, {"evidence_id": "evi_ef5b58a406", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.414473+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:29.414629+00:00', '2026-09-26T19:35:29.414629+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_0a6e983a20', 'session_citizen_consent_a', 'tenancy', 'Deposit issue', 'Deposit withheld', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_fd35abbfc0", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.443138+00:00"}, {"evidence_id": "evi_25f780f701", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.443152+00:00"}, {"evidence_id": "evi_466b29425d", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.443157+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:29.443290+00:00', '2026-09-26T19:35:29.443290+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_58aba5f4fd', 'session_actions_owner', 'consumer', 'Action Test Case', '', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_de2eb597df", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.482221+00:00"}, {"evidence_id": "evi_ce7a7f1c14", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.482236+00:00"}, {"evidence_id": "evi_8c96aa1e1b", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:29.482241+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:29.485144+00:00', '2026-09-26T19:35:29.485144+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_c4d181a01a', 'test_sess_ai_civic_001', 'consumer', 'Consumer - Grievance', 'I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.', '{"opposing_party": "refuses to refund my Rs 35", "opposing_party_hash": "fec3027c35e2be20", "location": null, "locality_bucket": "General / Unspecified Region", "amount": 35000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."], "grievance": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."}'::jsonb, '[{"evidence_id": "evi_6e2c52df34", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:41.906308+00:00"}, {"evidence_id": "evi_8d1433af23", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:41.906321+00:00"}, {"evidence_id": "evi_926bc7d9d0", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:41.906326+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:41.906332+00:00', '2026-09-26T19:35:41.906332+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_81daf495a3', 'test_sess_ai_pro_002', 'consumer', 'Consumer - Grievance', 'The laptop delivered to me has a cracked screen and the store claims no return policy.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The laptop delivered to me has a cracked screen and the store claims no return policy."], "grievance": "The laptop delivered to me has a cracked screen and the store claims no return policy."}'::jsonb, '[{"evidence_id": "evi_5befd547b7", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.038169+00:00"}, {"evidence_id": "evi_02bd93037c", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.038181+00:00"}, {"evidence_id": "evi_6f12790362", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.038186+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.038192+00:00', '2026-09-26T19:35:42.038192+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_530bad5bab', 'test_sess_ai_col_003', 'tenancy', 'Tenancy - Bengaluru', 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.', '{"opposing_party": "in Bengaluru", "opposing_party_hash": "29a0bbda7db86c25", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."], "grievance": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."}'::jsonb, '[{"evidence_id": "evi_5d89a72192", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.144369+00:00"}, {"evidence_id": "evi_2ff630c09a", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.144380+00:00"}, {"evidence_id": "evi_c8ca1988d1", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.144384+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.144389+00:00', '2026-09-26T19:35:42.144389+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_f5e076c42a', 'test_sess_ai_free_004', 'general', 'General - Grievance', 'I cannot afford a lawyer and need free legal aid for my case.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["I cannot afford a lawyer and need free legal aid for my case."], "grievance": "I cannot afford a lawyer and need free legal aid for my case."}'::jsonb, '[{"evidence_id": "evi_49567dd9a2", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.257874+00:00"}, {"evidence_id": "evi_8ca2c43148", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.257885+00:00"}, {"evidence_id": "evi_30f3103a34", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.257891+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.257897+00:00', '2026-09-26T19:35:42.257897+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_9cd047c426', 'test_sess_001', 'tenancy', 'Updated Dispute with Landlord Sharma', 'Landlord deducted 50000 rupees security deposit without any repair receipts.', '{"opposing_party": "Landlord Sharma", "opposing_party_hash": "f2c7ed0d345897ef", "location": "Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 50000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_3d6e6439c4", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.508349+00:00"}, {"evidence_id": "evi_49286cc4bf", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.508364+00:00"}, {"evidence_id": "evi_eaafb31baf", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.508369+00:00"}]'::jsonb, 'granted', '2026-09-26T19:35:42.509122+00:00', '2026-09-26T19:35:42.524672+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_6dca48258b', 'sess_7f2fa7e19a194206', 'consumer', 'Consumer - Grievance', 'The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.', '{"opposing_party": "delivered a broken refrigerator and customer care", "opposing_party_hash": "db3fd930125f8977", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."], "grievance": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."}'::jsonb, '[{"evidence_id": "evi_4aed1ed014", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.545786+00:00"}, {"evidence_id": "evi_9ee2952e40", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.545797+00:00"}, {"evidence_id": "evi_7fe44ca9b6", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.545802+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.545809+00:00', '2026-09-26T19:35:42.545809+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_37bbb86d24', 'citizen_sess_supertech_1', 'property_rera', 'Supertech delay tower B', 'Builder Supertech has not delivered flat possession since 2 years in Greater Noida.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 4500000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_7fd0bd042c", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.668391+00:00"}, {"evidence_id": "evi_263afb1592", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.668405+00:00"}, {"evidence_id": "evi_fac097f153", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.668410+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.669715+00:00', '2026-09-26T19:35:42.669715+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_31e944cbf2', 'citizen_sess_supertech_2', 'property_rera', 'Supertech delay tower C', 'Supertech failed to hand over apartment possession in Greater Noida sector 1.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 5000000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_0e1f6392a6", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.681393+00:00"}, {"evidence_id": "evi_a0ddc5dcd6", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.681408+00:00"}, {"evidence_id": "evi_bdc1a29ced", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.681413+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.682180+00:00', '2026-09-26T19:35:42.682180+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_7feef7cbd3', 'session_citizen_alice_123', 'consumer', 'Alice Defective Laptop Grievance', 'Purchased laptop with defective motherboard; retailer refusing replacement.', '{"opposing_party": "MegaElectronics Store", "opposing_party_hash": "7282b47646230757", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_b292d44611", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.786080+00:00"}, {"evidence_id": "evi_e6d3805f3b", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.786095+00:00"}, {"evidence_id": "evi_b2d96d6d99", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.786100+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.786233+00:00', '2026-09-26T19:35:42.786233+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_2c2f8cd7d7', 'session_citizen_consent_a', 'tenancy', 'Deposit issue', 'Deposit withheld', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_34a360963d", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.812854+00:00"}, {"evidence_id": "evi_d53e53fd58", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.812869+00:00"}, {"evidence_id": "evi_9852cbf0a6", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.812873+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.813010+00:00', '2026-09-26T19:35:42.813010+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_68494bd511', 'session_actions_owner', 'consumer', 'Action Test Case', '', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_6e06ff243b", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.851628+00:00"}, {"evidence_id": "evi_9e0b5fe32c", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.851643+00:00"}, {"evidence_id": "evi_26439c1ccf", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:35:42.851648+00:00"}]'::jsonb, 'pending', '2026-09-26T19:35:42.852515+00:00', '2026-09-26T19:35:42.852515+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_b16b9fce38', 'test_sess_ai_civic_001', 'consumer', 'Consumer - Grievance', 'I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.', '{"opposing_party": "refuses to refund my Rs 35", "opposing_party_hash": "fec3027c35e2be20", "location": null, "locality_bucket": "General / Unspecified Region", "amount": 35000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."], "grievance": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000."}'::jsonb, '[{"evidence_id": "evi_90e7d9b23c", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.464686+00:00"}, {"evidence_id": "evi_d99644fdc3", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.464698+00:00"}, {"evidence_id": "evi_421cc140a0", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.464704+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:54.464710+00:00', '2026-09-26T19:40:54.464710+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_ecb4c03e02', 'test_sess_ai_pro_002', 'consumer', 'Consumer - Grievance', 'The laptop delivered to me has a cracked screen and the store claims no return policy.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The laptop delivered to me has a cracked screen and the store claims no return policy."], "grievance": "The laptop delivered to me has a cracked screen and the store claims no return policy."}'::jsonb, '[{"evidence_id": "evi_64e100dfea", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.597548+00:00"}, {"evidence_id": "evi_4b6eef85d7", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.597559+00:00"}, {"evidence_id": "evi_e99e6b02d1", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.597563+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:54.597569+00:00', '2026-09-26T19:40:54.597569+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_afc67592b1', 'test_sess_ai_col_003', 'tenancy', 'Tenancy - Bengaluru', 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.', '{"opposing_party": "in Bengaluru", "opposing_party_hash": "29a0bbda7db86c25", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": ["My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."], "grievance": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out."}'::jsonb, '[{"evidence_id": "evi_db665cc3b9", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.703596+00:00"}, {"evidence_id": "evi_7ebf0d036a", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.703609+00:00"}, {"evidence_id": "evi_7d7a1419c5", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.703613+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:54.703620+00:00', '2026-09-26T19:40:54.703620+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_8b863408f3', 'test_sess_ai_free_004', 'general', 'General - Grievance', 'I cannot afford a lawyer and need free legal aid for my case.', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["I cannot afford a lawyer and need free legal aid for my case."], "grievance": "I cannot afford a lawyer and need free legal aid for my case."}'::jsonb, '[{"evidence_id": "evi_f05a953827", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.808865+00:00"}, {"evidence_id": "evi_82116d9992", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.808874+00:00"}, {"evidence_id": "evi_fb1b598814", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:54.808880+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:54.808885+00:00', '2026-09-26T19:40:54.808885+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_a4450ae417', 'test_sess_001', 'tenancy', 'Updated Dispute with Landlord Sharma', 'Landlord deducted 50000 rupees security deposit without any repair receipts.', '{"opposing_party": "Landlord Sharma", "opposing_party_hash": "f2c7ed0d345897ef", "location": "Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 50000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_23376587d7", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.255757+00:00"}, {"evidence_id": "evi_3959ab778b", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.255772+00:00"}, {"evidence_id": "evi_ee0bd914c1", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.255778+00:00"}]'::jsonb, 'granted', '2026-09-26T19:40:55.256629+00:00', '2026-09-26T19:40:55.272754+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_3c5e824819', 'sess_093950c50ef84a97', 'consumer', 'Consumer - Grievance', 'The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.', '{"opposing_party": "delivered a broken refrigerator and customer care", "opposing_party_hash": "db3fd930125f8977", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": ["The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."], "grievance": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair."}'::jsonb, '[{"evidence_id": "evi_0f097e81e2", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.294809+00:00"}, {"evidence_id": "evi_2486b70186", "type": "receipt", "description": "Proof of payment or transaction receipt", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.294821+00:00"}, {"evidence_id": "evi_3cc99c27eb", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.294825+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:55.294832+00:00', '2026-09-26T19:40:55.294832+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_9ade3d8000', 'citizen_sess_supertech_1', 'property_rera', 'Supertech delay tower B', 'Builder Supertech has not delivered flat possession since 2 years in Greater Noida.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 4500000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_e5c9749791", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.417390+00:00"}, {"evidence_id": "evi_6a0c4c2a06", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.417405+00:00"}, {"evidence_id": "evi_c47cc1388c", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.417410+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:55.419062+00:00', '2026-09-26T19:40:55.419062+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_a8f1f9d5a7', 'citizen_sess_supertech_2', 'property_rera', 'Supertech delay tower C', 'Supertech failed to hand over apartment possession in Greater Noida sector 1.', '{"opposing_party": "Supertech Builders", "opposing_party_hash": "40d58ff5580f36ff", "location": "Greater Noida", "locality_bucket": "Noida / Greater Noida (UP)", "amount": 5000000.0, "amount_bucket": "\u20b920,00,000+", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_7bbf43719b", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.431192+00:00"}, {"evidence_id": "evi_7194672e09", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.431206+00:00"}, {"evidence_id": "evi_e8c4af3ffc", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.431211+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:55.432383+00:00', '2026-09-26T19:40:55.432383+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_f5e6e788ff', 'session_citizen_alice_123', 'consumer', 'Alice Defective Laptop Grievance', 'Purchased laptop with defective motherboard; retailer refusing replacement.', '{"opposing_party": "MegaElectronics Store", "opposing_party_hash": "7282b47646230757", "location": "Bengaluru", "locality_bucket": "Bengaluru Urban (Karnataka)", "amount": 75000.0, "amount_bucket": "\u20b925,000\u2013\u20b91,00,000", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_59df12178e", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.530726+00:00"}, {"evidence_id": "evi_172cc3ca1f", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.530739+00:00"}, {"evidence_id": "evi_db176fad9d", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.530745+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:55.530857+00:00', '2026-09-26T19:40:55.530857+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_649f791ae9', 'session_citizen_consent_a', 'tenancy', 'Deposit issue', 'Deposit withheld', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_529d99df74", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.556768+00:00"}, {"evidence_id": "evi_279bc384ba", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.556782+00:00"}, {"evidence_id": "evi_c4a3bab500", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.556786+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:55.556930+00:00', '2026-09-26T19:40:55.556930+00:00') ON CONFLICT DO NOTHING;
INSERT INTO cases (case_id, session_id, issue_type, title, description, entities_json, evidence_json, consent_status, created_at, updated_at) VALUES ('case_6824406a04', 'session_actions_owner', 'consumer', 'Action Test Case', '', '{"opposing_party": null, "opposing_party_hash": "hash_unspecified", "location": null, "locality_bucket": "General / Unspecified Region", "amount": null, "amount_bucket": "Not Specified", "dates": [], "key_facts": [], "grievance": null}'::jsonb, '[{"evidence_id": "evi_a2c61a8ace", "type": "document", "description": "Written contract, invoice, or agreement", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.592821+00:00"}, {"evidence_id": "evi_feaa81ac97", "type": "receipt", "description": "Proof of payment or bank transaction", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.592833+00:00"}, {"evidence_id": "evi_d937b43fc9", "type": "message", "description": "Written communication / chat / email record", "status": "needed", "source_filename": null, "created_at": "2026-09-26T19:40:55.592837+00:00"}]'::jsonb, 'pending', '2026-09-26T19:40:55.593807+00:00', '2026-09-26T19:40:55.593807+00:00') ON CONFLICT DO NOTHING;

-- Table: incidents (21 rows)
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_688733aa3c', 'case_26fb5cb122', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T17:21:43.744538+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_34dcbb19ad', 'case_c6000e807a', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T17:21:43.753063+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_1ca557fbd3', 'case_44198e1cbd', NULL, 'tenancy', 'General / Unspecified Region', 'Not Specified', 'hash_unspecified', 1, 0, '2026-09-26T17:21:43.832403+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_38273a4980', 'case_a2e70865a5', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T17:22:01.661329+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_fabcd095bd', 'case_4542f11e90', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T17:22:01.670694+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_96af88d3b4', 'case_6f32f05f1e', NULL, 'tenancy', 'General / Unspecified Region', 'Not Specified', 'hash_unspecified', 1, 0, '2026-09-26T17:22:01.793754+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_ede3f4f99b', 'case_2ebc7b780c', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:17:59.987506+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_ce15ce110b', 'case_a109df09e4', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:17:59.998067+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_55d0c2180e', 'case_95e1a18118', NULL, 'tenancy', 'General / Unspecified Region', 'Not Specified', 'hash_unspecified', 1, 0, '2026-09-26T19:18:00.146477+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_89a61c26fd', 'case_1653e79247', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:30:37.605701+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_ab994746b1', 'case_1f0c815a47', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:30:37.617013+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_e7d4062c69', 'case_17b9acfd7d', NULL, 'tenancy', 'General / Unspecified Region', 'Not Specified', 'hash_unspecified', 1, 0, '2026-09-26T19:30:37.749645+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_abcefff10e', 'case_1003f9c21f', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:35:29.315490+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_5c2cb49ecb', 'case_b89cd9931d', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:35:29.330382+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_66d88d6c0a', 'case_0a6e983a20', NULL, 'tenancy', 'General / Unspecified Region', 'Not Specified', 'hash_unspecified', 1, 0, '2026-09-26T19:35:29.461016+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_9017c18817', 'case_37bbb86d24', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:35:42.697660+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_ef3941de40', 'case_31e944cbf2', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:35:42.706083+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_0938569c5e', 'case_2c2f8cd7d7', NULL, 'tenancy', 'General / Unspecified Region', 'Not Specified', 'hash_unspecified', 1, 0, '2026-09-26T19:35:42.830457+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_7a9950f096', 'case_9ade3d8000', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:40:55.445396+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_df6aff6618', 'case_a8f1f9d5a7', 'clust_af84e15835', 'property_rera', 'Noida / Greater Noida (UP)', '₹20,00,000+', '40d58ff5580f36ff', 1, 0, '2026-09-26T19:40:55.453830+00:00') ON CONFLICT DO NOTHING;
INSERT INTO incidents (incident_id, case_id, cluster_id, issue_type, locality_bucket, amount_bucket, opposing_party_hash, consent_stage1, consent_stage2, created_at) VALUES ('inc_445735e924', 'case_649f791ae9', NULL, 'tenancy', 'General / Unspecified Region', 'Not Specified', 'hash_unspecified', 1, 0, '2026-09-26T19:40:55.574439+00:00') ON CONFLICT DO NOTHING;

-- Table: drafts (28 rows)
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_6c69358ff9', NULL, 'notice', 'Legal Notice - Apex Electronic Appliances Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
Apex Electronic Appliances Ltd
Connaught Place, New Delhi

FROM / ON BEHALF OF:
Rohan Gupta
Sector 62, Noida, UP

SUBJECT: Notice regarding supply of defective television — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Rohan Gupta, residing at Sector 62, Noida, UP, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.
    2. Display panel stopped working within 10 days of installation.
    3. Authorized service center refused warranty replacement.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Replace the defective TV unit with a brand new unit.
    2. Pay compensation of Rs 15,000 for distress.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Rohan Gupta)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T17:21:43.613439+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_rti_79bee80a63', NULL, 'rti', 'RTI Application - Municipal Corporation of Ghaziabad', 'FORM ''A''
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: 26-09-2026

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: Municipal Corporation of Ghaziabad
Department: Public Works Department
Jurisdiction: Central Government

1. FULL NAME OF APPLICANT: Sunita Verma
2. ADDRESS FOR CORRESPONDENCE: Indirapuram, Ghaziabad
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
    (1) Provide certified copy of sanctioned budget for repair of Main Road.
    (2) State official completion date and contractor name.

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    30 Calendar Days (Standard statutory disposal under Section 7(1))

6. APPLICATION FEE PARTICULARS:
    Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: Ghaziabad
Date: 26-09-2026

_____________________________
Signature / Thumb Impression of Applicant
(Sunita Verma)
', '{"life_liberty": false, "bpl": false}'::jsonb, '2026-09-26T17:21:43.631525+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_ee02adb645', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T17:21:49.806976+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_e2cfdf6762', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', 'LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": true}'::jsonb, '2026-09-26T17:21:49.832851+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_2f1d3371b1', NULL, 'notice', 'Legal Notice - Apex Electronic Appliances Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
Apex Electronic Appliances Ltd
Connaught Place, New Delhi

FROM / ON BEHALF OF:
Rohan Gupta
Sector 62, Noida, UP

SUBJECT: Notice regarding supply of defective television — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Rohan Gupta, residing at Sector 62, Noida, UP, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.
    2. Display panel stopped working within 10 days of installation.
    3. Authorized service center refused warranty replacement.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Replace the defective TV unit with a brand new unit.
    2. Pay compensation of Rs 15,000 for distress.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Rohan Gupta)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T17:22:00.748211+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_rti_04c00aeaf6', NULL, 'rti', 'RTI Application - Municipal Corporation of Ghaziabad', 'FORM ''A''
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: 26-09-2026

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: Municipal Corporation of Ghaziabad
Department: Public Works Department
Jurisdiction: Central Government

1. FULL NAME OF APPLICANT: Sunita Verma
2. ADDRESS FOR CORRESPONDENCE: Indirapuram, Ghaziabad
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
    (1) Provide certified copy of sanctioned budget for repair of Main Road.
    (2) State official completion date and contractor name.

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    30 Calendar Days (Standard statutory disposal under Section 7(1))

6. APPLICATION FEE PARTICULARS:
    Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: Ghaziabad
Date: 26-09-2026

_____________________________
Signature / Thumb Impression of Applicant
(Sunita Verma)
', '{"life_liberty": false, "bpl": false}'::jsonb, '2026-09-26T17:22:00.760048+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_a056cae8e4', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T17:22:01.378612+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_dd9d2c1f87', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', 'LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": true}'::jsonb, '2026-09-26T17:22:01.403262+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_536c067a18', NULL, 'notice', 'Legal Notice - Apex Electronic Appliances Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
Apex Electronic Appliances Ltd
Connaught Place, New Delhi

FROM / ON BEHALF OF:
Rohan Gupta
Sector 62, Noida, UP

SUBJECT: Notice regarding supply of defective television — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Rohan Gupta, residing at Sector 62, Noida, UP, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.
    2. Display panel stopped working within 10 days of installation.
    3. Authorized service center refused warranty replacement.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Replace the defective TV unit with a brand new unit.
    2. Pay compensation of Rs 15,000 for distress.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Rohan Gupta)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:17:59.129074+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_rti_1a78821252', NULL, 'rti', 'RTI Application - Municipal Corporation of Ghaziabad', 'FORM ''A''
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: 26-09-2026

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: Municipal Corporation of Ghaziabad
Department: Public Works Department
Jurisdiction: Central Government

1. FULL NAME OF APPLICANT: Sunita Verma
2. ADDRESS FOR CORRESPONDENCE: Indirapuram, Ghaziabad
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
    (1) Provide certified copy of sanctioned budget for repair of Main Road.
    (2) State official completion date and contractor name.

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    30 Calendar Days (Standard statutory disposal under Section 7(1))

6. APPLICATION FEE PARTICULARS:
    Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: Ghaziabad
Date: 26-09-2026

_____________________________
Signature / Thumb Impression of Applicant
(Sunita Verma)
', '{"life_liberty": false, "bpl": false}'::jsonb, '2026-09-26T19:17:59.142119+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_dae5e5352a', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:17:59.702077+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_5b1bffbd93', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', 'LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": true}'::jsonb, '2026-09-26T19:17:59.727259+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_c33c8878b8', NULL, 'notice', 'Legal Notice - Apex Electronic Appliances Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
Apex Electronic Appliances Ltd
Connaught Place, New Delhi

FROM / ON BEHALF OF:
Rohan Gupta
Sector 62, Noida, UP

SUBJECT: Notice regarding supply of defective television — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Rohan Gupta, residing at Sector 62, Noida, UP, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.
    2. Display panel stopped working within 10 days of installation.
    3. Authorized service center refused warranty replacement.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Replace the defective TV unit with a brand new unit.
    2. Pay compensation of Rs 15,000 for distress.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Rohan Gupta)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:30:36.760678+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_rti_865ee035ee', NULL, 'rti', 'RTI Application - Municipal Corporation of Ghaziabad', 'FORM ''A''
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: 26-09-2026

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: Municipal Corporation of Ghaziabad
Department: Public Works Department
Jurisdiction: Central Government

1. FULL NAME OF APPLICANT: Sunita Verma
2. ADDRESS FOR CORRESPONDENCE: Indirapuram, Ghaziabad
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
    (1) Provide certified copy of sanctioned budget for repair of Main Road.
    (2) State official completion date and contractor name.

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    30 Calendar Days (Standard statutory disposal under Section 7(1))

6. APPLICATION FEE PARTICULARS:
    Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: Ghaziabad
Date: 26-09-2026

_____________________________
Signature / Thumb Impression of Applicant
(Sunita Verma)
', '{"life_liberty": false, "bpl": false}'::jsonb, '2026-09-26T19:30:36.773214+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_185be75c8b', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:30:37.332448+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_55e6b9ff67', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', 'LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": true}'::jsonb, '2026-09-26T19:30:37.358561+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_5884cabb0b', NULL, 'notice', 'Legal Notice - Apex Electronic Appliances Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
Apex Electronic Appliances Ltd
Connaught Place, New Delhi

FROM / ON BEHALF OF:
Rohan Gupta
Sector 62, Noida, UP

SUBJECT: Notice regarding supply of defective television — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Rohan Gupta, residing at Sector 62, Noida, UP, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.
    2. Display panel stopped working within 10 days of installation.
    3. Authorized service center refused warranty replacement.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Replace the defective TV unit with a brand new unit.
    2. Pay compensation of Rs 15,000 for distress.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Rohan Gupta)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:35:28.401306+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_rti_c13e37cf24', NULL, 'rti', 'RTI Application - Municipal Corporation of Ghaziabad', 'FORM ''A''
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: 26-09-2026

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: Municipal Corporation of Ghaziabad
Department: Public Works Department
Jurisdiction: Central Government

1. FULL NAME OF APPLICANT: Sunita Verma
2. ADDRESS FOR CORRESPONDENCE: Indirapuram, Ghaziabad
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
    (1) Provide certified copy of sanctioned budget for repair of Main Road.
    (2) State official completion date and contractor name.

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    30 Calendar Days (Standard statutory disposal under Section 7(1))

6. APPLICATION FEE PARTICULARS:
    Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: Ghaziabad
Date: 26-09-2026

_____________________________
Signature / Thumb Impression of Applicant
(Sunita Verma)
', '{"life_liberty": false, "bpl": false}'::jsonb, '2026-09-26T19:35:28.414668+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_0cb560c663', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:35:29.033285+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_75b8e5e578', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', 'LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": true}'::jsonb, '2026-09-26T19:35:29.063276+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_7cdbee0742', NULL, 'notice', 'Legal Notice - Apex Electronic Appliances Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
Apex Electronic Appliances Ltd
Connaught Place, New Delhi

FROM / ON BEHALF OF:
Rohan Gupta
Sector 62, Noida, UP

SUBJECT: Notice regarding supply of defective television — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Rohan Gupta, residing at Sector 62, Noida, UP, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.
    2. Display panel stopped working within 10 days of installation.
    3. Authorized service center refused warranty replacement.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Replace the defective TV unit with a brand new unit.
    2. Pay compensation of Rs 15,000 for distress.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Rohan Gupta)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:35:41.864224+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_rti_fd8a258e79', NULL, 'rti', 'RTI Application - Municipal Corporation of Ghaziabad', 'FORM ''A''
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: 26-09-2026

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: Municipal Corporation of Ghaziabad
Department: Public Works Department
Jurisdiction: Central Government

1. FULL NAME OF APPLICANT: Sunita Verma
2. ADDRESS FOR CORRESPONDENCE: Indirapuram, Ghaziabad
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
    (1) Provide certified copy of sanctioned budget for repair of Main Road.
    (2) State official completion date and contractor name.

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    30 Calendar Days (Standard statutory disposal under Section 7(1))

6. APPLICATION FEE PARTICULARS:
    Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: Ghaziabad
Date: 26-09-2026

_____________________________
Signature / Thumb Impression of Applicant
(Sunita Verma)
', '{"life_liberty": false, "bpl": false}'::jsonb, '2026-09-26T19:35:41.875295+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_6dcb76451a', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:35:42.460884+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_7f66c19a58', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', 'LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": true}'::jsonb, '2026-09-26T19:35:42.486947+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_aba829a152', NULL, 'notice', 'Legal Notice - Apex Electronic Appliances Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
Apex Electronic Appliances Ltd
Connaught Place, New Delhi

FROM / ON BEHALF OF:
Rohan Gupta
Sector 62, Noida, UP

SUBJECT: Notice regarding supply of defective television — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Rohan Gupta, residing at Sector 62, Noida, UP, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.
    2. Display panel stopped working within 10 days of installation.
    3. Authorized service center refused warranty replacement.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Replace the defective TV unit with a brand new unit.
    2. Pay compensation of Rs 15,000 for distress.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Rohan Gupta)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:40:54.423289+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_rti_c430a25e53', NULL, 'rti', 'RTI Application - Municipal Corporation of Ghaziabad', 'FORM ''A''
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: 26-09-2026

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: Municipal Corporation of Ghaziabad
Department: Public Works Department
Jurisdiction: Central Government

1. FULL NAME OF APPLICANT: Sunita Verma
2. ADDRESS FOR CORRESPONDENCE: Indirapuram, Ghaziabad
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
    (1) Provide certified copy of sanctioned budget for repair of Main Road.
    (2) State official completion date and contractor name.

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    30 Calendar Days (Standard statutory disposal under Section 7(1))

6. APPLICATION FEE PARTICULARS:
    Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: Ghaziabad
Date: 26-09-2026

_____________________________
Signature / Thumb Impression of Applicant
(Sunita Verma)
', '{"life_liberty": false, "bpl": false}'::jsonb, '2026-09-26T19:40:54.434880+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_c47940822b', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', '================================================================================
   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)
   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.
   Unlocked documents include clean legal formatting, bar-compliant disclaimers,
   and direct postal tracking automation.
================================================================================

LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": false}'::jsonb, '2026-09-26T19:40:55.205346+00:00') ON CONFLICT DO NOTHING;
INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at) VALUES ('draft_not_6867b184c6', NULL, 'notice', 'Legal Notice - ABC Electronics Ltd', 'LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: 26-09-2026

TO,
ABC Electronics Ltd
Koramangala, Bengaluru

FROM / ON BEHALF OF:
Vikram Patel
Indiranagar, Bengaluru

SUBJECT: Notice for Defective Washing Machine — DEMAND NOTICE UNDER CONSUMER PROTECTION ACT, 2019 (SECTIONS 2(11), 35)

Sir/Madam,

Under instructions from and on behalf of my client/claimant, Vikram Patel, residing at Indiranagar, Bengaluru, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
    1. Machine ceased working within 2 days of delivery.

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of Consumer Protection Act, 2019 (Sections 2(11), 35), causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within 15 DAYS from the receipt of this notice:
    1. Full refund of Rs 25,000.
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of 15 days (on or before 11-10-2026), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of Vikram Patel)
', '{"statutory_days": 15, "applicable_act": "Consumer Protection Act, 2019 (Sections 2(11), 35)", "is_unlocked": true}'::jsonb, '2026-09-26T19:40:55.232847+00:00') ON CONFLICT DO NOTHING;

-- Table: audit_events (98 rows)
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_53be5eb33a28', 'session:test_sess_001', 'save_case', 'case_651e7f6092', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:21:43.672485+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_956da092ff61', 'session:test_sess_001', 'save_case', 'case_651e7f6092', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:21:43.693947+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_78480531015c', 'session:citizen_sess_supertech_1', 'save_case', 'case_26fb5cb122', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T17:21:43.716826+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_66f9f712c4c9', 'session:citizen_sess_supertech_2', 'save_case', 'case_c6000e807a', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T17:21:43.732722+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_9a2ff8470b81', 'session:session_citizen_alice_123', 'save_case', 'case_7fdc2ff2d4', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:21:43.786590+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_11db54c76919', 'session:session_citizen_consent_a', 'save_case', 'case_44198e1cbd', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:21:43.818502+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_5769f945e1c5', 'session:session_actions_owner', 'save_case', 'case_d181da2065', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:21:43.857118+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_80a73ee7a80e', 'user:usr_9159753499', 'subscription_updated', 'sub_d0e0b80076', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T17:21:49.781555+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_402514f960c2', 'session:sess_ac1c32fa953c42b7', 'save_case', 'case_7b3d3c77f8', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:21:55.030073+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_e31906c107c0', 'session:test_sess_ai_civic_001', 'save_case', 'case_8d72f62635', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:21:55.183128+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_443608178999', 'user:usr_96d5c9f1a9', 'subscription_updated', 'sub_test_test_sess_ai_pro_002', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T17:21:55.306842+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_1b1754a850a2', 'session:test_sess_ai_pro_002', 'save_case', 'case_cd56192812', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:21:55.318103+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_aaa9b77d098e', 'session:test_sess_ai_col_003', 'save_case', 'case_1cae89d1fd', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:21:55.427570+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_fcec963d99fe', 'session:test_sess_ai_free_004', 'save_case', 'case_c051855932', '{"issue_type": "general"}'::jsonb, '2026-09-26T17:21:55.543052+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_ceab4676804e', 'session:test_sess_ai_civic_001', 'save_case', 'case_62e67eeefb', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:22:00.793995+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_a75dec50b917', 'user:usr_96d5c9f1a9', 'subscription_updated', 'sub_test_test_sess_ai_pro_002', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T17:22:00.946073+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_afaa3ad773dc', 'session:test_sess_ai_pro_002', 'save_case', 'case_2a58bddf30', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:22:00.958952+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_d2918c5794c3', 'session:test_sess_ai_col_003', 'save_case', 'case_b89479c6f4', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:22:01.086202+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_fcf5c7df826a', 'session:test_sess_ai_free_004', 'save_case', 'case_95514a4374', '{"issue_type": "general"}'::jsonb, '2026-09-26T17:22:01.196955+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_f8d4d791bd9b', 'user:usr_25d28a6212', 'subscription_updated', 'sub_69a0e0b944', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T17:22:01.351792+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_c51e522a6f92', 'session:test_sess_001', 'save_case', 'case_98a36bca1c', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:22:01.430488+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_3c78725b6836', 'session:test_sess_001', 'save_case', 'case_98a36bca1c', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:22:01.447658+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_6e3f35b8b76b', 'session:sess_22b5b7c7e0ec4eed', 'save_case', 'case_80c7207e5f', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:22:01.468347+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_6f59e6024108', 'session:citizen_sess_supertech_1', 'save_case', 'case_a2e70865a5', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T17:22:01.637799+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_9b92603cfaf0', 'session:citizen_sess_supertech_2', 'save_case', 'case_4542f11e90', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T17:22:01.651979+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_4a19f08855dd', 'session:session_citizen_alice_123', 'save_case', 'case_f91a913622', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:22:01.753880+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_16b09865b435', 'session:session_citizen_consent_a', 'save_case', 'case_6f32f05f1e', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T17:22:01.779907+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_7adb8805898e', 'session:session_actions_owner', 'save_case', 'case_ff2b772523', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T17:22:01.818824+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_a59ad3c7201b', 'session:test_sess_ai_civic_001', 'save_case', 'case_03d371315e', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:17:59.180620+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_86e5ba34621a', 'user:usr_96d5c9f1a9', 'subscription_updated', 'sub_test_test_sess_ai_pro_002', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:17:59.301273+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_d1826f016625', 'session:test_sess_ai_pro_002', 'save_case', 'case_73843cf550', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:17:59.312896+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_fafdd4ced62f', 'session:test_sess_ai_col_003', 'save_case', 'case_d29e9ba6c1', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:17:59.416644+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_20eeeb278960', 'session:test_sess_ai_free_004', 'save_case', 'case_ffbb21658c', '{"issue_type": "general"}'::jsonb, '2026-09-26T19:17:59.524631+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_be4a61278b2c', 'user:usr_f0276593d3', 'subscription_updated', 'sub_44799a6a7a', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:17:59.674080+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_61052eed4837', 'session:test_sess_001', 'save_case', 'case_0f453f9da5', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:17:59.769806+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_e5d2a0c9ba29', 'session:test_sess_001', 'save_case', 'case_0f453f9da5', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:17:59.790420+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_34078497db6c', 'session:sess_0646032a43124efc', 'save_case', 'case_ea58d8417c', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:17:59.812682+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_1dc212275b93', 'session:citizen_sess_supertech_1', 'save_case', 'case_2ebc7b780c', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:17:59.964829+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_3b81f8d10cee', 'session:citizen_sess_supertech_2', 'save_case', 'case_a109df09e4', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:17:59.978596+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_3015d110716b', 'session:session_citizen_alice_123', 'save_case', 'case_b20909cbea', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:18:00.100748+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_3b0dbaf71046', 'session:session_citizen_consent_a', 'save_case', 'case_95e1a18118', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:18:00.131390+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_02fd59cd6bc3', 'session:session_actions_owner', 'save_case', 'case_bb1dc341a3', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:18:00.172434+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_625e56bb360f', 'session:test_sess_ai_civic_001', 'save_case', 'case_d86ff6433c', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:30:36.808449+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_74166293cae4', 'user:usr_96d5c9f1a9', 'subscription_updated', 'sub_test_test_sess_ai_pro_002', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:30:36.929428+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_b0fe57755d88', 'session:test_sess_ai_pro_002', 'save_case', 'case_0f0c9d5388', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:30:36.940807+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_adb19872b0b3', 'session:test_sess_ai_col_003', 'save_case', 'case_12fd33c51f', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:30:37.049059+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_d4bddbe8bb63', 'session:test_sess_ai_free_004', 'save_case', 'case_f7042f6b24', '{"issue_type": "general"}'::jsonb, '2026-09-26T19:30:37.158190+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_ba22d11e9d19', 'user:usr_26d46078e9', 'subscription_updated', 'sub_535cb5ed98', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:30:37.308669+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_ca385b81d037', 'session:test_sess_001', 'save_case', 'case_04a0830866', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:30:37.387145+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_373c3c169b4d', 'session:test_sess_001', 'save_case', 'case_04a0830866', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:30:37.404444+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_29125f6b177d', 'session:sess_f06de89e56ee46f6', 'save_case', 'case_8c38cfcfdf', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:30:37.425968+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_015bfe5c4b5d', 'session:citizen_sess_supertech_1', 'save_case', 'case_1653e79247', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:30:37.550477+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_028f92e7e30e', 'session:citizen_sess_supertech_2', 'save_case', 'case_1f0c815a47', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:30:37.591840+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_c6a03bf0e036', 'session:session_citizen_alice_123', 'save_case', 'case_534f0aec4e', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:30:37.709459+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_17bac647839c', 'session:session_citizen_consent_a', 'save_case', 'case_17b9acfd7d', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:30:37.735493+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_e1b3a36708db', 'session:session_actions_owner', 'save_case', 'case_730c8c16a3', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:30:37.773125+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_298f7af950aa', 'session:test_sess_ai_civic_001', 'save_case', 'case_33a2e5bce0', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:28.452490+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_812afc447940', 'user:usr_96d5c9f1a9', 'subscription_updated', 'sub_test_test_sess_ai_pro_002', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:35:28.586019+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_e0072d3f187a', 'session:test_sess_ai_pro_002', 'save_case', 'case_5611f8fba9', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:28.600738+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_de791c9ae0ee', 'session:test_sess_ai_col_003', 'save_case', 'case_2a7ee6e852', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:28.712177+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_f50f2085ff50', 'session:test_sess_ai_free_004', 'save_case', 'case_8e4c41bfb0', '{"issue_type": "general"}'::jsonb, '2026-09-26T19:35:28.843569+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_94187dcba0c2', 'user:usr_07ebc82f17', 'subscription_updated', 'sub_6b228e30e6', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:35:29.008575+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_ae506eb99473', 'session:test_sess_001', 'save_case', 'case_3973d04aef', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:29.100923+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_b71889e103f3', 'session:test_sess_001', 'save_case', 'case_3973d04aef', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:29.119114+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_bd9f09c636dd', 'session:sess_d7ae21a52dbe40d6', 'save_case', 'case_f420cc13f9', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:29.143557+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_9d1c98704605', 'session:citizen_sess_supertech_1', 'save_case', 'case_1003f9c21f', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:35:29.292465+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_31c6522ae0a4', 'session:citizen_sess_supertech_2', 'save_case', 'case_b89cd9931d', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:35:29.306606+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_2d725efec2ab', 'session:session_citizen_alice_123', 'save_case', 'case_b84c7ad945', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:29.418624+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_b701ad586bf8', 'session:session_citizen_consent_a', 'save_case', 'case_0a6e983a20', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:29.447224+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_6ab01a5bb92a', 'session:session_actions_owner', 'save_case', 'case_58aba5f4fd', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:29.489714+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_0e8ea82f168f', 'session:test_sess_ai_civic_001', 'save_case', 'case_c4d181a01a', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:41.912367+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_d4d780e08d38', 'user:usr_96d5c9f1a9', 'subscription_updated', 'sub_test_test_sess_ai_pro_002', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:35:42.030701+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_6f3f33c7cf50', 'session:test_sess_ai_pro_002', 'save_case', 'case_81daf495a3', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:42.042110+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_c2605b45affb', 'session:test_sess_ai_col_003', 'save_case', 'case_530bad5bab', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:42.148710+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_6da2a4532641', 'session:test_sess_ai_free_004', 'save_case', 'case_f5e076c42a', '{"issue_type": "general"}'::jsonb, '2026-09-26T19:35:42.265216+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_c70fbcf5434d', 'user:usr_5f227ea1d2', 'subscription_updated', 'sub_312656420e', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:35:42.429004+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_c7411c3d36d2', 'session:test_sess_001', 'save_case', 'case_9cd047c426', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:42.512774+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_c503f33062ab', 'session:test_sess_001', 'save_case', 'case_9cd047c426', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:42.529120+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_b83ed8cde716', 'session:sess_7f2fa7e19a194206', 'save_case', 'case_6dca48258b', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:42.549702+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_9063b18974ed', 'session:citizen_sess_supertech_1', 'save_case', 'case_37bbb86d24', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:35:42.673668+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_856195b82c3c', 'session:citizen_sess_supertech_2', 'save_case', 'case_31e944cbf2', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:35:42.686238+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_e1f719dfc282', 'session:session_citizen_alice_123', 'save_case', 'case_7feef7cbd3', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:42.790217+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_a0220103e9ad', 'session:session_citizen_consent_a', 'save_case', 'case_2c2f8cd7d7', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:35:42.816660+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_622227a6999b', 'session:session_actions_owner', 'save_case', 'case_68494bd511', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:35:42.856445+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_7f725ad2383c', 'session:test_sess_ai_civic_001', 'save_case', 'case_b16b9fce38', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:40:54.469054+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_e9a91ab369bd', 'user:usr_96d5c9f1a9', 'subscription_updated', 'sub_test_test_sess_ai_pro_002', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:40:54.590295+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_855695aafe4a', 'session:test_sess_ai_pro_002', 'save_case', 'case_ecb4c03e02', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:40:54.601721+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_3ba6e30ee24d', 'session:test_sess_ai_col_003', 'save_case', 'case_afc67592b1', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:40:54.707786+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_7556bd4355d5', 'session:test_sess_ai_free_004', 'save_case', 'case_8b863408f3', '{"issue_type": "general"}'::jsonb, '2026-09-26T19:40:54.816341+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_f7cf289e506f', 'user:usr_090299a782', 'subscription_updated', 'sub_849975120c', '{"plan_id": "plan_pro_monthly", "status": "active"}'::jsonb, '2026-09-26T19:40:54.972615+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_62a3a26bfb30', 'session:test_sess_001', 'save_case', 'case_a4450ae417', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:40:55.260564+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_2191244b316a', 'session:test_sess_001', 'save_case', 'case_a4450ae417', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:40:55.277106+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_c1ae7b838b5c', 'session:sess_093950c50ef84a97', 'save_case', 'case_3c5e824819', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:40:55.298407+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_153cac288086', 'session:citizen_sess_supertech_1', 'save_case', 'case_9ade3d8000', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:40:55.423070+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_e83c94e40612', 'session:citizen_sess_supertech_2', 'save_case', 'case_a8f1f9d5a7', '{"issue_type": "property_rera"}'::jsonb, '2026-09-26T19:40:55.436966+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_704be3973a40', 'session:session_citizen_alice_123', 'save_case', 'case_f5e6e788ff', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:40:55.535659+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_94d6534cb4ee', 'session:session_citizen_consent_a', 'save_case', 'case_649f791ae9', '{"issue_type": "tenancy"}'::jsonb, '2026-09-26T19:40:55.560443+00:00') ON CONFLICT DO NOTHING;
INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp) VALUES ('aud_6649e277d71a', 'session:session_actions_owner', 'save_case', 'case_6824406a04', '{"issue_type": "consumer"}'::jsonb, '2026-09-26T19:40:55.597413+00:00') ON CONFLICT DO NOTHING;

-- Table: user_subscriptions (8 rows)
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_d0e0b80076', 'usr_9159753499', 'plan_pro_monthly', 'active', '2026-09-26T17:21:49.778059+00:00', '2026-10-26T17:21:49.778059+00:00', 'pay_test_987654321', 0, '2026-09-26T17:21:49.778118+00:00', '2026-09-26T17:21:49.778118+00:00') ON CONFLICT DO NOTHING;
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_69a0e0b944', 'usr_25d28a6212', 'plan_pro_monthly', 'active', '2026-09-26T17:22:01.348049+00:00', '2026-10-26T17:22:01.348049+00:00', 'pay_test_987654321', 0, '2026-09-26T17:22:01.348095+00:00', '2026-09-26T17:22:01.348095+00:00') ON CONFLICT DO NOTHING;
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_44799a6a7a', 'usr_f0276593d3', 'plan_pro_monthly', 'active', '2026-09-26T19:17:59.670813+00:00', '2026-10-26T19:17:59.670813+00:00', 'pay_test_987654321', 0, '2026-09-26T19:17:59.670852+00:00', '2026-09-26T19:17:59.670852+00:00') ON CONFLICT DO NOTHING;
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_535cb5ed98', 'usr_26d46078e9', 'plan_pro_monthly', 'active', '2026-09-26T19:30:37.305266+00:00', '2026-10-26T19:30:37.305266+00:00', 'pay_test_987654321', 0, '2026-09-26T19:30:37.305337+00:00', '2026-09-26T19:30:37.305337+00:00') ON CONFLICT DO NOTHING;
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_6b228e30e6', 'usr_07ebc82f17', 'plan_pro_monthly', 'active', '2026-09-26T19:35:29.005132+00:00', '2026-10-26T19:35:29.005132+00:00', 'pay_test_987654321', 0, '2026-09-26T19:35:29.005171+00:00', '2026-09-26T19:35:29.005171+00:00') ON CONFLICT DO NOTHING;
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_312656420e', 'usr_5f227ea1d2', 'plan_pro_monthly', 'active', '2026-09-26T19:35:42.422738+00:00', '2026-10-26T19:35:42.422738+00:00', 'pay_test_987654321', 0, '2026-09-26T19:35:42.422782+00:00', '2026-09-26T19:35:42.422782+00:00') ON CONFLICT DO NOTHING;
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_test_test_sess_ai_pro_002', 'usr_96d5c9f1a9', 'plan_pro_monthly', 'active', '2026-01-01T00:00:00Z', '2027-01-01T00:00:00Z', NULL, 0, '2026-09-26T17:21:55.303350+00:00', '2026-09-26T19:40:54.586693+00:00') ON CONFLICT DO NOTHING;
INSERT INTO user_subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end, gateway_subscription_id, cancel_at_period_end, created_at, updated_at) VALUES ('sub_849975120c', 'usr_090299a782', 'plan_pro_monthly', 'active', '2026-09-26T19:40:54.967052+00:00', '2026-10-26T19:40:54.967052+00:00', 'pay_test_987654321', 0, '2026-09-26T19:40:54.967094+00:00', '2026-09-26T19:40:54.967094+00:00') ON CONFLICT DO NOTHING;

-- Table: payment_orders (35 rows)
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_d9527f2d8269', 'usr_e3a2b6cf48', 'order_cecd53089e8b44', 'subscription', NULL, 14900, 'INR', 'created', NULL, '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Ramesh Kumar", "customer_email": "ramesh@example.com", "customer_phone": null}'::jsonb, '2026-09-26T17:21:49.731768+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_c771840871a7', 'usr_bb354d5a92', 'order_4002e79eabdd41', 'notice_draft', 'case_consumer_001', 19900, 'INR', 'created', NULL, '{"item_title": "Statutory Legal Notice (15-Day Demand Draft)", "plan_id": null, "customer_name": "Priya Sharma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T17:21:49.746028+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_6ee45dc7bd21', 'usr_9159753499', 'order_8c7eb9b720644e', 'subscription', NULL, 14900, 'INR', 'paid', '478d8b634f8826beea8c0e6939fbe8f385bc63d5dca962e08ab979c4e05fb049', '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Amitabh Verma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T17:21:49.761048+00:00', '2026-09-26T17:21:49.772576+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_test_unlock_test_sess_gatekeeper_aef43c60', 'usr_7f6c4694e8', 'gw_ord_test_unlock_test_sess_gatekeeper_aef43c60', 'notice_draft', NULL, 19900, 'INR', 'paid', 'sig_test_paid', '{}'::jsonb, '2026-09-26T17:21:49.818088+00:00', '2026-09-26T17:21:49.821735+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_a3d6f94692a6', 'usr_fd5a11eb62', 'order_d1fc8488995141', 'collective_docket', 'cluster_bengaluru_deposit_withholding', 49900, 'INR', 'created', NULL, '{"item_title": "Collective Action Docket Escrow Contribution", "plan_id": null, "customer_name": "Siddharth Rao", "customer_email": "siddharth@example.com", "customer_phone": null}'::jsonb, '2026-09-26T17:21:49.847492+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_512edd491915', 'usr_a8e6edb547', 'order_d130d34b4edb4b', 'subscription', NULL, 14900, 'INR', 'created', NULL, '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Ramesh Kumar", "customer_email": "ramesh@example.com", "customer_phone": null}'::jsonb, '2026-09-26T17:22:01.306720+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_e7a4ccbdbff0', 'usr_4fceecd52f', 'order_4720a8c51f294a', 'notice_draft', 'case_consumer_001', 19900, 'INR', 'created', NULL, '{"item_title": "Statutory Legal Notice (15-Day Demand Draft)", "plan_id": null, "customer_name": "Priya Sharma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T17:22:01.320694+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_9aa3c7e44d84', 'usr_25d28a6212', 'order_22dcc7c615e445', 'subscription', NULL, 14900, 'INR', 'paid', '54384f13f34cd7fc398efeb8de87852844185f99375277001b17e08ccb37cdae', '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Amitabh Verma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T17:22:01.334718+00:00', '2026-09-26T17:22:01.343820+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_test_unlock_test_sess_gatekeeper_086d8d71', 'usr_eada858eb8', 'gw_ord_test_unlock_test_sess_gatekeeper_086d8d71', 'notice_draft', NULL, 19900, 'INR', 'paid', 'sig_test_paid', '{}'::jsonb, '2026-09-26T17:22:01.388119+00:00', '2026-09-26T17:22:01.392278+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_fb508005529d', 'usr_4d45f2fc2b', 'order_fc287cbdf3d44b', 'collective_docket', 'cluster_bengaluru_deposit_withholding', 49900, 'INR', 'created', NULL, '{"item_title": "Collective Action Docket Escrow Contribution", "plan_id": null, "customer_name": "Siddharth Rao", "customer_email": "siddharth@example.com", "customer_phone": null}'::jsonb, '2026-09-26T17:22:01.416703+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_d2c59b89ab58', 'usr_606652a663', 'order_35570a409f0642', 'subscription', NULL, 14900, 'INR', 'created', NULL, '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Ramesh Kumar", "customer_email": "ramesh@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:17:59.630359+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_4b9a0aacf50a', 'usr_558c2ed662', 'order_ceebfd927f8945', 'notice_draft', 'case_consumer_001', 19900, 'INR', 'created', NULL, '{"item_title": "Statutory Legal Notice (15-Day Demand Draft)", "plan_id": null, "customer_name": "Priya Sharma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:17:59.644341+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_513b711ae9b6', 'usr_f0276593d3', 'order_7c84b569979349', 'subscription', NULL, 14900, 'INR', 'paid', '3e92a1945f4ad18573d3ee6326c8cb94b6acbe1626712ae5178ea025df7ef752', '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Amitabh Verma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:17:59.657575+00:00', '2026-09-26T19:17:59.667158+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_test_unlock_test_sess_gatekeeper_f7576d11', 'usr_b456feb4bc', 'gw_ord_test_unlock_test_sess_gatekeeper_f7576d11', 'notice_draft', NULL, 19900, 'INR', 'paid', 'sig_test_paid', '{}'::jsonb, '2026-09-26T19:17:59.712330+00:00', '2026-09-26T19:17:59.715987+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_b78bcc028cec', 'usr_6cb706a392', 'order_0ab3f1f5abd847', 'collective_docket', 'cluster_bengaluru_deposit_withholding', 49900, 'INR', 'created', NULL, '{"item_title": "Collective Action Docket Escrow Contribution", "plan_id": null, "customer_name": "Siddharth Rao", "customer_email": "siddharth@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:17:59.745668+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_658b888f959d', 'usr_1af0d6a38b', 'order_59df559820f049', 'subscription', NULL, 14900, 'INR', 'created', NULL, '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Ramesh Kumar", "customer_email": "ramesh@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:30:37.263116+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_0d33125c42fa', 'usr_79499fcc6c', 'order_c9b0c89090f943', 'notice_draft', 'case_consumer_001', 19900, 'INR', 'created', NULL, '{"item_title": "Statutory Legal Notice (15-Day Demand Draft)", "plan_id": null, "customer_name": "Priya Sharma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:30:37.276761+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_f88f758a3bd2', 'usr_26d46078e9', 'order_c7a2ae66b08b4b', 'subscription', NULL, 14900, 'INR', 'paid', '982e3d47b24b7f9e9a8fcd0e74b765a22901f7d28b706a21a6d04743a9066c68', '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Amitabh Verma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:30:37.291078+00:00', '2026-09-26T19:30:37.301668+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_test_unlock_test_sess_gatekeeper_fba88a81', 'usr_0d0067984c', 'gw_ord_test_unlock_test_sess_gatekeeper_fba88a81', 'notice_draft', NULL, 19900, 'INR', 'paid', 'sig_test_paid', '{}'::jsonb, '2026-09-26T19:30:37.342145+00:00', '2026-09-26T19:30:37.346162+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_6705f831981b', 'usr_1a235497f7', 'order_46baad3ed22945', 'collective_docket', 'cluster_bengaluru_deposit_withholding', 49900, 'INR', 'created', NULL, '{"item_title": "Collective Action Docket Escrow Contribution", "plan_id": null, "customer_name": "Siddharth Rao", "customer_email": "siddharth@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:30:37.373322+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_43e008c154ad', 'usr_abf4716922', 'order_f1a1767333a84a', 'subscription', NULL, 14900, 'INR', 'created', NULL, '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Ramesh Kumar", "customer_email": "ramesh@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:35:28.960936+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_bb2693a61435', 'usr_3cbe978544', 'order_f4f5853b59324e', 'notice_draft', 'case_consumer_001', 19900, 'INR', 'created', NULL, '{"item_title": "Statutory Legal Notice (15-Day Demand Draft)", "plan_id": null, "customer_name": "Priya Sharma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:35:28.978227+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_41ac29ee105d', 'usr_07ebc82f17', 'order_131d803a755b4d', 'subscription', NULL, 14900, 'INR', 'paid', '781c28fe065e099e7bb3fe003cbede4884375a5a09dd26afb795f4e604d917f0', '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Amitabh Verma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:35:28.991724+00:00', '2026-09-26T19:35:29.000620+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_test_unlock_test_sess_gatekeeper_34113abf', 'usr_5d7aa1fedb', 'gw_ord_test_unlock_test_sess_gatekeeper_34113abf', 'notice_draft', NULL, 19900, 'INR', 'paid', 'sig_test_paid', '{}'::jsonb, '2026-09-26T19:35:29.044030+00:00', '2026-09-26T19:35:29.049685+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_c4e09a505903', 'usr_02296d8437', 'order_d942d190e6784c', 'collective_docket', 'cluster_bengaluru_deposit_withholding', 49900, 'INR', 'created', NULL, '{"item_title": "Collective Action Docket Escrow Contribution", "plan_id": null, "customer_name": "Siddharth Rao", "customer_email": "siddharth@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:35:29.080954+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_8824dd46a684', 'usr_5306762b82', 'order_806d6457d70c47', 'subscription', NULL, 14900, 'INR', 'created', NULL, '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Ramesh Kumar", "customer_email": "ramesh@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:35:42.375361+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_11cd2ba94fe8', 'usr_2151def9ee', 'order_011e2ec35a9844', 'notice_draft', 'case_consumer_001', 19900, 'INR', 'created', NULL, '{"item_title": "Statutory Legal Notice (15-Day Demand Draft)", "plan_id": null, "customer_name": "Priya Sharma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:35:42.390620+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_b8ad305049b1', 'usr_5f227ea1d2', 'order_041fac4b8b6848', 'subscription', NULL, 14900, 'INR', 'paid', 'f09cdac684e6df1eeaad889acbca25c391c80d2a05a3436885e32f065769bf50', '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Amitabh Verma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:35:42.406637+00:00', '2026-09-26T19:35:42.417678+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_test_unlock_test_sess_gatekeeper_5fecc649', 'usr_6ea327def5', 'gw_ord_test_unlock_test_sess_gatekeeper_5fecc649', 'notice_draft', NULL, 19900, 'INR', 'paid', 'sig_test_paid', '{}'::jsonb, '2026-09-26T19:35:42.470954+00:00', '2026-09-26T19:35:42.474918+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_0864316480e3', 'usr_8d2e1767b2', 'order_6fcab6fcc2a24d', 'collective_docket', 'cluster_bengaluru_deposit_withholding', 49900, 'INR', 'created', NULL, '{"item_title": "Collective Action Docket Escrow Contribution", "plan_id": null, "customer_name": "Siddharth Rao", "customer_email": "siddharth@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:35:42.499942+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_006ded3b2f1b', 'usr_17d30741de', 'order_064dd0d99e934a', 'subscription', NULL, 14900, 'INR', 'created', NULL, '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Ramesh Kumar", "customer_email": "ramesh@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:40:54.926764+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_f8c9bbfc22a8', 'usr_b652b4b22c', 'order_d4fb093dcf0f4c', 'notice_draft', 'case_consumer_001', 19900, 'INR', 'created', NULL, '{"item_title": "Statutory Legal Notice (15-Day Demand Draft)", "plan_id": null, "customer_name": "Priya Sharma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:40:54.940076+00:00', NULL) ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_6b93bf57a3f6', 'usr_090299a782', 'order_7f5837b8333c4a', 'subscription', NULL, 14900, 'INR', 'paid', 'ea82b46f3685c983c6a0c1482cc064fbe29d1c3ccaea877d897e26b39cc62ba4', '{"item_title": "Saathi Pro Monthly", "plan_id": "plan_pro_monthly", "customer_name": "Amitabh Verma", "customer_email": null, "customer_phone": null}'::jsonb, '2026-09-26T19:40:54.953030+00:00', '2026-09-26T19:40:54.962010+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_test_unlock_test_sess_gatekeeper_376aff54', 'usr_5df3ccfa8f', 'gw_ord_test_unlock_test_sess_gatekeeper_376aff54', 'notice_draft', NULL, 19900, 'INR', 'paid', 'sig_test_paid', '{}'::jsonb, '2026-09-26T19:40:55.216995+00:00', '2026-09-26T19:40:55.221822+00:00') ON CONFLICT DO NOTHING;
INSERT INTO payment_orders (order_id, user_id, gateway_order_id, item_type, item_ref_id, amount_inr, currency, status, signature, metadata_json, created_at, paid_at) VALUES ('ord_f4aa986ccce2', 'usr_d0fcf240ce', 'order_97ffbef5a25841', 'collective_docket', 'cluster_bengaluru_deposit_withholding', 49900, 'INR', 'created', NULL, '{"item_title": "Collective Action Docket Escrow Contribution", "plan_id": null, "customer_name": "Siddharth Rao", "customer_email": "siddharth@example.com", "customer_phone": null}'::jsonb, '2026-09-26T19:40:55.246864+00:00', NULL) ON CONFLICT DO NOTHING;

-- Table: invoices (7 rows)
INSERT INTO invoices (invoice_id, order_id, user_id, customer_name, customer_state, sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr, total_amount_inr, invoice_pdf_url, created_at) VALUES ('INV-2026-8BD494', 'ord_6ee45dc7bd21', 'usr_9159753499', 'Amitabh Verma', 'Delhi', '998311', 12627, 1136, 1137, 0, 14900, '/api/v1/billing/invoices/INV-2026-8BD494/download', '2026-09-26T17:21:49.785093+00:00') ON CONFLICT DO NOTHING;
INSERT INTO invoices (invoice_id, order_id, user_id, customer_name, customer_state, sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr, total_amount_inr, invoice_pdf_url, created_at) VALUES ('INV-2026-E7BD89', 'ord_9aa3c7e44d84', 'usr_25d28a6212', 'Amitabh Verma', 'Delhi', '998311', 12627, 1136, 1137, 0, 14900, '/api/v1/billing/invoices/INV-2026-E7BD89/download', '2026-09-26T17:22:01.355660+00:00') ON CONFLICT DO NOTHING;
INSERT INTO invoices (invoice_id, order_id, user_id, customer_name, customer_state, sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr, total_amount_inr, invoice_pdf_url, created_at) VALUES ('INV-2026-0EE53C', 'ord_513b711ae9b6', 'usr_f0276593d3', 'Amitabh Verma', 'Delhi', '998311', 12627, 1136, 1137, 0, 14900, '/api/v1/billing/invoices/INV-2026-0EE53C/download', '2026-09-26T19:17:59.677356+00:00') ON CONFLICT DO NOTHING;
INSERT INTO invoices (invoice_id, order_id, user_id, customer_name, customer_state, sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr, total_amount_inr, invoice_pdf_url, created_at) VALUES ('INV-2026-72FF1F', 'ord_f88f758a3bd2', 'usr_26d46078e9', 'Amitabh Verma', 'Delhi', '998311', 12627, 1136, 1137, 0, 14900, '/api/v1/billing/invoices/INV-2026-72FF1F/download', '2026-09-26T19:30:37.312137+00:00') ON CONFLICT DO NOTHING;
INSERT INTO invoices (invoice_id, order_id, user_id, customer_name, customer_state, sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr, total_amount_inr, invoice_pdf_url, created_at) VALUES ('INV-2026-8A1ED3', 'ord_41ac29ee105d', 'usr_07ebc82f17', 'Amitabh Verma', 'Delhi', '998311', 12627, 1136, 1137, 0, 14900, '/api/v1/billing/invoices/INV-2026-8A1ED3/download', '2026-09-26T19:35:29.011849+00:00') ON CONFLICT DO NOTHING;
INSERT INTO invoices (invoice_id, order_id, user_id, customer_name, customer_state, sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr, total_amount_inr, invoice_pdf_url, created_at) VALUES ('INV-2026-9C06E9', 'ord_b8ad305049b1', 'usr_5f227ea1d2', 'Amitabh Verma', 'Delhi', '998311', 12627, 1136, 1137, 0, 14900, '/api/v1/billing/invoices/INV-2026-9C06E9/download', '2026-09-26T19:35:42.435226+00:00') ON CONFLICT DO NOTHING;
INSERT INTO invoices (invoice_id, order_id, user_id, customer_name, customer_state, sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr, total_amount_inr, invoice_pdf_url, created_at) VALUES ('INV-2026-AA4448', 'ord_6b93bf57a3f6', 'usr_090299a782', 'Amitabh Verma', 'Delhi', '998311', 12627, 1136, 1137, 0, 14900, '/api/v1/billing/invoices/INV-2026-AA4448/download', '2026-09-26T19:40:55.181008+00:00') ON CONFLICT DO NOTHING;

COMMIT;
