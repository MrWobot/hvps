using ClosedXML.Excel;
using Core.Exceptions;
namespace HVPSGenerateConfigurationClassesAndMatlabParameters
{
    public static class SpreadsheetReader
    {
        public static SpreadsheetVariable[] Read(string filePath, string variableNameColumnTitle, string variableNameColumn, string valueColumn)
        {
            using var workbook = new XLWorkbook(filePath);
            var worksheet = workbook.Worksheet(1);

            // Specific cell
            string variableNameHeadingCell = $"{variableNameColumn}1";
            var columnHeading = worksheet.Cell(variableNameHeadingCell).GetString();
            if(columnHeading != variableNameColumnTitle) {
                throw new ParseException($"Failed to locate {variableNameColumnTitle}\" column in cell {variableNameHeadingCell} as expected!");
            }
            var spreadsheetVariables = new List<SpreadsheetVariable>();
            foreach (var cell in worksheet.Column(variableNameColumn).CellsUsed().Skip(1))
            {
                spreadsheetVariables.Add(new SpreadsheetVariable(name:cell.GetString(), valueString: cell.WorksheetRow().Cell(valueColumn).GetString()));
            }
            return spreadsheetVariables.OrderBy(s=>s.Name).ToArray();
        }
    }
}