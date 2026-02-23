import { NextResponse } from 'next/server';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle redirect base URL dynamically
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (request.headers.get('host')?.includes('localhost')
            ? `http://${request.headers.get('host')}`
            : `https://${request.headers.get('host')}`);

    if (error) {
        return NextResponse.redirect(`${baseUrl}/wn_registry?error=${error}`);
    }

    if (!code) {
        return NextResponse.redirect(`${baseUrl}/wn_registry?error=no_code`);
    }

    try {
        const redirectUri = `${baseUrl}/api/auth/discord/callback`;

        // Exchange code for access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokenData);
            const errStr = encodeURIComponent(JSON.stringify(tokenData));
            return NextResponse.redirect(`${baseUrl}/wn_registry?error=token_failed&details=${errStr}`);
        }

        // Get user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            console.error('User fetch failed:', userData);
            return NextResponse.redirect(`${baseUrl}/wn_registry?error=user_failed`);
        }

        // Encode user data and redirect
        const encodedUser = encodeURIComponent(JSON.stringify({
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            global_name: userData.global_name,
        }));

        return NextResponse.redirect(`${baseUrl}/wn_registry?discord=${encodedUser}`);

    } catch (error) {
        console.error('Discord callback error:', error);
        return NextResponse.redirect(`${baseUrl}/wn_registry?error=callback_error`);
    }
}
