import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Fixture from '@/models/Fixture';
import { parse } from 'csv-parse/sync';

export async function POST(req) {
  await dbConnect();

  try {
    const { text } = await req.json(); // Expecting { text: 'csv_content' }

    if (!text) {
      return NextResponse.json({ error: 'No CSV text received' }, { status: 400 });
    }

    const parsed = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    const fixtures = parsed.map(row => ({
      fixture_mid: row.fixture_mid,
      season: row.season,
      competition_name: row.competition_name,
      fixture_datetime: row.fixture_datetime,
      fixture_round: row.fixture_round,
      home_team: row.home_team,
      away_team: row.away_team,
    }));

    console.log('Parsed Fixtures:', fixtures);

    if (fixtures.length === 0) {
      return NextResponse.json({ error: 'No valid data parsed' }, { status: 400 });
    }

    await Fixture.insertMany(fixtures);

    return NextResponse.json({ message: 'Upload successful' });
  } catch (error) {
    console.error('Error during upload:', error);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}