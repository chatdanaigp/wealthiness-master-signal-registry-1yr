import { NextResponse } from 'next/server';

const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function POST(request) {
    try {
        const formData = await request.formData();

        // Extract text fields
        const firstName = formData.get('firstName') || '';
        const middleName = formData.get('middleName') || '';
        const lastName = formData.get('lastName') || '';
        const nickname = formData.get('nickname') || '';
        const country = formData.get('country') || '';
        const contact = formData.get('contact') || '';
        const connextId = formData.get('connextId') || '';
        const referalName = formData.get('referalName') || '';
        const referalId = formData.get('referalId') || '';
        const discordId = formData.get('discordId') || '';
        const discordUsername = formData.get('discordUsername') || '';

        // Handle file upload
        const transferSlip = formData.get('transferSlip');
        let transferSlipBase64 = '';
        let transferSlipName = '';
        let transferSlipType = '';

        if (transferSlip && transferSlip.size > 0) {
            const bytes = await transferSlip.arrayBuffer();
            const buffer = Buffer.from(bytes);
            transferSlipBase64 = buffer.toString('base64');
            transferSlipName = `${discordId}_${Date.now()}_${transferSlip.name}`;
            transferSlipType = transferSlip.type;
        }

        // Prepare data for Google Apps Script
        const registrationData = {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            nickname: nickname,
            country: country,
            contact: contact,
            connext_id: connextId,
            referal_name: referalName,
            referal_id: referalId,
            discord_id: discordId,
            discord_username: discordUsername,
            transferSlipBase64: transferSlipBase64,
            transferSlipName: transferSlipName,
            transferSlipType: transferSlipType,
        };

        // Send to Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Registration failed');
        }

        return NextResponse.json({
            success: true,
            message: 'Registration saved successfully',
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
