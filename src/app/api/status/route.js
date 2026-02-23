import { NextResponse } from 'next/server';

const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json({ found: false });
        }

        // Fetch pending registrations from Google Apps Script
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getPending`);
        const pendingData = await response.json();

        // Check if user is in pending list
        if (pendingData.success && pendingData.data) {
            const foundUser = pendingData.data.find(user =>
                user.discordInfo && user.discordInfo.toLowerCase().includes(username.toLowerCase())
            );

            if (foundUser) {
                return NextResponse.json({
                    found: true,
                    status: 'pending',
                });
            }
        }

        // Check approved/active registrations
        const expiredResponse = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getExpired`);
        const expiredData = await expiredResponse.json();

        // This is a simplified check - in production you might want
        // to create a dedicated endpoint to check user status

        return NextResponse.json({ found: false });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({ found: false, error: error.message });
    }
}
