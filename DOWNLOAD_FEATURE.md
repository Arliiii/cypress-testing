# Report Download Feature

## Overview
The report download feature allows users to download their statistical analysis results directly to their computer in multiple formats.

## How It Works

### Download Button
When you click the "Download Report" button on the Results page, you'll see a dropdown menu with two options:

1. **Download as Text (.txt)**
   - Plain text format
   - Easy to read and edit
   - Contains full report with formatting
   - Includes all statistics and interpretations

2. **Download as CSV (.csv)**
   - Comma-separated values format
   - Can be opened in Excel, Google Sheets, or any spreadsheet application
   - Perfect for further data analysis
   - Contains structured tabular data

### What Gets Downloaded

#### Text Format (.txt)
- Project name and analysis type
- Report ID and timestamp
- Credits used
- All statistical results organized by groups
- Variable statistics (Mean, SD, Median, Quartiles)
- Interpretations for each group

#### CSV Format (.csv)
- Structured table with columns:
  - Group
  - Variable
  - Mean ± SD
  - Median
  - Min/Max values
  - Q1/Q3 (Quartiles)
- Ready to import into Excel or statistical software

### File Naming
Files are automatically named based on your project:
- Format: `ProjectName_AnalysisType_Report.extension`
- Example: `Demo_Descriptive_Statistics_Report.txt`
- Example: `Demo_Descriptive_Statistics_Report.csv`

### Download Location
Files are saved to your browser's default download folder (usually "Downloads" folder on your PC).

## Technical Implementation

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Edge, Safari)
- Uses HTML5 Blob API for file generation
- No server-side processing required
- Instant download without page refresh

### Features
- ✅ Multiple format options (TXT, CSV)
- ✅ Automatic file naming
- ✅ Clean formatting
- ✅ UTF-8 encoding support (Turkish characters work perfectly)
- ✅ Toast notification on successful download
- ✅ Report also saved to localStorage for dashboard access

## Future Enhancements (Optional)

You could add more formats in the future:
- **PDF** - Using libraries like jsPDF
- **Excel (.xlsx)** - Using libraries like xlsx or ExcelJS
- **Word (.docx)** - Using libraries like docx
- **HTML** - Interactive report with charts

## Usage Example

1. Complete your analysis on the Analysis page
2. View results on the Results page
3. Click the "Download Report" button
4. Select your preferred format (TXT or CSV)
5. File automatically downloads to your PC
6. Open with your preferred application

## Notes
- CSV format is recommended for importing into Excel or other statistical software
- Text format is recommended for sharing reports via email or documentation
- Both formats preserve all your statistical analysis results
- Downloads work offline (no internet required after loading the page)
