-- Seed Data

-- 1. Amex Gold
INSERT INTO card_definitions (name, issuer, network, image_url, annual_fee)
VALUES ('Amex Gold Card', 'American Express', 'AMEX', 'https://example.com/amex-gold.png', 250.00);

-- Get ID (assuming it's 1 since it's first, but better to use subquery in real script or just insert blindly for seed)
-- For simplicity in this seed file, we assume standard sequence start.

INSERT INTO card_reward_rates (card_definition_id, category, multiplier)
VALUES
((SELECT id FROM card_definitions WHERE name = 'Amex Gold Card'), 'Dining', 4.00),
((SELECT id FROM card_definitions WHERE name = 'Amex Gold Card'), 'Groceries', 4.00),
((SELECT id FROM card_definitions WHERE name = 'Amex Gold Card'), 'Flights', 3.00),
((SELECT id FROM card_definitions WHERE name = 'Amex Gold Card'), 'Everything Else', 1.00);

-- 2. Chase Sapphire Preferred
INSERT INTO card_definitions (name, issuer, network, image_url, annual_fee)
VALUES ('Chase Sapphire Preferred', 'Chase', 'VISA', 'https://example.com/csp.png', 95.00);

INSERT INTO card_reward_rates (card_definition_id, category, multiplier)
VALUES
((SELECT id FROM card_definitions WHERE name = 'Chase Sapphire Preferred'), 'Travel', 2.00), -- 5x on portal, simplified to 2x general
((SELECT id FROM card_definitions WHERE name = 'Chase Sapphire Preferred'), 'Dining', 3.00),
((SELECT id FROM card_definitions WHERE name = 'Chase Sapphire Preferred'), 'Online Grocery', 3.00),
((SELECT id FROM card_definitions WHERE name = 'Chase Sapphire Preferred'), 'Streaming', 3.00),
((SELECT id FROM card_definitions WHERE name = 'Chase Sapphire Preferred'), 'Everything Else', 1.00);

-- 3. Capital One Venture X
INSERT INTO card_definitions (name, issuer, network, image_url, annual_fee)
VALUES ('Capital One Venture X', 'Capital One', 'VISA', 'https://example.com/venture-x.png', 395.00);

INSERT INTO card_reward_rates (card_definition_id, category, multiplier)
VALUES
((SELECT id FROM card_definitions WHERE name = 'Capital One Venture X'), 'Everything Else', 2.00),
((SELECT id FROM card_definitions WHERE name = 'Capital One Venture X'), 'Hotels', 10.00), -- Portal
((SELECT id FROM card_definitions WHERE name = 'Capital One Venture X'), 'Flights', 5.00); -- Portal
