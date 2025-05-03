import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Fixture from '@/models/Fixture';
import { parse } from 'csv-parse/sync';

export async function POST(req) {
  await dbConnect();
  
  const formData = await req.formData();
  const file = formData.get('file');
  
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const text = new TextDecoder().decode(bytes);

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
}