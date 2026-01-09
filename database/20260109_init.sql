-- 1. ENUMs
CREATE TYPE bonus_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');
CREATE TYPE reset_period AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUALLY');
CREATE TYPE card_network AS ENUM ('VISA', 'MASTERCARD', 'AMEX', 'DISCOVER');

-- 2. Card Definitions (Universe of all credit cards)
CREATE TABLE card_definitions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    network card_network NOT NULL,
    image_url TEXT,
    annual_fee NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Card Reward Rates
CREATE TABLE card_reward_rates (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    card_definition_id BIGINT REFERENCES card_definitions(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    multiplier NUMERIC(4, 2) NOT NULL,
    UNIQUE (card_definition_id, category)
);

-- 4. User Wallet
CREATE TABLE user_wallet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_definition_id BIGINT REFERENCES card_definitions(id),
    opened_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    nickname TEXT,
    credit_limit NUMERIC(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, card_definition_id)
);

-- 5. Sign-Up Bonuses
CREATE TABLE sign_up_bonuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES user_wallet(id) ON DELETE CASCADE,
    required_spend NUMERIC(12, 2) NOT NULL,
    deadline DATE NOT NULL,
    bonus_points INTEGER NOT NULL,
    current_spend NUMERIC(12, 2) DEFAULT 0,
    status bonus_status DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Benefit Trackers
CREATE TABLE benefit_trackers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES user_wallet(id) ON DELETE CASCADE,
    benefit_name TEXT NOT NULL,
    reset_period reset_period NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    used_amount NUMERIC(10, 2) DEFAULT 0,
    next_reset_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_wallet_user_id ON user_wallet(user_id);
CREATE INDEX idx_sign_up_bonuses_wallet_id ON sign_up_bonuses(wallet_id);
CREATE INDEX idx_sign_up_bonuses_status ON sign_up_bonuses(status);
CREATE INDEX idx_benefit_trackers_wallet_id ON benefit_trackers(wallet_id);
CREATE INDEX idx_card_reward_rates_category ON card_reward_rates(category);

-- RLS: Enable on user-owned tables
ALTER TABLE user_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_up_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_trackers ENABLE ROW LEVEL SECURITY;

-- Policy: user_wallet
CREATE POLICY "Users can view own wallet" ON user_wallet
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON user_wallet
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON user_wallet
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallet" ON user_wallet
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: sign_up_bonuses
CREATE POLICY "Users can manage own bonuses" ON sign_up_bonuses
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_wallet WHERE id = wallet_id AND user_id = auth.uid())
    );

-- Policy: benefit_trackers
CREATE POLICY "Users can manage own benefits" ON benefit_trackers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_wallet WHERE id = wallet_id AND user_id = auth.uid())
    );
