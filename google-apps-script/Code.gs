/**
 * Wealthiness Master Signal Registry 1yr - Google Apps Script
 * 
 * Deploy as Web App:
 * 1. Deploy > New deployment
 * 2. Type: Web app
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 * 5. Deploy > Copy URL
 * 
 * SHEET: การตอบแบบฟอร์ม 1
 * 
 * HEADER ROW (Row 1):
 * A: ประทับเวลา (Timestamp)
 * B: First Name
 * C: Nickname
 * D: Country
 * E: ID Line / Phone Number / Your Contact
 * F: Connext ID
 * G: ชื่อ Discord
 * H: ชื่อ Trading View
 * I: Your referal name
 * J: Referral ID
 * K: Items that have already been received
 * L: ฝากเงินเข้าพอร์ตเทรด Connext ไปแล้วกี่ $
 * M: Middle Name
 * N: Last Name
 * O: transfer_slip (Drive Link)
 * P: status
 * Q: (reserved)
 * R: วันหมดอายุ (expire_at)
 */

// ============ CONFIGURATION ============
const CONFIG = {
  SHEET_ID: '1RD33GfNtHxq8OVGloyzoYMF6hoeuvRKumUBid1tpceM',
  SHEET_NAME: 'การตอบแบบฟอร์ม 1',
  DRIVE_FOLDER_ID: '1UoPSQt47fRQVbn265BhSqHp0GRPFUIVy',
  TIMEZONE: 'Asia/Bangkok',
  // Secret key to prevent unauthorized bots
  BOT_SECRET: 'master-signal-1yr-secure-v1'
};

// Column indices (0-based)
const COLUMNS = {
  TIMESTAMP: 0,           // A - ประทับเวลา (Auto)
  FIRST_NAME: 1,          // B
  NICKNAME: 2,            // C
  COUNTRY: 3,             // D
  CONTACT: 4,             // E - ID Line / Phone Number / Your Contact
  CONNEXT_ID: 5,          // F
  DISCORD_NAME: 6,        // G - ชื่อ Discord (from OAuth)
  TRADING_VIEW_NAME: 7,   // H
  REFERAL_NAME: 8,        // I
  REFERAL_ID: 9,          // J
  ITEMS_RECEIVED: 10,     // K
  DEPOSIT_AMOUNT: 11,     // L - ฝากเงินเข้าพอร์ตเทรด $
  MIDDLE_NAME: 12,        // M
  LAST_NAME: 13,          // N
  TRANSFER_SLIP: 14,      // O - Drive link
  STATUS: 15,             // P - pending/Approved/active/expired
  RESERVED: 16,           // Q - (reserved)
  EXPIRE_AT: 17,          // R - วันหมดอายุ
};

/**
 * Get current Thailand time as formatted string
 */
