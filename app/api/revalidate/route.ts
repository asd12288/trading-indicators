import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Secret token to prevent unauthorized revalidation requests
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "trader-map-secret";

export async function POST(request: NextRequest) {
  try {
    // Get the secret from the request
    const { secret, path = "/" } = await request.json();

    // Check if the secret matches
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Invalid secret" },
        { status: 401 }
      );
    }

    // Revalidate the path
    revalidatePath(path);

    // Return success
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path
    });
  } catch (error) {
    // Return error
    return NextResponse.json(
      { message: "Error revalidating", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Also handle GET requests for easier testing
export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    const path = request.nextUrl.searchParams.get("path") || "/";

    // Check if the secret matches
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Invalid secret" },
        { status: 401 }
      );
    }

    // Revalidate the path
    revalidatePath(path);

    // Return success
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path
    });
  } catch (error) {
    // Return error
    return NextResponse.json(
      { message: "Error revalidating", error: (error as Error).message },
      { status: 500 }
    );
  }
}
