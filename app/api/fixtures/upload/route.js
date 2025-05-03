import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Fixture from '@/models/Fixture';
import { parse } from 'csv-parse/sync';
import formidable from 'formidable';
import { promises as fs } from 'fs';

// 告诉 Next.js 关闭默认的 bodyParser，交给 formidable 处理
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  await dbConnect();

  const form = formidable({ multiples: false });

  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });

  const uploadedFile = data.files.file?.[0];

  if (!uploadedFile) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const text = await fs.readFile(uploadedFile.filepath, 'utf-8');

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