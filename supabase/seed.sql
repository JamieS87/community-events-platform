-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '9a36d70a-1425-410f-baaf-dea2e4cbf1d4', 'authenticated', 'authenticated', 'eventfan@dev.com', '$2a$10$2f3.zcLSCSnRrpFlmUMbkeYpTaw.N.fXUVjn6yabFcmZlRA5eryXm', '2024-07-14 13:45:51.446497+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-07-14 13:45:51.441476+00', '2024-07-14 13:45:51.44664+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '93cc7e19-ddba-43f6-94eb-a755ed6fbe33', 'authenticated', 'authenticated', 'eventstaff@dev.com', '$2a$10$5tWOPqJHNKOBbD4zbLvoWOW642salxeLscKnpunv4zBb7TAhntr4e', '2024-07-14 13:46:08.580323+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-07-14 13:46:08.57606+00', '2024-07-14 13:46:08.58053+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('9a36d70a-1425-410f-baaf-dea2e4cbf1d4', '9a36d70a-1425-410f-baaf-dea2e4cbf1d4', '{"sub": "9a36d70a-1425-410f-baaf-dea2e4cbf1d4", "email": "eventfan@dev.com", "email_verified": false, "phone_verified": false}', 'email', '2024-07-14 13:45:51.443673+00', '2024-07-14 13:45:51.443712+00', '2024-07-14 13:45:51.443712+00', '1dd550bd-ab83-4fc0-89b4-f56ff3bf6e06');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('93cc7e19-ddba-43f6-94eb-a755ed6fbe33', '93cc7e19-ddba-43f6-94eb-a755ed6fbe33', '{"sub": "93cc7e19-ddba-43f6-94eb-a755ed6fbe33", "email": "eventstaff@dev.com", "email_verified": false, "phone_verified": false}', 'email', '2024-07-14 13:46:08.577469+00', '2024-07-14 13:46:08.577515+00', '2024-07-14 13:46:08.577515+00', '65b0c88d-582d-4732-b85e-cfb3a5186754');

UPDATE profiles 
set is_staff = true
where user_id = '93cc7e19-ddba-43f6-94eb-a755ed6fbe33';

INSERT INTO events (name, description, start_date, end_date, start_time, end_time, published, pricing_model, price)
VALUES ('CoffeeFest', 'Coffee lovers unite', '01-08-2030', '01-08-2030', '10:00', '20:00', true, 'free', 0),
       ('StarbucksStock', 'Starbucks coffee lovers unite', '01-08-2030', '02-08-2030', '11:00', '21:00', true, 'paid', 100),
       ('Costapocalypse', 'World ending coffee event', '02-08-2030', '04-08-2030', '11:00', '21:00', false, 'paid', 100),
      ('Beananza', 'It''s a bonanza of coffee', '02-08-2030', '04-08-2030', '11:00', '21:00', true, 'payf', 200);