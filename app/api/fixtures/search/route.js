import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Fixture from '@/models/Fixture';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  if (!query) {
    return NextResponse.json([]);
  }

  const fixtures = await Fixture.find({
    $or: [
      { home_team: { $regex: query, $options: 'i' } },
      { away_team: { $regex: query, $options: 'i' } },
      { competition_name: { $regex: query, $options: 'i' } },
    ],
  }).limit(20); //prevent too much datas

  return NextResponse.json(fixtures);
}