function getThailandTime(date = new Date()) {
  return Utilities.formatDate(date, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Handle GET requests - Return data for Discord bot polling
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    const secret = params.bot_secret;

    // Security Check: Block requests without correct secret
    if (action === 'getApproved' && secret !== CONFIG.BOT_SECRET) {
       return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized: Invalid Bot Secret'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get approved registrations for bot
    if (action === 'getApproved') {
      return getApprovedRegistrations();
    }

    // Get expired registrations
    if (action === 'getExpired') {
      return getExpiredRegistrations();
    }

    // Get all pending for status check
    if (action === 'getPending') {
      return getPendingRegistrations();
    }

    // Default: return status
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Master Signal Registry 1yr API',
      timestamp: getThailandTime()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get approved registrations (status contains "approved" but not processed)
 */
function getApprovedRegistrations() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const approved = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = String(row[COLUMNS.STATUS] || '').toLowerCase().trim();
    
    // Only get "Approved" that hasn't been processed yet
    // Exclude 'active', 'expired', 'done'
    if (status.includes('approved') && !status.includes('done') && !status.includes('active') && !status.includes('expired')) {
      const discordInfo = String(row[COLUMNS.DISCORD_NAME] || '');
      const discordIdMatch = discordInfo.match(/\((\d+)\)/);
      const discordId = discordIdMatch ? discordIdMatch[1] : null;
      
      if (discordId) {
        approved.push({
          rowIndex: i + 1, // 1-based for sheets
          firstName: row[COLUMNS.FIRST_NAME],
          nickname: row[COLUMNS.NICKNAME],
          lastName: row[COLUMNS.LAST_NAME],
          discordId: discordId,
          discordInfo: discordInfo,
          status: row[COLUMNS.STATUS],
        });
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: approved,
    count: approved.length,
    timestamp: getThailandTime()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get expired registrations (status contains "active" and expire_at < now)
 */
function getExpiredRegistrations() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  
  const expired = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = String(row[COLUMNS.STATUS] || '').toLowerCase().trim();
    const expireAtStr = String(row[COLUMNS.EXPIRE_AT] || '');
    
    // Check if status is Active
    if (status.includes('active') && !status.includes('expired')) {
      if (expireAtStr) {
        const expireDate = new Date(expireAtStr);
        
        // If expiry date is valid and in the past
        if (!isNaN(expireDate.getTime()) && expireDate < now) {
           const discordInfo = String(row[COLUMNS.DISCORD_NAME] || '');
           const discordIdMatch = discordInfo.match(/\((\d+)\)/);
           const discordId = discordIdMatch ? discordIdMatch[1] : null;

           if (discordId) {
             expired.push({
               rowIndex: i + 1,
               discordId: discordId,
               firstName: row[COLUMNS.FIRST_NAME],
               nickname: row[COLUMNS.NICKNAME],
               lastName: row[COLUMNS.LAST_NAME],
               expireAt: expireAtStr
             });
           }
        }
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: expired,
    count: expired.length
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get pending registrations (for checking new users)
 */
function getPendingRegistrations() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const pending = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = String(row[COLUMNS.STATUS] || '').toLowerCase().trim();
    
    // Status must be exactly 'pending'
    if (status === 'pending') {
      const discordInfo = String(row[COLUMNS.DISCORD_NAME] || '');
      const discordIdMatch = discordInfo.match(/\((\d+)\)/);
      const discordId = discordIdMatch ? discordIdMatch[1] : null;
      
      if (discordId) {
        pending.push({
          rowIndex: i + 1,
          discordId: discordId,
          discordInfo: discordInfo,
        });
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: pending,
    count: pending.length
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests - Save registration or update status
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Update status action (from Discord bot)
    if (data.action === 'updateStatus') {
      return updateStatus(data.rowIndex, data.newStatus, data.expireAt);
    }
    
    // Default: Save new registration
    return saveRegistration(data);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message,
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save new registration to sheet
 */
function saveRegistration(data) {
  // Save transfer slip to Drive
  let slipLink = '';
  if (data.transferSlipBase64) {
    slipLink = saveImageToDrive(
      data.transferSlipBase64,
      data.transferSlipName,
      data.transferSlipType
    );
  }
  
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  // Format: username (ID)
  const discordInfo = `${data.discord_username} (${data.discord_id})`;
  
  const rowData = [
    getThailandTime(),              // A - ประทับเวลา
    data.first_name,                // B - First Name
    data.nickname,                  // C - Nickname
    data.country,                   // D - Country
    data.contact,                   // E - ID Line / Phone Number / Your Contact
    data.connext_id,                // F - Connext ID
    discordInfo,                    // G - ชื่อ Discord
    data.trading_view_name || '',   // H - ชื่อ Trading View
    data.referal_name || '',        // I - Your referal name
    data.referal_id || '',          // J - Referral ID
    data.items_received || '',      // K - Items that have already been received
    data.deposit_amount || '',      // L - ฝากเงินเข้าพอร์ตเทรด $
    data.middle_name || '',         // M - Middle Name
    data.last_name || '',           // N - Last Name
    slipLink,                       // O - transfer_slip
    'pending',                      // P - status
    '',                             // Q - (reserved)
    '',                             // R - expire_at (set when approved)
  ];
  
  sheet.appendRow(rowData);
  
  console.log(`✅ Registration saved: ${data.first_name} ${data.last_name}`);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Registration saved successfully',
    driveLink: slipLink,
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update status and expiry in sheet (called by Discord bot)
 */
function updateStatus(rowIndex, newStatus, expireAt) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    // Update status column (P = column 16)
    sheet.getRange(rowIndex, COLUMNS.STATUS + 1).setValue(newStatus);
    
    // Update expire_at if provided (R = column 18)
    if (expireAt) {
      sheet.getRange(rowIndex, COLUMNS.EXPIRE_AT + 1).setValue(expireAt);
    }
    
    console.log(`✅ Status updated: Row ${rowIndex} -> ${newStatus}`);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Status updated',
      rowIndex: rowIndex,
      newStatus: newStatus
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error updating status:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save image to Google Drive
 */
function saveImageToDrive(base64Data, fileName, mimeType) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (error) {
    console.error('Error saving image:', error);
    return 'Error saving image';
  }
}

/**
 * Test function - View sheet data
 */
function testViewData() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  console.log(data);
}
