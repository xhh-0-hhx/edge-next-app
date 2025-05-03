import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Fixture from '@/models/Fixture';
import { parse } from 'csv-parse/sync';

export async function POST(req) {
  try {
    console.log('⏩ Received upload request');

    const { text } = await req.json();
    console.log('✅ Received text from body');

    if (!text) {
      console.error('❌ No CSV text received');
      return NextResponse.json({ error: 'No CSV text received' }, { status: 400 });
    }

    await dbConnect();
    console.log('✅ Database connected');

    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });
    console.log(`✅ Parsed ${records.length} records from CSV`);

    if (!Array.isArray(records) || !records.length) {
      console.error('❌ CSV parsing returned no valid records');
      return NextResponse.json({ error: 'No valid records parsed' }, { status: 400 });
    }

    const fixtures = records.map(row => ({
      fixture_mid: row.fixture_mid,
      season: row.season,
      competition_name: row.competition_name,
      fixture_datetime: row.fixture_datetime,
      fixture_round: row.fixture_round,
      home_team: row.home_team,
      away_team: row.away_team,
    }));

    const inserted = await Fixture.insertMany(fixtures);
    console.log(`✅ Successfully inserted ${inserted.length} fixtures into database`);

    return NextResponse.json({ message: `Upload successful. Inserted ${inserted.length} records.` }, { status: 200 });
  } catch (error) {
    console.error('❌ Upload API Error:', error.message);
    console.error(error.stack);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}