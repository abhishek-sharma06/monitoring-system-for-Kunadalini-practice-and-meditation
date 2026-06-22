-- Fix admin password hash (the original hash did not match "Admin@123")
UPDATE users SET password = '$2b$10$viphFZCZLdmwcGyfPqSH0OoMJS3SB3.TKf1cFJCSKvI6Ra61hI8Q6'
WHERE email = 'admin@kundalini.com' AND role = 'admin';
