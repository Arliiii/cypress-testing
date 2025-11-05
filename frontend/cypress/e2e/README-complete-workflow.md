# Complete Workflow Test

This is a comprehensive end-to-end test that covers the entire user journey through your website.

## 🎯 What This Test Does

The test performs these steps in order:

1. ✅ **Login** with credentials: `doll20aa@gmail.com` / `Arlinda55.`
2. ✅ **Create a new project** named "project 1"
3. ✅ **Click on the project** to open it
4. ✅ **Select Transactive** analysis type
5. ✅ **Upload an Excel file** from your Downloads folder
6. ✅ **Select checkboxes** for analysis steps
7. ✅ **Submit the analysis**
8. ✅ **View the report** on the results page
9. ✅ **Download the report**

## 🚀 How to Run

### 1. Make sure your app is running:
```bash
cd frontend
npm run dev
```

### 2. Open Cypress Test Runner:
```bash
npx cypress open
```

### 3. In Cypress:
- Select **E2E Testing**
- Choose your browser (Chrome recommended)
- Click on `complete-workflow.cy.ts`

### 4. Watch the test run automatically! 🎬

## 📝 Using Your Own Excel File

To upload a real Excel file from your Downloads folder, open the test file and find this line (around line 76):

```typescript
const fileName = 'test-data.xlsx'; // CHANGE THIS to your actual file name
```

Then uncomment this line:
```typescript
cy.get('input[type="file"]').selectFile('C:\\Users\\arlin\\Downloads\\' + fileName, { force: true });
```

And comment out the dummy file upload section.

## 🔧 Customizing the Test

Edit `cypress/fixtures/test-data.json` to change:
- Login credentials
- Project name
- Analysis type

```json
{
  "testUser": {
    "email": "your-email@example.com",
    "password": "YourPassword"
  },
  "projectName": "Your Project Name",
  "analysisType": "transactive"
}
```

## ⏱️ Test Duration

This test takes approximately **15-30 seconds** depending on:
- File upload size
- Analysis processing time
- Network speed

## 🐛 Troubleshooting

**Test fails at login:**
- Check credentials are correct
- Verify the email and password input IDs match (`#email`, `#password`)

**Test fails at file upload:**
- Make sure file input exists on the page
- Check the file path is correct
- Verify file format is supported (.xlsx)

**Test fails at checkboxes:**
- The test will skip if no checkboxes are found
- Check console logs for details

**Test fails at download:**
- Make sure download button exists
- Check browser download settings

## 📊 Test Results

After running:
- ✅ Green checkmarks = steps passed
- ❌ Red X = step failed (see error details)
- ⚠️ Yellow warning = step skipped (element not found)

## 💡 Tips

1. **Watch in slow motion**: In Cypress, you can slow down the test to see each step
2. **Time travel**: Click on any step to see the app state at that moment
3. **Debug mode**: Add `cy.pause()` in the test to stop and inspect
4. **Screenshots**: Failed tests automatically save screenshots to `cypress/screenshots/`

## 🎥 Running Headless

To run without opening the browser:
```bash
npx cypress run --spec "cypress/e2e/complete-workflow.cy.ts"
```

## 📹 Record Video

Videos are automatically recorded and saved to `cypress/videos/` when running headless.

---

**Happy Testing! 🧪**
