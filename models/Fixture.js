import mongoose from 'mongoose';

const FixtureSchema = new mongoose.Schema({
    fixture_mid: String,
    season: String,
    competition_name: String,
    fixture_datetime: String,
    fixture_round: String,
    home_team: String,
    away_team: String,
});

export default mongoose.models.Fixture || mongoose.model('Fixture', FixtureSchema);