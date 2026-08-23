/**
 * EmpattyDent — Google Apps Script pentru comenzi + newsletter
 *
 * Acest script trebuie pus într-un Google Sheet PRIVAT:
 * Google Sheets → Extensions → Apps Script.
 *
 * 1. Rulează setup() o singură dată.
 * 2. Deploy → New deployment → Web app.
 * 3. Execute as: Me.
 * 4. Who has access: Anyone.
 * 5. Copiază URL-ul /exec în site, în script.js, la GOOGLE_APPS_SCRIPT_URL.
 */

const ORDERS_SHEET = 'Comenzi';
const NEWSLETTER_SHEET = 'Newsletter';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let orders = ss.getSheetByName(ORDERS_SHEET);
  if (!orders) orders = ss.insertSheet(ORDERS_SHEET);
  if (orders.getLastRow() === 0) {
    orders.appendRow([
      'ID comandă','Data','Client','Telefon','Email','Județ','Localitate',
      'Adresă','Produse','Total produse','Plată','Status','Observații'
    ]);
  }

  let newsletter = ss.getSheetByName(NEWSLETTER_SHEET);
  if (!newsletter) newsletter = ss.insertSheet(NEWSLETTER_SHEET);
  if (newsletter.getLastRow() === 0) {
    newsletter.appendRow(['Data','Email','Sursă']);
  }

  [orders, newsletter].forEach(sheet => {
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,sheet.getLastColumn())
      .setFontWeight('bold')
      .setBackground('#173c50')
      .setFontColor('#ffffff');
    sheet.autoResizeColumns(1, sheet.getLastColumn());
  });
}

function doPost(e) {
  try {
    if (!e || !e.parameter) return json_({ok:false, error:'Cerere invalidă'});

    // Honeypot anti-spam. Dacă este completat, ignorăm cererea.
    if (e.parameter.website) return json_({ok:true});

    const type = e.parameter.type;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (type === 'newsletter') {
      return saveNewsletter_(ss, e.parameter.email);
    }

    if (type === 'order') {
      return saveOrder_(ss, e.parameter.order);
    }

    return json_({ok:false, error:'Tip necunoscut'});
  } catch (err) {
    console.error(err);
    return json_({ok:false, error:String(err)});
  }
}

function saveNewsletter_(ss, email) {
  email = String(email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return json_({ok:false, error:'Email invalid'});
  }

  let sheet = ss.getSheetByName(NEWSLETTER_SHEET);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(NEWSLETTER_SHEET);
  }

  // Evită dublurile.
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues().flat()
      .map(x => String(x).trim().toLowerCase());
    if (emails.includes(email)) return json_({ok:true, duplicate:true});
  }

  sheet.appendRow([new Date(), email, 'Website']);
  return json_({ok:true});
}

function saveOrder_(ss, rawOrder) {
  if (!rawOrder) return json_({ok:false, error:'Comandă lipsă'});

  const order = JSON.parse(rawOrder);
  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];

  if (!customer.name || !customer.phone || !customer.email ||
      !customer.county || !customer.city || !customer.address || !items.length) {
    return json_({ok:false, error:'Date obligatorii lipsă'});
  }

  let sheet = ss.getSheetByName(ORDERS_SHEET);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(ORDERS_SHEET);
  }

  const itemsText = items
    .map(item => `${item.qty} × ${item.name} — ${Number(item.price) * Number(item.qty)} lei`)
    .join('\n');

  sheet.appendRow([
    order.id || `EMP-${Date.now()}`,
    new Date(),
    customer.name,
    customer.phone,
    customer.email,
    customer.county,
    customer.city,
    customer.address,
    itemsText,
    Number(order.subtotal) || 0,
    order.payment || 'Ramburs',
    order.status || 'NOUĂ',
    customer.notes || ''
  ]);

  return json_({ok:true, id:order.id});
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
