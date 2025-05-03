import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Fixture from '@/models/Fixture';
import { parse } from 'csv-parse/sync';

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
  
    await dbConnect();

  
    let text;
    try {
      const body = await req.json();
      text = body.text;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    if (!text) {
      return NextResponse.json({ error: 'No CSV text received' }, { status: 400 });
    }

   
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    if (!records.length) {
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

  
    await Fixture.insertMany(fixtures);

    return NextResponse.json({ message: 'Upload successful' }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}