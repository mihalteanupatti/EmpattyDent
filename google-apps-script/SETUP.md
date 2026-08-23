# EmpattyDent — conectarea comenzilor și newsletterului

Site-ul este static/GitHub Pages, deci nu are bază de date proprie. Pentru început folosim un **Google Sheet privat** + **Google Apps Script**.

## Ce vei avea

În Google Sheet vor apărea două tab-uri:

- **Comenzi** — toate comenzile trimise din site.
- **Newsletter** — toate adresele de e-mail care se abonează.

Clientul nu vede Google Sheet-ul. El doar completează formularul de pe site.

Plata este **ramburs**. Nu există plată online.

---

## 1. Creează tabelul privat

1. Intră în Google Sheets.
2. Creează un spreadsheet nou, de exemplu `EmpattyDent — Comenzi`.
3. Nu îl face public.
4. Intră în **Extensions → Apps Script**.
5. Șterge codul existent.
6. Copiază tot conținutul din `google-apps-script/Code.gs`.
7. Salvează.
8. Rulează funcția `setup()` o singură dată.
9. Google îți va cere permisiuni. Acceptă-le cu contul tău.

După `setup()` vei avea tab-urile `Comenzi` și `Newsletter`.

## 2. Publică Apps Script ca Web App

În Apps Script:

**Deploy → New deployment**

Alege:

- Type: **Web app**
- Execute as: **Me**
- Who has access: **Anyone**

Apasă **Deploy** și copiază URL-ul care se termină în `/exec`.

Nu trebuie să dai nimănui acces la spreadsheet.

## 3. Pune URL-ul în site

Deschide:

`script.js`

La început vei vedea:

```js
const GOOGLE_APPS_SCRIPT_URL = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Înlocuiește textul dintre ghilimele cu URL-ul primit de la Google.

Exemplu:

```js
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec';
```

Salvează și urcă `script.js` în repository-ul GitHub.

---

## Cum funcționează după configurare

### Newsletter

Clientul introduce e-mailul:

`ana@email.com`

→ site-ul trimite datele către Apps Script  
→ Apps Script adaugă:

| Data | Email | Sursă |
|---|---|---|
| 23.08.2026 | ana@email.com | Website |

Dacă aceeași adresă se abonează din nou, scriptul nu o dublează.

### Comandă

Clientul:

1. adaugă produse în coș;
2. apasă `Continuă către comandă`;
3. completează numele;
4. telefonul;
5. e-mailul;
6. județul;
7. localitatea;
8. adresa;
9. observațiile, dacă are;
10. confirmă că este de acord cu folosirea datelor pentru procesarea comenzii;
11. apasă `Trimite comanda — plata ramburs`.

În `Comenzi` apare o linie nouă cu toate datele.

Exemplu:

```text
EMP-12345678
Maria Popescu
0720...
maria@email.com
Prahova
...
Cartea — Dexteritate & lucru în oglindă × 1 — 79 lei
79
Ramburs
NOUĂ
```

Tu poți modifica manual statusul:

`NOUĂ → PREGĂTITĂ → EXPEDIATĂ`

și îi trimiți clientului e-mailul când comanda este gata.

---

## Important pentru siguranță

Spreadsheet-ul trebuie să rămână **privat**.

Web App-ul este public deoarece site-ul trebuie să poată trimite date către el. Formularul are deja un câmp honeypot anti-spam, dar pentru un volum mare de comenzi recomand să adăugăm ulterior Cloudflare Turnstile/reCAPTCHA și validări suplimentare.

Înainte de lansarea magazinului, merită să adăugăm și o pagină separată de **Politica de confidențialitate / GDPR**, deoarece formularul colectează nume, telefon, e-mail și adresă.
