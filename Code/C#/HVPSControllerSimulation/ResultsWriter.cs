using Core.CSV;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HVPSControllerSimulation
{
    internal class ResultsWriter : IDisposable
    {
            CsvWriter _Writer;
            public ResultsWriter(string filePath)
            {
                _Writer = new CsvWriter(filePath);
                _Writer.WriteLine(new string[] {
                    "quarter cycle",
                    "t",
                    "V_drive",
                    "i",
                    "i_m",
                    "v_C"
                });
            }
            public void Append(int nQuarterCycle, double t, double V_drive, double i, double i_m, double v_C)
            {
                _Writer.WriteLine(new string[] { 
                    nQuarterCycle.ToString(),
                    t.ToString(),
                    V_drive.ToString(),
                    i.ToString(), 
                    i_m.ToString(), 
                    v_C.ToString()
                });
            }
            public void Dispose()
            {
                _Writer.Dispose();
            }
    }
}
