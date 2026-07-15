import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Normalize email for robust matching (trim + lowercase) and support the older demo aliases.
    const normalizedEmail = String(email).trim().toLowerCase();
    const emailAliases: Record<string, string> = {
      "admin@example.com": "admin@example.com",
      "provider@example.com": "provider@example.com",
      "user@example.com": "user@example.com",
      "customer@example.com": "user@example.com",
      "provider@foodhub.com": "provider@example.com",
      "admin@foodhub.com": "admin@example.com",
      "user@foodhub.com": "user@example.com",
      "anna@example.com": "user@example.com",
      "dan@foodhub.com": "provider@example.com",
    };
    const resolvedEmail = emailAliases[normalizedEmail] ?? normalizedEmail;
    let user: any = users.find((entry) => String(entry.email).trim().toLowerCase() === resolvedEmail);

    // Debug log for development to help diagnose credential issues
    // eslint-disable-next-line no-console
    console.log("Auth login attempt:", { email: normalizedEmail, resolvedEmail, providedPassword: !!password });

    const isProd = process.env.NODE_ENV === "production";
    if (!user) {
      if (isProd) {
        return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
      }

      // Create a simple mock user. If the email looks like a provider or admin, set the matching role.
      const nextId = `user-${users.length + 1}`;
      const guessedRole: any = resolvedEmail.includes("admin")
        ? "ADMIN"
        : resolvedEmail.includes("dan@foodhub") || resolvedEmail.includes("provider")
        ? "PROVIDER"
        : "CUSTOMER";
      const newUser = {
        id: nextId,
        name: resolvedEmail.split("@")[0],
        email: resolvedEmail,
        password: String(password || "dev"),
        role: guessedRole,
        businessName: guessedRole === "PROVIDER" ? "FoodHub Services" : undefined,
        address: guessedRole === "PROVIDER" ? "123 Provider Way" : undefined,
      };

      users.push(newUser);
      // Use the newly created user for the response
      // eslint-disable-next-line no-console
      console.log("Created mock user for dev:", { id: newUser.id, email: newUser.email, role: newUser.role });
      user = newUser;
    }

    // For production enforce password match; in dev we've already accepted or created the user.
    if (isProd && user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    return NextResponse.json({
      data: {
        accessToken: `mock-token-${user.id}`,
        refreshToken: `mock-refresh-${user.id}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessName: user.businessName,
          address: user.address,
        },
      },
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Login handler error", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
