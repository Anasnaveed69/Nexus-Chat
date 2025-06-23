-- This script creates sample data for the Business Nexus platform
-- Run this after setting up your MongoDB database

-- Note: This is a conceptual SQL script for reference
-- In practice, you would use MongoDB operations or a seeding script

-- Sample Entrepreneurs
INSERT INTO users (name, email, password, role, profile) VALUES
('Alice Johnson', 'alice@startup.com', 'hashed_password', 'entrepreneur', {
  bio: 'Passionate entrepreneur building the next generation of fintech solutions.',
  startupName: 'FinTech Innovations',
  pitchSummary: 'We are revolutionizing personal finance management with AI-powered insights.',
  fundingNeeded: '$500k - $1M',
  industry: 'Financial Technology',
  location: 'San Francisco, CA',
  foundedYear: '2023',
  teamSize: '5-10',
  website: 'https://fintechinnovations.com'
});

INSERT INTO users (name, email, password, role, profile) VALUES
('Bob Chen', 'bob@healthtech.com', 'hashed_password', 'entrepreneur', {
  bio: 'Healthcare technology entrepreneur focused on improving patient outcomes.',
  startupName: 'HealthTech Solutions',
  pitchSummary: 'Developing AI-powered diagnostic tools for early disease detection.',
  fundingNeeded: '$1M - $2M',
  industry: 'Healthcare Technology',
  location: 'Boston, MA',
  foundedYear: '2022',
  teamSize: '10-20',
  website: 'https://healthtechsolutions.com'
});

-- Sample Investors
INSERT INTO users (name, email, password, role, profile) VALUES
('Carol Smith', 'carol@venture.com', 'hashed_password', 'investor', {
  bio: 'Experienced venture capitalist with 15+ years in tech investments.',
  investmentInterests: ['Technology', 'Healthcare', 'Fintech'],
  portfolioCompanies: ['TechCorp', 'HealthStart', 'FinanceApp'],
  location: 'New York, NY',
  investmentRange: '$100k - $5M',
  experience: '15+ years',
  website: 'https://venturesmith.com'
});

INSERT INTO users (name, email, password, role, profile) VALUES
('David Wilson', 'david@angelinvest.com', 'hashed_password', 'investor', {
  bio: 'Angel investor and former tech executive passionate about early-stage startups.',
  investmentInterests: ['SaaS', 'AI/ML', 'E-commerce'],
  portfolioCompanies: ['CloudTech', 'AIStart', 'ShopSmart'],
  location: 'Austin, TX',
  investmentRange: '$25k - $500k',
  experience: '10+ years',
  website: 'https://angelinvest.com'
});
