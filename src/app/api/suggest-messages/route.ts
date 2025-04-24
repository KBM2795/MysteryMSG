import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Custom error class for API errors
class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Initialize Gemini client
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(req: Request) {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new APIError('Gemini API key is not configured', 500);
    }

    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Get the generative model
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    if (!response) {
      throw new APIError('No response generated from Gemini', 500);
    }

    // Log success for debugging
    console.log('Successfully generated questions:', response);

    return NextResponse.json(
      { success: true, questions: response },
      { status: 200 }
    );

  } catch (error) {
    // Handle known API errors
    if (error instanceof APIError) {
      console.error(`API Error: ${error.message}`);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    // Handle Gemini API errors
    if (error instanceof Error) {
      console.error('Gemini API Error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to generate questions' },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
