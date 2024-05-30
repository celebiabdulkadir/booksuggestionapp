import { NextRequest, NextResponse } from 'next/server';

type Answers = {
  genre?: string;
  authors?: string;
  language?: string;
  storyType?: string;
  standaloneOrSeries?: string;
  favoriteBook?: string;
  themes?: string;
  readingFrequency?: string;
  tonePreference?: string;
};

export async function POST(req: NextRequest) {
  const answers: Answers = await req.json();

  try {
    const response = await fetch('http://localhost:8080/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};