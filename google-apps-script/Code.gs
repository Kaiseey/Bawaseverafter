/**
 * #Bawaseverafter RSVP + confirmation email service.
 * Runs on the couple's Google account using free Google Apps Script services.
 * Keep this script private. Never publish the shared secret in the website code.
 */
const SHARED_SECRET = 'REPLACE_WITH_A_LONG_RANDOM_SECRET';
const SPREADSHEET_NAME = 'Bawaseverafter Wedding RSVPs';
const SHEET_NAME = 'Guest Responses';

function doGet() {
  return json_({ status: 'ready', service: 'Bawaseverafter RSVP' });
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!SHARED_SECRET || SHARED_SECRET.indexOf('REPLACE_') === 0 || data.secret !== SHARED_SECRET) {
      return json_({ success: false, error: 'Unauthorised request.' });
    }

    const name = clean_(data.full_name, 120);
    const email = clean_(data.email, 254).toLowerCase();
    const attendance = data.attendance === 'yes' ? 'Joyfully accepts' : data.attendance === 'no' ? 'Regretfully declines' : '';
    const guests = Math.max(0, Math.min(4, Number(data.guest_count) || 0));
    const phone = clean_(data.phone, 40);
    const note = clean_(data.message, 1000);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !attendance) {
      return json_({ success: false, error: 'Invalid RSVP details.' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let sheet;
    try {
      sheet = getSheet_();
      sheet.appendRow([new Date(), name, email, phone, attendance, guests, note]);
    } finally {
      lock.releaseLock();
    }

    let emailSent = false;
    try {
      const subject = 'We received your RSVP | #Bawaseverafter';
      const responseLine = data.attendance === 'yes'
        ? 'We are delighted that you will be celebrating with us.'
        : 'Thank you for letting us know. You will be missed, and we appreciate you taking the time to respond.';
      const guestLine = data.attendance === 'yes' ? 'Guests confirmed: ' + guests : '';
      const plainBody = 'Dear ' + name + ',\n\n' +
        'Thank you for responding to our wedding invitation. ' + responseLine + '\n\n' +
        guestLine + '\n\n' +
        'Nkasire & Emmanuel\n' +
        '12 December 2026 · Jos, Nigeria\n' +
        '#Bawaseverafter\n\n' +
        'His purpose. His timing. Our forever.';
      MailApp.sendEmail({
        to: email,
        subject: subject,
        body: plainBody,
        name: 'Nkasire & Emmanuel',
      });
      emailSent = true;
    } catch (mailError) {
      console.error('RSVP saved, but confirmation email failed: ' + mailError);
    }

    return json_({ success: true, emailSent: emailSent });
  } catch (error) {
    console.error(error);
    return json_({ success: false, error: 'Unable to process RSVP.' });
  }
}

function setup() {
  const sheet = getSheet_();
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 7).setValues([[
    'Submitted at', 'Full name', 'Email', 'Phone', 'Attendance', 'Guest count', 'Message'
  ]]);
  sheet.autoResizeColumns(1, 7);
  Logger.log('RSVP spreadsheet: ' + sheet.getParent().getUrl());
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('RSVP_SPREADSHEET_ID');
  let spreadsheet;
  if (id) {
    spreadsheet = SpreadsheetApp.openById(id);
  } else {
    spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
    props.setProperty('RSVP_SPREADSHEET_ID', spreadsheet.getId());
  }
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Submitted at', 'Full name', 'Email', 'Phone', 'Attendance', 'Guest count', 'Message']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[<>]/g, '').trim().slice(0, maxLength);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
